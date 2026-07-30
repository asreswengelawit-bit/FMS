package com.HumanResourceManagement.Employee.Model;

// package com.HumanResourceManagement.Employee.entity;

// import com.HumanResourceManagement.shared.audit.Auditable;
import jakarta.persistence.*;
// import lombok.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

// import java.util.UUID;
@Data
@Entity
@Table(name = "employee_documents")

public class EmployeeDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Enumerated(EnumType.STRING)
    @Column(name = "document_type", nullable = false)
    private DocumentType documentType;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "file_url", nullable = false)
    private String fileUrl;

    @Column(name = "uploaded_at", nullable = false)
    private LocalDateTime uploadedAt;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(nullable = false)
    private boolean verified;

    public enum DocumentType {
        CV, ID, CERTIFICATE, CONTRACT, OTHER
    }
}