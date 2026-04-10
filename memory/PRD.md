# Citius - AI-Native Sales Agency Landing Page

## Problem Statement
Landing page for validating and collecting early signups for Citius, an AI-Native Sales Agency targeting DevTools startups. Signal-driven outbound with AI-powered personalization.

## Architecture
- **Backend**: FastAPI + MongoDB (waitlist collection)
- **Frontend**: React + TailwindCSS + Shadcn UI
- **Design**: Swiss & High-Contrast (Outfit + IBM Plex Sans + JetBrains Mono, accent #002FA7)

## User Personas
- Technical founders at DevTools/Infrastructure startups
- B2B Sales Leaders, VPs of Sales evaluating AI sales solutions

## Core Requirements
- Email-only waitlist signup with duplicate detection
- YC-style landing page with product-forward dashboard mockup
- Sections: Hero + Dashboard Mockup, How It Works (3 steps), Results (metrics + testimonials), Before vs After, FAQ, Final CTA

## What's Been Implemented (Dec 2025)
- Full landing page matching user's exact design with all 7 sections
- Dashboard mockup showing campaigns, stats, prospect table
- Backend: POST /api/waitlist, GET /api/waitlist/count
- Shadcn Accordion for FAQ, responsive nav with smooth scroll offset
- All tests passing (100% backend, 100% frontend)

## Prioritized Backlog
- P0: None (MVP complete)
- P1: Email notification on new signup (SendGrid), Admin dashboard
- P2: A/B testing headlines, Analytics/conversion tracking, CSV export

## Next Tasks
- Integrate email notification service
- Build admin panel for waitlist management
- Add OG meta tags for social sharing
