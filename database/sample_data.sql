-- DriveMind sample test data
-- Run only after the four tables exist.
-- These records use fixed IDs for predictable testing.

-- 1. Vehicles
INSERT INTO public.vehicles (id, code, model, battery, status)
VALUES
    (1, 'AV-101', 'Aero S', 100, 'AVAILABLE'),
    (2, 'AV-102', 'Aero X', 35, 'AVAILABLE')
ON CONFLICT (id) DO NOTHING;

-- 2. Locations
INSERT INTO public.locations
    (id, code, name, x_coordinate, y_coordinate, location_type)
VALUES
    (1, 'LOC-001', 'Start Point', 0, 0, 'STATION'),
    (2, 'LOC-002', 'Destination A', 10, 10, 'DESTINATION')
ON CONFLICT (id) DO NOTHING;

-- 3. Trips
INSERT INTO public.trips
    (id, vehicle_id, source_id, destination_id,
     status, distance, battery_used)
VALUES
    (1, 1, 1, 2, 'COMPLETED', 10, 5)
ON CONFLICT (id) DO NOTHING;

-- 4. Trip events
INSERT INTO public.trip_events
    (trip_id, event_type, decision, reason)
VALUES
    (1, 'RED_SIGNAL', 'STOP', 'Red traffic signal detected')
ON CONFLICT DO NOTHING;
