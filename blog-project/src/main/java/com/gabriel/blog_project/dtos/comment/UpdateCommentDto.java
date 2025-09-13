package com.gabriel.blog_project.dtos.comment;

import java.time.LocalDateTime;

public record UpdateCommentDto(String comment_body, LocalDateTime updatedAt) {

}
