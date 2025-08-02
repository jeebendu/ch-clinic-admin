package com.jee.clinichub.app.doctor.blockedSlot.controller;


import java.util.List;
import org.springframework.web.bind.annotation.*;
import com.jee.clinichub.app.doctor.blockedSlot.model.BlockedSlotDTO;
import com.jee.clinichub.app.doctor.blockedSlot.service.BlockedSlotService;
import com.jee.clinichub.global.model.Status;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins  = "*", maxAge = 3600)
@RestController
@RequestMapping("v1/block-slot")
@RequiredArgsConstructor
public class BlockedSlotController {
    
    private final BlockedSlotService bSlotService;

    @PostMapping(value = "/saveOrUpdate")
    public Status saveOrUpdate(@RequestBody BlockedSlotDTO blockedSlotDTO) {
        return bSlotService.saveOrUpdate(blockedSlotDTO);
    }



    @DeleteMapping("/delete/id/{id}")
    public Status deleteById(@PathVariable Long id) {
        return bSlotService.deleteById(id);
    }

    @GetMapping("/id/{id}")
    public BlockedSlotDTO getById(@PathVariable Long id) {
        return bSlotService.getById(id);
    }

    @GetMapping("/list")
    public List<BlockedSlotDTO> findAll() {
        return bSlotService.findAll();
    }


    @GetMapping("/doctor/{doctorId}")
    public List<BlockedSlotDTO> findAllByDoctorId( @PathVariable Long doctorId) {
        return bSlotService.findAllByDoctorId(doctorId);
    }
}
