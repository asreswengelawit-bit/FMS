package com.crm.crm_backend.service.core;

import com.crm.crm_backend.dto.request.TerritoryRequestDTO;
import com.crm.crm_backend.dto.response.TerritoryResponseDTO;
import com.crm.crm_backend.model.entity.Territory;
import com.crm.crm_backend.repository.TerritoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TerritoryService {

    private final TerritoryRepository territoryRepository;

    public TerritoryResponseDTO createTerritory(TerritoryRequestDTO dto) {
        if (territoryRepository.existsByCode(dto.getCode())) {
            throw new IllegalArgumentException("Territory code already exists: " + dto.getCode());
        }
        Territory territory = mapToEntity(dto, new Territory());
        return toResponse(territoryRepository.save(territory));
    }

    @Transactional(readOnly = true)
    public TerritoryResponseDTO getTerritory(Long id) {
        return toResponse(requireTerritory(id));
    }

    @Transactional(readOnly = true)
    public Page<TerritoryResponseDTO> getAllTerritories(Pageable pageable) {
        return territoryRepository.findAll(pageable).map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public List<TerritoryResponseDTO> getActiveTerritories() {
        return territoryRepository.findByActiveTrueOrderByNameAsc().stream()
                .map(this::toResponse)
                .toList();
    }

    public TerritoryResponseDTO updateTerritory(Long id, TerritoryRequestDTO dto) {
        Territory territory = requireTerritory(id);
        if (!territory.getCode().equals(dto.getCode()) && territoryRepository.existsByCode(dto.getCode())) {
            throw new IllegalArgumentException("Territory code already exists: " + dto.getCode());
        }
        mapToEntity(dto, territory);
        return toResponse(territoryRepository.save(territory));
    }

    public void deleteTerritory(Long id) {
        Territory territory = requireTerritory(id);
        territoryRepository.delete(territory);
        log.info("Territory {} deleted", id);
    }

    private Territory requireTerritory(Long id) {
        return territoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Territory not found: " + id));
    }

    private Territory mapToEntity(TerritoryRequestDTO dto, Territory territory) {
        territory.setCode(dto.getCode().trim());
        territory.setName(dto.getName().trim());
        territory.setRegion(dto.getRegion());
        territory.setDescription(dto.getDescription());
        territory.setManagerUsername(dto.getManagerUsername());
        territory.setActive(dto.getActive() != null ? dto.getActive() : true);
        return territory;
    }

    private TerritoryResponseDTO toResponse(Territory territory) {
        TerritoryResponseDTO dto = new TerritoryResponseDTO();
        dto.setId(territory.getId());
        dto.setCode(territory.getCode());
        dto.setName(territory.getName());
        dto.setRegion(territory.getRegion());
        dto.setDescription(territory.getDescription());
        dto.setManagerUsername(territory.getManagerUsername());
        dto.setActive(territory.getActive());
        dto.setCreatedAt(territory.getCreatedAt());
        dto.setUpdatedAt(territory.getUpdatedAt());
        return dto;
    }
}
