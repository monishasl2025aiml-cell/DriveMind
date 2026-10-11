package com.drivemind.backend.service;

import com.drivemind.backend.dto.TripRequest;
import com.drivemind.backend.model.Location;
import com.drivemind.backend.model.Trip;
import com.drivemind.backend.model.Vehicle;
import com.drivemind.backend.repository.LocationRepository;
import com.drivemind.backend.repository.TripRepository;
import com.drivemind.backend.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TripService {

    private final TripRepository tripRepository;
    private final VehicleRepository vehicleRepository;
    private final LocationRepository locationRepository;

    public TripService(
            TripRepository tripRepository,
            VehicleRepository vehicleRepository,
            LocationRepository locationRepository) {

        this.tripRepository = tripRepository;
        this.vehicleRepository = vehicleRepository;
        this.locationRepository = locationRepository;
    }

    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }

    public Trip addTrip(TripRequest request) {

        Vehicle vehicle = vehicleRepository.findByCode(request.getVehicle())
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        Location source = locationRepository.findByCode(request.getSource())
                .orElseThrow(() -> new RuntimeException("Source location not found"));

        Location destination = locationRepository.findByCode(request.getDestination())
                .orElseThrow(() -> new RuntimeException("Destination location not found"));

        Trip trip = new Trip();

        trip.setVehicle(vehicle);
        trip.setSource(source);
        trip.setDestination(destination);

        trip.setStatus(
                request.getStatus() == null
                        ? "ACTIVE"
                        : request.getStatus()
        );

        trip.setDistance(request.getDistance());
        trip.setBatteryUsed(request.getBatteryUsed());
        trip.setStartedAt(LocalDateTime.now());

        return tripRepository.save(trip);
    }

    public Trip updateTrip(Long id, Trip updatedTrip) {

        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        trip.setVehicle(updatedTrip.getVehicle());
        trip.setSource(updatedTrip.getSource());
        trip.setDestination(updatedTrip.getDestination());
        trip.setStartedAt(updatedTrip.getStartedAt());
        trip.setEndedAt(updatedTrip.getEndedAt());
        trip.setStatus(updatedTrip.getStatus());
        trip.setDistance(updatedTrip.getDistance());
        trip.setBatteryUsed(updatedTrip.getBatteryUsed());

        return tripRepository.save(trip);
    }

    public void deleteTrip(Long id) {
        tripRepository.deleteById(id);
    }
}