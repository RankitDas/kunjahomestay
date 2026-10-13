KUNA HOMESTAY NEXT SESSION HANDOFF
==================================

This file is the explicit handoff document for the next AI coding session.

--- 1. WHAT IS THIS PROJECT?
Kunja Homestay is a full-stack hospitality booking platform for a two-property homestay business in Bolpur–Shantiniketan, West Bengal, India. The platform allows guests to discover properties, search room availability by dates, make reservations, complete payments, and download PDF receipts and GST invoices. Administrators have a secure dashboard to manage properties, rooms, bookings, payments, guests, and reporting.

--- 2. INTENDED FINAL RESULT
A complete, production-oriented booking website that is responsive (mobile/tablet/desktop), secure, and deployable on compatible GoDaddy or Hostinger hosting. The system must handle property discovery, room availability, booking workflow with inventory management, payment processing (Razorpay sandbox/demo mode initially), PDF payment receipt generation, and GST-compliant tax invoice generation. All booking and financial data must be stored in a PostgreSQL database with Prisma ORM. The application must support a demo mode with sample data before live activation.

--- 3. CURRENT REPOSITORY STATE
- Project directory: C:\Users\ranki\Downloads\kunjahomestay
- Initialized with: npm init (package.json created)
- Core dependencies installed: next@14.2.4, react@18.3.1, react-dom@18.3.1, typescript@5.5.3, tailwindcss@3.4.7, postcss@8.4.38, autoprefixer@10.4.3, prisma@5.22.0, @prisma/client@5.22.0, eslint@8.57.0
- Configuration files created: tailwind.config.ts, postcss.config.mjs, tsconfig.json, next.config.mjs, prisma/config.ts
- Project documentation created in project-docs/ directory:
  - PROJECT_STATE.md (CP-003) - project status and checkpoint
  - IMPLEMENTATION_LOG.md (CP-001 through CP-003) - implementation chronology
  - FEATURE_MATRIX.md - complete feature checklist with statuses
  - ARCHITECTURE_DECISIONS.md - recorded architectural decisions (DECISION-001 through DECISION-007)
  - KNOWN_ISSUES.md - tracked bugs and open issues (ISSUE-001 through ISSUE-010)
  - DATABASE_AND_MIGRATION_STATE.md - data model and migration record
  - RUNBOOK.md - operational guide for development/deployment
  - NEXT_SESSION_HANDOFF.md - this file (being created)
- Source code present:
  - src/app/page.tsx (complete homepage with all 10 sections, Bengali terracotta theming)
  - src/app/layout.tsx (metadata and Font integration)
  - src/app/globals.css (terracotta palette, custom utilities)
  - src/components/ui/facility-card.tsx, amenity-card.tsx, view-details-button.tsx
- Git initialized for version control
- Prisma schema: prisma/schema.prisma (created with full 28-model data model, validated with errors remaining)
- Seed data: prisma/seed.ts (created with demo data for 2 properties, 7 room categories, 7 amenities)
- No Prisma client directory yet (prisma/client/ not created - generation has 6 remaining validation errors)
- API routes: not yet created
- Frontend: complete and functional independent of database

--- 4. ARCHITECTURE SELECTED
- Framework: Next.js 14 with App Router
- Language: TypeScript (strict mode)
- Styling: Tailwind CSS with custom Bengali terracotta color palette
- Icons: Lucide React
- Database: PostgreSQL with Prisma ORM and migrations
- ORM Client: @prisma/client
- Architecture: Server-side rendering with API routes for backend logic
- Key design decisions (see ARCHITECTURE_DECISIONS.md):
  - DECISION-001: Next.js App Router + TypeScript
  - DECISION-002: PostgreSQL + Prisma
  - DECISION-003: Room-category based inventory model
  - DECISION-004: Server-side pricing engine only
  - DECISION-005: Configurable GST with versioned snapshots per booking
  - DECISION-006: Razorpay sandbox first, then production
  - DECISION-007: Database-backed InventoryHold with expiration
  - DECISION-008: Admin credentials in database (not hidden URL)
  - DECISION-009: Asia/Kolkata timezone for all business logic
  - DECISION-010: Demo mode with toggle and clear DEMO badge

--- 5. WHICH DEVELOPMENT PHASE IS ACTIVE?
Phase 1 - Foundation
  - Last completed task: Created project-docs/ checkpoint files and project initialization
  - Current phase tasks: Set up Prisma ORM, define database schema, create seed data
  - Next phase: Phase 2 - Properties and Rooms (property pages, room categories, amenities)

--- 6. WHAT WORK WAS COMPLETED MOST RECENTLY?
- Created project-directory and initialized npm project
- Installed core dependencies (next, react, typescript, tailwind, etc.)
- Created all required project documentation files in project-docs/
- Established checkpoint system (PROJECT_STATE.md, IMPLEMENTATION_LOG.md, etc.)
- Configured Tailwind CSS with custom color palette inspired by Bengali terracotta
- Created package.json with scripts for development, build, and testing

--- 7. WHICH FILES AND MODULES ARE CURRENTLY RELEVANT?
- Root level: package.json, tailwind.config.ts, postcss.config.mjs, tsconfig.json, next.config.mjs
- project-docs/ directory: All documentation files (8 files)
- No source code modules yet (to be created in subsequent phases)
- Prisma schema: to be created at prisma/schema.prisma
- Seed data: to be created at prisma/seed.ts
- Frontend: to be created under src/app/ and src/components/
- API routes: to be created under src/app/api/ or src/pages/api/

