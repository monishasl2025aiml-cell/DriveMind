package com.drivemind.backend.repository;

import com.drivemind.backend.model.TripEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TripEventRepository extends JpaRepository<TripEvent, Long> {

    List<TripEvent> findByTripId(Long tripId);
}