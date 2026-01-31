package com.gabriel.blog_project.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gabriel.blog_project.entities.EnumLikeTargetType;
import com.gabriel.blog_project.services.LikeService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/likes")
public class LikeController {
	private final LikeService likeService;
	
	public LikeController(LikeService likeService) {
		this.likeService = likeService; 
	}
	
	@PostMapping("/toggle")
	public ResponseEntity<Boolean> toggleLike(HttpServletRequest request, @RequestParam Long targetId, @RequestParam EnumLikeTargetType targetType) {
		boolean liked = likeService.toggleLike(request, targetId, targetType);
		return ResponseEntity.ok(liked);
	}
	
	 @GetMapping("/count") 
	 public ResponseEntity<Long> countLikes(@RequestParam Long targetId, @RequestParam EnumLikeTargetType targetType) {
		 Long count = likeService.countLikes(targetId, targetType);
		 return ResponseEntity.ok(count);
	 }
}


