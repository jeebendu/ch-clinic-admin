
package com.jee.clinichub.modules.queue.service;

import com.jee.clinichub.modules.queue.dto.QueueItemDto;
import com.jee.clinichub.modules.queue.dto.QueueResponseDto;
import com.jee.clinichub.modules.queue.entity.LiveVisitQueue;
import com.jee.clinichub.modules.queue.repository.LiveVisitQueueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class QueueService {

    @Autowired
    private LiveVisitQueueRepository queueRepository;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    public QueueResponseDto getQueueData(Long branchId, LocalDate date, String sortBy, Integer limit) {
        List<LiveVisitQueue> queueItems;
        
        if (limit != null && limit > 0) {
            queueItems = queueRepository.findByBranchIdAndDateOrderByActualSequenceLimit(branchId, date, limit);
        } else if ("checkin_time".equals(sortBy)) {
            queueItems = queueRepository.findByBranchIdAndDateOrderByCheckinTime(branchId, date);
        } else {
            // Default to actual_sequence
            queueItems = queueRepository.findByBranchIdAndDateOrderByActualSequence(branchId, date);
        }

        Long totalCount = queueRepository.countByBranchIdAndDate(branchId, date);

        List<QueueItemDto> queueItemDtos = queueItems.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return new QueueResponseDto(
                totalCount,
                branchId,
                date.format(DATE_FORMATTER),
                sortBy != null ? sortBy : "actual_sequence",
                queueItemDtos
        );
    }

    public QueueResponseDto getQueuePreview(Long branchId, LocalDate date) {
        return getQueueData(branchId, date, "actual_sequence", 4);
    }

    private QueueItemDto convertToDto(LiveVisitQueue entity) {
        Long waitingMinutes = calculateWaitingMinutes(entity.getCheckinTime());
        String status = determineStatus(entity);

        return new QueueItemDto(
                entity.getPatientScheduleId(),
                entity.getConsultingDoctorId(),
                entity.getBranchId(),
                entity.getPatientId(),
                entity.getCheckinTime(),
                entity.getPlannedSequence(),
                entity.getActualSequence(),
                entity.getEstimatedConsultationTime(),
                waitingMinutes,
                status
        );
    }

    private Long calculateWaitingMinutes(LocalDateTime checkinTime) {
        if (checkinTime == null) {
            return 0L;
        }
        return Duration.between(checkinTime, LocalDateTime.now()).toMinutes();
    }

    private String determineStatus(LiveVisitQueue entity) {
        // This is a placeholder logic - you may need to adjust based on your business rules
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime estimatedTime = entity.getEstimatedConsultationTime();
        
        if (estimatedTime != null && now.isAfter(estimatedTime)) {
            return "in_consultation";
        } else if (calculateWaitingMinutes(entity.getCheckinTime()) > 60) {
            return "no_show";
        } else {
            return "waiting";
        }
    }
}
