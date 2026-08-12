package com.crm.crm_backend.util.export;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class CsvGenerator {

    public String toCsv(List<String> headers, List<List<String>> rows) {
        StringBuilder sb = new StringBuilder();
        sb.append(headers.stream().map(this::escape).collect(Collectors.joining(",")));
        sb.append('\n');
        for (List<String> row : rows) {
            sb.append(row.stream().map(this::escape).collect(Collectors.joining(",")));
            sb.append('\n');
        }
        return sb.toString();
    }

    private String escape(String value) {
        if (value == null) {
            return "";
        }
        String v = value.replace("\"", "\"\"");
        if (v.contains(",") || v.contains("\"") || v.contains("\n") || v.contains("\r")) {
            return "\"" + v + "\"";
        }
        return v;
    }
}
