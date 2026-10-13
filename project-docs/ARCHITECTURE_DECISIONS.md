KUNA HOMESTAY ARCHITECTURE DECISIONS
=====================================

This file records important technical and business decisions for the project.

--- DECISION LOG ---

[DECISION-001] Framework Selection
Date: 2026-10-13
Subject: Full-stack framework for Kunja Homestay booking platform
Context: Need a modern, maintainable TypeScript-based architecture that supports SSR, SEO, and a good developer experience.
Selected Approach: Next.js 14 with App Router and TypeScript
Reason for Selection: 
  - App Router provides server components and middleware capabilities
  - Built-in TypeScript support with strict type checking
  - File-based routing system
  - API route handlers for backend functionality
  - Easy deployment on Vercel or other Node.js hosts
  - Strong ecosystem and documentation
Alternatives considered: 
  - Remix: Strong router, but different data fetching model
  - Full Express.js + React: More setup, less opinionated
  - Nuxt 3: Good but less familiar in TypeScript-first workflow
Consequences and trade-offs: 
  - Leverages React ecosystem fully
  - Learning curve for App Router vs Pages Router
  - Deployment flexibility (Vercel, traditional Node.js, GoDaddy/Hostinger)
Affected modules: Entire application
Decision status: FINAL

[DECISION-002] Database Technology
Date: 2026-10-13
Subject: Database selection for booking platform
Context: Requirements specify PostgreSQL with Prisma ORM for reliability and relations
Selected Approach: PostgreSQL with Prisma ORM and migrations
Reason for Selection:
  - Relational database with strong ACID guarantees for financial data
  - Prisma provides type-safe queries and migrations
  - PostgreSQL is widely supported on hosting plans (Heroku, Railway, Supabase, etc.)
  - JSONB support for flexible amenity/media data
  - Row-level security potential for admin/guest separation
Alternatives considered:
  - MongoDB: Document-based, less suitable for transactional booking/invoice data
  - MySQL: Viable but Prisma support and feature set slightly different
  - Supabase: PostgreSQL-backed but adds auth layer we'll manage separately
Consequences and trade-offs: 
  - Requires PostgreSQL hosting (managed service or VPS)
  - Migration learning curve for Prisma schema language
Affected modules: Database, schema, migrations, seed data
Decision status: FINAL

[DECISION-003] Room Inventory Model
Date: 2026-10-13
Subject: Physical rooms vs room-category quantity model
Context: Need to model room inventory that can be booked for date ranges
Selected Approach: Room-category based inventory with transactional allocation
  (Quantity-based: each RoomCategory has a quantity, bookings allocate from quantity)
Reason for Selection:
  - Simpler model for initial version
  - Sufficient for homestay with limited room categories per property
  - Transactional inventory holds prevent overbooking
  - Easier to implement and understand for owners
  - Can evolve to individually managed rooms later if needed
Alternatives considered:
  - Individually managed RoomUnit model: Each physical room has own ID/status
    - More granular but much more complex for availability logic
    - Better for "specific room assignment" scenarios
Consequences and trade-offs:
  - Cannot assign specific physical rooms to guests (beyond category)
  - Future: can add RoomUnit model alongside if needed
Affected modules: RoomCategory, Booking, InventoryHold models
Decision status: FINAL

[DECISION-004] Pricing Engine Location
Date: 2026-10-13
Subject: Where price calculations occur (frontend vs server)
Context: Pricing must be consistent across availability, booking, payment, and invoice
Selected Approach: Server-side pricing engine only
  All price calculations run on server; frontend displays server-provided values
Reason for Selection:
  - Prevents clients from manipulating prices
  - Single source of truth for taxes, discounts, totals
  - Enables consistent invoices/receipts generated from same data
  - Accommodates tax configuration changes after booking
Alternatives considered:
  - Frontend-only with server validation on submit
    - Risk of price manipulation between validation and submission
    - Poor user experience if prices change after quote
Consequences and trade-offs:
  - Frontend must request price quotes from server for every search
  - Slightly more network traffic but ensures correctness
Affected modules: All pricing displays, booking summary, payment amount, invoice generation
Decision status: FINAL

[DECISION-005] GST Invoice Configuration
Date: 2026-10-13
Subject: Tax invoice generation and configuration
Context: Indian hospitality business may need GST-compliant invoices
Selected Approach: 
  - Admin-configurable tax settings (GSTIN, rates, status)
  - Versioned tax snapshot preserved per booking
  - Separate invoice and receipt number sequences
  - Invoices only generated when business GST status is active and configured
  - Test/demo mode clearly identifies non-live tax configurations
Reason for Selection:
  - Business owner must verify GSTIN and rates before production
  - Bookings preserve the tax basis used at time of booking
  - Invoices are not falsely presented as legally valid without config
  - Receipts separate from tax invoices (payment confirmation vs tax document)
Alternatives considered:
  - Automatic GST calculation without admin configuration
    - Risk of incorrect tax rates being applied
    - Potential compliance issues
Consequences and trade-offs:
  - Admin must complete tax configuration before live bookings
  - Demo mode uses clearly identified test settings
Affected modules: Tax configuration, Invoice model, Booking model tax snapshot
Decision status: FINAL

