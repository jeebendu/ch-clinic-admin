package com.jee.clinichub.app.core.sequence.service;

import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.google.common.base.Strings;
import com.jee.clinichub.app.branch.context.BranchContextHolder;
import com.jee.clinichub.app.branch.model.Branch;
import com.jee.clinichub.app.core.module.model.Module;
import com.jee.clinichub.app.core.module.repository.ModuleRepository;
import com.jee.clinichub.app.core.sequence.model.Sequence;
import com.jee.clinichub.app.core.sequence.model.SequenceDto;
import com.jee.clinichub.app.core.sequence.model.SequenceProj;
import com.jee.clinichub.app.core.sequence.repository.SequenceRepository;
import com.jee.clinichub.global.model.Status;

@Service(value = "sequenceService")
public class SequenceServiceImpl implements SequenceService {
	
	private static final Logger log = LoggerFactory.getLogger(SequenceServiceImpl.class);

    @Autowired
    private SequenceRepository sequenceRepository;
    
    @Autowired
    ModuleRepository moduleRepository;
    
    
	@Override
	public Status saveOrUpdate(SequenceDto sequenceDto) {
		try{
			
			//boolean isExistName = (sequenceDto.getId()==null) ? sequenceRepository.existsByName(sequenceDto.getName()): sequenceRepository.existsByNameAndIdNot(sequenceDto.getName(),sequenceDto.getId());
			//boolean isExistCode = (sequenceDto.getId()==null) ? sequenceRepository.existsByCode(sequenceDto.getCode()): sequenceRepository.existsByCodeAndIdNot(sequenceDto.getCode(),sequenceDto.getId());
			
			//if(isExistName){return new Status(false,"Sequence Name already exist");
	    	//}else if(isExistCode){return new Status(false,"Sequence Code already exist");}
			
			Sequence sequence = new Sequence();
			Module module = moduleRepository.findById(sequenceDto.getModule().getId()).get();
			
			
			if(sequenceDto.getId()==null) {
				sequence = new Sequence(sequenceDto);
				sequence.setIncrementLastId(0);
				Branch branch = BranchContextHolder.getCurrentBranch();
				sequence.setBranch(branch);
				
			}else{
				sequence = this.setSequence(sequenceDto);
			}
			
			sequence.setModule(module);
			sequence = sequenceRepository.save(sequence);
			return new Status(true,( (sequenceDto.getId()==null) ? "Added":"Updated")  +  " Successfully");
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return new Status(false,"Something went wrong");
		
	}
	
    private Sequence setSequence(SequenceDto sequenceDto) {
    	Sequence exSequence = sequenceRepository.findById(sequenceDto.getId()).get();
    	exSequence.setModule(new Module(sequenceDto.getModule()));
    	exSequence.setIncrementLastId(sequenceDto.getIncrementLastId());
    	exSequence.setIncrementPadChar(sequenceDto.getIncrementPadChar());
    	exSequence.setIncrementPadLength(sequenceDto.getIncrementPadLength());
    	exSequence.setIncrementPrefix(sequenceDto.getIncrementPrefix());
    	exSequence.setIncludeYear(sequenceDto.isIncludeYear());
    	exSequence.setIncludeBranchCode(sequenceDto.isIncludeBranchCode());
    	
    	
		return exSequence;
		
		
	}

	@Override
  	public List<SequenceProj> getAllSequences() {
		Branch branch = BranchContextHolder.getCurrentBranch();
    	List<SequenceProj> sequenceList = sequenceRepository.findAllProjectedByBranch_id(branch.getId());
  		return sequenceList;
  	}

    @Override
    public Sequence findByName(String name) {
        //Sequence sequence = sequenceRepository.findSequenceByName(name);
        return null;
    }
    
    
	@Override
	@Cacheable(value = "sequenceCache",keyGenerator = "multiTenantCacheKeyGenerator")
	public SequenceDto getById(Long id) {
		SequenceDto sequenceDto = new SequenceDto();
		try{
			Optional<Sequence> sequence = sequenceRepository.findById(id);
			if(sequence.isPresent()){
				sequenceDto = new SequenceDto(sequence.get());
			}
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return sequenceDto;
	}

	
	@Override
	public Status deleteById(Long id) {
		try{
			Optional<Sequence> sequence = sequenceRepository.findById(id);
			if(!sequence.isPresent()){
				return new Status(false,"Sequence Not Found");
			}
			
			sequenceRepository.deleteById(id);
			return new Status(true,"Deleted Successfully");
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return new Status(false,"Something went wrong");
	}

	@Override
	public SequenceDto getLastSequense(Long branchId) {
		
		SequenceDto sequenceDto = new SequenceDto();
		try{
			Sequence sequence = sequenceRepository.findOneByBranch_id(branchId);
			if(sequence!=null){
				sequenceDto = new SequenceDto(sequence);
			}
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return sequenceDto;
		
	}
	
	@Override
	public String getNextSequense(Long branchId, Long moduleId) {
		String nextSequense = "";
		
		try{
			Sequence sequence = sequenceRepository.findOneByBranch_idAndModule_id(branchId,moduleId);
			nextSequense = constructSequense(sequence);
			
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return nextSequense;
		
	}

	private String constructSequense(Sequence sequence) {
		
		String sequenseText = "";
		Integer lastIncreamentId = sequence.getIncrementLastId();
		
		lastIncreamentId++;
		sequenseText+=sequence.getIncrementPrefix();
		
		if(sequence.isIncludeYear()){
			sequenseText+=YearMonth.now().getYear();
		}
		
		
		String padChar = Strings.padStart(String.valueOf(lastIncreamentId), sequence.getIncrementPadLength(), sequence.getIncrementPadChar());
		sequenseText+=padChar;
		
		return sequenseText;
	}

	@Override
	@CacheEvict(value="sequenceCache", allEntries=true,keyGenerator = "multiTenantCacheKeyGenerator")
	public boolean incrementSequense(Long branchId, Long moduleId,String currentSequense) {
		try{
			Sequence sequence = sequenceRepository.findOneByBranch_idAndModule_id(branchId,moduleId);
			Integer lastIncreamentId = sequence.getIncrementLastId(); 
			lastIncreamentId = lastIncreamentId+1;
			sequence.setIncrementLastId(lastIncreamentId);
			sequence.setIncrementLastFinal(currentSequense);
			sequenceRepository.save(sequence);
			
		}catch(Exception e){
			log.error(e.getLocalizedMessage());
		}
		return true;
	}

	@Override
	public void createDefaultSequencesForBranch(Branch branch) {
		try {
			log.info("Creating default sequences for new branch: {}", branch.getName());
			
			// Get all modules
			List<Module> allModules = moduleRepository.findAll();
			
			for (Module module : allModules) {
				// Check if sequence already exists for this branch and module
				boolean sequenceExists = sequenceRepository.existsByBranch_idAndModule_id(branch.getId(), module.getId());
				
				if (!sequenceExists) {
					// Create default sequence
					Sequence sequence = new Sequence();
					sequence.setBranch(branch);
					sequence.setModule(module);
					sequence.setIncrementPrefix(module.getCode() != null ? module.getCode() : module.getName().substring(0, 3).toUpperCase());
					sequence.setIncrementPadChar('0');
					sequence.setIncrementPadLength(4);
					sequence.setIncrementLastId(0);
					sequence.setIncludeYear(true);
					sequence.setIncludeBranchCode(false);
					
					sequenceRepository.save(sequence);
					//log.info("Created default sequence for module: {} in branch: {}", module.getName(), branch.getName());
				}
			}
			
		} catch (Exception e) {
			log.error("Error creating default sequences for branch {}: {}", branch.getName(), e.getMessage(), e);
			// Don't throw exception here as we don't want to fail branch creation due to sequence creation issues
		}
	}


	

	

	
}
