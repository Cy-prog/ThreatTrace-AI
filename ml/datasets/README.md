# ThreatTrace AI — ML Datasets Governance

## Dataset Architecture
- `raw/`: Unprocessed, sanitized threat signal datasets.
- `processed/`: Balanced, tokenized, and stratified evaluation datasets.

## Governance & Privacy Guardrails
1. **No Sensitive PII**: Synthetic and publicly disclosable threat scenarios only.
2. **Class Stratification**: Equal representation across violent threats, cyber exploits, extortion, bomb threats, and non-threat operational chatter.
3. **Reproducibility**: Fixed random seeds (seed 42) for train/validation/test splits (80/10/10).
