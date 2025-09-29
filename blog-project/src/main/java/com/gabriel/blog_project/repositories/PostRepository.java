package com.gabriel.blog_project.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gabriel.blog_project.entities.Post;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
	List<Post> findPostByUserId(Long userId);
}
