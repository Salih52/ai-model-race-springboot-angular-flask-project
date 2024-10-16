package com.example.backend.services;

import com.example.backend.config.JwtService;
import com.example.backend.dto.AuthenticationDto;
import com.example.backend.dto.AuthenticationResponse;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.dto.UserDto;
import com.example.backend.user.Role;
import com.example.backend.user.User;
import com.example.backend.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService  jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already registered");
        }

        if (userRepository.findBySchoolNo(request.getSchoolNo()).isPresent()) {
            throw new RuntimeException("School number is already registered");
        }
        System.out.println("User mail:" + request.getEmail());

        var user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .schoolNo(request.getSchoolNo())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();

        userRepository.save(user);

        var jwtToken = jwtService.generateToken(user);
        System.out.println("Generated JWT Token: " + jwtToken);

        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .build();
    }

    public AuthenticationResponse authenticate(AuthenticationDto request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .accessToken(jwtToken)
                .build();
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream().map(user -> UserDto.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .schoolNo(user.getSchoolNo())
                .email(user.getEmail())
                .build()).collect(Collectors.toList());
    }

    private Role getRole(String role){
        if(role.equals("user")){
            return  Role.USER;
        } else if (role.equals("admin")) {
            return Role.ADMIN;
        }
        return null;
    }
}
