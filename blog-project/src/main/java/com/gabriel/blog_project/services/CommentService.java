package com.gabriel.blog_project.services;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import com.gabriel.blog_project.dtos.comment.CreateCommentDto;
import com.gabriel.blog_project.dtos.comment.ShowCommentDto;
import com.gabriel.blog_project.entities.Comment;
import com.gabriel.blog_project.entities.EnumRole;
import com.gabriel.blog_project.entities.Post;
import com.gabriel.blog_project.entities.User;
import com.gabriel.blog_project.exceptions.EmptyDatasException;
import com.gabriel.blog_project.exceptions.PermissionDeniedException;
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
				.orElseThrow(() -> new EmptyDatasException("Post not found"));
		
		var comment = new Comment(createDto.comment_body());
		comment.setUser(user);
		comment.setPost(post);
		
		var commentSaved = commentRepository.save(comment);
		
		return new ShowCommentDto(commentSaved.getId(), commentSaved.getComment_body(), commentSaved.getCreatedAt(), commentSaved.getUpdatedAt());
	}
	
	public List<ShowCommentDto> getAllComments(Long postId, HttpServletRequest request) {
		long userId = (Long) request.getAttribute("userId");
		
		userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found"));
		
		postRepository.findById(postId)
				.orElseThrow(() -> new EmptyDatasException("Post not found"));
		
		var comments = commentRepository.findCommentByPostId(postId);
		
		if(comments.isEmpty()) {
			throw new EmptyDatasException("No comments found");
		}
				
		List<ShowCommentDto> result = comments.stream().map(comment -> new ShowCommentDto(comment.getId(), comment.getComment_body(), 
				comment.getCreatedAt(), comment.getUpdatedAt())).collect(Collectors.toList());
		
		return result;
	}
	
	public ShowCommentDto getCommentById(Long postId, Long commentId, HttpServletRequest request) {
		long userId = (Long) request.getAttribute("userId");
		
		userRepository.findById(userId)
		.orElseThrow(() -> new RuntimeException("User not found"));

		postRepository.findById(postId)
		.orElseThrow(() -> new EmptyDatasException("Post not found"));
		
		 var comment = commentRepository.findByPostIdAndId(postId, commentId)
			        .orElseThrow(() -> new EmptyDatasException("Comment not found"));
		
		return new ShowCommentDto(commentId, comment.getComment_body(), comment.getCreatedAt(), comment.getUpdatedAt());
	}
	
	public void deleteCommentById(Long postId, Long commentId, HttpServletRequest request) {
		long userId = (Long) request.getAttribute("userId");
			
		User user = userRepository.findById(userId)
		.orElseThrow(() -> new RuntimeException("User not found"));

		postRepository.findById(postId)
		.orElseThrow(() -> new EmptyDatasException("Post not found"));
		
		var comment = commentRepository.findByPostIdAndId(postId, commentId)
				.orElseThrow(() -> new EmptyDatasException("Comment not found"));
		
		if (!Objects.equals(comment.getUser().getId(), userId) && user.getRole() != EnumRole.ADMIN) {
			throw new PermissionDeniedException("You have no permission to delete this comment.");
		}
		
		commentRepository.delete(comment);
	}
}



