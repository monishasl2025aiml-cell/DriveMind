package com.drivemind.backend.service;

import com.drivemind.backend.model.Location;
import com.drivemind.backend.repository.LocationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocationService {

    private final LocationRepository locationRepository;

    public LocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    public List<Location> getAllLocations() {
        return locationRepository.findAll();
    }

    public Location getLocationByCode(String code) {
        return locationRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Location not found"));
    }

    public Location addLocation(Location location) {
        return locationRepository.save(location);
    }
}