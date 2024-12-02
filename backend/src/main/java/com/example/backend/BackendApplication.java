package com.example.backend;

import com.example.backend.dto.RegisterRequest;
import com.example.backend.services.AuthenticationService;
import com.example.backend.services.FileStorageService;
import jakarta.annotation.Resource;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

import static com.example.backend.user.Role.ADMIN;
import static com.example.backend.user.Role.USER;

@SpringBootApplication
public class BackendApplication implements CommandLineRunner {
	@Resource
	FileStorageService fileStorageService;

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner commandLineRunner(
			AuthenticationService service
	) {
		return args -> {
			var admin = RegisterRequest.builder()
					.firstName("Admin")
					.lastName("Admin")
					.email("admin@mail.com")
					.password("adminailab987")
					.role(ADMIN)
					.build();
			System.out.println("Admin token: " + service.register(admin).getAccessToken());

			var user1 = RegisterRequest.builder()
					.firstName("salih")
					.lastName("eliaçık")
					.email("salih@mail.com")
					.password("123456")
					.schoolNo("123456")
					.role(USER)
					.build();
			System.out.println("Admin token: " + service.register(user1).getAccessToken());
		};
	}
	@Override
	public void run(String... arg) throws Exception {
		fileStorageService.deleteAll();
		fileStorageService.init();
	}

	@Bean
	public RestTemplate restTemplate(RestTemplateBuilder builder) {
		return builder.build();
	}

}
