package com.gabriel.blog_project.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "tb_like",uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "target_id", "target_type"})})
public class Like {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	 @ManyToOne(fetch = FetchType.LAZY)
	    @JoinColumn(name = "user_id", nullable = false)
	    private User user;

	    /* ID do Post ou Comment */
	    @Column(name = "target_id", nullable = false)
	    private Long targetId;

	    /* POST ou COMMENT */
	    @Enumerated(EnumType.STRING)
	    @Column(name = "target_type", nullable = false, length = 20)
	    private EnumLikeTargetType enumLiketargetType;

	    @Column(nullable = false)
	    private LocalDateTime createdAt;
	
	    public Like() {
	    	
	    }
	    
	    public Like(User user, Long targetId, EnumLikeTargetType enumLiketargetType) {
	        this.user = user;
	        this.targetId = targetId;
	        this.enumLiketargetType = enumLiketargetType;
	    }
	    
	    @PrePersist
	    protected void onCreate() {
	        this.createdAt = LocalDateTime.now();
	    }

		public Long getId() {
			return id;
		}

		public void setId(Long id) {
			this.id = id;
		}

		public User getUser() {
			return user;
		}

		public void setUser(User user) {
			this.user = user;
		}

		public Long getTargetId() {
			return targetId;
		}

		public void setTargetId(Long targetId) {
			this.targetId = targetId;
		}

		public EnumLikeTargetType getEnumLiketargetType() {
			return enumLiketargetType;
		}

		public void setEnumLiketargetType(EnumLikeTargetType enumLiketargetType) {
			this.enumLiketargetType = enumLiketargetType;
		}

		public LocalDateTime getCreatedAt() {
			return createdAt;
		}

		public void setCreatedAt(LocalDateTime createdAt) {
			this.createdAt = createdAt;
		}

}


