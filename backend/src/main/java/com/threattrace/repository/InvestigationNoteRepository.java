package com.threattrace.repository;

import com.threattrace.entity.InvestigationNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvestigationNoteRepository extends JpaRepository<InvestigationNote, String> {
    List<InvestigationNote> findByInvestigationIdOrderByCreatedAtAsc(String investigationId);
}
