package com.gabriel.blog_project.services;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.gabriel.blog_project.dtos.comment.ShowCommentDto;
import com.gabriel.blog_project.dtos.rating.CreateRatingDto;
import com.gabriel.blog_project.dtos.rating.ShowRatingDto;
import com.gabriel.blog_project.dtos.rating.UpdateRatingDto;
import com.gabriel.blog_project.entities.EnumRole;
import com.gabriel.blog_project.entities.Post;
import com.gabriel.blog_project.entities.Rating;
import com.gabriel.blog_project.entities.User;
import com.gabriel.blog_project.exceptions.EmptyDatasException;
import com.gabriel.blog_project.exceptions.NoPermissionToRate;
import com.gabriel.blog_project.exceptions.PermissionDeniedException;
import com.gabriel.blog_project.repositories.PostRepository;
import com.gabriel.blog_project.repositories.RatingRepository;
import com.gabriel.blog_project.repositories.UserRepository;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class RatingService {
	
	private final RatingRepository ratingRepository;
	private final UserRepository userRepository;
	private final PostRepository postRepository;
	
	
	public RatingService(RatingRepository ratingRepository, UserRepository userRepository, PostRepository postRepository) {
		this.ratingRepository = ratingRepository;
		this.userRepository = userRepository;
		this.postRepository = postRepository;
	}
	
	//Function only for ADMIN 
	public List<ShowRatingDto> getAllRatings(HttpServletRequest request) {
		long userId = (Long) request.getAttribute("userId");
		
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found"));
		
		if(user.getRole() != EnumRole.ADMIN) {
			throw new PermissionDeniedException("You have no permission to see all ratings");
		}
		
		var ratings = ratingRepository.findAll();
		if(ratings.isEmpty()) {
			throw new EmptyDatasException("Ratings not found");
		}
		
		List<ShowRatingDto> result = ratings.stream().map(rating -> new ShowRatingDto(rating.getId(), rating.getRating_value()))
				.collect(Collectors.toList());
		
		return result;
		
	}
	
	public ShowRatingDto createRating(Long postId, HttpServletRequest request, CreateRatingDto createDto) {
		long userId = (Long) request.getAttribute("userId");
		
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found"));
		
		Post post = postRepository.findById(postId)
				.orElseThrow(() -> new EmptyDatasException("Post not found"));
		
		ratingRepository.findByUserIdAndPostId(userId, postId).ifPresent(r -> {
			throw new NoPermissionToRate("You have already rated this post");
		});
		
		var rating_value = new Rating(createDto.rating_value());
		rating_value.setUser(user);
		rating_value.setPost(post);
		
		var ratingSaved = ratingRepository.save(rating_value);
		return new ShowRatingDto(ratingSaved.getId(), ratingSaved.getRating_value());
	}
	
	public void deleteRatingById(Long postId, Long ratingId, HttpServletRequest request) {
		long userId = (Long) request.getAttribute("userId");
		
		userRepository.findById(userId)
		.orElseThrow(() -> new RuntimeException("User not found"));

		postRepository.findById(postId)
		.orElseThrow(() -> new EmptyDatasException("Post not found"));
		
		var rating = ratingRepository.findByIdAndPostIdAndUserId(ratingId, postId, userId)				
				.orElseThrow(() -> new EmptyDatasException("Rating not found"));
		
		if (!Objects.equals(rating.getUser().getId(), userId)) {
			throw new PermissionDeniedException("You have no permission to delete this rating.");
		}
		
		ratingRepository.delete(rating);
	}
	
	public ShowRatingDto updateRatingById(Long postId, Long ratingId, UpdateRatingDto updateDto, HttpServletRequest request) {
		long userId = (Long) request.getAttribute("userId");
		
		userRepository.findById(userId)
		.orElseThrow(() -> new RuntimeException("User not found"));

		postRepository.findById(postId)
		.orElseThrow(() -> new EmptyDatasException("Post not found"));
		
		var rating = ratingRepository.findByIdAndPostIdAndUserId(ratingId, postId, userId)
				.orElseThrow(() -> new EmptyDatasException("Rating not found"));
		
		if (!Objects.equals(rating.getUser().getId(), userId)) {
			throw new PermissionDeniedException("You have no permission to update this rating.");
		}
		
		rating.setRating_value(updateDto.rating_value());
		
		ratingRepository.save(rating);
		return new ShowRatingDto(rating.getId(), rating.getRating_value());
	}
}



