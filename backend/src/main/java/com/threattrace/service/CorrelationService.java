package com.threattrace.service;

import com.threattrace.dto.response.CorrelationGraphResponse;
import com.threattrace.entity.Threat;
import com.threattrace.entity.ThreatEntity;
import com.threattrace.entity.ThreatRelation;
import com.threattrace.repository.ThreatRelationRepository;
import com.threattrace.repository.ThreatRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;

@Service
public class CorrelationService {

    private final ThreatRelationRepository threatRelationRepository;
    private final ThreatRepository threatRepository;

    public CorrelationService(ThreatRelationRepository threatRelationRepository, ThreatRepository threatRepository) {
        this.threatRelationRepository = threatRelationRepository;
        this.threatRepository = threatRepository;
    }

    @Transactional
    public void correlateThreat(Threat newThreat) {
        if (newThreat.getAnalysis() == null) return;

        List<Threat> recentThreats = threatRepository.findRecentThreats(PageRequest.of(0, 30));
        Set<String> newEntityValues = new HashSet<>();
        for (ThreatEntity e : newThreat.getAnalysis().getEntities()) {
            newEntityValues.add(e.getEntityValue().toLowerCase());
        }

        for (Threat candidate : recentThreats) {
            if (candidate.getId().equals(newThreat.getId()) || candidate.getAnalysis() == null) continue;

            double similarity = 0.0;
            String reason = null;

            // Shared entity check
            int sharedCount = 0;
            String sharedEntityName = null;
            for (ThreatEntity ce : candidate.getAnalysis().getEntities()) {
                if (newEntityValues.contains(ce.getEntityValue().toLowerCase())) {
                    sharedCount++;
                    sharedEntityName = ce.getEntityValue();
                }
            }

            if (sharedCount > 0) {
                similarity += 0.50 + Math.min(0.35, sharedCount * 0.15);
                reason = "SHARED_ENTITY: " + sharedEntityName;
            } else if (candidate.getAnalysis().getPredictedCategory().equals(newThreat.getAnalysis().getPredictedCategory())) {
                similarity += 0.40;
                reason = "CATEGORY_SIMILARITY: " + candidate.getAnalysis().getPredictedCategory();
            }

            if (similarity >= 0.45) {
                ThreatRelation relation = new ThreatRelation();
                relation.setSourceThreat(newThreat);
                relation.setTargetThreat(candidate);
                relation.setSimilarityScore(Math.min(0.98, similarity));
                relation.setCorrelationReason(reason != null ? reason : "PATTERN_OVERLAP");
                relation.setMetadata(String.format("{\"shared_entities\": %d}", sharedCount));
                relation.setCreatedAt(Instant.now());
                threatRelationRepository.save(relation);
            }
        }
    }

    @Transactional(readOnly = true)
    public CorrelationGraphResponse buildGlobalGraph() {
        List<Threat> threats = threatRepository.findRecentThreats(PageRequest.of(0, 25));
        List<CorrelationGraphResponse.GraphNode> nodes = new ArrayList<>();
        List<CorrelationGraphResponse.GraphLink> links = new ArrayList<>();
        Set<String> seenNodes = new HashSet<>();

        for (Threat t : threats) {
            if (!seenNodes.contains(t.getId())) {
                String sev = (t.getAnalysis() != null) ? t.getAnalysis().getSeverity() : "LOW";
                int score = (t.getAnalysis() != null) ? t.getAnalysis().getRiskScore() : 20;
                nodes.add(new CorrelationGraphResponse.GraphNode(
                        t.getId(),
                        t.getThreatReference(),
                        "THREAT",
                        sev,
                        score
                ));
                seenNodes.add(t.getId());
            }

            if (t.getAnalysis() != null) {
                for (ThreatEntity entity : t.getAnalysis().getEntities()) {
                    String entityNodeId = "ent_" + entity.getEntityType() + "_" + entity.getEntityValue().replaceAll("\\s+", "_");
                    if (!seenNodes.contains(entityNodeId)) {
                        nodes.add(new CorrelationGraphResponse.GraphNode(
                                entityNodeId,
                                entity.getEntityValue() + " (" + entity.getEntityType() + ")",
                                entity.getEntityType(),
                                "INFO",
                                0
                        ));
                        seenNodes.add(entityNodeId);
                    }
                    links.add(new CorrelationGraphResponse.GraphLink(
                            t.getId(),
                            entityNodeId,
                            "CONTAINS_" + entity.getEntityType(),
                            0.7
                    ));
                }
            }
        }

        List<ThreatRelation> relations = threatRelationRepository.findTopCorrelations();
        for (ThreatRelation r : relations) {
            if (seenNodes.contains(r.getSourceThreat().getId()) && seenNodes.contains(r.getTargetThreat().getId())) {
                links.add(new CorrelationGraphResponse.GraphLink(
                        r.getSourceThreat().getId(),
                        r.getTargetThreat().getId(),
                        r.getCorrelationReason(),
                        r.getSimilarityScore()
                ));
            }
        }

        return new CorrelationGraphResponse(nodes, links);
    }
}
