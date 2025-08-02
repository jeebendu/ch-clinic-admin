package com.jee.clinichub.app.core.slider.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class SliderDto {

    private Long id;
    private String name;
    private String description;
    private String url;
    private int sortOrder;
    private boolean active;

    public SliderDto(Slider slider) {
        this.id = slider.getId();
        this.name = slider.getName();
        this.description = slider.getDescription();
        this.url = slider.getUrl();
        this.sortOrder = slider.getSortOrder();
        this.active = slider.isActive();
    }
    
}
