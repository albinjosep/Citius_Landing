# Citius - AI-Native Sales Agency Landing Page

## Problem Statement
Landing page for validating and collecting early signups for Citius, an AI-Native Sales Agency that replaces traditional SDR teams with AI-powered sales pipelines.

## Architecture
- **Backend**: FastAPI + MongoDB (waitlist collection)
- **Frontend**: React + TailwindCSS + Shadcn UI
- **Design**: Swiss & High-Contrast (Outfit + IBM Plex Sans + JetBrains Mono)

## User Personas
- B2B Sales Leaders, VPs of Sales, Founders evaluating AI sales solutions

## Core Requirements
- Email-only waitlist signup with duplicate detection
- YC-style landing page: clear value prop, social proof, urgency
- Sections: Hero, How It Works, Pricing Comparison, Testimonials, FAQ, Final CTA

## What's Been Implemented (Dec 2025)
- Full landing page with all 7 sections
- Backend: POST /api/waitlist, GET /api/waitlist/count with duplicate email check
- Frontend: Responsive design, Shadcn Accordion for FAQ, waitlist counter with social proof seed
- Smooth scroll navigation, mobile-responsive navbar
- All tests passing (100% backend, 100% frontend)

## Prioritized Backlog
- P0: None (MVP complete)
- P1: Email notification on new signup (SendGrid), Admin dashboard to view signups
- P2: A/B test different hero headlines, Analytics/conversion tracking, Export waitlist to CSV

## Next Tasks
- Integrate email notification service for new signups
- Build admin panel to view/export waitlist entries
- Add meta tags and Open Graph for social sharing
