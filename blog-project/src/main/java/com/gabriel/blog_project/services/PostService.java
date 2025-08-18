package com.gabriel.blog_project.services;

import org.springframework.stereotype.Service;

import com.gabriel.blog_project.dtos.post.CreatePostDto;
import com.gabriel.blog_project.dtos.post.ShowPostDto;
import com.gabriel.blog_project.entities.Post;
import com.gabriel.blog_project.entities.User;
import com.gabriel.blog_project.repositories.PostRepository;
import com.gabriel.blog_project.repositories.UserRepository;

@Service
public class PostService {
	
	private final PostRepository postRepository;
	private final UserRepository userRepository;	
	
	
	public PostService(PostRepository postRepository, UserRepository userRepository) {
		this.postRepository = postRepository;
		this.userRepository = userRepository;
	}
	
	public ShowPostDto createPost(CreatePostDto createPostDto) {
		Long userId = 1L;
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found"));
		
		var post = new Post(createPostDto.titlePost(), createPostDto.bodyPost(), createPostDto.imagePost());
		
		post.setUser(user);
		var postSaved = postRepository.save(post);
		
		return new ShowPostDto(postSaved.getId(), postSaved.getTitlePost(), postSaved.getBodyPost(), 
				postSaved.getImagePost(), postSaved.getCreatedAt(), postSaved.getUpdatedAt());
	}
}
