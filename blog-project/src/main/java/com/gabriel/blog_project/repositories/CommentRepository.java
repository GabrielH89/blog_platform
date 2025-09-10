	package com.gabriel.blog_project.repositories;
	
	import java.util.List;
	import java.util.Optional;
	
	import org.springframework.data.jpa.repository.JpaRepository;
	import org.springframework.stereotype.Repository;
	
	import com.gabriel.blog_project.entities.Comment;
	
	@Repository
	public interface CommentRepository extends JpaRepository<Comment, Long> {
		List<Comment> findCommentByPostId(Long postId);
		Optional<Comment> findByPostIdAndId(Long postId, Long commentId);
		List<Comment> findByUserId(Long userId);
	}
