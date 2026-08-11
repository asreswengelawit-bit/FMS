package com.crm.crm_backend.cache;

import com.crm.crm_backend.model.entity.PricingRule;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

@Component
public class PricingCache {

    private final AtomicReference<List<PricingRule>> activeRules =
            new AtomicReference<>(List.of());

    public List<PricingRule> getActiveRules() {
        return activeRules.get();
    }

    public void replaceActiveRules(List<PricingRule> rules) {
        activeRules.set(List.copyOf(rules != null ? rules : List.of()));
    }

    public void clear() {
        activeRules.set(List.of());
    }

    public List<PricingRule> snapshot() {
        return new ArrayList<>(activeRules.get());
    }
}
