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

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/posts")
public class PostController {
	
	private final PostService postService;
	
	public PostController(PostService postService) {
		this.postService = postService;
	}
	
	@PostMapping
	public ResponseEntity<ShowPostDto> createPost(@Valid @RequestBody CreatePostDto createDto, HttpServletRequest request) {
		ShowPostDto postCreated = postService.createPost(createDto, request);
		return ResponseEntity.status(201).body(postCreated);
	}
	
	@GetMapping
	public ResponseEntity<List<ShowPostDto>> getAllPosts(HttpServletRequest request) {
		List<ShowPostDto> posts = postService.getAllPosts(request);
		return ResponseEntity.ok(posts);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<ShowPostDto> getPostById(@PathVariable Long id, HttpServletRequest request) {
		ShowPostDto post = postService.getPostById(id, request);
		return ResponseEntity.ok(post);
	}
	
	@DeleteMapping
	public ResponseEntity<String> deleteAllPosts(HttpServletRequest request) {
		postService.deleteAllPosts(request);
		return ResponseEntity.ok("Posts deleted with success");
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<String> deletePostById(@PathVariable Long id, HttpServletRequest request) {
		postService.deletePostById(id, request);
		return ResponseEntity.ok("Post " + id + " deleted with success");
	}
	
	@PutMapping("/{id}")
	public ResponseEntity<ShowPostDto> updatePostById(@Valid @RequestBody UpdatePostDto updateDto, @PathVariable Long id, HttpServletRequest request) {
		ShowPostDto postUpdated = postService.updatePostById(id, updateDto, request);
		return ResponseEntity.ok(postUpdated);
	}
}
