package com.gabriel.blog_project.utils;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import java.io.IOException;

public class FileUtils {
	private static final Path UPLOAD_DIR = Paths.get("uploads").toAbsolutePath();
	
	private static void deleteImage(String imagePath) {
		if(imagePath == null || imagePath.isEmpty()) return;
		
		try {
			 String fileName = Paths.get(imagePath).getFileName().toString();
			 Path fullPath = UPLOAD_DIR.resolve(fileName);
	         Files.deleteIfExists(fullPath);
	         System.out.println("Image deleted: " + fullPath);
		}catch(IOException e) {
			System.err.println("Error to delete image: " + e.getMessage());
		}
	}
	
	  // Deleta várias imagens de uma lista de caminhos
	public static void deleteImages(Iterable<String> imagePaths) {
        for (String imagePath : imagePaths) {
            deleteImage(imagePath);
        }
	}
}
