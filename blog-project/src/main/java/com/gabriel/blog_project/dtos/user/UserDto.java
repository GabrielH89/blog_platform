package com.gabriel.blog_project.dtos.user;

import com.gabriel.blog_project.entities.EnumRole;

public record UserDto(String username, String email, String password, String imageUser, EnumRole role) {

}
