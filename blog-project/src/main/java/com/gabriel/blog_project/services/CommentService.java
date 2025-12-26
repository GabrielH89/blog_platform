package com.gabriel.blog_project.services;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import com.gabriel.blog_project.dtos.comment.CreateCommentDto;
import com.gabriel.blog_project.dtos.comment.ShowCommentDto;
import com.gabriel.blog_project.dtos.comment.UpdateCommentDto;
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

    private Long validateUser(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return userId;
    }    
    
    public ShowCommentDto createComment(Long postId, CreateCommentDto createDto, Long parentCommentId, HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");

        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        Post post = postRepository.findById(postId).orElseThrow(() -> new EmptyDatasException("Post not found"));

        Comment comment = new Comment(createDto.comment_body());
        comment.setUser(user);
        comment.setPost(post);

        if (parentCommentId != null) {
            Comment parent = commentRepository.findByIdAndDeletedFalse(parentCommentId)
                    .orElseThrow(() -> new EmptyDatasException("Parent comment not found"));

            if (!parent.getPost().getId().equals(postId)) {
                throw new IllegalArgumentException("Parent comment does not belong to this post");
            }

            comment.setParentComment(parent);
        }

        Comment saved = commentRepository.save(comment);

        return toDto(saved, List.of());
    }


    public List<ShowCommentDto> getAllComments(Long postId, HttpServletRequest request) {
        validateUser(request);

        postRepository.findById(postId).orElseThrow(() -> new EmptyDatasException("Post not found"));

        List<Comment> roots =
                commentRepository.findByPostIdAndParentCommentIsNullAndDeletedFalseOrderByCreatedAtAsc(postId);

        return roots.stream()
                .map(comment -> toDto(
                        comment,
                        loadReplies(comment.getId())
                ))
                .toList();
    }

    public ShowCommentDto getCommentById(Long postId, Long commentId, HttpServletRequest request) {
        validateUser(request);

        Comment comment = commentRepository.findByIdAndDeletedFalse(commentId).orElseThrow(() -> new EmptyDatasException("Comment not found"));

        if (!comment.getPost().getId().equals(postId)) {
            throw new EmptyDatasException("Comment does not belong to this post");
        }

        return toDto(comment, loadReplies(comment.getId()));
    }

    public ShowCommentDto updateCommentById(Long commentId, Long postId, UpdateCommentDto updateDto, HttpServletRequest request) {
        Long userId = validateUser(request);

        Comment comment = commentRepository.findByIdAndDeletedFalse(commentId).orElseThrow(() -> new EmptyDatasException("Comment not found"));

        if (!comment.getPost().getId().equals(postId)) {
            throw new EmptyDatasException("Comment does not belong to this post");
        }

        if (!comment.getUser().getId().equals(userId)) {
            throw new PermissionDeniedException("You have no permission to update this comment.");
        }

        comment.setComment_body(updateDto.comment_body());
        commentRepository.save(comment);

        return toDto(comment, loadReplies(comment.getId()));
    }

    public void deleteCommentById(Long postId, Long commentId, HttpServletRequest request) {
        Long userId = validateUser(request);

        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = commentRepository.findByIdAndDeletedFalse(commentId).orElseThrow(() -> new EmptyDatasException("Comment not found"));

        if (!comment.getPost().getId().equals(postId)) {
            throw new EmptyDatasException("Comment does not belong to this post");
        }

        if (!comment.getUser().getId().equals(userId) && user.getRole() != EnumRole.ADMIN) {
            throw new PermissionDeniedException("You have no permission to delete this comment.");
        }

        comment.setDeleted(true);
        commentRepository.save(comment);
    }
   
    private List<ShowCommentDto> loadReplies(Long parentId) {
        return commentRepository.findByParentCommentIdAndDeletedFalseOrderByCreatedAtAsc(parentId).stream()
                .map(reply -> toDto(reply, loadReplies(reply.getId())))
                .toList();
    }

    private ShowCommentDto toDto(Comment comment, List<ShowCommentDto> replies) {
        return new ShowCommentDto(comment.getId(), comment.getComment_body(), comment.getCreatedAt(), comment.getUpdatedAt(), comment.getDeleted(),
        		replies, comment.getUser().getId());
    }
}




