package com.drivemind.backend.controller;

import com.drivemind.backend.dto.TripEventRequest;
import com.drivemind.backend.model.TripEvent;
import com.drivemind.backend.service.TripEventService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trip-events")
@CrossOrigin(origins = "*")
public class TripEventController {

    private final TripEventService tripEventService;

    public TripEventController(TripEventService tripEventService) {
        this.tripEventService = tripEventService;
    }

    @GetMapping
    public List<TripEvent> getAllEvents() {
        return tripEventService.getAllEvents();
    }

    @GetMapping("/trip/{tripId}")
    public List<TripEvent> getEventsByTrip(@PathVariable Long tripId) {
        return tripEventService.getEventsByTrip(tripId);
    }

    @PostMapping
    public TripEvent addEvent(@RequestBody TripEventRequest request) {
        return tripEventService.addEvent(request);
    }

    @DeleteMapping("/{id}")
    public void deleteEvent(@PathVariable Long id) {
        tripEventService.deleteEvent(id);
    }
}