package com.gabriel.blog_project.services;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.gabriel.blog_project.dtos.post.CreatePostDto;
import com.gabriel.blog_project.dtos.post.ShowPostDto;
import com.gabriel.blog_project.dtos.post.UpdatePostDto;
import com.gabriel.blog_project.entities.EnumRole;
import com.gabriel.blog_project.entities.Post;
import com.gabriel.blog_project.entities.User;
import com.gabriel.blog_project.exceptions.EmptyDatasException;
import com.gabriel.blog_project.exceptions.PermissionDeniedException;
import com.gabriel.blog_project.repositories.PostRepository;
import com.gabriel.blog_project.repositories.UserRepository;
import com.gabriel.blog_project.utils.FileUtils;

import java.io.IOException;
import jakarta.servlet.http.HttpServletRequest;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostService(PostRepository postRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    // ------------------ UTIL ------------------

    private User getAuthenticatedUser(HttpServletRequest request) {
        long userId = (Long) request.getAttribute("userId");

        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private void checkPostPermission(User user, Post post) {
        boolean isOwner = Objects.equals(post.getUser().getId(), user.getId());
        boolean isAdmin = user.getRole() == EnumRole.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new PermissionDeniedException("You have no permission to perform this action");
        }
    }

    // ------------------ CREATE ------------------

    public ShowPostDto createPost(CreatePostDto dto, HttpServletRequest request) {

        User user = getAuthenticatedUser(request);

        MultipartFile imageFile = dto.imagePost();
        String fileUrl = null;

        if (imageFile != null && !imageFile.isEmpty()) {
            String fileName = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
            Path uploadPath = Paths.get("uploads").toAbsolutePath();

            try {
                Files.createDirectories(uploadPath);
                Path filePath = uploadPath.resolve(fileName);
                imageFile.transferTo(filePath.toFile());

                fileUrl = "/uploads/" + fileName;

            } catch (IOException e) {
                throw new RuntimeException("Erro ao salvar imagem", e);
            }
        }

        Post post = new Post(dto.titlePost(), dto.bodyPost(), fileUrl);
        post.setUser(user);

        Post saved = postRepository.save(post);

        return new ShowPostDto(
                saved.getId(),
                saved.getTitlePost(),
                saved.getBodyPost(),
                saved.getImagePost(),
                saved.getCreatedAt(),
                saved.getUpdatedAt()
        );
    }

    // ------------------ READ ------------------

    public List<ShowPostDto> getAllPosts(HttpServletRequest request) {
        getAuthenticatedUser(request);

        var posts = postRepository.findAllByOrderByCreatedAtDesc();

        if (posts.isEmpty()) throw new EmptyDatasException("No posts found");

        return posts.stream()
                .map(p -> new ShowPostDto(
                        p.getId(), p.getTitlePost(), p.getBodyPost(),
                        p.getImagePost(), p.getCreatedAt(), p.getUpdatedAt()
                ))
                .collect(Collectors.toList());
    }

    public List<ShowPostDto> getPostsUser(HttpServletRequest request) {
        User user = getAuthenticatedUser(request);

        var posts = postRepository.findAllByUserIdOrderByCreatedAtDesc(user.getId());

        if (posts.isEmpty()) throw new EmptyDatasException("No posts found");

        return posts.stream()
                .map(p -> new ShowPostDto(
                        p.getId(), p.getTitlePost(), p.getBodyPost(),
                        p.getImagePost(), p.getCreatedAt(), p.getUpdatedAt()
                ))
                .collect(Collectors.toList());
    }

    public ShowPostDto getPostById(Long id, HttpServletRequest request) {
        getAuthenticatedUser(request);

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new EmptyDatasException("No post found with id " + id));

        return new ShowPostDto(
                post.getId(),
                post.getTitlePost(),
                post.getBodyPost(),
                post.getImagePost(),
                post.getCreatedAt(),
                post.getUpdatedAt()
        );
    }

    // ------------------ DELETE ------------------

    public void deleteAllPosts(HttpServletRequest request) {
        User user = getAuthenticatedUser(request);

        List<Post> posts;

        if (user.getRole() == EnumRole.ADMIN) {
            posts = postRepository.findAll();
        } else {
            posts = postRepository.findAll()
                    .stream()
                    .filter(p -> p.getUser().getId().equals(user.getId()))
                    .collect(Collectors.toList());
        }

        if (posts.isEmpty()) throw new EmptyDatasException("No posts found to delete");

        FileUtils.deleteImages(
                posts.stream()
                        .map(Post::getImagePost)
                        .filter(Objects::nonNull)
                        .collect(Collectors.toList())
        );

        postRepository.deleteAll(posts);
    }

    public void deletePostById(Long id, HttpServletRequest request) {
        User user = getAuthenticatedUser(request);

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new EmptyDatasException("No post found with id " + id));

        checkPostPermission(user, post);

        if (post.getImagePost() != null) {
            FileUtils.deleteImages(List.of(post.getImagePost()));
        }

        postRepository.delete(post);
    }

    // ------------------ UPDATE ------------------

    public ShowPostDto updatePostById(Long id, UpdatePostDto dto, HttpServletRequest request) {

        User user = getAuthenticatedUser(request);

        Post post = postRepository.findById(id)
                .orElseThrow(() -> new EmptyDatasException("No post found with id " + id));

        checkPostPermission(user, post);

        MultipartFile newImage = dto.imagePost();

        if (newImage != null && !newImage.isEmpty()) {

            if (post.getImagePost() != null)
                FileUtils.deleteImages(List.of(post.getImagePost()));

            String fileName = System.currentTimeMillis() + "_" + newImage.getOriginalFilename();
            Path uploadPath = Paths.get("uploads").toAbsolutePath();

            try {
                Files.createDirectories(uploadPath);
                Path filePath = uploadPath.resolve(fileName);
                newImage.transferTo(filePath.toFile());
                post.setImagePost("/uploads/" + fileName);

            } catch (IOException e) {
                throw new RuntimeException("Erro ao salvar nova imagem", e);
            }
        }

        if (dto.titlePost() != null) post.setTitlePost(dto.titlePost());
        if (dto.bodyPost() != null) post.setBodyPost(dto.bodyPost());

        post.setUpdatedAt(LocalDateTime.now());
        postRepository.save(post);

        return new ShowPostDto(
                post.getId(),
                post.getTitlePost(),
                post.getBodyPost(),
                post.getImagePost(),
                post.getCreatedAt(),
                post.getUpdatedAt()
        );
    }
}
