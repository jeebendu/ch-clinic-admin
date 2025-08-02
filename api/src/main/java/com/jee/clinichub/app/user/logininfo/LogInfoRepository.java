package com.jee.clinichub.app.user.logininfo;

import java.util.Date;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface LogInfoRepository extends JpaRepository<LogInfo, Long> {

       LogInfo findTopByUser_idOrderByLoginTimeDesc(Long id);

       @Cacheable(value = "logInfoCache", keyGenerator = "multiTenantCacheKeyGenerator")
       @Query("SELECT l FROM LogInfo l " +
       "WHERE (:value IS NULL OR l.userName LIKE %:value%) " +
       // "AND (:dateFrom IS NULL OR l.loginTime >= :dateFrom) " +
       "AND (:status IS NULL OR l.status = :status) " +
       "AND (:mobile IS NULL OR l.mobile = :mobile) " +
       "ORDER BY l.id DESC"
       )
       Page<LogInfo> filter(Pageable pr,
       @Param("value") String value,
       @Param("status") Boolean status,
       @Param("mobile") Boolean mobile
       // @Param("dateFrom") Date dateFrom
       );

}
