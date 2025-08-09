
package com.jee.clinichub.app.laborder.controller;

import java.util.List;

import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.laborder.model.LabOrderItemDTO;
import com.jee.clinichub.app.laborder.model.enums.LabOrderItemStatus;
import com.jee.clinichub.app.laborder.service.LabOrderItemService;
import com.jee.clinichub.global.model.Status;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/lab-order-items")
@RequiredArgsConstructor
public class LabOrderItemController {

    private final LabOrderItemService labOrderItemService;

    @GetMapping(value = "/list")
    public List<LabOrderItemDTO> getAllLabOrderItems() {
        return labOrderItemService.getAllLabOrderItems();
    }

    @GetMapping(value = "/id/{id}")
    public LabOrderItemDTO getById(@PathVariable Long id) {
        return labOrderItemService.getLabOrderItemById(id);
    }

    @PostMapping(value = "/saveOrUpdate")
    public Status saveOrUpdate(@RequestBody @Valid LabOrderItemDTO labOrderItemDTO, 
                               HttpServletRequest request, Errors errors) {
        return labOrderItemService.saveOrUpdate(labOrderItemDTO);
    }

    @DeleteMapping(value = "/delete/id/{id}")
    public Status deleteById(@PathVariable Long id) {
        return labOrderItemService.deleteById(id);
    }

    @PutMapping(value = "/update-status/id/{id}")
    public Status updateStatus(@PathVariable Long id, @RequestParam LabOrderItemStatus status) {
        return labOrderItemService.updateStatus(id, status);
    }

    @GetMapping(value = "/order/{labOrderId}")
    public List<LabOrderItemDTO> getLabOrderItemsByOrderId(@PathVariable Long labOrderId) {
        return labOrderItemService.getLabOrderItemsByOrderId(labOrderId);
    }

    @GetMapping(value = "/test-type/{testTypeId}")
    public List<LabOrderItemDTO> getLabOrderItemsByTestTypeId(@PathVariable Long testTypeId) {
        return labOrderItemService.getLabOrderItemsByTestTypeId(testTypeId);
    }

    @GetMapping(value = "/status/{status}")
    public List<LabOrderItemDTO> getLabOrderItemsByStatus(@PathVariable LabOrderItemStatus status) {
        return labOrderItemService.getLabOrderItemsByStatus(status);
    }

    @PutMapping(value = "/sample-collection/id/{id}")
    public Status updateSampleCollection(@PathVariable Long id, @RequestParam Boolean collected) {
        return labOrderItemService.updateSampleCollection(id, collected);
    }
}
