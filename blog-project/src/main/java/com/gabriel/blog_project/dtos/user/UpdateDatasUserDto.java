package com.gabriel.blog_project.dtos.user;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateDatasUserDto(
	@NotBlank(message = "Username cannot be empty")
	@Size(max = 255, message = "Username cannot be longer than 200 characters")
	String username, 
	
	@NotBlank(message = "Email cannot be empty")
	@Size(max = 600, message = "Email cannot be longer than 600 characters")
	@Pattern(
			regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
			message = "Invalid email format"
			)
	
	String login, 
	
	String password, MultipartFile imageUser) {

}
