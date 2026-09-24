package com.threattrace;

import com.threattrace.dto.request.ThreatIngestRequest;
import com.threattrace.dto.response.ThreatDetailResponse;
import com.threattrace.service.ThreatService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("dev")
@Transactional
class ThreatServiceTest {

    @Autowired
    private ThreatService threatService;

    @Test
    void testIngestAndAnalyzeBombThreat() {
        ThreatIngestRequest request = new ThreatIngestRequest();
        request.setSourceType("EMAIL");
        request.setSourceReference("investigator-tip@intel.org");
        request.setRawContent("[DEMO DATA] An explosive bomb is placed at Metro Station Chicago and set to detonate tomorrow at 08:00 unless 100 BTC is sent.");
        request.setLocationName("Metro Station, Chicago");
        request.setLatitude(41.8781);
        request.setLongitude(-87.6298);

        ThreatDetailResponse response = threatService.ingestThreat(request, "analyst@threattrace.io");

        assertNotNull(response);
        assertNotNull(response.getId());
        assertTrue(response.getThreatReference().startsWith("THR-"));
        assertEquals("ANALYZED", response.getStatus());
        assertTrue(response.getGeoVerified());

        // Check AI Analysis results
        assertNotNull(response.getAnalysis());
        assertEquals("BOMB_THREAT", response.getAnalysis().getPredictedCategory());
        assertTrue(response.getAnalysis().getRiskScore() >= 60, "Bomb threat should have high risk score");
        assertTrue(response.getAnalysis().getConfidence() > 0.8);
        assertFalse(response.getAnalysis().getSignalBreakdown().isEmpty());
    }

    @Test
    void testIngestBenignReport() {
        ThreatIngestRequest request = new ThreatIngestRequest();
        request.setSourceType("USER_REPORT");
        request.setRawContent("Routine daily operational log update. Server maintenance completed with no issues.");

        ThreatDetailResponse response = threatService.ingestThreat(request, "analyst@threattrace.io");

        assertNotNull(response);
        assertNotNull(response.getAnalysis());
        assertEquals("NON_THREAT", response.getAnalysis().getPredictedCategory());
        assertTrue(response.getAnalysis().getRiskScore() <= 35, "Benign report should have low risk score");
    }
}
