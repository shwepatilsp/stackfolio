# Build stage
FROM maven:3.8-openjdk-17-slim AS builder
WORKDIR /build

# Copy parent pom and service pom
COPY pom.xml ./pom.xml
COPY api-gateway/pom.xml ./api-gateway/pom.xml
COPY api-gateway/src ./api-gateway/src

# Build the service with minimal memory usage
RUN mvn -f ./api-gateway/pom.xml clean package -DskipTests -o -q

# Runtime stage - use JRE slim image
FROM openjdk:17-jre-slim-bullseye
WORKDIR /app

# Install only necessary runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy JAR from builder
COPY --from=builder /build/api-gateway/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=60s --timeout=5s --start-period=30s --retries=2 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# Run application with ultra-optimized memory settings
ENTRYPOINT ["sh", "-c", "java ${JAVA_OPTS:-'-Xms16m -Xmx64m -XX:+UseG1GC -XX:+UseStringDeduplication -XX:MaxGCPauseMillis=200 -XX:+UseCompressedOops -XX:+UseCompressedClassPointers'} -jar app.jar"]
