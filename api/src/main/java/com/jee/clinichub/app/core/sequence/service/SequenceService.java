package com.jee.clinichub.app.core.sequence.service;

import java.util.List;

import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.core.sequence.model.Sequence;
import com.jee.clinichub.app.core.sequence.model.SequenceDto;
import com.jee.clinichub.app.core.sequence.model.SequenceProj;
import com.jee.clinichub.global.model.Status;

public interface SequenceService {
	
    Sequence findByName(String name);

    SequenceDto getById(Long id);

	Status deleteById(Long id);

	Status saveOrUpdate(SequenceDto Sequence);

	List<SequenceProj> getAllSequences();

	String getNextSequense(Long branchId, Long entityId);

	SequenceDto getLastSequense(Long branchId);

	boolean incrementSequense(Long branchId, Long entityId, String nextSequense);

	void createDefaultSequencesForBranch(Branch branch);
}
