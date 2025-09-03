package com.gabriel.blog_project.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gabriel.blog_project.dtos.comment.CreateCommentDto;
import com.gabriel.blog_project.dtos.comment.ShowCommentDto;
import com.gabriel.blog_project.services.CommentService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/posts/{postId}/comments")
public class CommentController {
	
	private final CommentService commentService;
	
	public CommentController(CommentService commentService) {
		this.commentService = commentService;
	}
	
	@PostMapping
	public ResponseEntity<ShowCommentDto> createComment(@PathVariable Long postId, @RequestBody CreateCommentDto createDto, HttpServletRequest request) {
		ShowCommentDto commentCreated = commentService.createComment(postId, createDto, request);
		return ResponseEntity.status(201).body(commentCreated);
	}
}


