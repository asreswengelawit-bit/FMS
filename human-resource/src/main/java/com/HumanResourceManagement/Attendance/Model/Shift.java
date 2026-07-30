package com.HumanResourceManagement.Attendance.Model;

import java.time.LocalTime;
import jakarta.persistence.*;
// package com.HumanResourceManagement.Attendance.entity;
import lombok.Data;

// import com.Human

@Data
@Entity
@Table(name = "shifts")

public class Shift {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "break_duration_minutes", nullable = false)
    private int breakDuration;

    @Column(name = "grace_period_minutes", nullable = false)
    private int gracePeriodMinutes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    public enum Status {
        ACTIVE, INACTIVE
    }
}