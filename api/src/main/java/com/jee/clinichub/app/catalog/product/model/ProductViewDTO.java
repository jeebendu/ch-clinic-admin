package com.jee.clinichub.app.catalog.product.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "catalog_product_view")
public class ProductViewDTO {

    @Id
    private Long id;

    @Column(name = "branch_id")
    private Long branchId;

    private String brand;

    @Column(name = "brand_id")
    private Long brandId;

    @Column(name = "cap_per_strip")
    private Integer capPerStrip;

    private String category;

    @Column(name = "category_id")
    private Long categoryId;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "created_time")
    private String createdTime;


    @Column(name = "expiry_month")
    private Integer expiryMonth;

    @Column(name = "is_batched")
    private Boolean isBatched;

    @Column(name = "modified_by")
    private String modifiedBy;

    @Column(name = "modified_time")
    private String modifiedTime;

    private String name;

    private Double price;

    private Integer qty;

    @Column(name = "qty_loose")
    private Integer qtyLoose;

    @Column(name = "rack_no")
    private String rackNo;

    @Column(name = "strips_per_box")
    private Integer stripsPerBox;

    private String type;

    @Column(name = "type_id")
    private Long typeId;

    // Getters and Setters

}
