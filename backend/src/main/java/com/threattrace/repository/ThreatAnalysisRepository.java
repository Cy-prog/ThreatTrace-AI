package com.threattrace.repository;

import com.threattrace.entity.ThreatAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ThreatAnalysisRepository extends JpaRepository<ThreatAnalysis, String> {
    Optional<ThreatAnalysis> findByThreatId(String threatId);
}
