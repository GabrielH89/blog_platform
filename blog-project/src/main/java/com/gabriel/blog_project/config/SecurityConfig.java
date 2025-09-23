package com.gabriel.blog_project.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.gabriel.blog_project.security.SecurityFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
	
	@Autowired
	SecurityFilter securityFilter;
	
	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		  return http
		        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
		        .csrf(csrf -> csrf.disable()) // necessário para o H2 Console
		        .headers(headers -> headers.frameOptions(frame -> frame.disable())) // 👈 libera uso de frames
		        .authorizeHttpRequests(auth -> auth
		            .requestMatchers("/auth/register", "/auth/login", "/uploads/**").permitAll()
		            .requestMatchers("/h2-console/**").permitAll() // 👈 libera todo o console
		            .requestMatchers("/posts/**").authenticated()
		            .anyRequest().authenticated()
		        )
		        .sessionManagement(session -> session
		            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
		        )
		        .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
		        .build();
	}
	
	 @Bean
	    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfiguration) throws Exception {
	    	return authConfiguration.getAuthenticationManager();
	    }
	    
	    @Bean
	    public PasswordEncoder passwordEncoder() {
	    	return new BCryptPasswordEncoder();
	    }
	
	    @Bean
		public CorsConfigurationSource corsConfigurationSource() {
		    CorsConfiguration configuration = new CorsConfiguration();
		    configuration.setAllowedOrigins(List.of("http://localhost:5173")); 
		    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); // Métodos permitidos
		    configuration.setAllowedHeaders(List.of("Authorization", "Content-Type")); // Headers permitidos
		    configuration.setAllowCredentials(true);

		    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		    source.registerCorsConfiguration("/**", configuration);
		    return source;
		}

}
