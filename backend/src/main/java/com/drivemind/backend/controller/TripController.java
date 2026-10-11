package com.drivemind.backend.controller;

import com.drivemind.backend.dto.TripRequest;
import com.drivemind.backend.model.Trip;
import com.drivemind.backend.service.TripService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trips")
@CrossOrigin(origins = "*")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @GetMapping
    public List<Trip> getAllTrips() {
        return tripService.getAllTrips();
    }

    @PostMapping
    public Trip addTrip(@RequestBody TripRequest request) {
        return tripService.addTrip(request);
    }

    @PutMapping("/{id}")
    public Trip updateTrip(
            @PathVariable Long id,
            @RequestBody Trip trip) {

        return tripService.updateTrip(id, trip);
    }

    @DeleteMapping("/{id}")
    public void deleteTrip(@PathVariable Long id) {
        tripService.deleteTrip(id);
    }
}