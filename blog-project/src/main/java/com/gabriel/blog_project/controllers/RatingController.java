package com.gabriel.blog_project.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gabriel.blog_project.dtos.rating.CreateRatingDto;
import com.gabriel.blog_project.dtos.rating.ShowRatingDto;
import com.gabriel.blog_project.dtos.rating.UpdateRatingDto;
import com.gabriel.blog_project.services.RatingService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/posts/{postId}/ratings")
public class RatingController {
	
	private final RatingService ratingService;
	
	public RatingController(RatingService ratingService) {
		this.ratingService = ratingService;
	}
		
	@PostMapping
    public ResponseEntity<ShowRatingDto> createRating(@PathVariable Long postId, @Valid @RequestBody CreateRatingDto createDto,
    		HttpServletRequest request) {
        ShowRatingDto newRating = ratingService.createRating(postId, request, createDto);
        return ResponseEntity.status(201).body(newRating);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRatingById(@PathVariable Long postId, @PathVariable Long id, HttpServletRequest request) {
        ratingService.deleteRatingById(postId, id, request);
        return ResponseEntity.ok("Rating deleted successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<ShowRatingDto> updateRatingById(@PathVariable Long postId, @PathVariable Long id, @Valid 
    		@RequestBody UpdateRatingDto updateDto, HttpServletRequest request) {
        ShowRatingDto updated = ratingService.updateRatingById(postId, id, updateDto, request);
        return ResponseEntity.ok(updated);
    }
    
    @GetMapping("/user")
    public ResponseEntity<ShowRatingDto> getUserRating(@PathVariable Long postId, HttpServletRequest request) {
        ShowRatingDto rating = ratingService.getUserRating(postId, request);
        return ResponseEntity.ok(rating);
    }

}


