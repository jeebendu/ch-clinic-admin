package com.jee.clinichub.app.purchase.vendorItemColumn.model;

import com.jee.clinichub.app.vendor.model.VendorDto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class VendorItemProj {

    private Long id;

    private VendorDto vendor;
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
    private int netAmount= -1;
    private String startPoint;
    private String expSeparator;

    public VendorItemProj(VendorItemColumn vColumn){
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
        this.netAmount = vColumn.getNetAmount();
        this.startPoint = vColumn.getStartPoint();
        this.expSeparator = vColumn.getExpSeparator();
        this.vendor = new VendorDto(vColumn.getVendor());
    }

}
