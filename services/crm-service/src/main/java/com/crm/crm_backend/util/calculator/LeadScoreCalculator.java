package com.crm.crm_backend.util.calculator;


import com.crm.crm_backend.model.entity.Lead;
import org.springframework.stereotype.Component;

@Component
public class LeadScoreCalculator {

    public int calculate(Lead lead) {
        int score = 0;

        // Email domain scoring
        if (lead.getEmail() != null) {
            String domain = lead.getEmail().split("@")[1];
            if (domain.contains(".gov") || domain.contains(".edu")) {
                score += 20;
            } else if (domain.equals("gmail.com") || domain.equals("yahoo.com")) {
                score += 10;
            } else {
                score += 5;
            }
        }

        // Company scoring
        if (lead.getCompany() != null && !lead.getCompany().isEmpty()) {
            score += 15;
        }

        // Job title scoring
        if (lead.getJobTitle() != null) {
            String title = lead.getJobTitle().toLowerCase();
            if (title.contains("director") || title.contains("vp") ||
                    title.contains("president") || title.contains("ceo") ||
                    title.contains("cfo") || title.contains("cto")) {
                score += 20;
            } else if (title.contains("manager") || title.contains("head")) {
                score += 10;
            } else if (title.contains("senior") || title.contains("lead")) {
                score += 5;
            }
        }

        // Industry scoring
        if (lead.getIndustry() != null) {
            String industry = lead.getIndustry().toLowerCase();
            if (industry.contains("technology") || industry.contains("software") ||
                    industry.contains("telecom") || industry.contains("government")) {
                score += 10;
            }
        }

        // Phone number provided
        if (lead.getPhone() != null && !lead.getPhone().isEmpty()) {
            score += 5;
        }

        return Math.min(score, 100);
    }
}
