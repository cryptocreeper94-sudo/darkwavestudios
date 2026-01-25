# ORBIT Financial Integration - DarkWave Studios

## Overview

DarkWave Studios is integrated with ORBIT Staffing for financial tracking, bookkeeping, and 1099 contractor management. All transactions are automatically synced to ORBIT for centralized financial reporting.

## Connection Status

- **App Name**: DarkWave Studios
- **Revenue Split**: 100% Jason (no partner split)
- **Sync Method**: Auto-push on payment completion + manual sync endpoints
- **Environment**: Using dev URL (production credentials pending)

## Automatic Payment Sync

When a payment is completed via Stripe or Coinbase Commerce, it is automatically pushed to ORBIT:

### Stripe Flow
1. Customer completes checkout → Stripe sends webhook
2. `checkout.session.completed` event triggers
3. Payment status updated to "completed" in local DB
4. Payment synced to ORBIT via `syncPaymentToOrbit()`

### Coinbase Flow
1. Customer completes crypto payment → Coinbase sends webhook
2. `charge:confirmed` or `charge:resolved` event triggers
3. Payment status updated to "completed" in local DB
4. Payment synced to ORBIT via `syncPaymentToOrbit()`

## API Endpoints

### Financial Statement
```
GET /api/orbit/financial-statement?period=2026-01
Headers: X-Admin-Key: darkwave-admin-2024
```

Returns monthly financial statement from ORBIT including:
- Total revenue
- Transaction list
- Owner distribution
- Contractor payments
- Blockchain anchor (if stamped)

### Contractor Payment (1099 Tracking)
```
POST /api/orbit/contractor-payment
Headers: 
  Content-Type: application/json
  X-Admin-Key: darkwave-admin-2024

Body:
{
  "payeeId": "contractor-uuid",
  "payeeName": "John Developer",
  "payeeEmail": "john@example.com",
  "amount": 500.00,
  "description": "Code contribution - Trust Layer feature",
  "category": "contractor-services"
}
```

Returns:
- Payment ID
- YTD total for contractor
- Whether 1099 form is required ($600+ threshold)

### Manual Payment Sync
```
POST /api/orbit/sync-payment/:paymentId
Headers: X-Admin-Key: darkwave-admin-2024
```

Manually sync a specific payment to ORBIT.

### Bulk Payment Sync
```
POST /api/orbit/sync-all-payments
Headers: X-Admin-Key: darkwave-admin-2024
```

Sync all completed payments to ORBIT. Returns count of synced/failed.

## Transaction Data Format

DarkWave sends the following data to ORBIT for each transaction:

```json
{
  "transactionId": "stripe_pi_xxx",
  "type": "subscription" | "payment",
  "amount": 199.00,
  "currency": "USD",
  "sourceApp": "DarkWave Studios",
  "productName": "Growth Plan",
  "customerEmail": "customer@example.com",
  "customerName": "Customer Name",
  "paymentMethod": "stripe" | "coinbase",
  "stripePaymentIntentId": "pi_xxx",
  "coinbaseChargeId": "xxx",
  "metadata": {
    "planType": "growth",
    "internalPaymentId": "uuid"
  },
  "timestamp": "2026-01-25T12:00:00Z"
}
```

## Account Mapping

Transactions are auto-categorized in ORBIT:
- Revenue: "ecosystem-app-revenue"
- Subscriptions: "saas-subscriptions" 
- Projects: "custom-development"
- Contractor payments: "1099-contractor-expense"

## Service Plans

| Plan Type | Name | Price |
|-----------|------|-------|
| starter | Starter Plan | $99/mo |
| growth | Growth Plan | $199/mo |
| scale | Scale Plan | $399/mo |
| custom_landing | Custom Landing Page | $997 |
| custom_business | Business Website | $1,997 |
| custom_ecommerce | E-Commerce Platform | $3,997 |
| custom_saas | SaaS Application | $4,997 |

## Files

- `server/orbitClient.ts` - ORBIT API client with financial sync methods
- `server/webhookHandlers.ts` - Stripe webhook handler with ORBIT sync
- `server/routes.ts` - Financial sync API endpoints

## Pending

- [ ] Production credentials sync on ORBIT side
- [ ] Financial dashboard UI in Trust Layer Hub
- [ ] Automated monthly statement generation
