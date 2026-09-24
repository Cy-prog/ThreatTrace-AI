-- V5__seed_initial_data.sql: Seed Roles, Users, Initial Model Versions, and Synthetic Demo Data

-- 1. Roles
INSERT INTO roles (id, name, description) VALUES
('r001-admin', 'ROLE_ADMIN', 'System Administrator with full access to settings, user management, and audit logs'),
('r002-analyst', 'ROLE_ANALYST', 'Threat Analyst authorized to ingest, triage, and analyze incoming threat signals'),
('r003-investigator', 'ROLE_INVESTIGATOR', 'Senior Investigator authorized to manage investigation cases and evidence'),
('r004-viewer', 'ROLE_VIEWER', 'Read-only observer access for auditing and executive briefings');

-- 2. Initial Users (All default passwords: Username capitalized + Pass123!, e.g. AdminPass123!)
-- admin@threattrace.io / AdminPass123!
INSERT INTO users (id, username, email, password_hash, full_name, enabled, created_at, updated_at) VALUES
('u001-admin', 'admin@threattrace.io', 'admin@threattrace.io', '$2b$12$TDaVMyVZn4EebM3OLQYboesIjizoHspIKoEmTw56ulJDcvGTgysZW', 'SOC Director', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('u002-analyst', 'analyst@threattrace.io', 'analyst@threattrace.io', '$2b$12$.1HcBtKzwo8wwKOfzyce/.rtWiNAnOJ63g/XgaftcslU2Iyl/GKDC', 'Marcus Vance (Lead Analyst)', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('u003-investigator', 'investigator@threattrace.io', 'investigator@threattrace.io', '$2b$12$agVnvs3/.6FnJhN.wXdGz.ga/hg/YFkWlAsP6nyvAWGChi0xvK.p2', 'Elena Rostova (Senior Investigator)', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('u004-viewer', 'viewer@threattrace.io', 'viewer@threattrace.io', '$2b$12$Eu0b9GHAeNTUMc1KvwliXOVBTWMSQGb.JW10IxonX.utMdKNrj.7m', 'Sarah Chen (Compliance Officer)', TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 3. Assign Roles
INSERT INTO user_roles (user_id, role_id) VALUES
('u001-admin', 'r001-admin'),
('u001-admin', 'r002-analyst'),
('u002-analyst', 'r002-analyst'),
('u003-investigator', 'r003-investigator'),
('u003-investigator', 'r002-analyst'),
('u004-viewer', 'r004-viewer');

-- 4. Model Registry
INSERT INTO model_versions (id, model_name, model_version, model_type, training_dataset, evaluation_metrics, status, deployed_at) VALUES
('m001-classifier', 'ThreatClassifier-MultiClass', 'v1.4.2', 'ENSEMBLE_TRANSFORMER_TFIDF', 'dataset-threats-2026-q3', '{"f1_macro": 0.924, "precision": 0.931, "recall": 0.918, "eval_samples": 4500}', 'ACTIVE', CURRENT_TIMESTAMP),
('m002-ner', 'ThreatNER-CyberLinguistic', 'v2.1.0', 'TRANSFORMER_TOKEN_SPAN', 'cyber-ner-conll-enhanced', '{"entity_f1": 0.897, "exact_span_match": 0.882}', 'ACTIVE', CURRENT_TIMESTAMP),
('m003-risk', 'TransparentRiskScoringEngine', 'v1.0.0', 'WEIGHTED_MULTI_SIGNAL', 'risk-benchmark-v1', '{"calibration_error": 0.04}', 'ACTIVE', CURRENT_TIMESTAMP);

-- 5. Synthetic Demo Threats (Clearly tagged DEMO DATA)
INSERT INTO threats (id, threat_reference, source_type, source_reference, raw_content, status, location_name, latitude, longitude, geo_verified, reported_by, submitted_at, created_at, updated_at) VALUES
('t001-threat', 'THR-2026-000184', 'EMAIL', 'sec-tip-4412@external-relay.net', '[DEMO DATA] We have planted explosive charges across the transit tunnels connecting Central Metro Station in Chicago. If 50 BTC is not transferred to bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh by tomorrow at 9:00 AM, the detonation sequence will commence without further warning.', 'ANALYZED', 'Central Metro Station, Chicago, IL, USA', 41.8781, -87.6298, TRUE, 'u002-analyst', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('t002-threat', 'THR-2026-000185', 'SOCIAL_MEDIA', '@shadow_strike99 on X', '[DEMO DATA] Target confirmed: Meridian Financial headquarters on 5th Avenue, New York. Our assault team is locked and loaded. Retaliation for the executive fraud starts tonight at 23:00 EST.', 'IN_REVIEW', '5th Avenue, New York, NY, USA', 40.7744, -73.9656, TRUE, 'u002-analyst', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('t003-threat', 'THR-2026-000186', 'WEB_REPORT', 'Public Safety Portal #982', '[DEMO DATA] Anonymous tip: A disgruntled contractor was seen downloading industrial SCADA schematics for the North Water Treatment Plant in Seattle. Mentioned deploying zero-day malware to trigger valve failures within 48 hours.', 'ESCALATED', 'North Water Treatment Plant, Seattle, WA, USA', 47.6062, -122.3321, TRUE, 'u003-investigator', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('t004-threat', 'THR-2026-000187', 'MESSAGE', 'Encrypted Telegram Channel 0x88', '[DEMO DATA] Beware. We will find where you live and ensure you never publish another investigation report against our syndicate. We are tracking your vehicles.', 'ANALYZED', NULL, NULL, NULL, FALSE, 'u002-analyst', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

('t005-threat', 'THR-2026-000188', 'API', 'Automated SIEM Alert Gateway', '[DEMO DATA] Routine scheduled vulnerability scan completed on edge gateway firewalls. 0 critical vulnerabilities detected. System nominal.', 'RESOLVED', 'Data Center Alpha, Frankfurt, Germany', 50.1109, 8.6821, TRUE, 'u001-admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 6. Analyses for Synthetic Threats
INSERT INTO threat_analyses (id, threat_id, predicted_category, confidence, risk_score, severity, sentiment_label, sentiment_score, urgency_score, explanation_summary, signal_breakdown, model_name, model_version, human_review_required, analyzed_at) VALUES
('a001-analysis', 't001-threat', 'BOMB_THREAT', 0.96, 92, 'CRITICAL', 'NEGATIVE', -0.88, 0.95, '[DEMO DATA] High-confidence bomb threat and extortion attempt specifying explicit facility target (Central Metro Station), precise geographic location (Chicago), strict temporal deadline (tomorrow 9:00 AM), and financial ransom demand (50 BTC). Immediate law enforcement coordination advised.', '[{"signal":"Base Category (BOMB_THREAT)","points":35,"detail":"Severe public safety explosive hazard"},{"signal":"Explicit Target & Location","points":25,"detail":"Central Metro Station, Chicago"},{"signal":"Temporal Imminence","points":15,"detail":"Deadline: tomorrow at 9:00 AM"},{"signal":"Extortion Demand","points":10,"detail":"50 BTC ransom demand"},{"signal":"Model High Confidence","points":7,"detail":"Confidence 96%"}]', 'ThreatClassifier-MultiClass', 'v1.4.2', TRUE, CURRENT_TIMESTAMP),

('a002-analysis', 't002-threat', 'VIOLENT_THREAT', 0.91, 84, 'CRITICAL', 'NEGATIVE', -0.92, 0.88, '[DEMO DATA] Targeted violent assault threat against corporate headquarters (Meridian Financial) naming specific physical address (5th Avenue, New York) and tight temporal deadline (tonight at 23:00 EST). Weaponized intent detected.', '[{"signal":"Base Category (VIOLENT_THREAT)","points":30,"detail":"Assault and physical violence rhetoric"},{"signal":"Explicit Corporate Target","points":20,"detail":"Meridian Financial headquarters"},{"signal":"Location Specificity","points":15,"detail":"5th Avenue, New York"},{"signal":"Imminent Deadline","points":12,"detail":"tonight at 23:00 EST"},{"signal":"Model Confidence","points":7,"detail":"Confidence 91%"}]', 'ThreatClassifier-MultiClass', 'v1.4.2', TRUE, CURRENT_TIMESTAMP),

('a003-analysis', 't003-threat', 'CYBER_THREAT', 0.88, 76, 'HIGH', 'NEGATIVE', -0.65, 0.78, '[DEMO DATA] Credible insider threat and operational technology cyber threat targeting critical infrastructure (North Water Treatment Plant, Seattle) with 48-hour timeline and zero-day malware reference.', '[{"signal":"Base Category (CYBER_THREAT)","points":25,"detail":"Critical SCADA infrastructure attack"},{"signal":"Facility Specificity","points":20,"detail":"North Water Treatment Plant"},{"signal":"Temporal Horizon","points":12,"detail":"within 48 hours"},{"signal":"Malware Reference","points":12,"detail":"zero-day malware valve failure"},{"signal":"Model Confidence","points":7,"detail":"Confidence 88%"}]', 'ThreatClassifier-MultiClass', 'v1.4.2', TRUE, CURRENT_TIMESTAMP),

('a004-analysis', 't004-threat', 'STALKING', 0.84, 58, 'MEDIUM', 'NEGATIVE', -0.74, 0.62, '[DEMO DATA] Intimidation and stalking harassment directed at an investigator. Mentions physical surveillance and tracking. No reliable geographic coordinate detected in raw text.', '[{"signal":"Base Category (STALKING)","points":20,"detail":"Surveillance and intimidation"},{"signal":"Target Reference","points":15,"detail":"Targeted investigator"},{"signal":"Surveillance Signal","points":15,"detail":"tracking vehicles indicator"},{"signal":"Model Confidence","points":8,"detail":"Confidence 84%"}]', 'ThreatClassifier-MultiClass', 'v1.4.2', TRUE, CURRENT_TIMESTAMP),

('a005-analysis', 't005-threat', 'NON_THREAT', 0.99, 5, 'LOW', 'NEUTRAL', 0.05, 0.02, '[DEMO DATA] Benign operational scan notification. No threatening language, violent intent, or risk indicators detected.', '[{"signal":"Base Category (NON_THREAT)","points":0,"detail":"Benign automated system log"},{"signal":"Zero Risk Indicators","points":5,"detail":"Routine automated notification"}]', 'ThreatClassifier-MultiClass', 'v1.4.2', FALSE, CURRENT_TIMESTAMP);

-- 7. Threat Entities
INSERT INTO threat_entities (id, analysis_id, entity_type, entity_value, confidence, start_offset, end_offset, source_span) VALUES
('e001-ent', 'a001-analysis', 'FACILITY', 'Central Metro Station', 0.95, 68, 89, 'Central Metro Station'),
('e002-ent', 'a001-analysis', 'LOCATION', 'Chicago', 0.98, 93, 100, 'Chicago'),
('e003-ent', 'a001-analysis', 'DATE', 'tomorrow at 9:00 AM', 0.92, 192, 211, 'tomorrow at 9:00 AM'),
('e004-ent', 'a002-analysis', 'ORGANIZATION', 'Meridian Financial', 0.94, 30, 48, 'Meridian Financial'),
('e005-ent', 'a002-analysis', 'LOCATION', 'New York', 0.97, 78, 86, 'New York'),
('e006-ent', 'a002-analysis', 'TIME', 'tonight at 23:00 EST', 0.93, 160, 180, 'tonight at 23:00 EST'),
('e007-ent', 'a003-analysis', 'FACILITY', 'North Water Treatment Plant', 0.91, 101, 128, 'North Water Treatment Plant'),
('e008-ent', 'a003-analysis', 'LOCATION', 'Seattle', 0.96, 132, 139, 'Seattle');

-- 8. Threat Indicators
INSERT INTO threat_indicators (id, analysis_id, indicator_type, label, weight, evidence_snippet) VALUES
('i001-ind', 'a001-analysis', 'WEAPON_REFERENCE', 'Explosive Device Reference', 0.95, 'planted explosive charges across the transit tunnels'),
('i002-ind', 'a001-analysis', 'DEMAND_LANGUAGE', 'Financial Extortion Ransom Demand', 0.88, 'If 50 BTC is not transferred'),
('i003-ind', 'a001-analysis', 'IMMINENCE_SIGNAL', 'Specific Imminent Deadline', 0.92, 'by tomorrow at 9:00 AM'),
('i004-ind', 'a002-analysis', 'THREAT_LANGUAGE', 'Assault Team Mobilization', 0.90, 'Our assault team is locked and loaded'),
('i005-ind', 'a003-analysis', 'CYBER_THREAT', 'SCADA Zero-day Exploitation', 0.85, 'deploying zero-day malware to trigger valve failures');

-- 9. Investigations
INSERT INTO investigations (id, investigation_reference, threat_id, assigned_analyst_id, priority, status, title, summary, resolution_notes, created_at, updated_at, closed_at) VALUES
('inv001-case', 'INV-2026-000042', 't001-threat', 'u003-investigator', 'CRITICAL', 'OPEN', '[DEMO DATA] Chicago Metro Transit Explosive Extortion Threat', 'Investigation initiated following automated ingestion of high-consequence bomb threat targeting Chicago transit tunnels. Coordinating with federal transit security partners.', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
('inv002-case', 'INV-2026-000043', 't003-threat', 'u003-investigator', 'HIGH', 'IN_REVIEW', '[DEMO DATA] Seattle Critical Water SCADA Threat Triage', 'Evaluating integrity of SCADA blueprints and verifying identity of recently terminated industrial contractors.', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL);

-- 10. Investigation Notes
INSERT INTO investigation_notes (id, investigation_id, author_id, content, created_at) VALUES
('n001-note', 'inv001-case', 'u003-investigator', 'Verified BTC wallet address on chain explorer. Wallet shows 0 prior transactions. Subpoena request drafted for relay server IP.', CURRENT_TIMESTAMP);

-- 11. Alerts
INSERT INTO alerts (id, alert_reference, threat_id, alert_type, severity, status, acknowledged_by, acknowledged_at, created_at) VALUES
('alt001', 'ALT-2026-000088', 't001-threat', 'CRITICAL_SEVERITY_THRESHOLD', 'CRITICAL', 'OPEN', NULL, NULL, CURRENT_TIMESTAMP),
('alt002', 'ALT-2026-000089', 't002-threat', 'HIGH_RISK_THRESHOLD', 'CRITICAL', 'ACKNOWLEDGED', 'u002-analyst', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('alt003', 'ALT-2026-000090', 't003-threat', 'INFRASTRUCTURE_TARGET', 'HIGH', 'OPEN', NULL, NULL, CURRENT_TIMESTAMP);

-- 12. Threat Relations / Correlations
INSERT INTO threat_relations (id, source_threat_id, target_threat_id, similarity_score, correlation_reason, metadata, created_at) VALUES
('rel001', 't001-threat', 't002-threat', 0.68, 'EXTORTION_TACTIC_OVERLAP', '{"shared_indicator": "DEMAND_LANGUAGE", "urgency_window_hours": 24}', CURRENT_TIMESTAMP);

-- 13. Audit Log Entries
INSERT INTO audit_logs (id, actor, action, resource_type, resource_id, ip_address, metadata, created_at) VALUES
('aud001', 'system', 'SYSTEM_BOOT', 'PLATFORM', 'threattrace-core', '127.0.0.1', '{"version": "1.0.0", "status": "INITIALIZED"}', CURRENT_TIMESTAMP),
('aud002', 'u002-analyst', 'THREAT_INGESTED', 'THREAT', 't001-threat', '10.0.4.12', '{"reference": "THR-2026-000184", "source": "EMAIL"}', CURRENT_TIMESTAMP),
('aud003', 'system', 'THREAT_ANALYZED', 'THREAT_ANALYSIS', 'a001-analysis', '127.0.0.1', '{"risk_score": 92, "category": "BOMB_THREAT"}', CURRENT_TIMESTAMP);
