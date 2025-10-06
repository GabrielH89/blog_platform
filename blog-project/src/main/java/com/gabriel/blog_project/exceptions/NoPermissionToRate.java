package com.gabriel.blog_project.exceptions;

public class NoPermissionToRate extends RuntimeException {
	public NoPermissionToRate(String message) {
		super(message);
	}
}
