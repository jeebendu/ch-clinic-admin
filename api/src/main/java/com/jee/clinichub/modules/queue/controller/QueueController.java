
package com.jee.clinichub.modules.queue.controller;

import com.jee.clinichub.modules.queue.dto.QueueResponseDto;
import com.jee.clinichub.modules.queue.service.QueueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/queue")
@CrossOrigin(origins = "*")
public class QueueController {

    @Autowired
    private QueueService queueService;

    @GetMapping("/live")
    public ResponseEntity<QueueResponseDto> getLiveQueue(
            @RequestParam(name = "branch_id", required = false) Long branchId,
            @RequestParam(name = "date", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(name = "sort_by", required = false, defaultValue = "actual_sequence") String sortBy,
            @RequestParam(name = "limit", required = false) Integer limit,
            @RequestHeader(name = "X-Branch-ID", required = false) String headerBranchId) {

        // Use branch_id from parameter, fallback to header
        Long effectiveBranchId = branchId;
        if (effectiveBranchId == null && headerBranchId != null) {
            try {
                effectiveBranchId = Long.parseLong(headerBranchId);
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest().build();
            }
        }

        // Default to today if no date provided
        LocalDate effectiveDate = date != null ? date : LocalDate.now();

        // Validate branch_id
        if (effectiveBranchId == null) {
            return ResponseEntity.badRequest().build();
        }

        // Validate sort_by parameter
        if (!"actual_sequence".equals(sortBy) && !"checkin_time".equals(sortBy)) {
            return ResponseEntity.badRequest().build();
        }

        try {
            QueueResponseDto response = queueService.getQueueData(effectiveBranchId, effectiveDate, sortBy, limit);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/preview")
    public ResponseEntity<QueueResponseDto> getQueuePreview(
            @RequestParam(name = "branch_id", required = false) Long branchId,
            @RequestParam(name = "date", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestHeader(name = "X-Branch-ID", required = false) String headerBranchId) {

        // Use branch_id from parameter, fallback to header
        Long effectiveBranchId = branchId;
        if (effectiveBranchId == null && headerBranchId != null) {
            try {
                effectiveBranchId = Long.parseLong(headerBranchId);
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest().build();
            }
        }

        // Default to today if no date provided
        LocalDate effectiveDate = date != null ? date : LocalDate.now();

        // Validate branch_id
        if (effectiveBranchId == null) {
            return ResponseEntity.badRequest().build();
        }

        try {
            QueueResponseDto response = queueService.getQueuePreview(effectiveBranchId, effectiveDate);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getQueueCount(
            @RequestParam(name = "branch_id", required = false) Long branchId,
            @RequestParam(name = "date", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestHeader(name = "X-Branch-ID", required = false) String headerBranchId) {

        // Use branch_id from parameter, fallback to header
        Long effectiveBranchId = branchId;
        if (effectiveBranchId == null && headerBranchId != null) {
            try {
                effectiveBranchId = Long.parseLong(headerBranchId);
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest().build();
            }
        }

        // Default to today if no date provided
        LocalDate effectiveDate = date != null ? date : LocalDate.now();

        // Validate branch_id
        if (effectiveBranchId == null) {
            return ResponseEntity.badRequest().build();
        }

        try {
            QueueResponseDto response = queueService.getQueueData(effectiveBranchId, effectiveDate, "actual_sequence", null);
            return ResponseEntity.ok(response.getTotalCount());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
