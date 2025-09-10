package com.gabriel.blog_project.services;

import java.util.List;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.gabriel.blog_project.dtos.user.CreateUserDto;
import com.gabriel.blog_project.dtos.user.UserDto;
import com.gabriel.blog_project.entities.Comment;
import com.gabriel.blog_project.entities.EnumRole;
import com.gabriel.blog_project.entities.User;
import com.gabriel.blog_project.exceptions.EmptyDatasException;
import com.gabriel.blog_project.repositories.CommentRepository;
import com.gabriel.blog_project.repositories.UserRepository;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class UserService implements UserDetailsService {
	
	private final UserRepository userRepository;
	private final CommentRepository commentRepository;
	
	public UserService(UserRepository userRepository, CommentRepository commentRepository) {
		this.userRepository = userRepository;
		this.commentRepository = commentRepository;
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		return userRepository.findByLogin(username);
	}
	
	public String deleteAccount(HttpServletRequest request) {
		Long userId = (Long) request.getAttribute("userId");
		
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found"));
		
		userRepository.delete(user);
		
		return "User deleted with success";
	}
	
	public void deleteAllUserComments(HttpServletRequest request) {
		long userId = (Long) request.getAttribute("userId");
		
		User user = userRepository.findById(userId)
		.orElseThrow(() -> new RuntimeException("User not found"));
		
		if(user.getRole() == EnumRole.ADMIN) {
			var commentsFound = commentRepository.findAll();
			
			if(commentsFound.isEmpty()) {
				throw new EmptyDatasException("No comments found to delete");
			}
			
			commentRepository.deleteAll(commentsFound);
		}else {
			List<Comment> userComments = commentRepository.findByUserId(userId);
			
			if(userComments.isEmpty()) {
				throw new EmptyDatasException("No comments found in the sistem");
			}
			
			commentRepository.deleteAll(userComments);
		}
	}
}
