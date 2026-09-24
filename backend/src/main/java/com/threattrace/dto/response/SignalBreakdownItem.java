package com.threattrace.dto.response;

public class SignalBreakdownItem {
    private String signal;
    private int points;
    private String detail;

    public SignalBreakdownItem() {}

    public SignalBreakdownItem(String signal, int points, String detail) {
        this.signal = signal;
        this.points = points;
        this.detail = detail;
    }

    public String getSignal() { return signal; }
    public void setSignal(String signal) { this.signal = signal; }

    public int getPoints() { return points; }
    public void setPoints(int points) { this.points = points; }

    public String getDetail() { return detail; }
    public void setDetail(String detail) { this.detail = detail; }
}
