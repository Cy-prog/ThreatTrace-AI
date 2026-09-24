package com.threattrace.repository;

import com.threattrace.entity.Threat;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ThreatRepository extends JpaRepository<Threat, String> {

    Optional<Threat> findByThreatReference(String threatReference);

    @Query("SELECT t FROM Threat t LEFT JOIN t.analysis a WHERE " +
           "(:query IS NULL OR LOWER(t.rawContent) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(t.threatReference) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:sourceType IS NULL OR t.sourceType = :sourceType) AND " +
           "(:status IS NULL OR t.status = :status) AND " +
           "(:severity IS NULL OR (a IS NOT NULL AND a.severity = :severity)) AND " +
           "(:category IS NULL OR (a IS NOT NULL AND a.predictedCategory = :category)) AND " +
           "(:minRisk IS NULL OR (a IS NOT NULL AND a.riskScore >= :minRisk)) AND " +
           "(:maxRisk IS NULL OR (a IS NOT NULL AND a.riskScore <= :maxRisk))")
    Page<Threat> findWithFilters(
            @Param("query") String query,
            @Param("sourceType") String sourceType,
            @Param("status") String status,
            @Param("severity") String severity,
            @Param("category") String category,
            @Param("minRisk") Integer minRisk,
            @Param("maxRisk") Integer maxRisk,
            Pageable pageable
    );

    @Query("SELECT COUNT(t) FROM Threat t")
    long countTotalThreats();

    @Query("SELECT COUNT(t) FROM Threat t JOIN t.analysis a WHERE a.severity IN ('HIGH', 'CRITICAL')")
    long countHighRiskThreats();

    @Query("SELECT COUNT(t) FROM Threat t JOIN t.analysis a WHERE a.humanReviewRequired = true AND t.status IN ('PENDING', 'ANALYZED')")
    long countRequiringReview();

    @Query("SELECT COALESCE(AVG(a.riskScore), 0.0) FROM ThreatAnalysis a")
    double calculateAverageRiskScore();

    @Query("SELECT t FROM Threat t ORDER BY t.createdAt DESC")
    List<Threat> findRecentThreats(Pageable pageable);

    @Query("SELECT t FROM Threat t WHERE t.geoVerified = true AND t.latitude IS NOT NULL AND t.longitude IS NOT NULL")
    List<Threat> findGeoVerifiedThreats();
}
