package com.gabriel.blog_project.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

import com.gabriel.blog_project.entities.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	UserDetails findByLogin(String login);
}
