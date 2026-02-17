package com.gabriel.blog_project.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gabriel.blog_project.dtos.user.UserDto;
import com.gabriel.blog_project.services.UserService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/admin")
public class AdminController {

	private final UserService userService;
	
	public AdminController(UserService userService) {
		this.userService = userService;
	}
	
	@GetMapping("/users")
	public ResponseEntity<List<UserDto>> getAllUsers(HttpServletRequest request) {
	    List<UserDto> users = userService.getAllUsers(request);
	    return ResponseEntity.ok(users);
	}

	@GetMapping("/users/count")
	public ResponseEntity<Long> countTotalUsers(HttpServletRequest request) {
	    Long total = userService.countTotalUsers(request);
	    return ResponseEntity.ok(total);
	}

}
