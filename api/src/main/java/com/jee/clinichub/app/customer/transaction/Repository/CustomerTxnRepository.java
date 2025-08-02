package com.jee.clinichub.app.customer.transaction.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.customer.transaction.model.CustomerTxn;

@Repository
public interface CustomerTxnRepository extends JpaRepository<CustomerTxn, Long>{

	List<CustomerTxn> findAllByCustomer_id(Long vId);

}
