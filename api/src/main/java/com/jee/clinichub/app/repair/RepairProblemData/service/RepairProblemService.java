package com.jee.clinichub.app.repair.RepairProblemData.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.jee.clinichub.app.repair.RepairProblemData.model.RepairProblemDataDto;
import com.jee.clinichub.global.model.Status;

import jakarta.validation.Valid;

public interface RepairProblemService {

	List<RepairProblemDataDto> getAllRepairProblemData();

	RepairProblemDataDto getById(Long id);

	Status saveOrUpdate(@Valid RepairProblemDataDto repairProblemDataDto);

	Status deleteById(Long id);

	byte[] repairProblemDataPrint(MultipartFile canvasChartLeftFile, MultipartFile canvasChartRightFile, Long id);

}
