package com.gabriel.blog_project.services;

import org.springframework.stereotype.Service;

import com.gabriel.blog_project.dtos.user.CreateUserDto;
import com.gabriel.blog_project.dtos.user.UserDto;
import com.gabriel.blog_project.entities.User;
import com.gabriel.blog_project.repositories.UserRepository;

@Service
public class UserService {
	
	private final UserRepository userRepository;
	
	public UserService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}
	
	public UserDto createUser(CreateUserDto createDto) {
		User user = new User();
		user.setUsername(createDto.username());
		user.setLogin(createDto.login());
		user.setPassword(createDto.password());
		user.setImageUser(createDto.imageUser());
		user.setRole(createDto.role());
		
		userRepository.save(user);
		return new UserDto(user.getUsername(), user.getLogin(), user.getPassword(), user.getImageUser(), user.getRole());
	}
}
