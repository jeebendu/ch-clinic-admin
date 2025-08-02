package com.jee.clinichub.app.core.sequence.model;

import com.jee.clinichub.app.core.projections.CommonProj;



public interface SequenceProj  {
	
    Long getId();
	CommonProj getModule();
	String getIncrementPrefix();
	String getIncrementPadChar();
	String getIncrementPadLength();
	String getIncrementLastId();
	String getIncrementLastFinal();
	boolean isIncludeYear();
	boolean isIncludeBranchCode();
	
	
}