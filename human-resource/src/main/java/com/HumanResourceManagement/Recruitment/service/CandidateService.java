package com.HumanResourceManagement.Recruitment.service;

import com.HumanResourceManagement.Recruitment.Model.Candidate;
import com.HumanResourceManagement.Recruitment.dto.CandidateRequest;
import com.HumanResourceManagement.Recruitment.dto.CandidateResponse;
import com.HumanResourceManagement.Recruitment.repository.CandidateRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CandidateService {

    private final CandidateRepository candidateRepository;

    public CandidateResponse createCandidate(CandidateRequest requestDto) {
        Candidate candidate = requestDto.toEntity();
        Candidate savedCandidate = candidateRepository.save(candidate);
        return CandidateResponse.fromEntity(savedCandidate);
    }

    @Transactional(readOnly = true)
    public CandidateResponse getCandidateById(Long id) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Candidate not found with ID: " + id));
        return CandidateResponse.fromEntity(candidate);
    }

    @Transactional(readOnly = true)
    public List<CandidateResponse> getAllCandidates() {
        return candidateRepository.findAll().stream()
                .map(CandidateResponse::fromEntity)
                .collect(Collectors.toList());
    }

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

    public void deleteCandidate(Long id) {
        if (!candidateRepository.existsById(id)) {
            throw new EntityNotFoundException("Candidate not found with ID: " + id);
        }
        candidateRepository.deleteById(id);
    }
}