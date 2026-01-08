	package com.gabriel.blog_project.repositories;
	
	import java.util.List;
	import java.util.Optional;
	
	import org.springframework.data.jpa.repository.JpaRepository;
	import org.springframework.stereotype.Repository;
	
	import com.gabriel.blog_project.entities.Comment;
	
	@Repository
	public interface CommentRepository extends JpaRepository<Comment, Long> {
		 // Comentários raiz visíveis
	    List<Comment> findByPostIdAndParentCommentIsNullAndDeletedFalseOrderByCreatedAtAsc(Long postId);

	    // Respostas diretas visíveis
	    List<Comment> findByParentCommentIdAndDeletedFalseOrderByCreatedAtAsc(Long parentId);

	    // Buscar comentário válido para update/delete
	    Optional<Comment> findByIdAndDeletedFalse(Long id);

	    // Comentários de um usuário (histórico)
	    List<Comment> findByUserIdAndDeletedFalseOrderByCreatedAtDesc(Long userId);

	    // Admin / auditoria (opcional)
	    List<Comment> findByPostId(Long postId);
	    
	    List<Comment> findAllByUserIdOrderByCreatedAtDesc(Long userId);
	}
