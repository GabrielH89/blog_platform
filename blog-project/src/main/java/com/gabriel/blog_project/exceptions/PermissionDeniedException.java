package com.gabriel.blog_project.exceptions;

public class PermissionDeniedException extends RuntimeException {
	public PermissionDeniedException(String message) {
		super(message);
	}
}
