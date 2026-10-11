package com.drivemind.backend.service;

import com.drivemind.backend.dto.TripEventRequest;
import com.drivemind.backend.model.Trip;
import com.drivemind.backend.model.TripEvent;
import com.drivemind.backend.repository.TripEventRepository;
import com.drivemind.backend.repository.TripRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TripEventService {

    private final TripEventRepository tripEventRepository;
    private final TripRepository tripRepository;

    public TripEventService(
            TripEventRepository tripEventRepository,
            TripRepository tripRepository) {

        this.tripEventRepository = tripEventRepository;
        this.tripRepository = tripRepository;
    }

    public List<TripEvent> getAllEvents() {
        return tripEventRepository.findAll();
    }

    public List<TripEvent> getEventsByTrip(Long tripId) {
        return tripEventRepository.findByTripId(tripId);
    }

    public TripEvent addEvent(TripEventRequest request) {

        Trip trip = tripRepository.findById(request.getTripId())
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        TripEvent event = new TripEvent();

        event.setTrip(trip);
        event.setEventType(request.getEventType());
        event.setDecision(request.getDecision());
        event.setReason(request.getReason());

        return tripEventRepository.save(event);
    }

    public void deleteEvent(Long id) {
        tripEventRepository.deleteById(id);
    }
}