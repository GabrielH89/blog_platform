package com.gabriel.blog_project.dtos.user;

public record LoginResponseDto(String token, Long userId) {
	
	public LoginResponseDto(String token) {
		this(token, null);
	}
	

    public LoginResponseDto(Long userId) {
        this(null, userId);
    }
}
