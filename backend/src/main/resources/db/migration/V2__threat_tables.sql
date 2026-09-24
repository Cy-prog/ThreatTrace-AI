-- V2__threat_tables.sql: Core Threat Intelligence Tables

CREATE TABLE model_versions (
    id VARCHAR(36) PRIMARY KEY,
    model_name VARCHAR(100) NOT NULL,
    model_version VARCHAR(50) NOT NULL,
    model_type VARCHAR(50) NOT NULL,
    training_dataset VARCHAR(150),
    evaluation_metrics TEXT,
    status VARCHAR(30) NOT NULL,
    deployed_at TIMESTAMP NOT NULL
);

CREATE TABLE threats (
    id VARCHAR(36) PRIMARY KEY,
    threat_reference VARCHAR(50) NOT NULL UNIQUE,
    source_type VARCHAR(50) NOT NULL,
    source_reference VARCHAR(255),
    raw_content TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    location_name VARCHAR(255),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    geo_verified BOOLEAN DEFAULT FALSE,
    reported_by VARCHAR(36),
    submitted_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_threats_reported_by FOREIGN KEY (reported_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE threat_analyses (
    id VARCHAR(36) PRIMARY KEY,
    threat_id VARCHAR(36) NOT NULL UNIQUE,
    predicted_category VARCHAR(100) NOT NULL,
    confidence DOUBLE PRECISION NOT NULL,
    risk_score INTEGER NOT NULL,
    severity VARCHAR(30) NOT NULL,
    sentiment_label VARCHAR(50),
    sentiment_score DOUBLE PRECISION,
    urgency_score DOUBLE PRECISION,
    explanation_summary TEXT,
    signal_breakdown TEXT,
    model_name VARCHAR(100) NOT NULL,
    model_version VARCHAR(50) NOT NULL,
    human_review_required BOOLEAN DEFAULT TRUE,
    analyzed_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_analyses_threat FOREIGN KEY (threat_id) REFERENCES threats(id) ON DELETE CASCADE
);

CREATE TABLE threat_entities (
    id VARCHAR(36) PRIMARY KEY,
    analysis_id VARCHAR(36) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_value VARCHAR(255) NOT NULL,
    confidence DOUBLE PRECISION NOT NULL,
    start_offset INTEGER,
    end_offset INTEGER,
    source_span VARCHAR(500),
    CONSTRAINT fk_entities_analysis FOREIGN KEY (analysis_id) REFERENCES threat_analyses(id) ON DELETE CASCADE
);

CREATE TABLE threat_indicators (
    id VARCHAR(36) PRIMARY KEY,
    analysis_id VARCHAR(36) NOT NULL,
    indicator_type VARCHAR(50) NOT NULL,
    label VARCHAR(150) NOT NULL,
    weight DOUBLE PRECISION NOT NULL,
    evidence_snippet TEXT,
    CONSTRAINT fk_indicators_analysis FOREIGN KEY (analysis_id) REFERENCES threat_analyses(id) ON DELETE CASCADE
);

CREATE TABLE threat_relations (
    id VARCHAR(36) PRIMARY KEY,
    source_threat_id VARCHAR(36) NOT NULL,
    target_threat_id VARCHAR(36) NOT NULL,
    similarity_score DOUBLE PRECISION NOT NULL,
    correlation_reason VARCHAR(100) NOT NULL,
    metadata TEXT,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_relations_source FOREIGN KEY (source_threat_id) REFERENCES threats(id) ON DELETE CASCADE,
    CONSTRAINT fk_relations_target FOREIGN KEY (target_threat_id) REFERENCES threats(id) ON DELETE CASCADE
);

CREATE INDEX idx_threats_reference ON threats(threat_reference);
CREATE INDEX idx_threats_status ON threats(status);
CREATE INDEX idx_threats_source ON threats(source_type);
CREATE INDEX idx_threats_created_at ON threats(created_at);
CREATE INDEX idx_analyses_risk ON threat_analyses(risk_score);
CREATE INDEX idx_analyses_severity ON threat_analyses(severity);
CREATE INDEX idx_analyses_category ON threat_analyses(predicted_category);
CREATE INDEX idx_entities_type ON threat_entities(entity_type);
CREATE INDEX idx_entities_value ON threat_entities(entity_value);
