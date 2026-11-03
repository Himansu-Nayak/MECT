package org.mahavirtrust.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private static final int MAX_REQUESTS_PER_MINUTE = 30;
    private final Map<String, RequestBucket> ipBuckets = new ConcurrentHashMap<>();

    private static class RequestBucket {
        long minuteTimestamp;
        AtomicInteger count;

        RequestBucket(long minuteTimestamp) {
            this.minuteTimestamp = minuteTimestamp;
            this.count = new AtomicInteger(1);
        }
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Rate limit only public submission endpoints to stop spam and flood attacks
        if (path.contains("/public/")) {
            String clientIp = getClientIp(request);
            long currentMinute = Instant.now().getEpochSecond() / 60;

            RequestBucket bucket = ipBuckets.compute(clientIp, (key, existing) -> {
                if (existing == null || existing.minuteTimestamp != currentMinute) {
                    return new RequestBucket(currentMinute);
                } else {
                    existing.count.incrementAndGet();
                    return existing;
                }
            });

            if (bucket.count.get() > MAX_REQUESTS_PER_MINUTE) {
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                response.getWriter().write("""
                        {
                            "status": 429,
                            "error": "Too Many Requests",
                            "message": "Submission rate limit exceeded. Please wait a minute before submitting again.",
                            "path": "%s",
                            "timestamp": "%s"
                        }
                        """.formatted(path, Instant.now()));
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    private String getClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader != null && !xfHeader.isBlank()) {
            return xfHeader.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
