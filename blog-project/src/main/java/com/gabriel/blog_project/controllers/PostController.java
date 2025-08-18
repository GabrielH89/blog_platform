package com.gabriel.blog_project.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gabriel.blog_project.dtos.post.CreatePostDto;
import com.gabriel.blog_project.dtos.post.ShowPostDto;
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
}
