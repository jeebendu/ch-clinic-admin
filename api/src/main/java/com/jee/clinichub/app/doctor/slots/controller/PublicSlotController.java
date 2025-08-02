package com.jee.clinichub.app.doctor.slots.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jee.clinichub.app.doctor.slots.model.SlotDto;
import com.jee.clinichub.app.doctor.slots.model.SlotHandler;
import com.jee.clinichub.app.doctor.slots.service.SlotService;
import com.jee.clinichub.global.model.Status;

import lombok.AllArgsConstructor;

@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("v1/public/doctor/slots")
@RestController
@AllArgsConstructor
public class PublicSlotController {

    private final SlotService slotService;

        @GetMapping("/list")
    public List<SlotDto> getAllSlots() {
        return slotService.getAllSlots();
    }

    
    @PostMapping("/generate")
    public Status generateSlot(@RequestBody SlotHandler slotHandler) {
        return slotService.generateSlot(slotHandler);
    }


    @PostMapping("/list-filtered")
    public List<SlotDto> getFilteredSlots(@RequestBody SlotHandler slotHandler) {
        return slotService.getFilteredSlots(slotHandler);
    }

    

} 
// v1/public/doctor/slots/generate