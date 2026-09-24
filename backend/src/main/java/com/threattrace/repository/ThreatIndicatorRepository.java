package com.threattrace.repository;

import com.threattrace.entity.ThreatIndicator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ThreatIndicatorRepository extends JpaRepository<ThreatIndicator, String> {
    List<ThreatIndicator> findByAnalysisId(String analysisId);
}
