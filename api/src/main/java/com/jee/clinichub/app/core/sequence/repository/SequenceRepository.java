
package com.jee.clinichub.app.core.sequence.repository;

import java.util.List;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.jee.clinichub.app.core.sequence.model.Sequence;
import com.jee.clinichub.app.core.sequence.model.SequenceProj;

@Repository
public interface SequenceRepository extends JpaRepository<Sequence, Long> {
	
	Sequence findSequenceById(Long sequenceId);

	Sequence findOneByBranch_id(Long branchId);

	Sequence findOneByBranch_idAndModule_id(Long branchId, Long moduleId);

	@Cacheable(value = "sequenceCache" , keyGenerator = "multiTenantCacheKeyGenerator")
	List<SequenceProj> findAllProjectedByBranch_id(Long id);

	boolean existsByBranch_idAndModule_id(Long id, Long id2);

	List<Sequence> findAllByBranch_id(Long branchId);
}
