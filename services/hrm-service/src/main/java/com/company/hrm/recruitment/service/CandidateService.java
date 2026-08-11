package com.company.hrm.recruitment.service;

import com.company.hrm.recruitment.dto.CandidateRequest;
import com.company.hrm.recruitment.dto.CandidateResponse;

import java.util.List;

public interface CandidateService {

    CandidateResponse createCandidate(CandidateRequest requestDto);

    CandidateResponse getCandidateById(Long id);

    List<CandidateResponse> getAllCandidates();

    CandidateResponse updateCandidate(Long id, CandidateRequest requestDto);

    void deleteCandidate(Long id);
}