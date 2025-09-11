package com.gabriel.blog_project.dtos.user;

import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateDatasUserDto(@NotBlank(message = "Username cannot be empty")
	@Size(max = 255, message = "Username cannot be longer than 200 characters")
	String username, 
	@NotBlank(message = "Email cannot be empty")
	@Size(max = 600, message = "Email cannot be longer than 600 characters")
	@Pattern(
			regexp = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
			message = "Invalid email format"
			)
	String login, 
	@Column(nullable = false)
	@NotBlank(message = "Password cannot be empty")
	@Size(max = 300, message = "Password cannot be longer than 300 characters")
	@Pattern(
			regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])\\S{6,}$",
	        message = "Password must contain at least one letter, one number, and one special character and not empty spaces"
	        )
	String password, MultipartFile imageUser) {

}
