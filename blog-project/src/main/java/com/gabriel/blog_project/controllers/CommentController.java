package com.gabriel.blog_project.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gabriel.blog_project.dtos.comment.CreateCommentDto;
import com.gabriel.blog_project.dtos.comment.ShowCommentDto;
import com.gabriel.blog_project.services.CommentService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/posts/{postId}/comments")
public class CommentController {
	
	private final CommentService commentService;
	
	public CommentController(CommentService commentService) {
		this.commentService = commentService;
	}
	
	@PostMapping
	public ResponseEntity<ShowCommentDto> createComment(@Valid @PathVariable Long postId, @RequestBody CreateCommentDto createDto, 
			HttpServletRequest request) {
		ShowCommentDto commentCreated = commentService.createComment(postId, createDto, request);
		return ResponseEntity.status(201).body(commentCreated);
	}
	
	@GetMapping
	public ResponseEntity<List<ShowCommentDto>> getAllComments(@PathVariable Long postId, HttpServletRequest request) {
		List<ShowCommentDto> comments = commentService.getAllComments(postId, request);
		return ResponseEntity.ok(comments);
	}
	
	@GetMapping("/{id}")
	public ResponseEntity<ShowCommentDto> getCommentById(@PathVariable Long postId, @PathVariable Long id, HttpServletRequest request) {
		ShowCommentDto comment = commentService.getCommentById(postId, id, request);
		return ResponseEntity.ok(comment);
	}
	
	@DeleteMapping("/{id}") 
	public ResponseEntity<String> deleteCommentById(@PathVariable Long postId, @PathVariable Long id, HttpServletRequest request) {
		commentService.deleteCommentById(postId, id, request);
		return ResponseEntity.ok("Comment deleted with success");
	}
	
}


