package com.gabriel.blog_project.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gabriel.blog_project.dtos.user.CreateUserDto;
import com.gabriel.blog_project.entities.EnumRole;
import com.gabriel.blog_project.entities.User;
import com.gabriel.blog_project.repositories.UserRepository;
import com.gabriel.blog_project.security.TokenService;
import com.gabriel.blog_project.services.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {
	
	private final UserRepository userRepository;
	
	private final UserService userService;
	
	private final PasswordEncoder passwordEncoder;
	
	private final AuthenticationManager authenticationManager;
	
	private final TokenService tokenService;
	
	public AuthController(UserRepository userRepository, UserService userService, PasswordEncoder passwordEncoder, 
			AuthenticationManager authenticationManager, TokenService tokenService) {
		this.userRepository = userRepository;
		this.userService = userService;
		this.passwordEncoder = passwordEncoder;
		this.authenticationManager = authenticationManager;
		this.tokenService = tokenService;
	}
	
	@PostMapping("/register")
	public ResponseEntity<String> register(@Valid @RequestBody CreateUserDto createUserDto, BindingResult bindingResult) {
		if(bindingResult.hasErrors()) {
			StringBuilder errorMessages = new StringBuilder();
			for (FieldError error : bindingResult.getFieldErrors()) {
				errorMessages.append(error.getField()).append(": ").append(error.getDefaultMessage()).append("\n");
			}
			return ResponseEntity.badRequest().body(errorMessages.toString());
		}
		
		if(userRepository.findByLogin(createUserDto.login()) != null) {
			return ResponseEntity.badRequest().body("Email already exists");
		}
		
		String encryptedPassword = passwordEncoder.encode(createUserDto.password());
		
		EnumRole role = userRepository.count() == 0 ? EnumRole.ADMIN : EnumRole.USER;
		
		User newUser = new User(createUserDto.username(), createUserDto.login(), encryptedPassword, role);
		userRepository.save(newUser);
		return ResponseEntity.status(201).body("User created with success");
	}
	
}
