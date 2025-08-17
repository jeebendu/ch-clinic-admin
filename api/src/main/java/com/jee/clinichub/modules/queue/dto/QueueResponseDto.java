
package com.jee.clinichub.modules.queue.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

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

    // Constructors
    public QueueResponseDto() {}

    public QueueResponseDto(Long totalCount, Long branchId, String date, String sortBy, List<QueueItemDto> queueItems) {
        this.totalCount = totalCount;
        this.branchId = branchId;
        this.date = date;
        this.sortBy = sortBy;
        this.queueItems = queueItems;
    }

    // Getters and Setters
    public Long getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(Long totalCount) {
        this.totalCount = totalCount;
    }

    public Long getBranchId() {
        return branchId;
    }

    public void setBranchId(Long branchId) {
        this.branchId = branchId;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getSortBy() {
        return sortBy;
    }

    public void setSortBy(String sortBy) {
        this.sortBy = sortBy;
    }

    public List<QueueItemDto> getQueueItems() {
        return queueItems;
    }

    public void setQueueItems(List<QueueItemDto> queueItems) {
        this.queueItems = queueItems;
    }
}
