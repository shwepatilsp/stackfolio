# Build stage
FROM maven:3.8-openjdk-17-slim AS builder
WORKDIR /build

COPY pom.xml ./pom.xml
COPY interaction-service/pom.xml ./interaction-service/pom.xml
COPY interaction-service/src ./interaction-service/src

# Build with minimal memory usage
RUN mvn -f ./interaction-service/pom.xml clean package -DskipTests -o -q

# Runtime stage - use JRE slim image
FROM openjdk:17-jre-slim-bullseye
WORKDIR /app

# Install only necessary runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /build/interaction-service/target/*.jar app.jar

EXPOSE 8083

HEALTHCHECK --interval=60s --timeout=5s --start-period=30s --retries=2 \
    CMD curl -f http://localhost:8083/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "java ${JAVA_OPTS:-'-Xms32m -Xmx96m -XX:+UseG1GC -XX:+UseStringDeduplication -XX:MaxGCPauseMillis=200'} -jar app.jar"]
