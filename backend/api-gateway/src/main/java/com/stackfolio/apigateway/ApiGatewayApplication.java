package com.stackfolio.apigateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ApiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
            .route("profile_service", r -> r
                .path("/api/profile/**")
                .uri("http://profile-service:8081"))
            .route("project_service", r -> r
                .path("/api/projects/**")
                .uri("http://project-service:8082"))
            .route("interaction_service", r -> r
                .path("/api/contact/**")
                .uri("http://interaction-service:8083"))
            .build();
    }
}