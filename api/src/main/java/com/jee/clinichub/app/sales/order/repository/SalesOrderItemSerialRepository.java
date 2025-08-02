package com.jee.clinichub.app.sales.order.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.sales.order.model.SalesOrderItemSerial;

@Repository
public interface SalesOrderItemSerialRepository extends JpaRepository<SalesOrderItemSerial, Long> {

	List<SalesOrderItemSerial> findAllByItemId(Long id);

  
}