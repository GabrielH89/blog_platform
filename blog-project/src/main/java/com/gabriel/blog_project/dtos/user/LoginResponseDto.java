package com.gabriel.blog_project.dtos.user;

public record LoginResponseDto(String token, Long userId, String role) {
	
	public LoginResponseDto(String message) {
		this(null, null, message);
	}

	 public LoginResponseDto(String token, Long userId, String role) {
	        this.token = token;
	        this.userId = userId;
	        this.role = role;
	    }
}
