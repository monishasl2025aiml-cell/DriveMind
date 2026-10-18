package com.drivemind.backend.dto;

public class TripRequest {

    private String vehicle;
    private String source;
    private String destination;
    private String status;
    private double distance;
    private int batteryUsed;

    public TripRequest() {}

    public String getVehicle() {
        return vehicle;
    }

    public void setVehicle(String vehicle) {
        this.vehicle = vehicle;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public double getDistance() {
        return distance;
    }

    public void setDistance(double distance) {
        this.distance = distance;
    }

    public int getBatteryUsed() {
        return batteryUsed;
    }

    public void setBatteryUsed(int batteryUsed) {
        this.batteryUsed = batteryUsed;
    }
}