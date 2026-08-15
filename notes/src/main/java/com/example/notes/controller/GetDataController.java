package com.example.notes.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
@CrossOrigin("http://localhost:5173")
@RestController
public class GetDataController {

    @GetMapping("/api/sub-data")
    public String getData() {
        return "Kedar";
    }
}