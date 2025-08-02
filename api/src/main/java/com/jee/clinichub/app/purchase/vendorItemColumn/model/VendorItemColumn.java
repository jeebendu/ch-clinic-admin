package com.jee.clinichub.app.purchase.vendorItemColumn.model;

import java.io.Serializable;

import com.jee.clinichub.app.vendor.model.Vendor;
import com.jee.clinichub.config.audit.Auditable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "vendor_po_import_config")
public class VendorItemColumn extends Auditable<String> implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "vendor_id")
    private Vendor vendor;

    private int sn = -1;
    private int hsn = -1;
    private int mfg = -1;
    private int name = -1;
    private int pack = -1;
    private int batch = -1;
    private int exp = -1;
    private int mrp = -1;
    private int qty = -1;
    private int free = -1;
    private int rate = -1;
    private int amount = -1;
    private int dis = -1;
    private int sgst = -1;
    private int cgst = -1;

    @Column(name = "item_length")
    private int itemLength = 0;

    @Column(name = "net_amount")
    private int netAmount=-1;
    
    @Column(name = "start_point")
    private String startPoint;

    @Column(name = "exp_separator")
    private String expSeparator;

    public VendorItemColumn(VendorItemColumnDto vColumn) {
        this.id = vColumn.getId();
        this.sn = vColumn.getSn();
        this.hsn = vColumn.getHsn();
        this.mfg = vColumn.getMfg();
        this.name = vColumn.getName();
        this.pack = vColumn.getPack();
        this.batch = vColumn.getBatch();
        this.exp = vColumn.getExp();
        this.mrp = vColumn.getMrp();
        this.qty = vColumn.getQty();
        this.free = vColumn.getFree();
        this.rate = vColumn.getRate();
        this.amount = vColumn.getAmount();
        this.dis = vColumn.getDis();
        this.sgst = vColumn.getSgst();
        this.cgst = vColumn.getCgst();
        this.itemLength = vColumn.getItemLength();
        this.netAmount = vColumn.getNetAmount();
        this.startPoint = vColumn.getStartPoint();
        this.expSeparator = vColumn.getExpSeparator();
        this.vendor = new Vendor(vColumn.getVendor());
    }

}
