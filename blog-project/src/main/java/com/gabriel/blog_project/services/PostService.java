package com.gabriel.blog_project.services;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.gabriel.blog_project.dtos.post.CreatePostDto;
import com.gabriel.blog_project.dtos.post.ShowPostDto;
import com.gabriel.blog_project.dtos.post.UpdatePostDto;
import com.gabriel.blog_project.entities.EnumRole;
import com.gabriel.blog_project.entities.Post;
import com.gabriel.blog_project.entities.User;
import com.gabriel.blog_project.exceptions.EmptyDatasException;
import com.gabriel.blog_project.exceptions.PermissionDeniedException;
import com.gabriel.blog_project.repositories.PostRepository;
import com.gabriel.blog_project.repositories.UserRepository;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class PostService {
	
	private final PostRepository postRepository;
	private final UserRepository userRepository;	
	
	
	public PostService(PostRepository postRepository, UserRepository userRepository) {
		this.postRepository = postRepository;
		this.userRepository = userRepository;
	}
	
	public ShowPostDto createPost(CreatePostDto createPostDto, HttpServletRequest request) {
		long userId = (Long) request.getAttribute("userId");
		
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found"));
		
		var post = new Post(createPostDto.titlePost(), createPostDto.bodyPost(), createPostDto.imagePost());
		
		post.setUser(user);
		var postSaved = postRepository.save(post);
		
		return new ShowPostDto(postSaved.getId(), postSaved.getTitlePost(), postSaved.getBodyPost(), 
				postSaved.getImagePost(), postSaved.getCreatedAt(), postSaved.getUpdatedAt());
	}
	
	public List<ShowPostDto> getAllPosts(HttpServletRequest request) {
		long userId = (Long) request.getAttribute("userId");
		
		userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found"));
		
		var posts = postRepository.findAll();
		
		if(posts.isEmpty()) {
			throw new EmptyDatasException("No posts found");
		}
		
		List<ShowPostDto> result = posts.stream().map(post -> new ShowPostDto(post.getId(), post.getTitlePost(), post.getBodyPost(), 
				post.getImagePost(), post.getCreatedAt(), post.getUpdatedAt())).collect(Collectors.toList());
		return result;
	}
	
	public ShowPostDto getPostById(Long id, HttpServletRequest request) {
		long userId = (Long) request.getAttribute("userId");
		
		userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found"));
		
		var post = postRepository.findById(id)
		        .orElseThrow(() -> new EmptyDatasException("No post found with id " + id));
	    

	    // Mapeia o Post para ShowPostDto
	    return new ShowPostDto(
	            post.getId(),
	            post.getTitlePost(),
	            post.getBodyPost(),
	            post.getImagePost(),
	            post.getCreatedAt(),
	            post.getUpdatedAt()
	    );
	}
	
	public void deleteAllPosts(HttpServletRequest request) {
		long userId = (Long) request.getAttribute("userId");
		
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found"));
		
		 if (user.getRole().equals("ADMIN")) {
		        // ADMIN can delete all posts
		        var posts = postRepository.findAll();
		        if (posts.isEmpty()) {
		            throw new EmptyDatasException("No posts found to delete");
		        }
		        postRepository.deleteAll(posts);
		        return;
		    }

		    // Common users: can only delete their own posts
		    var userPosts = postRepository.findAll()
		            .stream()
		            .filter(post -> post.getUser().getId().equals(userId))
		            .toList();

		    if (userPosts.isEmpty()) {
		        throw new EmptyDatasException("You have no posts to delete");
		    }

		
		postRepository.deleteAll(userPosts);	
	}
	
	public void deletePostById(Long id, HttpServletRequest request) {
		long userId = (Long) request.getAttribute("userId");
		
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found"));
		
		Post post = postRepository.findById(id)
			        .orElseThrow(() -> new EmptyDatasException("No post found with id " + id));
		 
		if (!Objects.equals(post.getUser().getId(), userId) && user.getRole() != EnumRole.ADMIN) {
			 throw new PermissionDeniedException("You have no permission to delete this post");
		}

		 
		postRepository.deleteById(id);
	}
	
	public ShowPostDto updatePostById(Long id, UpdatePostDto updateDto, HttpServletRequest request) {
		long userId = (Long) request.getAttribute("userId");
		
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found"));
		
		Post post = postRepository.findById(id)
			        .orElseThrow(() -> new EmptyDatasException("No post found with id " + id));
		 
		if (!Objects.equals(post.getUser().getId(), userId) && user.getRole() != EnumRole.ADMIN) {
	        throw new PermissionDeniedException("You have no permission to update this post");
	    }
		
		post.setTitlePost(updateDto.titlePost());
		post.setBodyPost(updateDto.bodyPost());
		post.setImagePost(updateDto.imagePost());
		post.setUpdatedAt(updateDto.updatedAt());
		
		postRepository.save(post);
		
		 return new ShowPostDto(
		            post.getId(),
		            post.getTitlePost(),
		            post.getBodyPost(),
		            post.getImagePost(),
		            post.getCreatedAt(),
		            post.getUpdatedAt()
		    );
	}
}
