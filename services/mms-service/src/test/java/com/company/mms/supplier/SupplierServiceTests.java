package com.company.mms.supplier;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.company.mms.shared.ConflictException;
import com.company.mms.shared.ResourceNotFoundException;
import com.company.mms.supplier.dto.CreateSupplierRequest;
import com.company.mms.supplier.dto.UpdateSupplierRequest;

@ExtendWith(MockitoExtension.class)
class SupplierServiceTests {

    @Mock
    private SupplierRepository repository;

    private SupplierService service;

    @BeforeEach
    void setUp() {
        service = new SupplierService(repository);
    }

    @Test
    void createsActiveSupplierByDefault() {
        CreateSupplierRequest request = new CreateSupplierRequest(
                "SUP-001", "Abay Stationery", "Alem Tesfaye", "sales@abay.example",
                "+251911000000", "Addis Ababa", null);
        when(repository.existsById("SUP-001")).thenReturn(false);
        when(repository.findByEmailIgnoreCase("sales@abay.example")).thenReturn(Optional.empty());
        when(repository.saveAndFlush(any(Supplier.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var result = service.create(request);

        assertThat(result.id()).isEqualTo("SUP-001");
        assertThat(result.name()).isEqualTo("Abay Stationery");
        assertThat(result.status()).isEqualTo("ACTIVE");
    }

    @Test
    void rejectsDuplicateSupplierCode() {
        CreateSupplierRequest request = new CreateSupplierRequest(
                "SUP-001", "Abay Stationery", "Alem Tesfaye", null, null, null, "ACTIVE");
        when(repository.existsById("SUP-001")).thenReturn(true);

        assertThatThrownBy(() -> service.create(request))
                .isInstanceOf(ConflictException.class)
                .hasMessageContaining("already exists");
        verify(repository, never()).saveAndFlush(any());
    }

    @Test
    void updatesSupplierAndPreventsEmailCollision() {
        Supplier supplier = new Supplier("SUP-001", "Abay Stationery", "Alem Tesfaye",
                "sales@abay.example", null, null, "ACTIVE");
        when(repository.findById("SUP-001")).thenReturn(Optional.of(supplier));
        when(repository.findByEmailIgnoreCase("new@abay.example")).thenReturn(Optional.empty());
        when(repository.saveAndFlush(supplier)).thenReturn(supplier);

        var result = service.update("SUP-001", new UpdateSupplierRequest(
                "Abay Supplies", "Liya Bekele", "new@abay.example", null, null, "PROBATION"));

        assertThat(result.name()).isEqualTo("Abay Supplies");
        assertThat(result.email()).isEqualTo("new@abay.example");
        assertThat(result.status()).isEqualTo("PROBATION");
    }

    @Test
    void returnsNotFoundForUnknownSupplier() {
        when(repository.findById("SUP-404")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.findById("SUP-404"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Supplier not found: SUP-404");
    }

    @Test
    void deleteSoftDeactivatesSupplier() {
        Supplier supplier = new Supplier("SUP-001", "Abay Stationery", "Alem Tesfaye",
                null, null, null, "ACTIVE");
        when(repository.findById("SUP-001")).thenReturn(Optional.of(supplier));

        service.delete("SUP-001");

        assertThat(supplier.getStatus()).isEqualTo("INACTIVE");
        verify(repository).save(supplier);
    }
}
