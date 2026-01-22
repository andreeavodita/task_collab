package com.task_collab.dto;

import org.springframework.http.HttpStatusCode;

import java.time.Instant;

public class ErrorResponse {

    private String error;

    private String message;

    private Instant timestamp;

    private String path;

    public ErrorResponse(String error, String message, Instant timestamp, String path) {
        this.error = error;
        this.message = message;
        this.timestamp = timestamp;
        this.path = path;
    }

    public String getError() {
        return error;
    }

    public String getMessage() {
        return message;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public String getPath() {
        return path;
    }
}
