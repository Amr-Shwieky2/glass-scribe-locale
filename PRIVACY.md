# Privacy & Data Documentation

## Overview

This document describes the personal data handling practices for the Shwaki Brothers Glassworks website, in compliance with the Israeli Protection of Privacy Law (5741-1981).

**Privacy Contact Email:** privacy@shwakiglassworks.com

## 1. Data Collection

### What We Collect

When a user submits the contact form, we collect:

| Field | Required | Purpose | Max Length |
|-------|----------|---------|------------|
| Name | Yes | Identify the customer | 100 chars |
| Email | Yes | Contact the customer | 254 chars |
| Phone | Yes | Contact the customer | 20 chars |
| Service | No | Understand the inquiry type | 100 chars |
| Message | Yes | Customer's inquiry details | 1000 chars |

### What We Do NOT Collect

- IP addresses (not stored)
- Browser fingerprints
- Location data
- Personal demographics
- Financial information
- User accounts/passwords

## 2. Data Transmission

### Contact Form Flow

```
[User Browser] 
    ↓ HTTPS (encrypted)
[Vercel Serverless Function] 
    ↓ HTTPS (encrypted)
[Telegram Bot API]
    ↓
[Business Owner's Telegram]
```

### Security Measures

1. **HTTPS Encryption**: All data in transit is encrypted using TLS 1.3
2. **Input Sanitization**: All user inputs are sanitized to prevent XSS/injection
3. **Rate Limiting**: 5 requests per minute per IP to prevent abuse
4. **Honeypot Protection**: Hidden field to catch automated bots
5. **Environment Variables**: API tokens stored securely, never exposed in client code

## 3. Data Storage

### Where Data is Stored

| Location | Data | Retention |
|----------|------|-----------|
| Telegram | Contact form messages | Until manually deleted by owner |
| Browser localStorage | Language preference | Until user clears browser data |
| Browser localStorage | Accessibility settings | Until user clears browser data |
| Browser localStorage | Cookie consent choice | Until user clears browser data |

### What is NOT Stored

- We do not maintain a database of customer information
- Messages are only stored in the business owner's Telegram
- No data is stored on our servers (serverless functions are stateless)

## 4. Data Deletion

### How to Request Deletion

Users can request deletion of their data by:

1. **Email**: Send request to the business email
2. **Phone**: Call the business phone number
3. **Contact Form**: Submit a deletion request

### Deletion Process

1. User submits deletion request
2. Business owner locates messages in Telegram
3. Messages are deleted from Telegram history
4. Confirmation sent to user within 30 days

### What Can Be Deleted

- Contact form messages sent to Telegram
- Any other personal data the user has shared

### What Cannot Be Deleted

- Anonymous analytics data (no personal identifiers)
- Browser localStorage data (user must clear manually)

## 5. Third-Party Services

### Telegram

- **Purpose**: Receive contact form submissions
- **Data Sent**: Name, email, phone, service, message
- **Privacy Policy**: https://telegram.org/privacy
- **Location**: Cloud-based (international)

### Plausible Analytics (Optional)

- **Purpose**: Anonymous website usage statistics
- **Data Collected**: Page views, referrers, device type (anonymized)
- **No Cookies**: Does not use cookies
- **No Personal Data**: Does not collect IP addresses or personal identifiers
- **Privacy Policy**: https://plausible.io/privacy
- **Location**: EU (GDPR compliant)

### Cloudinary

- **Purpose**: Image hosting and delivery
- **Data**: Product/project images only (no personal data)
- **Privacy Policy**: https://cloudinary.com/privacy

### Vercel

- **Purpose**: Website hosting
- **Data**: Request logs (anonymized)
- **Privacy Policy**: https://vercel.com/legal/privacy-policy

## 6. Cookies & Local Storage

### Essential (Always Active)

| Name | Purpose | Type |
|------|---------|------|
| Language preference | Remember user's language choice | localStorage |
| Accessibility settings | Remember accessibility preferences | localStorage |
| Cookie consent | Remember consent choice | localStorage |

### Analytics (User Choice)

| Name | Purpose | Type |
|------|---------|------|
| None | Plausible is cookieless | N/A |

## 7. User Rights (Israeli Privacy Law)

Under the Protection of Privacy Law, users have the right to:

1. **Access**: Request a copy of their personal data
2. **Correction**: Request correction of inaccurate data
3. **Deletion**: Request deletion of their data
4. **Object**: Object to processing of their data

### How to Exercise Rights

Contact the business via:
- Phone: Listed on website
- Email: Listed on website
- Contact Form: Submit through website

Response time: Within 30 days

## 8. Security Measures Summary

| Measure | Implementation |
|---------|---------------|
| Encryption | HTTPS/TLS 1.3 on all pages |
| XSS Prevention | Input sanitization |
| CSRF Prevention | Serverless architecture |
| Rate Limiting | 5 requests/minute/IP |
| Bot Prevention | Honeypot field |
| Token Security | Environment variables |
| Content Security | Security headers in HTML |

## 9. Compliance Checklist

### Israeli Privacy Law (5741-1981)

- [x] Minimum data collection
- [x] Clear purpose of collection
- [x] User consent before submission
- [x] Right to access data
- [x] Right to delete data
- [x] Secure data transmission
- [x] Privacy policy available

### Website Standards

- [x] HTTPS everywhere
- [x] Cookie consent banner
- [x] Privacy policy page
- [x] Contact information visible
- [x] Accessibility features

## 10. Updates

This documentation was last updated: March 2026

Any changes to data handling practices will be reflected in:
1. This documentation
2. The Privacy Policy page on the website
3. The Cookie Consent notice

---

## Contact

For privacy-related inquiries:
- See contact information on the website
- Response within 30 days
