package com.gabriel.blog_project.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.gabriel.blog_project.services.UserService;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/users")
public class UserController {
	
	private final UserService userService;
	
	public UserController(UserService userService) {
		this.userService = userService;
	}
	
	@DeleteMapping
	public ResponseEntity<String> deleteAccount(HttpServletRequest request) {
		userService.deleteAccount(request);
		return ResponseEntity.noContent().build();
	}
	
	@DeleteMapping("/comments")
	public ResponseEntity<String> deleteAllUserComments(HttpServletRequest request) {
		userService.deleteAllUserComments(request);
		return ResponseEntity.ok("Comments deleted with success");
	}
}
