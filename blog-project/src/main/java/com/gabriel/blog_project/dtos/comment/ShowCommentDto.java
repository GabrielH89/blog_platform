package com.gabriel.blog_project.dtos.comment;

import java.time.LocalDateTime;

public record ShowCommentDto(String comment_body, LocalDateTime createdAt, LocalDateTime updatedAt) {

}
