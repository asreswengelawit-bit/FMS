package com.crm.crm_backend.service.core;

import com.crm.crm_backend.dto.request.SegmentCreateDTO;
import com.crm.crm_backend.dto.request.SegmentUpdateDTO;
import com.crm.crm_backend.dto.response.SegmentMemberResponseDTO;
import com.crm.crm_backend.dto.response.SegmentResponseDTO;
import com.crm.crm_backend.exception.CustomerNotFoundException;
import com.crm.crm_backend.mapper.SegmentMapper;
import com.crm.crm_backend.model.entity.Customer;
import com.crm.crm_backend.model.entity.CustomerSegment;
import com.crm.crm_backend.model.entity.SegmentMember;
import com.crm.crm_backend.repository.CustomerRepository;
import com.crm.crm_backend.repository.CustomerSegmentRepository;
import com.crm.crm_backend.repository.SegmentMemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class SegmentService {

    private final CustomerSegmentRepository segmentRepository;
    private final SegmentMemberRepository segmentMemberRepository;
    private final CustomerRepository customerRepository;
    private final SegmentMapper segmentMapper;
    private final SegmentCriteriaEvaluator criteriaEvaluator;

    public SegmentResponseDTO createSegment(SegmentCreateDTO dto) {

        CustomerSegment segment = segmentMapper.toEntity(dto);

        segment.setSegmentNumber("SEG-" + System.currentTimeMillis());
        segment.setActive(true);

        CustomerSegment saved = segmentRepository.save(segment);

        return segmentMapper.toResponseDTO(saved);
    }

    @Transactional(readOnly = true)
    public SegmentResponseDTO getSegment(Long id) {

        return segmentMapper.toResponseDTO(requireSegment(id));
    }

    @Transactional(readOnly = true)
    public Page<SegmentResponseDTO> getAllSegments(Pageable pageable) {

        return segmentRepository.findAll(pageable)
                .map(segmentMapper::toResponseDTO);
    }

    public SegmentResponseDTO updateSegment(Long id, SegmentUpdateDTO dto) {

        CustomerSegment segment = requireSegment(id);
        segmentMapper.updateEntityFromDTO(dto, segment);
        return segmentMapper.toResponseDTO(segmentRepository.save(segment));
    }

    public void deleteSegment(Long id) {

        CustomerSegment segment = requireSegment(id);
        segmentMemberRepository.deleteBySegmentId(id);
        segmentRepository.delete(segment);
        log.info("Segment {} deleted", id);
    }

    public SegmentMemberResponseDTO addMember(Long segmentId, Long customerId) {

        CustomerSegment segment = requireSegment(segmentId);
        Customer customer = requireCustomer(customerId);

        if (segmentMemberRepository.existsBySegmentIdAndCustomerId(segmentId, customerId)) {
            throw new IllegalStateException(
                    "Customer " + customerId + " is already a member of segment " + segmentId);
        }

        SegmentMember member = SegmentMember.builder()
                .segment(segment)
                .customer(customer)
                .build();

        return toMemberResponse(segmentMemberRepository.save(member));
    }

    public void removeMember(Long segmentId, Long customerId) {

        requireSegment(segmentId);
        SegmentMember member = segmentMemberRepository
                .findBySegmentIdAndCustomerId(segmentId, customerId)
                .orElseThrow(() -> new IllegalStateException(
                        "Customer " + customerId + " is not a member of segment " + segmentId));

        segmentMemberRepository.delete(member);
        log.info("Removed customer {} from segment {}", customerId, segmentId);
    }

    @Transactional(readOnly = true)
    public List<SegmentMemberResponseDTO> listMembers(Long segmentId) {

        requireSegment(segmentId);
        return segmentMemberRepository.findBySegmentId(segmentId).stream()
                .map(this::toMemberResponse)
                .toList();
    }

    /**
     * Re-evaluate criteria against all customers and replace segment membership.
     *
     * @return number of members after evaluation
     */
    public int evaluateAndPopulate(Long segmentId) {

        CustomerSegment segment = requireSegment(segmentId);
        if (Boolean.FALSE.equals(segment.getActive())) {
            throw new IllegalStateException("Cannot evaluate an inactive segment: " + segmentId);
        }

        segmentMemberRepository.deleteBySegmentId(segmentId);

        List<SegmentMember> matched = new ArrayList<>();
        for (Customer customer : customerRepository.findAll()) {
            if (criteriaEvaluator.matches(customer, segment)) {
                matched.add(SegmentMember.builder()
                        .segment(segment)
                        .customer(customer)
                        .build());
            }
        }

        if (!matched.isEmpty()) {
            segmentMemberRepository.saveAll(matched);
        }

        log.info("Segment {} evaluated — {} members", segmentId, matched.size());
        return matched.size();
    }

    private CustomerSegment requireSegment(Long id) {
        return segmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Segment not found: " + id));
    }

    private Customer requireCustomer(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found: " + id));
    }

    private SegmentMemberResponseDTO toMemberResponse(SegmentMember member) {
        SegmentMemberResponseDTO dto = new SegmentMemberResponseDTO();
        dto.setId(member.getId());
        dto.setSegmentId(member.getSegment() != null ? member.getSegment().getId() : null);
        Customer customer = member.getCustomer();
        if (customer != null) {
            dto.setCustomerId(customer.getId());
            dto.setCustomerNumber(customer.getCustomerNumber());
            dto.setCustomerName(customer.getCompanyName() != null
                    ? customer.getCompanyName()
                    : customer.getContactName());
            dto.setEmail(customer.getEmail());
        }
        dto.setJoinedAt(member.getJoinedAt());
        return dto;
    }
}
