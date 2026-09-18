package com.company.fms.budget;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "budgets")
public class Budget {

    @Id
    @Column(length = 50, nullable = false, updatable = false)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(name = "budget_period")
    private String budgetPeriod;

    @Column(length = 20)
    private String type;

    private String description;

    private String category;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(name = "total_budget_amount", nullable = false, precision = 20, scale = 2)
    private BigDecimal totalBudgetAmount;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    private String owner;

    @Column(name = "created_by", length = 100)
    private String createdBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @OneToMany(mappedBy = "budget", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id asc")
    private List<BudgetLine> lines = new ArrayList<>();

    protected Budget() {
    }

    public Budget(String id, String name, String budgetPeriod, String type, String description,
            String category, String status, BigDecimal totalBudgetAmount, LocalDate startDate,
            LocalDate endDate, String owner, String createdBy) {
        this.id = id;
        this.name = name;
        this.budgetPeriod = budgetPeriod;
        this.type = type;
        this.description = description;
        this.category = category;
        this.status = status;
        this.totalBudgetAmount = totalBudgetAmount;
        this.startDate = startDate;
        this.endDate = endDate;
        this.owner = owner;
        this.createdBy = createdBy;
    }

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

    public void addLine(BudgetLine line) {
        line.attachTo(this);
        lines.add(line);
    }

    public BigDecimal totalSpent() {
        return lines.stream().map(BudgetLine::totalSpent)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public BigDecimal totalRemaining() {
        return totalBudgetAmount.subtract(totalSpent());
    }

    public BigDecimal progressPercentage() {
        if (totalBudgetAmount.signum() == 0) {
            return BigDecimal.ZERO;
        }
        return totalSpent().divide(totalBudgetAmount, 2, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100));
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getBudgetPeriod() { return budgetPeriod; }
    public String getType() { return type; }
    public String getDescription() { return description; }
    public String getCategory() { return category; }
    public String getStatus() { return status; }
    public BigDecimal getTotalBudgetAmount() { return totalBudgetAmount; }
    public LocalDate getStartDate() { return startDate; }
    public LocalDate getEndDate() { return endDate; }
    public String getOwner() { return owner; }
    public String getCreatedBy() { return createdBy; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public List<BudgetLine> getLines() { return lines; }
    public void setStatus(String status) { this.status = status; }

    public void submit() {
        this.status = "SUBMITTED";
    }

    public void approve() {
        this.status = "APPROVED";
    }
}
