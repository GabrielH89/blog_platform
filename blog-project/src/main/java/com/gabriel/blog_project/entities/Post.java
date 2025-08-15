package com.gabriel.blog_project.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "tb_post")
public class Post {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String titlePost;
	private String bodyPost;
	private String imagePost;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

	@ManyToOne
	@JoinColumn(name = "user_id", nullable = false)
	private User user;
	
	public Post() {
		
	}

	public Post(Long id, String titlePost, String bodyPost, String imagePost, LocalDateTime createdAt, LocalDateTime updatedAt) {
		this.id = id;
		this.titlePost = titlePost;
		this.bodyPost = bodyPost;
		this.imagePost = imagePost;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
	}
	
	@PrePersist
	protected void onCreate() {
		this.createdAt = LocalDateTime.now();
		this.updatedAt = LocalDateTime.now();
	}
	
	@PreUpdate
	protected void onUpdate() {
		this.updatedAt = LocalDateTime.now();
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getTitlePost() {
		return titlePost;
	}

	public void setTitlePost(String titlePost) {
		this.titlePost = titlePost;
	}

	public String getBodyPost() {
		return bodyPost;
	}

	public void setBodyPost(String bodyPost) {
		this.bodyPost = bodyPost;
	}

	public String getImagePost() {
		return imagePost;
	}

	public void setImagePost(String imagePost) {
		this.imagePost = imagePost;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}
	
}
