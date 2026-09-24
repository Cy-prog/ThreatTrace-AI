package com.threattrace.repository;

import com.threattrace.entity.ThreatRelation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ThreatRelationRepository extends JpaRepository<ThreatRelation, String> {

    @Query("SELECT r FROM ThreatRelation r WHERE r.sourceThreat.id = :threatId OR r.targetThreat.id = :threatId")
    List<ThreatRelation> findAllRelationsForThreat(@Param("threatId") String threatId);

    @Query("SELECT r FROM ThreatRelation r ORDER BY r.similarityScore DESC")
    List<ThreatRelation> findTopCorrelations();
}
