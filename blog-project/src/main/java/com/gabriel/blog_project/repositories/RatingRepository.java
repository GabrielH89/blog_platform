package com.gabriel.blog_project.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gabriel.blog_project.entities.Rating;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
	Optional<Rating> findByUserIdAndPostId(Long userId, Long postIid);
}
