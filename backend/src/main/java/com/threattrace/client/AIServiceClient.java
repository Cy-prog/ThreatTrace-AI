package com.threattrace.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.threattrace.dto.response.SignalBreakdownItem;
import com.threattrace.dto.response.ThreatAnalysisDTO;
import com.threattrace.dto.response.ThreatEntityDTO;
import com.threattrace.dto.response.ThreatIndicatorDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class AIServiceClient {

    private static final Logger logger = LoggerFactory.getLogger(AIServiceClient.class);

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final String aiServiceUrl;
    private final String aiServiceApiKey;

    public AIServiceClient(
            @Value("${threattrace.ai-service.url:http://localhost:8000}") String aiServiceUrl,
            @Value("${threattrace.ai-service.api-key:ThreatTrace-Internal-AI-Key-2026-Secure}") String aiServiceApiKey,
            @Value("${threattrace.ai-service.timeout-ms:5000}") int timeoutMs
    ) {
        org.springframework.http.client.SimpleClientHttpRequestFactory factory = new org.springframework.http.client.SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(3000);
        factory.setReadTimeout(timeoutMs > 0 ? timeoutMs : 5000);
        this.restTemplate = new RestTemplate(factory);
        this.objectMapper = new ObjectMapper();
        String normalizedUrl = aiServiceUrl != null ? aiServiceUrl.trim() : "http://localhost:8000";
        if (!normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
            if (normalizedUrl.contains(":8000") || normalizedUrl.contains("localhost")) {
                normalizedUrl = "http://" + normalizedUrl;
            } else {
                normalizedUrl = "https://" + normalizedUrl;
            }
        }
        this.aiServiceUrl = normalizedUrl.endsWith("/") ? normalizedUrl.substring(0, normalizedUrl.length() - 1) : normalizedUrl;
        this.aiServiceApiKey = aiServiceApiKey;
    }

    public ThreatAnalysisDTO analyzeThreat(String threatId, String content, String sourceType) {
        try {
            String endpoint = aiServiceUrl + "/api/v1/analyze";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-ThreatTrace-Internal-Key", aiServiceApiKey);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("threat_id", threatId);
            requestBody.put("content", content);
            requestBody.put("source_type", sourceType);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(endpoint, entity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return parseAIResponse(response.getBody());
            }
        } catch (Exception ex) {
            logger.warn("AI microservice call failed at {}: {}. Falling back to internal heuristic analysis engine.", aiServiceUrl, ex.getMessage());
        }

        // Resilient deterministic fallback engine
        return executeDeterministicFallback(content);
    }

    private ThreatAnalysisDTO parseAIResponse(String responseJson) {
        try {
            JsonNode root = objectMapper.readTree(responseJson);
            ThreatAnalysisDTO dto = new ThreatAnalysisDTO();
            dto.setPredictedCategory(root.path("predicted_category").asText("UNKNOWN"));
            dto.setConfidence(root.path("confidence").asDouble(0.85));
            dto.setRiskScore(root.path("risk_score").asInt(50));
            dto.setSeverity(root.path("severity").asText("MEDIUM"));
            dto.setSentimentLabel(root.path("sentiment_label").asText("NEGATIVE"));
            dto.setSentimentScore(root.path("sentiment_score").asDouble(-0.5));
            dto.setUrgencyScore(root.path("urgency_score").asDouble(0.5));
            dto.setExplanationSummary(root.path("explanation_summary").asText("Automated AI threat intelligence assessment."));
            dto.setModelName(root.path("model_name").asText("ThreatClassifier-FastAPI"));
            dto.setModelVersion(root.path("model_version").asText("v1.4.2"));
            dto.setHumanReviewRequired(root.path("human_review_required").asBoolean(true));
            dto.setAnalyzedAt(Instant.now());

            // Signal breakdown
            if (root.has("signal_breakdown") && root.get("signal_breakdown").isArray()) {
                for (JsonNode item : root.get("signal_breakdown")) {
                    dto.getSignalBreakdown().add(new SignalBreakdownItem(
                            item.path("signal").asText(),
                            item.path("points").asInt(),
                            item.path("detail").asText()
                    ));
                }
            }

            // Entities
            if (root.has("entities") && root.get("entities").isArray()) {
                for (JsonNode item : root.get("entities")) {
                    dto.getEntities().add(new ThreatEntityDTO(
                            UUID.randomUUID().toString(),
                            item.path("entity_type").asText(),
                            item.path("entity_value").asText(),
                            item.path("confidence").asDouble(0.9),
                            item.path("start_offset").asInt(0),
                            item.path("end_offset").asInt(0),
                            item.path("source_span").asText()
                    ));
                }
            }

            // Indicators
            if (root.has("indicators") && root.get("indicators").isArray()) {
                for (JsonNode item : root.get("indicators")) {
                    dto.getIndicators().add(new ThreatIndicatorDTO(
                            UUID.randomUUID().toString(),
                            item.path("indicator_type").asText(),
                            item.path("label").asText(),
                            item.path("weight").asDouble(0.8),
                            item.path("evidence_snippet").asText()
                    ));
                }
            }

            return dto;
        } catch (Exception e) {
            logger.error("Failed to parse AI response JSON", e);
            throw new RuntimeException("Malformed response from AI Service", e);
        }
    }

    public ThreatAnalysisDTO executeDeterministicFallback(String text) {
        String lower = text.toLowerCase();
        ThreatAnalysisDTO dto = new ThreatAnalysisDTO();
        dto.setAnalyzedAt(Instant.now());
        dto.setModelName("ThreatTrace-Heuristic-Fallback");
        dto.setModelVersion("v1.0.0-fallback");
        dto.setHumanReviewRequired(true);

        int risk = 10;
        String category = "NON_THREAT";
        double confidence = 0.88;
        String severity = "LOW";

        List<SignalBreakdownItem> breakdown = new ArrayList<>();
        List<ThreatIndicatorDTO> indicators = new ArrayList<>();
        List<ThreatEntityDTO> entities = new ArrayList<>();

        if (lower.contains("bomb") || lower.contains("explosive") || lower.contains("detonate") || lower.contains("blast")) {
            category = "BOMB_THREAT";
            risk += 35;
            confidence = 0.94;
            breakdown.add(new SignalBreakdownItem("Base Threat (BOMB_THREAT)", 35, "Detected explosive detonation references"));
            indicators.add(new ThreatIndicatorDTO(UUID.randomUUID().toString(), "WEAPON_REFERENCE", "Explosive Device Marker", 0.95, extractSnippet(text, "bomb", "explosive", "detonate")));
        } else if (lower.contains("kill") || lower.contains("assault") || lower.contains("murder") || lower.contains("shoot") || lower.contains("attack")) {
            category = "VIOLENT_THREAT";
            risk += 30;
            confidence = 0.91;
            breakdown.add(new SignalBreakdownItem("Base Threat (VIOLENT_THREAT)", 30, "Lethal violence vocabulary detected"));
            indicators.add(new ThreatIndicatorDTO(UUID.randomUUID().toString(), "THREAT_LANGUAGE", "Violent Intent Marker", 0.90, extractSnippet(text, "kill", "assault", "shoot", "attack")));
        } else if (lower.contains("malware") || lower.contains("ransomware") || lower.contains("zero-day") || lower.contains("ddos") || lower.contains("exploit") || lower.contains("scada")) {
            category = "CYBER_THREAT";
            risk += 25;
            confidence = 0.89;
            breakdown.add(new SignalBreakdownItem("Base Threat (CYBER_THREAT)", 25, "Cyber warfare/malware vocabulary detected"));
            indicators.add(new ThreatIndicatorDTO(UUID.randomUUID().toString(), "CYBER_THREAT", "Cyber Attack Signal", 0.88, extractSnippet(text, "malware", "ransomware", "zero-day", "scada")));
        } else if (lower.contains("btc") || lower.contains("bitcoin") || lower.contains("transfer") || lower.contains("ransom") || lower.contains("pay") || lower.contains("extort")) {
            category = "EXTORTION";
            risk += 22;
            confidence = 0.87;
            breakdown.add(new SignalBreakdownItem("Base Threat (EXTORTION)", 22, "Demand or coercive financial terms detected"));
            indicators.add(new ThreatIndicatorDTO(UUID.randomUUID().toString(), "DEMAND_LANGUAGE", "Coercive Payment Demand", 0.85, extractSnippet(text, "btc", "transfer", "pay", "ransom")));
        } else if (lower.contains("tracking") || lower.contains("watch you") || lower.contains("where you live") || lower.contains("stalk")) {
            category = "STALKING";
            risk += 20;
            confidence = 0.84;
            breakdown.add(new SignalBreakdownItem("Base Threat (STALKING)", 20, "Physical surveillance tracking detected"));
            indicators.add(new ThreatIndicatorDTO(UUID.randomUUID().toString(), "ESCALATION_SIGNAL", "Surveillance & Stalking Marker", 0.82, extractSnippet(text, "tracking", "watch you", "where you live")));
        }

        // Target detection
        Pattern targetPattern = Pattern.compile("(?i)(target|against|headquarters|station|plant|office|hospital|school|airport|metro)\\s+([A-Z][a-zA-Z0-9\\s]{2,25})");
        Matcher targetMatcher = targetPattern.matcher(text);
        if (targetMatcher.find()) {
            risk += 18;
            String targetVal = targetMatcher.group(0);
            breakdown.add(new SignalBreakdownItem("Explicit Target Reference", 18, "Identified targeted facility: " + targetVal));
            entities.add(new ThreatEntityDTO(UUID.randomUUID().toString(), "FACILITY", targetVal, 0.91, targetMatcher.start(), targetMatcher.end(), targetVal));
        }

        // Temporal detection
        Pattern timePattern = Pattern.compile("(?i)(tomorrow|tonight|today|\\d{1,2}:\\d{2}|within\\s+\\d+\\s+hours|deadline|immediately)");
        Matcher timeMatcher = timePattern.matcher(text);
        if (timeMatcher.find()) {
            risk += 14;
            String timeVal = timeMatcher.group(0);
            breakdown.add(new SignalBreakdownItem("Temporal Imminence", 14, "Imminent horizon: " + timeVal));
            indicators.add(new ThreatIndicatorDTO(UUID.randomUUID().toString(), "IMMINENCE_SIGNAL", "Time Window Identified", 0.88, timeVal));
            entities.add(new ThreatEntityDTO(UUID.randomUUID().toString(), "TIME", timeVal, 0.90, timeMatcher.start(), timeMatcher.end(), timeVal));
        }

        // BTC Address regex
        Pattern btcPattern = Pattern.compile("\\b(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,39}\\b");
        Matcher btcMatcher = btcPattern.matcher(text);
        if (btcMatcher.find()) {
            risk += 10;
            String btcVal = btcMatcher.group(0);
            breakdown.add(new SignalBreakdownItem("Crypto Ransom Address", 10, "Cryptocurrency wallet detected"));
            entities.add(new ThreatEntityDTO(UUID.randomUUID().toString(), "CRYPTO_WALLET", btcVal, 0.99, btcMatcher.start(), btcMatcher.end(), btcVal));
        }

        risk = Math.min(100, risk);
        if (risk >= 80) severity = "CRITICAL";
        else if (risk >= 60) severity = "HIGH";
        else if (risk >= 35) severity = "MEDIUM";
        else severity = "LOW";

        dto.setPredictedCategory(category);
        dto.setConfidence(confidence);
        dto.setRiskScore(risk);
        dto.setSeverity(severity);
        dto.setSentimentLabel(risk > 35 ? "NEGATIVE" : "NEUTRAL");
        dto.setSentimentScore(risk > 35 ? -0.8 : 0.0);
        dto.setUrgencyScore(risk > 60 ? 0.9 : 0.3);
        dto.setExplanationSummary(String.format("Heuristic fallback classified threat as %s with risk score %d/100 (%s). Found %d entities and %d risk indicators.",
                category, risk, severity, entities.size(), indicators.size()));
        dto.setSignalBreakdown(breakdown);
        dto.setEntities(entities);
        dto.setIndicators(indicators);

        return dto;
    }

    private String extractSnippet(String text, String... keywords) {
        String lower = text.toLowerCase();
        for (String kw : keywords) {
            int idx = lower.indexOf(kw);
            if (idx != -1) {
                int start = Math.max(0, idx - 25);
                int end = Math.min(text.length(), idx + kw.length() + 35);
                return (start > 0 ? "..." : "") + text.substring(start, end).trim() + (end < text.length() ? "..." : "");
            }
        }
        return text.substring(0, Math.min(60, text.length()));
    }
}
