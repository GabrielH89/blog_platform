package com.gabriel.blog_project.dtos.post;

import java.time.LocalDateTime;

public record UpdatePostDto(String titlePost, String bodyPost, String imagePost, LocalDateTime updatedAt) {

}