[DECISION-006] Payment Gateway Integration
Date: 2026-10-13
Subject: Razorpay vs other payment providers
Context: Indian market requires local payment gateway support
Selected Approach: Razorpay with sandbox/test mode first
  Server-order creation + server signature verification + webhook verification
Reason for Selection:
  - Most popular Indian payment gateway
  - Supports UPI, cards, net banking, wallets
  - Well-documented server API with webhooks
  - Sandbox mode for demo/testing without real money
  - Supports INR currency natively
Alternatives considered:
  - PayU Money: Also Indian-focused but less API-friendly
  - Stripe: Available in India but different UX/local methods
  - Cashfree: Viable alternative but smaller ecosystem
Consequences and trade-offs:
  - Requires Razorpay account and sandbox credentials
  - Webhook endpoint must be publicly accessible (ngrok or deployed)
  - Demo mode uses simulated payment flow
Affected modules: Payment model, Webhook handler, Booking confirmation, Receipt generation
Decision status: FINAL

[DECISION-007] Inventory Hold Strategy
Date: 2026-10-13
Subject: How to temporarily hold rooms during booking flow
Context: Need to prevent overbooking when guest is completing payment
Selected Approach: Database-backed InventoryHold records with expiration
  - Create hold when guest starts checkout
  - Hold has start/end dates and expiration timestamp
  - Recheck availability before confirming booking
  - Release expired holds automatically
  - Hold associated with checkout session/booking ID
Reason for Selection:
  - Transactional database protection against overbooking
  - Automatic release prevents permanent inventory lock
  - Can handle simultaneous booking attempts
  - Clear audit trail for holds
Alternatives considered:
  - Redis-based holds: Faster but adds infrastructure complexity
    - Cache invalidation risks if Redis and DB get out of sync
  - Frontend-only holding (localStorage, etc.)
    - No security; anyone can clear hold and book
Consequences and trade-offs:
  - Additional database writes for holds
  - Hold cleanup job or TTL-based expiration
Affected modules: InventoryHold model, Booking creation, Checkout flow
Decision status: FINAL

[DECISION-008] Admin Authentication
Date: 2026-10-13
Subject: How to authenticate administrators
Context: Admin dashboard needs secure access control
Selected Approach: 
  - Simple admin credentials (username/password) stored in database
  - Session-based authentication with secure cookies
  - Rate limiting on login endpoint
  - No third-party OAuth for initial version
Reason for Selection:
  - Owner-controlled credentials (can change via dashboard)
  - Simpler than integrating Google/Auth0 for homestay owners
  - Full control over admin accounts
  - Can add role-based permissions later
Alternatives considered:
  - Embedded admin URL security (security through obscurity)
    - Discouraged by security best practices
  - Third-party OAuth providers
    - Adds complexity and owner dependency
Consequences and trade-offs:
  - Owners must remember admin credentials
  - Lost credentials require database reset or recovery flow
Affected modules: Admin routes, Authentication API, Session management
Decision status: FINAL

[DECISION-009] Date and Timezone Handling
Date: 2026-10-13
Subject: Business timezone and date presentation
Context: Bolpur–Shantiniketan, India; Asia/Kolkata timezone
Selected Approach: 
  - All business date checks use Asia/Kolkata timezone
  - Guest-facing dates presented in Indian format (DD MMMM YYYY)
  - ISO strings stored in database
  - Check-in as arrival, check-out as departure (occupies nights from check-in to check-out excluding check-out)
Reason for Selection:
  - Consistent business rules across all date-sensitive operations
  - Local presentation for Indian guests
  - Clear overlap checking with timezone-aware comparisons
Alternatives considered:
  - UTC-only handling with client conversion
    - Confusion for guests selecting dates
    - Day boundary issues for overnight stays
Consequences and trade-offs:
  - Must convert guest-selected dates to Asia/Kolkata for validation
Affected modules: Availability validation, Booking model, Checkout flow
Decision status: FINAL

[DECISION-010] Demo Mode Implementation
Date: 2026-10-13
Subject: How to handle demo vs production mode
Context: Application must work as demonstration before live activation
Selected Approach: 
  - Demo-mode toggle via environment variable
  - Clearly labelled DEMO badge/banner throughout
  - Simulated payment flow (never real transactions in demo mode)
  - Test/sample data identified as demo, not real
  - Test tax settings clearly marked as illustrative
  - Real payments only when demo-mode is disabled AND payment config present
Reason for Selection:
  - Allows testing complete workflow without real money
  - Owner can show the system to stakeholders without risk
  - Clear visual distinction between demo and production
  - Switching to production requires config change, not rewrite
Alternatives considered:
  - Separate demo and production codebases
    - Drift between versions, different features
  - Feature flags per-functionality
    - More complex, easier to leave insecure paths open
Consequences and trade-offs:
  - Must carefully guard all production-dependent operations
  - Demo mode must not accept real payments under any circumstances
Affected modules: Payment processing, Booking confirmation, Tax configuration, Environment checks
Decision status: FINAL

--- AFFECTED MODULES SUMMARY ---
- Database schema and models
- API route handlers
- Frontend components and pages
- Environment configuration
- Security and authentication
- Payment and invoice generation
- Admin dashboard functionality

--- DECISION STATUS KEY ---
FINAL = Settled, will not be changed without significant reason and full re-evaluation
PROVISIONAL = Can be adjusted as requirements clarify
EXPERIMENTAL = Being tested, may be replaced