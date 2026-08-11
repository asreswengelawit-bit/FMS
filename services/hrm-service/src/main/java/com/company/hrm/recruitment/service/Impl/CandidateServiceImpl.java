package com.company.hrm.recruitment.service.Impl;

import com.company.hrm.recruitment.service.CandidateService;
import com.company.hrm.recruitment.dto.CandidateRequest;
import com.company.hrm.recruitment.dto.CandidateResponse;
import com.company.hrm.recruitment.entity.Candidate;
import com.company.hrm.recruitment.repository.CandidateRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CandidateServiceImpl implements CandidateService {

    private final CandidateRepository candidateRepository;

    @Override
    public CandidateResponse createCandidate(CandidateRequest requestDto) {
        Candidate candidate = requestDto.toEntity();
        Candidate savedCandidate = candidateRepository.save(candidate);
        return CandidateResponse.fromEntity(savedCandidate);
    }

    @Override
    @Transactional(readOnly = true)
    public CandidateResponse getCandidateById(Long id) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Candidate not found with ID: " + id));
        return CandidateResponse.fromEntity(candidate);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CandidateResponse> getAllCandidates() {
        return candidateRepository.findAll().stream()
                .map(CandidateResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public CandidateResponse updateCandidate(Long id, CandidateRequest requestDto) {
        Candidate existingCandidate = candidateRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Candidate not found with ID: " + id));

        existingCandidate.setFirstName(requestDto.getFirstName());
        existingCandidate.setLastName(requestDto.getLastName());
        existingCandidate.setEmail(requestDto.getEmail());
        existingCandidate.setPhone(requestDto.getPhone());
        existingCandidate.setResumeUrl(requestDto.getResumeUrl());
        existingCandidate.setCoverLetterUrl(requestDto.getCoverLetterUrl());
        existingCandidate.setLinkedInUrl(requestDto.getLinkedInUrl());
        existingCandidate.setSource(requestDto.getSource());
        existingCandidate.setStatus(requestDto.getStatus());

        Candidate updatedCandidate = candidateRepository.save(existingCandidate);
        return CandidateResponse.fromEntity(updatedCandidate);
    }

    @Override
    public void deleteCandidate(Long id) {
        if (!candidateRepository.existsById(id)) {
            throw new EntityNotFoundException("Candidate not found with ID: " + id);
        }
        candidateRepository.deleteById(id);
    }
}