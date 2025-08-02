package com.jee.clinichub.config.cache;

import java.lang.reflect.Method;

import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.stereotype.Component;

import com.jee.clinichub.global.tenant.context.TenantContextHolder;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Component("multiTenantCacheKeyGenerator")
public class MultiTenantCacheKeyGenerator implements KeyGenerator {

	@Override
	public Object generate(Object target, Method method, Object... params) {
		StringBuilder sb = new StringBuilder();
        sb.append(TenantContextHolder.getCurrentTenant()) //my tenant context class which is using local thread. I set the value in the Spring filter.
          .append("_")
          .append(target.getClass().getSimpleName())
          .append("-")
          .append(method.getName());
        
        for (final Object o : params) {
        	sb.append("-")
            .append(o);
        }
        
        String tanentKey = sb.toString();
        log.info(tanentKey);
     
       return sb.toString();
	}

}
