package com.example.backend.controller;

import com.example.backend.dto.AuthenticationDto;
import com.example.backend.dto.AuthenticationResponse;
import com.example.backend.dto.UserDto;
import com.example.backend.services.AuthenticationService;
import com.example.backend.dto.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService service;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody RegisterRequest request
    ){
        return ResponseEntity.ok(service.register(request));
    }
    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationDto request
    ){
        return ResponseEntity.ok(service.authenticate(request));
    }

    @GetMapping("/getUsers")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = service.getAllUsers();
        return ResponseEntity.ok(users);
    }
}
