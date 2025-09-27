package com.gabriel.blog_project.dtos.post;

import org.springframework.web.multipart.MultipartFile;

public record CreatePostDto(String titlePost, String bodyPost, MultipartFile imagePost) {

}
