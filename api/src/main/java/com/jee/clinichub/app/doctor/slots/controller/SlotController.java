package com.jee.clinichub.app.doctor.slots.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.doctor.slots.model.SlotDto;
import com.jee.clinichub.app.doctor.slots.model.SlotFilter;
import com.jee.clinichub.app.doctor.slots.model.SlotHandler;
import com.jee.clinichub.app.doctor.slots.model.SlotProj;
import com.jee.clinichub.app.doctor.slots.service.SlotService;
import com.jee.clinichub.global.model.Status;

import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*",maxAge = 3600)
@RestController
@RequestMapping("v1/doctor/slots")
@RequiredArgsConstructor
public class SlotController {

    private final SlotService slotService;

    @GetMapping("/list")
    public List<SlotDto> getAllSlots() {
        return slotService.getAllSlots();
    }

    @PostMapping("filter")
    public List<SlotProj> getFilteredSlots(@RequestBody SlotFilter filter) {
        return slotService.getFilteredSlots(filter);
    }

    @PostMapping("/generate")
    public Status generateSlot(@RequestBody SlotHandler slotHandler) {
        return slotService.generateSlot(slotHandler);
    }

    @DeleteMapping("/delete/{id}")
    public Status deleteById(@PathVariable Long id) {
        return slotService.deleteById(id);
    }



    
}