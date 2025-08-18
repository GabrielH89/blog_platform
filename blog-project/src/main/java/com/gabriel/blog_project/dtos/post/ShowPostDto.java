package com.gabriel.blog_project.dtos.post;

import java.time.LocalDateTime;

public record ShowPostDto(Long id, String titlePost, String bodyPost, String imagePost, LocalDateTime createdAt, LocalDateTime updatedAt) {

}