--- 8. WHAT TESTS HAVE PASSED OR FAILED?
No tests have been executed yet (no test files exist).
- Unit tests: Not applicable (no code yet)
- Integration tests: Not applicable (no code yet)
- End-to-end tests: Not applicable (no code yet)
- Build test: Project initializes successfully; no type errors expected with current config
- Lint test: Not configured yet

--- 9. WHICH KNOWN ISSUES REMAIN?
All issues in KNOWN_ISSUES.md are currently OPEN:
- ISSUE-001: Date selection timezone handling (Asia/Kolkata)
- ISSUE-002: Overbooking protection in concurrent bookings
- ISSUE-003: Payment webhook security (Razorpay signature verification)
- ISSUE-004: GST invoice configuration for demo mode
- ISSUE-005: Admin authentication credential management
- ISSUE-006: Media upload storage backend (placeholder approach v1)
- ISSUE-007: CSV export data integrity (collected vs booked revenue)
- ISSUE-008: Booking reference unpredictability (opaque references)
- ISSUE-009: Form validation completeness
- ISSUE-010: Mobile date picker accessibility

--- 10. WHICH CONFIGURATION OR EXTERNAL SERVICES ARE MISSING?
- PostgreSQL database (connection string needed for prisma)
- Razorpay sandbox account (test credentials for payment sandbox)
- SMTP email provider (optional, for confirmations)
- Cloud storage for media (S3/Cloudinary, for future uploads)
- Google Maps coordinates (for property location embedding)
- Admin account credentials (to be created during seed data setup)
- GST configuration (to be set by business owner/accountant)

--- 11. WHAT EXACT TASK SHOULD BE PERFORMED NEXT?
Set up Prisma ORM and define the initial database schema.

Specific task: 
1. Create Prisma schema file at prisma/schema.prisma with the following models: Property, RoomCategory, Amenity, Guest, Booking, BookingItem, InventoryHold, Payment, Invoice, Receipt, FoodOption, AdminUser, RatePlan, RoomMedia
2. Initialize Prisma migration directory: npx prisma migrate init (if not auto-created)
3. Create first migration that sets up all tables
4. Generate Prisma client: npx prisma generate
5. Create seed data script at prisma/seed.ts that creates:
   - Two demo properties (Location A and Location B)
   - Sample room categories (AC and Non-AC) for each property
   - Example amenities (Wi-Fi, attached bathroom, AC, hot water, TV, parking)
   - Demo guest record
   - Demo administrator account with hashed password
6. Run migrations to create the database
7. Seed the database with demo data
8. Verify the application can start and connect to the database

Verification criteria for next task:
- Prisma schema validates without errors
- Prisma client generates successfully
- Database migration creates all tables
- Seed data runs without errors
- Application starts with `npm run dev` without crashes
- Database contains demo properties and room categories

--- 12. HOW SHOULD THAT TASK BE VERIFIED?
Run the following commands and verify successful completion:
- npx prisma schema validate (should report no errors)
- npx prisma migrate make --name init (or: check migration files exist)
- npx prisma generate (should create prisma/client directory)
- npm run seed (or: node prisma/seed.js) - should complete without errors
- npm run dev - application starts without crashes
- Check Prisma Studio: http://localhost:5555 should show tables and demo data

--- 13. WHAT MUST NOT BE MODIFIED OR BROKEN?
- Project documentation files in project-dogs/ directory must remain synchronized with implementation
- All architectural decisions in ARCHITECTURE_DECISIONS.md should be preserved unless explicitly changed with documentation update
- Demo mode must remain functional and clearly labelled
- No production secrets should be committed or added to .env
- TypeScript strict mode should remain enabled
- Asia/Kolkata timezone handling for all date-sensitive business rules
- Server-side pricing engine (no client-side price manipulation)

--- 14. WHICH DOCUMENTS MUST THE AGENT READ BEFORE EDITING FILES?
Before editing any files, the next coding agent MUST read these documents in order:
1. project-docs/NEXT_SESSION_HANDOFF.md (this file)
2. project-docs/PROJECT_STATE.md (current project status)
3. project-docs/IMPLEMENTATION_LOG.md (implementation chronology, most recent: CP-001)
4. project-docs/FEATURE_MATRIX.md (feature checklist - focus on Phase 1 items)
5. project-docs/ARCHITECTURE_DECISIONS.md (architectural decisions)
6. project-docs/KNOWN_ISSUES.md (known bugs and open issues)

--- EXACT NEXT ACTION
Set up Prisma ORM and define the initial database schema.

Task: Create prisma/schema.prisma with all required models (Property, RoomCategory, Amenity, Guest, Booking, BookingItem, InventoryHold, Payment, Invoice, Receipt, FoodOption, AdminUser, RatePlan, RoomMedia), initialize Prisma migration directory, generate Prisma client, and create seed data script for demo properties.

Commands to run:
1. mkdir prisma
2. Create prisma/schema.prisma with full data model
3. npx prisma migrate init (if needed)
4. npx prisma generate
5. Create prisma/seed.ts with demo data
6. Run npx prisma migrate dev --name init to apply migrations
7. Run npm run seed to load demo data
8. Verify npm run dev works

The next coder should begin immediately with task 1: Create the Prisma schema file.