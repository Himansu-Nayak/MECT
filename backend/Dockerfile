# syntax=docker/dockerfile:1
FROM eclipse-temurin:21-jre-alpine

RUN apk add --no-cache curl tzdata && \
    addgroup -g 1001 -S mect && \
    adduser -u 1001 -S mect -G mect && \
    mkdir -p /app /app/uploads/media /app/receipts && \
    chown -R mect:mect /app

WORKDIR /app

ARG JAR_FILE=target/mahavir-backend-0.1.0-SNAPSHOT.jar
COPY --chown=mect:mect ${JAR_FILE} /app/mahavir-backend.jar

USER mect

ENV JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseG1GC -XX:+ExitOnOutOfMemoryError -Djava.security.egd=file:/dev/./urandom"
ENV SERVER_PORT=8080

EXPOSE 8080

HEALTHCHECK --interval=20s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://127.0.0.1:8080/api/v1/actuator/health || exit 1

ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar /app/mahavir-backend.jar"]

