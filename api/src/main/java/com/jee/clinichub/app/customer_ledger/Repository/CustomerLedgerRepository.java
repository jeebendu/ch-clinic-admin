package com.jee.clinichub.app.customer_ledger.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.jee.clinichub.app.customer_ledger.model.CustomerLedger;

@Repository
public interface CustomerLedgerRepository extends JpaRepository<CustomerLedger, Long>{

	@Transactional
	//@Query (value="select cl.* from customer_ledger cl JOIN (SELECT @var :=0) r where cl.customer_id=:cId ", nativeQuery= true)
	//@Query ("select cl from CustomerLedger cl where cl.customer.id=:cId ")
	
	@Query(value = "CALL customer_txn_sp(:cId);", nativeQuery = true)
	List<CustomerLedger> findAllByCustomer_id(@Param("cId") Long cId);
	
	
	
	
}
