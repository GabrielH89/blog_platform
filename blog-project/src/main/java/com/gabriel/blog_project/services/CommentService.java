package com.gabriel.blog_project.services;

import org.springframework.stereotype.Service;

import com.gabriel.blog_project.dtos.comment.CreateCommentDto;
import com.gabriel.blog_project.dtos.comment.ShowCommentDto;
import com.gabriel.blog_project.entities.Comment;
import com.gabriel.blog_project.entities.Post;
import com.gabriel.blog_project.entities.User;
import com.gabriel.blog_project.repositories.CommentRepository;
import com.gabriel.blog_project.repositories.PostRepository;
import com.gabriel.blog_project.repositories.UserRepository;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class CommentService {
	
	private final CommentRepository commentRepository;
	private final UserRepository userRepository;
	private final PostRepository postRepository;
	
	public CommentService(CommentRepository commentRepository, UserRepository userRepository, PostRepository postRepository) {
		this.commentRepository = commentRepository;
		this.userRepository = userRepository;
		this.postRepository = postRepository;
	}
	
	public ShowCommentDto createComment(Long postId, CreateCommentDto createDto, HttpServletRequest request) {
		long userId = (Long) request.getAttribute("userId");
		
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found"));
		
		Post post = postRepository.findById(postId)
				.orElseThrow(() -> new RuntimeException("User not foun"));
		
		var comment = new Comment(createDto.comment_body());
		comment.setUser(user);
		comment.setPost(post);
		
		var commentSaved = commentRepository.save(comment);
		
		return new ShowCommentDto(commentSaved.getComment_body(), commentSaved.getCreatedAt(), commentSaved.getUpdatedAt());
	}
}



