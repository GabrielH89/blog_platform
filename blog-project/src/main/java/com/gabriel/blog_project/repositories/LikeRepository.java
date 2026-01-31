package com.gabriel.blog_project.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gabriel.blog_project.entities.EnumLikeTargetType;
import com.gabriel.blog_project.entities.Like;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
		Optional<Like> findByUserIdAndTargetIdAndTargetType(Long userId, Long targetId, EnumLikeTargetType targetType);

	    Long countByTargetIdAndTargetType(Long targetId, EnumLikeTargetType targetType);

	    void deleteByUserIdAndTargetIdAndTargetType(Long userId, Long targetId, EnumLikeTargetType targetType);
}
