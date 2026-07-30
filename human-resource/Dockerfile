# ---- Build stage ----
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml first so dependencies are cached separately from source changes
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build the jar
COPY src ./src
RUN mvn clean package -DskipTests

# ---- Run stage ----
FROM eclipse-temurin:21-jre
WORKDIR /app


# Copy the built jar from the build stage
COPY --from=build /app/target/*.jar app.jar



EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]