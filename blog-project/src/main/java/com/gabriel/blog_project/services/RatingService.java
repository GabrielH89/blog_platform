package com.gabriel.blog_project.services;

import java.util.Objects;

import org.springframework.stereotype.Service;
import com.gabriel.blog_project.dtos.rating.CreateRatingDto;
import com.gabriel.blog_project.dtos.rating.ShowRatingDto;
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
}



