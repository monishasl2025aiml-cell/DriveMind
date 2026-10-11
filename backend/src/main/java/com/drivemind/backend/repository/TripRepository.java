package com.drivemind.backend.repository;

import com.drivemind.backend.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TripRepository extends JpaRepository<Trip, Long> {
}