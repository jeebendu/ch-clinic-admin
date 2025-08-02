package com.jee.clinichub.app.purchase.vendorItemColumn.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.jee.clinichub.app.purchase.vendorItemColumn.model.VendorItemColumn;
import com.jee.clinichub.app.purchase.vendorItemColumn.model.VendorItemColumnDto;
import com.jee.clinichub.app.purchase.vendorItemColumn.model.VendorItemProj;
import com.jee.clinichub.app.purchase.vendorItemColumn.repository.VendorItemColumnRepo;
import com.jee.clinichub.app.vendor.model.Vendor;
import com.jee.clinichub.global.model.Status;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.extern.log4j.Log4j2;

@Transactional
@Service
@Log4j2
public class VendorItemColumnServiceImpl implements VendorItemColumnService {

    @Autowired
    private VendorItemColumnRepo vColumnRepo;


    @Override
    public VendorItemColumnDto getById(Long id) {
        return vColumnRepo.findById(id).map(VendorItemColumnDto::new).orElseThrow(() -> {
            throw new EntityNotFoundException("Column position not found with id " + id);
        });
    }

    @Override
    public Status deleteByVendorId(Long id) {
        vColumnRepo.findById(id).ifPresentOrElse((data)->{
vColumnRepo.deleteById(id);
        }, ()->{
            throw new EntityNotFoundException("field noot found with id : "+ id);
        });
        return new Status(true, "Deleted Successfully");
    }

    @Override
    public VendorItemProj getByVendorId(Long id) {
        VendorItemColumn vColumn= vColumnRepo.findByVendor_id(id);
        return new VendorItemProj(vColumn);
    }

    @Override
    public Status saveOrUpdate(@Valid VendorItemColumnDto vendorItemColumns) {
        try {

            boolean isExists = vColumnRepo.existsByVendor_idAndIdNot(vendorItemColumns.getVendor().getId(),
            vendorItemColumns.getId() != null ? vendorItemColumns.getId() : -1);

            if (isExists) {
                return new Status(false, "Same column position repeated");
            }
            VendorItemColumn vItemColumn = vendorItemColumns.getId() == null ? new VendorItemColumn(vendorItemColumns)
                    : this.setVendorItemColumn(vendorItemColumns);

            vColumnRepo.save(vItemColumn);
            return new Status(true, vendorItemColumns.getId() != null ? "Update Successfully" : "Save Successfully");
        }

        catch (Exception e) {
            log.error("Error saving or updating Column Position: {}", e.getMessage(), e);
            return new Status(false, "An error occurred");
        }
    }

    public VendorItemColumn setVendorItemColumn(VendorItemColumnDto vColumnDto) {
        return vColumnRepo.findById(vColumnDto.getId())
                .map(existingState -> {
                    existingState.setVendor(new Vendor(vColumnDto.getVendor()));
                    existingState.setSn(vColumnDto.getSn());
                    existingState.setHsn(vColumnDto.getHsn());
                    existingState.setMfg(vColumnDto.getMfg());
                    existingState.setName(vColumnDto.getName());
                    existingState.setPack(vColumnDto.getPack());
                    existingState.setBatch(vColumnDto.getBatch());
                    existingState.setExp(vColumnDto.getExp());
                    existingState.setMrp(vColumnDto.getMrp());
                    existingState.setQty(vColumnDto.getQty());
                    existingState.setFree(vColumnDto.getFree());
                    existingState.setRate(vColumnDto.getRate());
                    existingState.setAmount(vColumnDto.getAmount());
                    existingState.setDis(vColumnDto.getDis());
                    existingState.setSgst(vColumnDto.getSgst());
                    existingState.setCgst(vColumnDto.getCgst());
                    existingState.setItemLength(vColumnDto.getItemLength());
                    existingState.setNetAmount(vColumnDto.getNetAmount());
                    existingState.setStartPoint(vColumnDto.getStartPoint());
                    existingState.setExpSeparator(vColumnDto.getExpSeparator());
                    return existingState;
                }).orElseThrow(
                        () -> new EntityNotFoundException("Column Position not found with ID: " + vColumnDto.getId()));
    }

}
