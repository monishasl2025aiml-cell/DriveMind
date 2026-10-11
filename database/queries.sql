-- DriveMind: Useful SQL Queries
-- Run these in Supabase SQL Editor when needed.

-- 1. View all vehicles
SELECT *
FROM public.vehicles
ORDER BY id;

-- 2. View available vehicles
SELECT *
FROM public.vehicles
WHERE status = 'AVAILABLE';

-- 3. Find vehicles with low battery (below 30%)
SELECT *
FROM public.vehicles
WHERE battery < 30;

-- 4. View trip history with vehicle and location names
SELECT
    t.id AS trip_id,
    v.code AS vehicle_code,
    v.model AS vehicle_model,
    src.name AS source_location,
    dest.name AS destination_location,
    t.status,
    t.distance,
    t.battery_used,
    t.started_at,
    t.ended_at
FROM public.trips t
JOIN public.vehicles v ON t.vehicle_id = v.id
JOIN public.locations src ON t.source_id = src.id
JOIN public.locations dest ON t.destination_id = dest.id
ORDER BY t.started_at DESC;

-- 5. View active trips
SELECT *
FROM public.trips
WHERE status = 'ACTIVE';

-- 6. View completed trips
SELECT *
FROM public.trips
WHERE status = 'COMPLETED';

-- 7. View events for a particular trip
-- Change 1 to the trip ID you want to inspect.
SELECT *
FROM public.trip_events
WHERE trip_id = 1
ORDER BY event_time DESC;

-- 8. Count trips per vehicle
SELECT
    v.code AS vehicle_code,
    COUNT(t.id) AS total_trips
FROM public.vehicles v
LEFT JOIN public.trips t ON t.vehicle_id = v.id
GROUP BY v.id, v.code
ORDER BY v.code;

-- 9. Total and average trip distance
SELECT
    COALESCE(SUM(distance), 0) AS total_distance,
    COALESCE(AVG(distance), 0) AS average_distance
FROM public.trips;

-- 10. Total battery used across trips
SELECT
    COALESCE(SUM(battery_used), 0) AS total_battery_used
FROM public.trips;

-- 11. Count events by event type
SELECT
    event_type,
    COUNT(*) AS event_count
FROM public.trip_events
GROUP BY event_type
ORDER BY event_count DESC;
