package com.gabriel.blog_project.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gabriel.blog_project.dtos.comment.ShowCommentDto;
import com.gabriel.blog_project.services.CommentService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/user/me/comments")
public class UserCommentController {
	
	private final CommentService commentService;
	
	public UserCommentController(CommentService commentService) {
		this.commentService = commentService;
	}
	
	@GetMapping
	public ResponseEntity<List<ShowCommentDto>> getCommentsUser(HttpServletRequest request) {
		List<ShowCommentDto> commentsUser = commentService.getCommentsUser(request);
		return ResponseEntity.ok(commentsUser);
	}
}
