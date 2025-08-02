package com.jee.clinichub.config;

import java.sql.Connection;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.hibernate.engine.jdbc.connections.spi.MultiTenantConnectionProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Component
public class TenantConnectionProvider implements MultiTenantConnectionProvider {

	private static final long serialVersionUID = 1L;
	
    @Value("${app.default-tenant}")
    public String defaultTenant;

	private DataSource datasource;

    public TenantConnectionProvider(DataSource dataSource) {
        this.datasource = dataSource;
    }

    @Override
    public Connection getAnyConnection() throws SQLException {
        return datasource.getConnection();
    }

    @Override
    public void releaseAnyConnection(Connection connection) throws SQLException {
        connection.close();
    }

    @Override
    public Connection getConnection(String tenantIdentifier) throws SQLException {
    	
    	final Connection connection = getAnyConnection();
    	//boolean isDefault = tenantIdentifier.equalsIgnoreCase(TenantIdentifierResolver.DEFAULT_TENANT);
        //log.info("Tenant in getConnection: {}", TenantContextHolder.getCurrentTenant());
        String schemaQuery = String.format("SET search_path TO \'%s\';", tenantIdentifier);
        connection.createStatement().execute(schemaQuery);
    	return connection;
        
    }

    @Override
    public void releaseConnection(String tenantIdentifier, Connection connection) throws SQLException {
    	
    	String schemaQuery = String.format("SET search_path TO \'%s\';", defaultTenant);
        connection.createStatement().execute(schemaQuery);
        releaseAnyConnection(connection);
        //log.info("Tenant in releaseConnection: {}", TenantContextHolder.getCurrentTenant());
    }

    @Override
    public boolean supportsAggressiveRelease() {
        return false;
    }

    @Override
    public boolean isUnwrappableAs(Class unwrapType) {
        return false;
    }

    @Override
    public <T> T unwrap(Class<T> unwrapType) {
        return null;
    }
}
