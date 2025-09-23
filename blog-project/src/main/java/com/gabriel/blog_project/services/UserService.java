package com.gabriel.blog_project.services;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.gabriel.blog_project.dtos.user.DeleteImageUserDto;
import com.gabriel.blog_project.dtos.user.UpdateDatasUserDto;
import com.gabriel.blog_project.dtos.user.UserDto;
import com.gabriel.blog_project.entities.Comment;
import com.gabriel.blog_project.entities.EnumRole;
import com.gabriel.blog_project.entities.User;
import com.gabriel.blog_project.exceptions.EmptyDatasException;
import com.gabriel.blog_project.repositories.CommentRepository;
import com.gabriel.blog_project.repositories.UserRepository;
import com.gabriel.blog_project.security.TokenService;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class UserService implements UserDetailsService {
	
	private final UserRepository userRepository;
	private final CommentRepository commentRepository;
	private final PasswordEncoder passwordEncoder;
	private final ImageStorageService imageStorageService;
	private final TokenService tokenService;
	
	public UserService(UserRepository userRepository, CommentRepository commentRepository, PasswordEncoder passwordEncoder, 
			ImageStorageService imageStorageService, TokenService tokenService) {
		this.userRepository = userRepository;
		this.commentRepository = commentRepository;
		this.passwordEncoder = passwordEncoder;
		this.imageStorageService = imageStorageService;
		this.tokenService = tokenService;
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
	
	public ResponseEntity<Map<String, Object>> updateDatasUser(HttpServletRequest request, UpdateDatasUserDto updateDto) {
		 long userId = (Long) request.getAttribute("userId");

		    User user = userRepository.findById(userId)
		            .orElseThrow(() -> new NoSuchElementException("User not found"));
		    
		    UserDetails existingUserDetails = userRepository.findByLogin(updateDto.login());
		    if(existingUserDetails != null) {
		    	 User existingUser = (User) existingUserDetails; 
			        if (existingUser.getId() != user.getId()) {
			            throw new IllegalArgumentException("Não foi possível atualizar os dados do usuário");
			        }
		    }
		    
		    user.setUsername(updateDto.username());
		    user.setLogin(updateDto.login());
		    
		    if (updateDto.password() != null && !updateDto.password().isBlank()) {
		        String encryptedPassword = passwordEncoder.encode(updateDto.password());
		        user.setPassword(encryptedPassword);
		    }
		    
		    if(updateDto.imageUser() != null && !updateDto.imageUser().isEmpty()) {
		    	 try {
			            if (user.getImageUser() != null) {
			                imageStorageService.deleteImage(user.getImageUser());
			            }
			            String imagePath = imageStorageService.saveImage(updateDto.imageUser());
			            user.setImageUser(imagePath);
			        } catch (Exception e) {
			            throw new RuntimeException("Erro ao processar a imagem", e);
			        }
		    }
		    
		    userRepository.save(user);
		    
		    String newToken = tokenService.generateToken(user);
		    
		    UserDto userDto = new UserDto(user.getUsername(), user.getLogin(), null);
		    
		    return ResponseEntity.ok(Map.of(
		            "token", newToken,
		            "user", userDto
		    ));
	}
	
	public DeleteImageUserDto deleteUserImage(HttpServletRequest request) {
		Long userId = (Long) request.getAttribute("userId");
		
		if (userId == null) {
	        throw new IllegalArgumentException("User not found");
	    }
		
		 User user = userRepository.findById(userId)
			        .orElseThrow(() -> new IllegalArgumentException("User not found"));
		 
	        try {
	            if (user.getImageUser() != null) {
	                imageStorageService.deleteImage(user.getImageUser());
	            }
	           
	        } catch (Exception e) {
	            throw new RuntimeException("Error to process image", e);
	        }
		 
		 user.setImageUser(null);
		 userRepository.save(user);
		 return new DeleteImageUserDto(null);
	}
	
	public UserDto getUserById(HttpServletRequest request) {
	    Long userId = (Long) request.getAttribute("userId");

	    if (userId == null) {
	        throw new IllegalArgumentException("User not found");
	    }

	    User user = userRepository.findById(userId)
	            .orElseThrow(() -> new IllegalArgumentException("User not found"));
	    
	    return new UserDto(
	        user.getUsername(),
	        user.getLogin(),
	        user.getImageUser()
	    );
	}

}
