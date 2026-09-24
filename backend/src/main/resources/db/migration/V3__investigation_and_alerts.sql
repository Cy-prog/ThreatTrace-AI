-- V3__investigation_and_alerts.sql: Investigations and Alerts Schema

CREATE TABLE investigations (
    id VARCHAR(36) PRIMARY KEY,
    investigation_reference VARCHAR(50) NOT NULL UNIQUE,
    threat_id VARCHAR(36) NOT NULL,
    assigned_analyst_id VARCHAR(36),
    priority VARCHAR(30) NOT NULL,
    status VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    resolution_notes TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    closed_at TIMESTAMP,
    CONSTRAINT fk_investigations_threat FOREIGN KEY (threat_id) REFERENCES threats(id) ON DELETE CASCADE,
    CONSTRAINT fk_investigations_analyst FOREIGN KEY (assigned_analyst_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE investigation_notes (
    id VARCHAR(36) PRIMARY KEY,
    investigation_id VARCHAR(36) NOT NULL,
    author_id VARCHAR(36) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_notes_investigation FOREIGN KEY (investigation_id) REFERENCES investigations(id) ON DELETE CASCADE,
    CONSTRAINT fk_notes_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE alerts (
    id VARCHAR(36) PRIMARY KEY,
    alert_reference VARCHAR(50) NOT NULL UNIQUE,
    threat_id VARCHAR(36) NOT NULL,
    alert_type VARCHAR(100) NOT NULL,
    severity VARCHAR(30) NOT NULL,
    status VARCHAR(50) NOT NULL,
    acknowledged_by VARCHAR(36),
    acknowledged_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_alerts_threat FOREIGN KEY (threat_id) REFERENCES threats(id) ON DELETE CASCADE,
    CONSTRAINT fk_alerts_acknowledged_by FOREIGN KEY (acknowledged_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_investigations_status ON investigations(status);
CREATE INDEX idx_investigations_priority ON investigations(priority);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_severity ON alerts(severity);
