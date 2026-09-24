package com.threattrace.repository;

import com.threattrace.entity.ThreatEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ThreatEntityRepository extends JpaRepository<ThreatEntity, String> {
    List<ThreatEntity> findByAnalysisId(String analysisId);
    List<ThreatEntity> findByEntityType(String entityType);
}
