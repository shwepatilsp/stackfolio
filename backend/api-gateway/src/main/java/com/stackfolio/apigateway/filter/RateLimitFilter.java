package com.stackfolio.apigateway.filter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

import java.time.Duration;

@Component
public class RateLimitFilter implements WebFilter {

    @Autowired
    private ReactiveRedisTemplate<String, String> redisTemplate;

    private static final String CONTACT_FORM_KEY_PREFIX = "contact-form:ip:";
    private static final int MAX_REQUESTS = 10;
    private static final Duration WINDOW = Duration.ofMinutes(1);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String path = exchange.getRequest().getPath().value();
        String clientIp = getClientIp(exchange);

        // Only rate limit contact form
        if (path.startsWith("/api/contact/message")) {
            String key = CONTACT_FORM_KEY_PREFIX + clientIp;

            return redisTemplate.opsForValue()
                .increment(key)
                .flatMap(count -> {
                    if (count == 1) {
                        // Set expiry for new keys
                        return redisTemplate.expire(key, WINDOW)
                            .then(Mono.just(count));
                    }
                    return Mono.just(count);
                })
                .flatMap(count -> {
                    if (count > MAX_REQUESTS) {
                        exchange.getResponse().setStatusCode(HttpStatus.TOO_MANY_REQUESTS);
                        exchange.getResponse().getHeaders().add("X-RateLimit-Limit", String.valueOf(MAX_REQUESTS));
                        exchange.getResponse().getHeaders().add("X-RateLimit-Remaining", "0");
                        exchange.getResponse().getHeaders().add("X-RateLimit-Reset",
                            String.valueOf(System.currentTimeMillis() / 1000 + WINDOW.getSeconds()));
                        return exchange.getResponse().setComplete();
                    } else {
                        exchange.getResponse().getHeaders().add("X-RateLimit-Limit", String.valueOf(MAX_REQUESTS));
                        exchange.getResponse().getHeaders().add("X-RateLimit-Remaining", String.valueOf(MAX_REQUESTS - count));
                        return chain.filter(exchange);
                    }
                });
        }

        return chain.filter(exchange);
    }

    private String getClientIp(ServerWebExchange exchange) {
        String xForwardedFor = exchange.getRequest().getHeaders().getFirst("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return exchange.getRequest().getRemoteAddress().getAddress().getHostAddress();
    }
}