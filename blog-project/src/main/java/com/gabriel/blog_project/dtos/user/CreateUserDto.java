package com.gabriel.blog_project.dtos.user;

import com.gabriel.blog_project.entities.EnumRole;

public record CreateUserDto(String username, String login, String password, String imageUser, EnumRole role) {
	
}
