
package com.jee.clinichub.app.patient.queue.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QueueResponseDto {

    @JsonProperty("total_count")
    private Long totalCount;

    @JsonProperty("branch_id")
    private Long branchId;

    @JsonProperty("date")
    private String date;

    @JsonProperty("sort_by")
    private String sortBy;

    @JsonProperty("queue_items")
    private List<QueueItemDto> queueItems;

}
