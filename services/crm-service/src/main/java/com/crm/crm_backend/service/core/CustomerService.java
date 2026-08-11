package com.crm.crm_backend.service.core;

import com.crm.crm_backend.common.BaseService;
import com.crm.crm_backend.dto.request.CustomerCreateDTO;
import com.crm.crm_backend.dto.request.CustomerUpdateDTO;
import com.crm.crm_backend.dto.response.CustomerResponseDTO;
import com.crm.crm_backend.exception.CustomerNotFoundException;
import com.crm.crm_backend.exception.DuplicateEntityException;
import com.crm.crm_backend.mapper.CustomerMapper;
import com.crm.crm_backend.model.entity.Customer;
import com.crm.crm_backend.repository.CustomerRepository;
import com.crm.crm_backend.repository.TerritoryRepository;
import com.crm.crm_backend.spec.CustomerSpecification;
import com.crm.crm_backend.util.generator.CustomerNumberGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
@Slf4j
public class CustomerService extends BaseService<Customer, Long> {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;
    private final CustomerNumberGenerator customerNumberGenerator;
    private final com.crm.crm_backend.validator.CustomerValidator customerValidator;
    private final TerritoryRepository territoryRepository;

    @Override
    protected CustomerRepository getRepository() {
        return customerRepository;
    }

    @Transactional
    public CustomerResponseDTO createCustomer(CustomerCreateDTO dto) {
        log.info("Creating new customer with email: {}", dto.getEmail());

        customerValidator.validateCreate(dto);

        if (customerRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateEntityException("Customer with email " + dto.getEmail() + " already exists");
        }

        Customer customer = customerMapper.toEntity(dto);
        customer.setCustomerNumber(customerNumberGenerator.generate());
        applyTerritory(customer, dto.getTerritoryId());
        customerValidator.validateAmounts(customer);

        Customer saved = customerRepository.save(customer);
        log.info("Customer created with ID: {}", saved.getId());

        return customerMapper.toResponseDTO(saved);
    }

    @Transactional(readOnly = true)
    public CustomerResponseDTO getCustomerById(Long id) {
        Customer customer = customerRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found with ID: " + id));

        return customerMapper.toResponseDTO(customer);
    }

    @Transactional(readOnly = true)
    public Page<CustomerResponseDTO> getAllCustomers(Pageable pageable) {
        return searchCustomers(null, null, null, null, null, null, null, null, pageable);
    }

    @Transactional(readOnly = true)
    public Page<CustomerResponseDTO> searchCustomers(
            String q,
            com.crm.crm_backend.model.enums.CustomerStatus status,
            com.crm.crm_backend.model.enums.CustomerType customerType,
            Long territoryId,
            String city,
            String country,
            LocalDate createdFrom,
            LocalDate createdTo,
            Pageable pageable) {

        Specification<Customer> spec = CustomerSpecification.withFilters(
                q, status, customerType, territoryId, city, country, createdFrom, createdTo);
        return customerRepository.findAll(spec, pageable).map(customerMapper::toResponseDTO);
    }

    @Transactional
    public CustomerResponseDTO updateCustomer(Long id, CustomerUpdateDTO dto) {
        log.info("Updating customer with ID: {}", id);

        Customer customer = customerRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found with ID: " + id));

        customerValidator.validateUpdate(customer, dto);

        if (!customer.getEmail().equals(dto.getEmail()) &&
                customerRepository.existsByEmail(dto.getEmail())) {
            throw new DuplicateEntityException("Email " + dto.getEmail() + " already in use");
        }

        customerMapper.updateEntity(dto, customer);
        if (dto.getTerritoryId() != null) {
            applyTerritory(customer, dto.getTerritoryId());
        }
        customerValidator.validateAmounts(customer);

        Customer updated = customerRepository.save(customer);
        log.info("Customer updated with ID: {}", updated.getId());
        return customerMapper.toResponseDTO(updated);
    }

    @Transactional
    public void deleteCustomer(Long id) {
        log.info("Deleting customer with ID: {}", id);

        Customer customer = customerRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found with ID: " + id));

        customer.setDeleted(true);
        customerRepository.save(customer);

        log.info("Customer soft-deleted with ID: {}", id);
    }

    private void applyTerritory(Customer customer, Long territoryId) {
        if (territoryId == null) {
            return;
        }
        customer.setTerritory(territoryRepository.findById(territoryId)
                .orElseThrow(() -> new IllegalArgumentException("Territory not found: " + territoryId)));
    }
}
