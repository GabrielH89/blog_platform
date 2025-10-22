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
		
	public ShowPostDto createPost(CreatePostDto createPostDto, HttpServletRequest request) {
	    long userId = (Long) request.getAttribute("userId");

	    User user = userRepository.findById(userId)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    MultipartFile imageFile = createPostDto.imagePost();
	    String fileName = null;
	    String fileUrl = null; 

	    if (imageFile != null && !imageFile.isEmpty()) {
	        fileName = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
	        Path uploadPath = Paths.get("uploads").toAbsolutePath(); 

	        try {
	            Files.createDirectories(uploadPath);

	            Path filePath = uploadPath.resolve(fileName);

	            // salva o arquivo no disco
	            imageFile.transferTo(filePath.toFile());

	            // cria a URL relativa para acesso via HTTP
	            fileUrl = "/uploads/" + fileName;

	        } catch (IOException e) {
	            throw new RuntimeException("Erro ao salvar imagem", e);
	        }
	    }

	    // cria a entidade Post, usando a URL da imagem
	    var post = new Post(createPostDto.titlePost(), createPostDto.bodyPost(), fileUrl);
	    post.setUser(user);

	    var postSaved = postRepository.save(post);

	    return new ShowPostDto(
	            postSaved.getId(),
	            postSaved.getTitlePost(),
	            postSaved.getBodyPost(),
	            postSaved.getImagePost(), // aqui é a URL "/uploads/NOME_DO_ARQUIVO"
	            postSaved.getCreatedAt(),
	            postSaved.getUpdatedAt()
	    );
	}
	
	public List<ShowPostDto> getAllPosts(HttpServletRequest request) {
		long userId = (Long) request.getAttribute("userId");
		
		userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found"));
		
		var posts = postRepository.findAllByOrderByCreatedAtDesc();
		
		if(posts.isEmpty()) {
			throw new EmptyDatasException("No posts found");
		}		
		
		List<ShowPostDto> result = posts.stream().map(post -> new ShowPostDto(post.getId(), post.getTitlePost(), post.getBodyPost(), 
				post.getImagePost(), post.getCreatedAt(), post.getUpdatedAt())).collect(Collectors.toList());
		return result;
	}
	
	public List<ShowPostDto> getPostsUser(HttpServletRequest request) {
		long userId = (Long) request.getAttribute("userId");
		
		userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found"));
		
		var posts = postRepository.findPostByUserId(userId);
		
		if(posts.isEmpty()) {
			throw new EmptyDatasException("No posts found");
		}
		
		List<ShowPostDto> result = posts.stream().map(post -> new ShowPostDto(post.getId(), post.getTitlePost(), post.getBodyPost(), 
				post.getImagePost(), post.getCreatedAt(), post.getUpdatedAt())).collect(Collectors.toList());
		return result;
	}
	
	public ShowPostDto getPostById(Long id, HttpServletRequest request) {
		long userId = (Long) request.getAttribute("userId");
		
		userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found"));
		
		var post = postRepository.findById(id)
		        .orElseThrow(() -> new EmptyDatasException("No post found with id " + id));
	    
	    // Mapeia o Post para ShowPostDto
	    return new ShowPostDto(
	            post.getId(),
	            post.getTitlePost(),
	            post.getBodyPost(),
	            post.getImagePost(),
	            post.getCreatedAt(),
	            post.getUpdatedAt()
	    );
	}
	
	public void deleteAllPosts(HttpServletRequest request) {
	    long userId = (Long) request.getAttribute("userId");

	    User user = userRepository.findById(userId)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    List<Post> postsToDelete;

	    if (user.getRole() == EnumRole.ADMIN) {
	        postsToDelete = postRepository.findAll();
	    } else {
	        postsToDelete = postRepository.findAll().stream().filter(post -> post.getUser().getId().equals(userId)).collect(Collectors.toList());
	    }

	    if (postsToDelete.isEmpty()) {
	        throw new EmptyDatasException("No posts found to delete");
	    }

	    FileUtils.deleteImages(
	        postsToDelete.stream().map(Post::getImagePost).filter(Objects::nonNull).collect(Collectors.toList())
	    );

	    postRepository.deleteAll(postsToDelete);
	}
	
	public void deletePostById(Long id, HttpServletRequest request) {
		long userId = (Long) request.getAttribute("userId");
		
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new RuntimeException("User not found"));
		
		Post post = postRepository.findById(id)
			        .orElseThrow(() -> new EmptyDatasException("No post found with id " + id));
		 
		if (!Objects.equals(post.getUser().getId(), userId) && user.getRole() != EnumRole.ADMIN) {
			 throw new PermissionDeniedException("You have no permission to delete this post");
		}

		if(post.getImagePost() != null) {
			FileUtils.deleteImages(List.of(post.getImagePost()));
		}
		
		postRepository.deleteById(id);
	}
	
	public ShowPostDto updatePostById(Long id, UpdatePostDto updateDto, HttpServletRequest request) {
	    long userId = (Long) request.getAttribute("userId");

	    User user = userRepository.findById(userId)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    Post post = postRepository.findById(id)
	            .orElseThrow(() -> new EmptyDatasException("No post found with id " + id));

	    if (!Objects.equals(post.getUser().getId(), userId) && user.getRole() != EnumRole.ADMIN) {
	        throw new PermissionDeniedException("You have no permission to update this post");
	    }

	    MultipartFile newImageFile = updateDto.imagePost();
	    String newFileName = null;
	    String newFileUrl = null;

	    // 🖼️ Se o usuário enviou uma nova imagem
	    if (newImageFile != null && !newImageFile.isEmpty()) {
	        // Deleta a imagem antiga, se existir
	        if (post.getImagePost() != null) {
	            FileUtils.deleteImages(List.of(post.getImagePost()));
	        }

	        // Gera novo nome e caminho
	        newFileName = System.currentTimeMillis() + "_" + newImageFile.getOriginalFilename();
	        Path uploadPath = Paths.get("uploads").toAbsolutePath();

	        try {
	            Files.createDirectories(uploadPath);
	            Path filePath = uploadPath.resolve(newFileName);
	            newImageFile.transferTo(filePath.toFile());
	            newFileUrl = "/uploads/" + newFileName;
	        } catch (IOException e) {
	            throw new RuntimeException("Erro ao salvar nova imagem", e);
	        }

	        post.setImagePost(newFileUrl);
	    }

	    // 📝 Atualiza título e corpo
	    if (updateDto.titlePost() != null)
	        post.setTitlePost(updateDto.titlePost());

	    if (updateDto.bodyPost() != null)
	        post.setBodyPost(updateDto.bodyPost());

	    // Atualiza a data
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
