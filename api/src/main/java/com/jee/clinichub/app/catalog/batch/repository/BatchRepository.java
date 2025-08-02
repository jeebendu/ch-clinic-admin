package com.jee.clinichub.app.catalog.batch.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.catalog.batch.model.Batch;


@Repository
public interface BatchRepository extends JpaRepository<Batch, Long>{

	boolean existsByUid(String uid);

	boolean existsByUidAndIdNot(String uid, Long id);

	List<Batch> findByProductId(Long productId);

	boolean existsByUidAndProductId(String batch, Long id);

	Optional<Batch> findByUidAndProductId(String batch, Long productId);

	void deleteAllByProductId(Object object);

	List<Batch> findAllByProductId(Long productId);

    Batch findByUid(String batch);

}
