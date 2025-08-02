package com.jee.clinichub.config;


import javax.sql.DataSource;

import org.flywaydb.core.Flyway;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.jee.clinichub.global.tenant.repository.TenantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;

@Configuration
@ConditionalOnProperty(prefix = "spring", name = "flyway.enabled", matchIfMissing = true)
public class FlywayConfig {

    @Value("${app.default-tenant}")
    public String defaultTenant;
    
    private Flyway createCommonFlyway(DataSource dataSource, String schema) {
        return Flyway.configure()
                .locations("db/migration/common")
                .dataSource(dataSource)
                .schemas(schema)
                .table("flyway_schema_history_common")
                .baselineOnMigrate(true)
                .load();
    }

    private Flyway createMasterFlyway(DataSource dataSource) {
        return Flyway.configure()
                .locations("db/migration/master")
                .dataSource(dataSource)
                .schemas(defaultTenant)
                .table("flyway_schema_history_master")
                .baselineOnMigrate(true)
                .load();
    }
    
    private Flyway createTenantFlyway(DataSource dataSource, String schema) {
        return Flyway.configure()
                .locations("db/migration/tenants")
                .dataSource(dataSource)
                .schemas(schema)
                .table("flyway_schema_history_tenant")
                .baselineOnMigrate(true)
                .load();
    }

    public void migrateTenantSchema(DataSource dataSource,String schema) {
		Flyway common = createCommonFlyway(dataSource, schema);
		common.migrate();

		Flyway tenantFlyway = createTenantFlyway(dataSource, schema);
		tenantFlyway.migrate();
	}

    @Autowired
    private Environment environment;

    private boolean isTestDataEnabled() {
        // Uses app.testdata.enabled property, default false
        return Boolean.parseBoolean(environment.getProperty("app.testdata.enabled", "false"));
    }

    private Flyway createCommonTestDataFlyway(DataSource dataSource, String schema) {
        return Flyway.configure()
                .locations("db/migration/testdata/common")
                .dataSource(dataSource)
                .schemas(schema)
                .table("flyway_schema_history_testdata_common")
                .baselineOnMigrate(true)
                .load();
    }

    private Flyway createMasterTestDataFlyway(DataSource dataSource) {
        return Flyway.configure()
                .locations("db/migration/testdata/master")
                .dataSource(dataSource)
                .schemas(defaultTenant)
                .table("flyway_schema_history_testdata_master")
                .baselineOnMigrate(true)
                .load();
    }

    private Flyway createTenantTestDataFlyway(DataSource dataSource, String schema) {
        return Flyway.configure()
                .locations("db/migration/testdata/tenants")
                .dataSource(dataSource)
                .schemas(schema)
                .table("flyway_schema_history_testdata_tenant")
                .baselineOnMigrate(true)
                .load();
    }

    @Bean
    public Flyway flyway(DataSource dataSource) {
    	
    	Flyway flywayCommon = createCommonFlyway(dataSource, defaultTenant);
        Flyway flywayMaster = createMasterFlyway (dataSource);
    	
        flywayCommon.migrate();
        flywayMaster.migrate();

        // Conditionally run testdata migrations
        if (isTestDataEnabled()) {
            createCommonTestDataFlyway(dataSource, defaultTenant).migrate();
            createMasterTestDataFlyway(dataSource).migrate();
        }

        return flywayMaster;
    }

    @Bean
    CommandLineRunner commandLineRunner(TenantRepository repository, DataSource dataSource) {
        return args -> {
            repository.findAll().forEach(tenant -> {
                String tenantSchema = tenant.getClientId();
                
                // Create Flyway instance for tenant schema
                Flyway flywayCommon = createCommonFlyway(dataSource, tenantSchema);
                flywayCommon.migrate();
                
                // Create Flyway instance for tenant schema
                Flyway flywaytenant = createTenantFlyway(dataSource, tenantSchema);
                flywaytenant.migrate();

                // Conditionally run testdata for tenants
                if (isTestDataEnabled()) {
                    createCommonTestDataFlyway(dataSource, tenantSchema).migrate();
                    createTenantTestDataFlyway(dataSource, tenantSchema).migrate();
                }
            });
        };
    }
}
