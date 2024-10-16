package com.example.backend.controller;

import com.example.backend.dto.AuthenticationDto;
import com.example.backend.dto.AuthenticationResponse;
import com.example.backend.dto.UserDto;
import com.example.backend.services.AuthenticationService;
import com.example.backend.dto.RegisterRequest;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {
    private final AuthenticationService service;
    @Autowired
    private HttpServletRequest httpServletRequest;


    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody RegisterRequest request
    ){
        System.out.println("Email: " + request.getEmail());
        return ResponseEntity.ok(service.register(request));
    }
    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationDto request
    ){
        logger.info("A mail: " + request.getEmail());
        System.out.println("Request Headers: " + Collections.list(httpServletRequest.getHeaderNames())
                .stream()
                .collect(Collectors.toMap(h -> h, httpServletRequest::getHeader)));
        return ResponseEntity.ok(service.authenticate(request));
    }

    @GetMapping("/getUsers")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = service.getAllUsers();
        return ResponseEntity.ok(users);
    }
}
