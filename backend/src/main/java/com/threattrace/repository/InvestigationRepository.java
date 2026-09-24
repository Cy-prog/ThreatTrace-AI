package com.threattrace.repository;

import com.threattrace.entity.Investigation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvestigationRepository extends JpaRepository<Investigation, String> {
    Optional<Investigation> findByInvestigationReference(String investigationReference);
    List<Investigation> findByThreatId(String threatId);

    @Query("SELECT i FROM Investigation i WHERE " +
           "(:status IS NULL OR i.status = :status) AND " +
           "(:priority IS NULL OR i.priority = :priority)")
    Page<Investigation> findWithFilters(@Param("status") String status, @Param("priority") String priority, Pageable pageable);

    @Query("SELECT COUNT(i) FROM Investigation i WHERE i.status IN ('OPEN', 'IN_REVIEW', 'ESCALATED')")
    long countActiveInvestigations();
}
