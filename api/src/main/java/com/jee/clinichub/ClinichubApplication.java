package com.jee.clinichub;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
import org.springframework.data.envers.repository.support.EnversRevisionRepositoryFactoryBean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import com.jee.clinichub.global.utility.JasyptEncryptorUtil;
import com.ulisesbocchio.jasyptspringboot.configuration.EnableEncryptablePropertiesConfiguration;
 
import lombok.extern.log4j.Log4j2;

@EnableScheduling
@Log4j2
@EnableCaching     
@SpringBootApplication
@EnableTransactionManagement
@ComponentScan(basePackages = { "com.jee.clinichub" })
@Import(EnableEncryptablePropertiesConfiguration.class)
@EnableJpaRepositories(basePackages = {
		"com.jee.clinichub" }, repositoryFactoryBeanClass = EnversRevisionRepositoryFactoryBean.class)
public class ClinichubApplication {

	@Autowired
    private JasyptEncryptorUtil jasyptEncryptorUtil;
	
	public static void main(String[] args) {
		SpringApplication.run(ClinichubApplication.class, args);
		log.info("Clinichub CMS application started ...");

	}

	@Autowired
    public void runAfterStartup() {
        //jasyptEncryptorUtil.generate();
    }
	
}
