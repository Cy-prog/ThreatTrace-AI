package com.threattrace.repository;

import com.threattrace.entity.Alert;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AlertRepository extends JpaRepository<Alert, String> {
    Optional<Alert> findByAlertReference(String alertReference);
    List<Alert> findByThreatId(String threatId);

    @Query("SELECT a FROM Alert a WHERE " +
           "(:status IS NULL OR a.status = :status) AND " +
           "(:severity IS NULL OR a.severity = :severity)")
    Page<Alert> findWithFilters(@Param("status") String status, @Param("severity") String severity, Pageable pageable);

    @Query("SELECT COUNT(a) FROM Alert a WHERE a.status = 'OPEN'")
    long countOpenAlerts();

    @Query("SELECT a FROM Alert a ORDER BY a.createdAt DESC")
    List<Alert> findRecentAlerts(Pageable pageable);
}
