package com.gabriel.blog_project.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gabriel.blog_project.dtos.user.CreateUserDto;
import com.gabriel.blog_project.dtos.user.UserDto;
import com.gabriel.blog_project.services.UserService;

@RestController
@RequestMapping("/users")
public class UserController {
	
	private final UserService userService;
	
	public UserController(UserService userService) {
		this.userService = userService;
	}
	
	@PostMapping
	public ResponseEntity<UserDto> createUser(@RequestBody CreateUserDto createDto) {
		UserDto createdUser = userService.createUser(createDto);
		return ResponseEntity.status(201).body(createdUser);
	}
}
