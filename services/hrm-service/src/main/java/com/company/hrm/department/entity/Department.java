package com.company.hrm.department.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import com.company.hrm.employee.entity.Employee;
import com.company.hrm.shared.audit.Auditable;

@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@Table(name = "department")
@NoArgsConstructor
@AllArgsConstructor
public class Department extends Auditable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "name", nullable = false, unique = true)
    private String name;
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id")
    private Employee manager;
    @Column(name = "description")
    private String description;
}
