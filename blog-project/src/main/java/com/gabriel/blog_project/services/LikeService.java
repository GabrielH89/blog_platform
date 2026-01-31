package com.gabriel.blog_project.services;

import org.springframework.stereotype.Service;

import com.gabriel.blog_project.entities.EnumLikeTargetType;
import com.gabriel.blog_project.entities.Like;
import com.gabriel.blog_project.entities.User;
import com.gabriel.blog_project.repositories.LikeRepository;
import com.gabriel.blog_project.repositories.UserRepository;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class LikeService {

    private final LikeRepository likeRepository;
    private final UserRepository userRepository;

    public LikeService(LikeRepository likeRepository, UserRepository userRepository) {
        this.likeRepository = likeRepository;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");

        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public boolean toggleLike(HttpServletRequest request, Long targetId, EnumLikeTargetType targetType) {
        User user = getAuthenticatedUser(request);

        return likeRepository
            .findByUserIdAndTargetIdAndTargetType(user.getId(), targetId, targetType)
            .map(existingLike -> {
                likeRepository.delete(existingLike);
                return false; // like removido
            })
            .orElseGet(() -> {
                likeRepository.save(new Like(user, targetId, targetType));
                return true; // like adicionado
            });
    }

    public Long countLikes(Long targetId, EnumLikeTargetType targetType) {
        return likeRepository.countByTargetIdAndTargetType(targetId, targetType);
    }
}

