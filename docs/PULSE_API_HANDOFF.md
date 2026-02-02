# DarkWave Studios API Integration Handoff

## Overview
This document provides everything needed for DarkWave Studios to connect external customers to Pulse's Quant and Predictive AI systems.

---

## Production API Base URL
```
https://pulse.darkwavestudios.io/api
```
(Or current deployed Replit URL)

---

## Available API Endpoints

### 1. ML Prediction Stats (Primary)
```
GET /api/ml/stats
```
Returns comprehensive prediction statistics including:
- Total predictions count
- Buy/Sell/Hold signal distribution
- Win rates by time horizon (1H, 4H, 24H, 7D)
- Recent predictions with confidence levels

**Sample Response:**
```json
{
  "totalPredictions": 134937,
  "buySignals": 16629,
  "sellSignals": 39387,
  "holdSignals": 4297,
  "winRates": {
    "1H": 0.68,
    "4H": 0.71,
    "24H": 0.74,
    "7D": 0.65
  }
}
```

### 2. Recent Predictions
```
GET /api/ml/predictions
```
Get the latest ML predictions with confidence levels, signals, and supporting data.

**Sample Response:**
```json
{
  "predictions": [
    {
      "id": "pred_abc123",
      "asset": "BTC/USD",
      "signal": "BUY",
      "confidence": 0.87,
      "timeframe": "4H",
      "timestamp": "2026-02-02T10:00:00Z"
    }
  ]
}
```

### 3. Model Performance
```
GET /api/ml/performance
```
Historical performance metrics and accuracy tracking for the ML models.

**Sample Response:**
```json
{
  "accuracy": {
    "overall": 0.72,
    "1day": 0.75,
    "7day": 0.68,
    "30day": 0.71
  },
  "totalVerified": 100000
}
```

---

## Key Performance Metrics

| Metric | Value |
|--------|-------|
| Win Rate | 65-70% |
| Predictions Verified | 100,000+ |
| 1-Day Accuracy | Up to 75%+ |
| Data Updates | Real-time |

---

## Authentication

API access requires authentication via API key in the request headers:

```
Authorization: Bearer YOUR_API_KEY
X-API-Key: YOUR_API_KEY
```

---

## Rate Limits

| Tier | Requests/Min | Monthly Quota |
|------|-------------|---------------|
| Basic | 100 | 10,000 |
| Pro | 500 | 100,000 |
| Enterprise | Unlimited | Unlimited |

---

## Customer Onboarding

1. Customer submits request through Trust Layer Hub (/hub)
2. DarkWave team reviews and approves request
3. API credentials generated and sent securely
4. Customer receives onboarding documentation
5. Integration support provided as needed

---

## Contact

For API access requests or integration support:
- Trust Layer Hub: /hub (Pulse section)
- Contact: /contact

---

*Document created: February 2, 2026*
*Last updated: February 2, 2026*
