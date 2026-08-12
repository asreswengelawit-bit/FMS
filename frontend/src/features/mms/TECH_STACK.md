# Material Management System (MMS) - Technology Stack Documentation

## Executive Summary

The MMS platform is built on a modern, scalable technology stack designed to handle enterprise-grade material management operations. This document provides comprehensive guidance on technology selections, configurations, and best practices.

---

## Table of Contents

1. [Frontend Technology Stack](#frontend-technology-stack)
2. [Backend Technology Stack](#backend-technology-stack)
3. [Database & Caching](#database--caching)
4. [Message Broker](#message-broker)
5. [DevOps & Infrastructure](#devops--infrastructure)
6. [Monitoring & Observability](#monitoring--observability)
7. [Security](#security)
8. [Development Tools](#development-tools)

---

## Frontend Technology Stack

### React 18+

**Purpose**: Modern UI framework for building interactive web applications

**Key Features**:
- Functional components with hooks
- Concurrent rendering
- Suspense for data fetching
- Automatic batching
- Strict mode for development

**Installation**:
```bash
npx create-react-app mms-frontend --template typescript
# or with Vite (recommended for faster builds)
npm create vite@latest mms-frontend -- --template react-ts
```

**Project Structure**:
```
mms-frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   ├── material/
│   │   ├── inventory/
│   │   ├── warehouse/
│   │   └── dashboard/
│   ├── hooks/
│   │   ├── useApi.ts
│   │   ├── useAuth.ts
│   │   └── useNotification.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── websocket.ts
│   ├── store/
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── materialSlice.ts
│   │   │   └── inventorySlice.ts
│   │   └── index.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   └── constants.ts
│   ├── styles/
│   │   └── globals.css
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Materials.tsx
│   │   ├── Inventory.tsx
│   │   ├── Warehouse.tsx
│   │   └── Orders.tsx
│   └── App.tsx
├── public/
├── package.json
├── tsconfig.json
└── tailwind.config.js
```

### TypeScript 5+

**Purpose**: Static typing for JavaScript

**Benefits**:
- Type safety
- Better IDE support
- Reduced runtime errors
- Self-documenting code

**Configuration** (`tsconfig.json`):
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"],
      "@components/*": ["./components/*"],
      "@hooks/*": ["./hooks/*"],
      "@services/*": ["./services/*"]
    }
  }
}
```

### State Management

#### Redux Toolkit
```bash
npm install @reduxjs/toolkit react-redux
```

**Example Slice** (`materialSlice.ts`):
```typescript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchMaterials = createAsyncThunk(
  'materials/fetchMaterials',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/materials');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const materialSlice = createSlice({
  name: 'materials',
  initialState: {
    items: [],
    loading: false,
    error: null
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMaterials.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMaterials.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchMaterials.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  }
});

export default materialSlice.reducer;
```

### Warehouse Layout UI

**Purpose**: Practical warehouse screens for layout, zones, and inventory status

**Approach**:
- Use standard React components for cards, tables, and floor-plan style views
- Keep layout rendering 2D and data-driven for easier implementation and testing
- Reserve advanced visualizations for a later iteration if needed
```

### UI Libraries

#### Tailwind CSS
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Configuration** (`tailwind.config.js`):
```javascript
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        danger: '#EF4444'
      }
    },
  },
  plugins: [],
}
```

#### Material-UI (Optional)
```bash
npm install @mui/material @emotion/react @emotion/styled
```

### HTTP Client - Axios

**Installation**:
```bash
npm install axios
```

**API Configuration** (`services/api.ts`):
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh
      // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Data Visualization

#### Chart.js
```bash
npm install chart.js react-chartjs-2
```

#### D3.js (for advanced visualizations)
```bash
npm install d3
npm install --save-dev @types/d3
```

---

## Backend Technology Stack

### Java 17+

**Installation**: Download from oracle.com or use SDKMAN
```bash
sdk install java 17.0.0-oracle
java -version
```

**Key Features**:
- Records for immutable data
- Pattern matching (preview)
- Text blocks
- Sealed classes

### Spring Boot 3.x

**Project Setup** (Using Spring Initializr):
```
https://start.spring.io/
- Project: Maven
- Language: Java
- Spring Boot: 3.x.x
- Group: com.mms
- Artifact: mms-api-gateway
- Dependencies:
  - Spring Cloud Gateway
  - Lombok
  - Spring Security
  - Spring Data JPA
```

**POM.xml Structure**:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
  <modelVersion>4.0.0</modelVersion>
  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.1.0</version>
  </parent>

  <groupId>com.mms</groupId>
  <artifactId>mms-backend</artifactId>
  <version>1.0.0</version>
  <packaging>pom</packaging>

  <modules>
    <module>api-gateway</module>
    <module>material-service</module>
    <module>inventory-service</module>
    <!-- ... other services ... -->
  </modules>

  <properties>
    <java.version>17</java.version>
    <spring-cloud.version>2022.0.0</spring-cloud.version>
  </properties>

  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-dependencies</artifactId>
        <version>${spring-cloud.version}</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
    </dependencies>
  </dependencyManagement>

  <dependencies>
    <!-- Core dependencies included below -->
  </dependencies>

  <build>
    <plugins>
      <plugin>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-maven-plugin</artifactId>
      </plugin>
    </plugins>
  </build>
</project>
```

### Spring Data JPA

**Entity Example**:
```java
@Entity
@Table(name = "materials")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Material {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, unique = true)
    private String sku;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private UnitOfMeasure uom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @Column(precision = 10, scale = 2)
    private BigDecimal unitCost;

    @Column(nullable = false)
    private Integer safetyStock;

    @Column(nullable = false)
    private Integer leadTimeDays;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Version
    private Long version;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

### Hibernate Configuration

**application.yml**:
```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQL14Dialect
        format_sql: true
        jdbc:
          batch_size: 20
        order_inserts: true
        order_updates: true
  datasource:
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
```

### Spring Security

**Security Configuration**:
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/api/v1/health").permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            UserDetailsService userDetailsService,
            PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);

        return new ProviderManager(authProvider);
    }
}
```

### Lombok

**Dependencies**:
```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <scope>provided</scope>
</dependency>
```

**Common Annotations**:
```java
@Data              // @Getter, @Setter, @ToString, @EqualsAndHashCode, @RequiredArgsConstructor
@NoArgsConstructor // Zero-arg constructor
@AllArgsConstructor // All-args constructor
@Builder          // Builder pattern
@Slf4j            // Logger injection
```

### REST Controller Example

```java
@RestController
@RequestMapping("/api/v1/materials")
@RequiredArgsConstructor
@Slf4j
public class MaterialController {

    private final MaterialService materialService;
    private final MaterialMapper materialMapper;

    @GetMapping
    public ResponseEntity<PageResponse<MaterialDTO>> listMaterials(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search) {
        
        Page<Material> materials = materialService.findAll(
            PageRequest.of(page, size),
            search
        );
        
        return ResponseEntity.ok(
            PageResponse.of(materials, materialMapper::toDTO)
        );
    }

    @PostMapping
    public ResponseEntity<MaterialDTO> createMaterial(
            @Valid @RequestBody CreateMaterialRequest request) {
        
        Material material = materialService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(materialMapper.toDTO(material));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaterialDTO> getMaterial(@PathVariable String id) {
        Material material = materialService.findById(id);
        return ResponseEntity.ok(materialMapper.toDTO(material));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MaterialDTO> updateMaterial(
            @PathVariable String id,
            @Valid @RequestBody UpdateMaterialRequest request) {
        
        Material material = materialService.update(id, request);
        return ResponseEntity.ok(materialMapper.toDTO(material));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaterial(@PathVariable String id) {
        materialService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
```

### Service Layer Pattern

```java
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class MaterialService {

    private final MaterialRepository materialRepository;
    private final MaterialEventPublisher eventPublisher;
    private final MaterialCache materialCache;

    public Material create(CreateMaterialRequest request) {
        if (materialRepository.existsBySku(request.getSku())) {
            throw new DuplicateResourceException("SKU already exists");
        }

        Material material = Material.builder()
            .sku(request.getSku())
            .name(request.getName())
            .description(request.getDescription())
            .uom(request.getUom())
            .unitCost(request.getUnitCost())
            .safetyStock(request.getSafetyStock())
            .leadTimeDays(request.getLeadTimeDays())
            .build();

        material = materialRepository.save(material);
        
        // Clear cache
        materialCache.evictAll();
        
        // Publish event
        eventPublisher.publishMaterialCreated(material);
        
        log.info("Material created: {}", material.getId());
        return material;
    }

    @Transactional(readOnly = true)
    public Page<Material> findAll(Pageable pageable, String search) {
        if (search != null && !search.isBlank()) {
            return materialRepository.search(search, pageable);
        }
        return materialRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Material findById(String id) {
        return materialCache.get(id, () ->
            materialRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Material not found"))
        );
    }

    public Material update(String id, UpdateMaterialRequest request) {
        Material material = findById(id);
        
        material.setName(request.getName());
        material.setDescription(request.getDescription());
        material.setUnitCost(request.getUnitCost());
        material.setSafetyStock(request.getSafetyStock());
        material.setLeadTimeDays(request.getLeadTimeDays());

        material = materialRepository.save(material);
        
        materialCache.evict(id);
        eventPublisher.publishMaterialUpdated(material);
        
        log.info("Material updated: {}", id);
        return material;
    }

    public void delete(String id) {
        Material material = findById(id);
        materialRepository.delete(material);
        
        materialCache.evict(id);
        eventPublisher.publishMaterialDeleted(material);
        
        log.info("Material deleted: {}", id);
    }
}
```

---

## Database & Caching

### PostgreSQL 14+

**Installation**:
```bash
# Using Docker
docker run --name mms-postgres \
  -e POSTGRES_DB=mms \
  -e POSTGRES_USER=mms_user \
  -e POSTGRES_PASSWORD=secure_password \
  -p 5432:5432 \
  postgres:14

# Or native installation
brew install postgresql@14  # macOS
apt-get install postgresql-14  # Ubuntu
```

**Connection Configuration** (`application.yml`):
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/mms
    username: mms_user
    password: ${DB_PASSWORD}
    driver-class-name: org.postgresql.Driver
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
      idle-timeout: 600000
      max-lifetime: 1800000
```

**Database Initialization** (Flyway):
```bash
# Add dependency
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
```

**Migration Files** (`src/main/resources/db/migration`):
```sql
-- V1__initial_schema.sql
CREATE TABLE materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sku VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    unit_of_measure VARCHAR(20) NOT NULL,
    supplier_id UUID REFERENCES suppliers(id),
    unit_cost DECIMAL(10, 2),
    safety_stock INTEGER,
    lead_time_days INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    version BIGINT DEFAULT 0,
    CHECK (unit_cost >= 0),
    CHECK (safety_stock >= 0),
    CHECK (lead_time_days >= 0)
);

CREATE INDEX idx_materials_sku ON materials(sku);
CREATE INDEX idx_materials_supplier_id ON materials(supplier_id);
CREATE INDEX idx_materials_created_at ON materials(created_at);
```

### Redis 6+

**Installation**:
```bash
# Using Docker
docker run --name mms-redis \
  -p 6379:6379 \
  redis:7 redis-server \
  --appendonly yes

# Or native installation
brew install redis  # macOS
apt-get install redis-server  # Ubuntu
```

**Spring Boot Redis Configuration**:
```java
@Configuration
@EnableCaching
public class RedisConfig {

    @Bean
    public LettuceConnectionFactory connectionFactory() {
        return new LettuceConnectionFactory();
    }

    @Bean
    public RedisTemplate<String, Object> redisTemplate(
            LettuceConnectionFactory connectionFactory) {
        
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);

        Jackson2JsonRedisSerializer<Object> jackson2JsonRedisSerializer = 
            new Jackson2JsonRedisSerializer<>(Object.class);
        ObjectMapper om = new ObjectMapper();
        om.activateDefaultTyping(
            LaissezFaireSubTypeValidator.instance,
            ObjectMapper.DefaultTyping.NON_FINAL
        );
        jackson2JsonRedisSerializer.setObjectMapper(om);

        StringRedisSerializer stringRedisSerializer = new StringRedisSerializer();

        template.setKeySerializer(stringRedisSerializer);
        template.setValueSerializer(jackson2JsonRedisSerializer);
        template.setHashKeySerializer(stringRedisSerializer);
        template.setHashValueSerializer(jackson2JsonRedisSerializer);

        template.afterPropertiesSet();
        return template;
    }

    @Bean
    public CacheManager cacheManager(LettuceConnectionFactory connectionFactory) {
        RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofHours(1))
            .serializeKeysWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new StringRedisSerializer()))
            .serializeValuesWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new GenericJackson2JsonRedisSerializer()));

        return RedisCacheManager.create(connectionFactory);
    }
}
```

**Usage**:
```java
@Service
public class MaterialCacheService {

    private final RedisTemplate<String, Material> redisTemplate;

    public void cache(Material material) {
        redisTemplate.opsForValue()
            .set("material:" + material.getId(), material, Duration.ofHours(1));
    }

    public Material get(String id) {
        return redisTemplate.opsForValue().get("material:" + id);
    }

    public void evict(String id) {
        redisTemplate.delete("material:" + id);
    }
}
```

---

## Message Broker

### RabbitMQ

**Installation**:
```bash
# Using Docker
docker run --name mms-rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  -e RABBITMQ_DEFAULT_USER=guest \
  -e RABBITMQ_DEFAULT_PASS=guest \
  rabbitmq:3.12-management
```

**Spring Cloud Stream Configuration**:
```yaml
spring:
  cloud:
    stream:
      default-binder: rabbit
      bindings:
        materialEvents-out-0:
          destination: material-events
          content-type: application/json
        inventoryEvents-in-0:
          destination: inventory-events
          content-type: application/json
          group: inventory-service
      rabbit:
        bindings:
          materialEvents-out-0:
            producer:
              routing-key-expression: headers['event-type']
          inventoryEvents-in-0:
            consumer:
              acknowledge-mode: AUTO
              concurrency: 5
  rabbitmq:
    host: localhost
    port: 5672
    username: guest
    password: guest
```

**Event Publisher**:
```java
@Component
@RequiredArgsConstructor
public class MaterialEventPublisher {

    private final StreamBridge streamBridge;

    public void publishMaterialCreated(Material material) {
        MaterialCreatedEvent event = new MaterialCreatedEvent(
            material.getId(),
            material.getSku(),
            material.getName(),
            LocalDateTime.now()
        );

        streamBridge.send(
            "materialEvents-out-0",
            MessageBuilder.withPayload(event)
                .setHeader("event-type", "material.created")
                .build()
        );
    }
}
```

**Event Listener**:
```java
@Component
@RequiredArgsConstructor
public class InventoryEventListener {

    private final InventoryService inventoryService;

    @Bean
    public Consumer<MaterialCreatedEvent> handleMaterialCreated() {
        return event -> {
            // Handle material creation
            inventoryService.createInventoryEntry(event.getMaterialId());
        };
    }
}
```

---

## DevOps & Infrastructure

### Docker

**Dockerfile for Spring Boot Service**:
```dockerfile
# Multi-stage build
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /build
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /build/target/material-service-*.jar app.jar

EXPOSE 8001
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**Docker Compose**:
```yaml
version: '3.8'

services:
  # Database
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: mms
      POSTGRES_USER: mms_user
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # Cache
  redis:
    image: redis:7
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data

  # Message Broker
  rabbitmq:
    image: rabbitmq:3.12-management
    environment:
      RABBITMQ_DEFAULT_USER: guest
      RABBITMQ_DEFAULT_PASS: guest
    ports:
      - "5672:5672"
      - "15672:15672"
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq

  # Services
  api-gateway:
    build:
      context: ./api-gateway
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
    environment:
      SPRING_PROFILES_ACTIVE: dev
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/mms
      SPRING_RABBITMQ_HOST: rabbitmq
      REDIS_HOST: redis
    depends_on:
      - postgres
      - redis
      - rabbitmq

  material-service:
    build:
      context: ./material-service
      dockerfile: Dockerfile
    ports:
      - "8001:8001"
    environment:
      SPRING_PROFILES_ACTIVE: dev
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/mms
      SPRING_RABBITMQ_HOST: rabbitmq
      REDIS_HOST: redis
    depends_on:
      - postgres
      - redis
      - rabbitmq

  # Monitoring
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      GF_SECURITY_ADMIN_PASSWORD: admin
    depends_on:
      - prometheus

volumes:
  postgres_data:
  redis_data:
  rabbitmq_data:
```

### Kubernetes

**Deployment Example** (`material-service-deployment.yaml`):
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: material-service
  namespace: mms-prod
  labels:
    app: material-service
    version: v1
spec:
  replicas: 3
  selector:
    matchLabels:
      app: material-service
  template:
    metadata:
      labels:
        app: material-service
        version: v1
    spec:
      containers:
      - name: material-service
        image: registry.example.com/mms/material-service:1.0.0
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 8001
          name: http
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "prod"
        - name: SPRING_DATASOURCE_URL
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: database-url
        - name: SPRING_DATASOURCE_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: password
        - name: SPRING_RABBITMQ_HOST
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: rabbitmq-host
        - name: REDIS_HOST
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: redis-host
        livenessProbe:
          httpGet:
            path: /actuator/health/liveness
            port: 8001
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /actuator/health/readiness
            port: 8001
          initialDelaySeconds: 20
          periodSeconds: 5
        resources:
          requests:
            cpu: "500m"
            memory: "512Mi"
          limits:
            cpu: "1000m"
            memory: "1024Mi"
---
apiVersion: v1
kind: Service
metadata:
  name: material-service
  namespace: mms-prod
spec:
  selector:
    app: material-service
  type: ClusterIP
  ports:
  - port: 80
    targetPort: 8001
    protocol: TCP
    name: http
```

---

## Monitoring & Observability

### Spring Boot Actuator

**Configuration** (`application.yml`):
```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,metrics,prometheus,loggers,info
  endpoint:
    health:
      show-details: when-authorized
      probes:
        enabled: true
  metrics:
    export:
      prometheus:
        enabled: true
    distribution:
      percentiles-histogram:
        http.server.requests: true
      slo:
        http.server.requests: 50ms,100ms,200ms,500ms,1s
```

### Prometheus

**Configuration** (`prometheus.yml`):
```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'api-gateway'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['localhost:8080']

  - job_name: 'material-service'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['localhost:8001']

  - job_name: 'inventory-service'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['localhost:8002']
```

### Grafana Dashboards

Key metrics to monitor:
- HTTP request rate and latency
- JVM memory and garbage collection
- Database connection pool
- Cache hit rate
- Message queue depth
- Business metrics (inventory levels, orders processed)

---

## Security

### JWT Token Management

```java
@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
            .setSubject(userDetails.getUsername())
            .claim("roles", userDetails.getAuthorities())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration * 1000))
            .signWith(SignatureAlgorithm.HS512, jwtSecret)
            .compact();
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parser()
            .setSigningKey(jwtSecret)
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
            return true;
        } catch (SignatureException e) {
            log.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.error("Expired JWT token: {}", e.getMessage());
        }
        return false;
    }
}
```

---

## Development Tools

### Build Tools

**Maven** (Recommended):
```bash
# Build project
mvn clean package

# Run tests
mvn test

# Run integration tests
mvn verify

# Install locally
mvn clean install
```

### Testing Frameworks

**JUnit 5**:
```java
@SpringBootTest
class MaterialServiceTest {

    @Autowired
    private MaterialService materialService;

    @MockBean
    private MaterialRepository materialRepository;

    @Test
    void testCreateMaterial() {
        // Test implementation
    }
}
```

**Mockito**:
```java
@ExtendWith(MockitoExtension.class)
class MaterialRepositoryTest {

    @Mock
    private JdbcTemplate jdbcTemplate;

    @InjectMocks
    private MaterialRepository repository;

    @Test
    void shouldFindMaterialById() {
        // Test with mocks
    }
}
```

### IDE Configuration

**IntelliJ IDEA**:
- Install Spring Boot, Lombok plugins
- Enable annotation processing for Lombok
- Configure code inspections
- Set code style to Google Java Style

**VSCode**:
```json
{
  "java.home": "/path/to/jdk-17",
  "java.configuration.updateBuildConfiguration": "automatic",
  "java.format.enabled": true,
  "java.format.settings.url": "...google-java-style.xml"
}
```

---

**Document Version**: 1.0  
**Last Updated**: July 3, 2026  
**Status**: Complete
