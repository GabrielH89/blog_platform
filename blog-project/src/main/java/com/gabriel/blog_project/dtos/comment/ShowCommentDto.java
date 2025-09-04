package com.gabriel.blog_project.dtos.comment;

import java.time.LocalDateTime;

public record ShowCommentDto(Long id, String comment_body, LocalDateTime createdAt, LocalDateTime updatedAt) {

}
