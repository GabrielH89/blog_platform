package com.gabriel.blog_project.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gabriel.blog_project.dtos.post.CreatePostDto;
import com.gabriel.blog_project.dtos.post.ShowPostDto;
import com.gabriel.blog_project.dtos.post.UpdatePostDto;
import com.gabriel.blog_project.services.PostService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/posts")
public class PostController {
	
	private final PostService postService;
	
	public PostController(PostService postService) {
		this.postService = postService;
	}
	
	@PostMapping
	public ResponseEntity<ShowPostDto> createPost(@Valid @RequestBody CreatePostDto createDto) {
		ShowPostDto postCreated = postService.createPost(createDto);
		return ResponseEntity.status(201).body(postCreated);
	}
	
	@GetMapping
	public ResponseEntity<List<ShowPostDto>> getAllPosts() {
		List<ShowPostDto> posts = postService.getAllPosts();
		return ResponseEntity.ok(posts);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<ShowPostDto> getPostById(@PathVariable Long id) {
		ShowPostDto post = postService.getPostById(id);
		return ResponseEntity.ok(post);
	}
	
	@DeleteMapping
	public ResponseEntity<Void> deleteAllPosts() {
		postService.deleteAllPosts();
		return ResponseEntity.noContent().build();
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deletePostById(@PathVariable Long id) {
		postService.deletePostById(id);
		return ResponseEntity.noContent().build();
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<ShowPostDto> updatePostById(@Valid @RequestBody UpdatePostDto updateDto, @PathVariable Long id) {
		ShowPostDto postUpdated = postService.updatePostById(id, updateDto);
		return ResponseEntity.ok(postUpdated);
	}
}
