package com.crm.crm_backend.util.export;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class CsvGeneratorTest {

    private final CsvGenerator csvGenerator = new CsvGenerator();

    @Test
    void toCsv_writesHeaderAndRows() {
        String csv = csvGenerator.toCsv(
                List.of("id", "name"),
                List.of(
                        List.of("1", "Alice"),
                        List.of("2", "Bob")
                ));

        assertThat(csv).isEqualTo("id,name\n1,Alice\n2,Bob\n");
    }

    @Test
    void toCsv_escapesCommasQuotesAndNewlines() {
        String csv = csvGenerator.toCsv(
                List.of("note"),
                List.of(List.of("hello, \"world\"\nnext")));

        assertThat(csv).isEqualTo("note\n\"hello, \"\"world\"\"\nnext\"\n");
    }

    @Test
    void toCsv_treatsNullAsEmpty() {
        java.util.ArrayList<String> row = new java.util.ArrayList<>();
        row.add(null);
        row.add("x");

        String csv = csvGenerator.toCsv(
                List.of("a", "b"),
                List.of(row));

        assertThat(csv).isEqualTo("a,b\n,x\n");
    }
}
