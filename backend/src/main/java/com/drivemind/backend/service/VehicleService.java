package com.drivemind.backend.service;

import com.drivemind.backend.model.Vehicle;
import com.drivemind.backend.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Vehicle addVehicle(Vehicle vehicle) {
        vehicle.setBattery(100);
        vehicle.setStatus("AVAILABLE");
        return vehicleRepository.save(vehicle);
    }
    public Vehicle updateVehicle(Long id, Vehicle updatedVehicle) {

    Vehicle vehicle = vehicleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Vehicle not found"));

    vehicle.setCode(updatedVehicle.getCode());
    vehicle.setModel(updatedVehicle.getModel());
    vehicle.setBattery(updatedVehicle.getBattery());
    vehicle.setStatus(updatedVehicle.getStatus());

    return vehicleRepository.save(vehicle);
}

    public void deleteVehicle(Long id) {
        vehicleRepository.deleteById(id);
    }
}