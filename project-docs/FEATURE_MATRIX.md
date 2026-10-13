KUNA HOMESTAY FEATURE MATRIX
============================

This file tracks the complete feature checklist for the application.

--- HOMEPAGE AND BRAND DESIGN ---
[ ] Homepage with Bengali terracotta-inspired design
[ ] Two separate location cards (Location A, Location B)
[ ] Navigation bar with all required links
[ ] Hero section with property selection
[ ] Main booking search component
[ ] Property overview cards
[ ] Room highlight cards with placeholders
[ ] Food and hospitality section
[ ] Amenities section
[ ] Location and navigation section with maps
[ ] About and contact section
[ ] Footer with policies and copyright

--- PROPERTY AND ROOM MANAGEMENT ---
[ ] Property A management (edit details, photos, policies)
[ ] Property B management (edit details, photos, policies)
[ ] Room category AC/Non-AC filtering
[ ] Single/double/family occupancy configurations
[ ] Room inventory quantity management
[ ] Base rate and extra-person charge configuration
[ ] Amenity management (many-to-many)
[ ] Room media placeholders and future uploads
[ ] Seasonal/date-specific pricing

--- PRICING AND GST CALCULATION ---
[ ] Centralized pricing engine (server-side)
[ ] Room price per night calculation
[ ] Number of nights computation
[ ] Number of rooms multiplication
[ ] Extra-person charges
[ ] Meal charges configuration
[ ] Applicable discounts
[ ] GST/applicable tax calculation
[ ] Final payable total
[ ] Price breakdown display before booking confirmation
[ ] GST configuration (GSTIN, tax rates, place-of-supply)
[ ] Tax-inclusive or tax-exclusive display mode
[ ] Versioned tax configuration for booking-invoice consistency
[ ] Distinction between payment receipt and tax invoice

--- LIVE AVAILABILITY AND INVENTORY MANAGEMENT ---
[ ] Date-based availability search
[ ] Room inventory fetching per property
[ ] Exclusion of inactive/administratively blocked rooms
[ ] Overlapping reservation checking
[ ] Active booking hold accounting
[ ] Per-category availability calculation
[ ] Availability messages from real inventory: Available/1 remaining/Sold out/Temporarily unavailable
[ ] Date handling: check-in as arrival, check-out as departure (occupies nights from check-in to check-out excluding check-out)
[ ] Asia/Kolkata timezone for date-sensitive rules
[ ] Concurrency/overbooking protection with transactional validation
[ ] Inventory hold with expiration and release
[ ] Recheck availability before confirmation
[ ] Simultaneous booking attempt safety

--- BOOKING WORKFLOW ---
[ ] Step 1: Choose property (Location A or B)
[ ] Step 2: Choose dates and occupancy
[ ] Step 3: Browse rooms with availability/pricing
[ ] Step 4: Select room category and quantity
[ ] Step 5: Enter guest details (name, email, phone, guest count)
[ ] Step 6: Review booking with full price breakdown
[ ] Step 7: Payment (Razorpay simulated + real sandbox)
[ ] Step 8: Booking confirmation with unique reference
[ ] Step 9: Confirmation notification (email)
[ ] Guest booking lookup with reference + email/phone verification
[ ] Rate limiting on booking lookup
[ ] No exposure of sequential booking IDs

--- PDF RECEIPTS AND GST INVOICES ---
[ ] Server-side PDF generation module
[ ] Payment receipt with branding, receipt number, booking reference
[ ] Guest name, email, phone
[ ] Property name and address
[ ] Room category and quantity
[ ] Check-in/check-out dates, number of nights
[ ] Payment date, payment method, gateway transaction reference
[ ] Amount paid, total booking amount, outstanding balance
[ ] Currency (INR), status, authorized contact details
[ ] GST tax invoice with legally required information
[ ] Legal supplier name and address
[ ] GSTIN where applicable
[ ] Unique sequential invoice number
[ ] Invoice date
[ ] Recipient/customer details
[ ] Description of accommodation/services
[ ] Taxable value and classification
[ ] Applicable tax rate and amount
[ ] Total invoice amount
[ ] Place-of-supply details
[ ] Separate invoice and receipt number sequences
[ ] PDF stored against booking/payment record
[ ] Audit trail for corrected/cancelled/credited documents
[ ] Never delete issued invoice on booking cancellation
[ ] PDF preview/download in demo
[ ] Clearly identified test settings for invoices (not falsely presented as live)

--- GUEST BOOKING LOOKUP ---
[ ] "Find My Booking" page
[ ] Secure lookup with booking reference + email or phone verification
[ ] No guessing sequential booking IDs (randomized/opaque references)
[ ] Display only required guest information
[ ] View booking details, payment status
[ ] Download available receipts and invoices
[ ] Review cancellation policy
[ ] Cancellation/contact request per policy
[ ] Rate limiting to prevent brute-force lookups

--- ADMIN DASHBOARD ---
[ ] Secure administrator authentication
[ ] Dashboard at /admin
[ ] Overview cards: today's arrivals, departures, occupancy, rooms available
[ ] Current occupancy, upcoming bookings
[ ] Pending and completed payments
[ ] Cancellation requests
[ ] Revenue by period (confirmed, collected, refunds, outstanding, cancelled)
[ ] Property management (edit details, policies, activate/deactivate)
[ ] Room management (add/edit, assign to property, capacity, rates, amenities, inactive, photos/videos)
[ ] Availability calendar per property/room-category
[ ] Block inventory for maintenance/owner use (soft delete for historical records)
[ ] Booking management (search by reference, guest name/phone/email, filter by property/dates/status)
[ ] Record offline payments with audit info
[ ] Review cancellation requests
[ ] Booking modifications without losing history
[ ] View/download receipts and invoices
[ ] Pricing and tax settings (base rates, seasonal, weekend, date-specific, extras, meals, discounts, tax config, invoice numbering)
[ ] Guest management (view booking history, update contact/billing)
[ ] Reports and CSV exports (bookings by property, occupancy by date, revenue by date, room-category performance, payment method/status, outstanding, refunds, cancellation stats, tax/invoice summaries)
[ ] CSV export with source data, date range, payment-status filters, clear identification of collected vs booked totals
[ ] Administrative audit logs (property changes, room inventory/rate changes, booking modifications, payment-status changes, manual payments, invoice issuance/corrections, cancellations/refunds, account/permission changes)
[ ] Actor, action, timestamp, affected record, before/after values (no secrets/payment info)

--- AUTHENTICATION AND AUTHORIZATION ---
[ ] Public users: browse without account, create reservations, retrieve bookings via verification
[ ] No account creation forced unless genuine business requirement
[ ] Admin users: protected routes and API endpoints
[ ] Secure password hashing
[ ] Secure session cookies
[ ] CSRF protection
[ ] Login rate limiting
[ ] Logout and session expiry
[ ] Password reset/recovery
[ ] Role-based permissions (if multiple roles)
[ ] Server-side authorization on every protected operation
[ ] No hidden admin URL as security mechanism
[ ] No embedded secrets in frontend code

--- SECURITY AND PRIVACY ---
[ ] Server-side validation of all inputs
[ ] Parameterized database queries through ORM
[ ] SQL injection protection
[ ] XSS protection
[ ] CSRF protection where appropriate
[ ] Rate limiting on sensitive endpoints
[ ] Strict authorization checks
[ ] Secure HTTP headers
[ ] Secure session handling
[ ] File-upload validation (MIME types, size limits)
[ ] Safe file names and unique storage keys
[ ] No execution of uploaded files
[ ] Server-side monetary calculations only
[ ] Verified payment webhooks
[ ] Idempotent financial operations
[ ] Safe error messages (no stack traces/secrets)
[ ] Logging that excludes credentials/payment secrets
[ ] HTTPS in production
[ ] Environment-variable management
[ ] Secure backup and recovery procedures
[ ] No raw card info or CVV storage
[ ] .env.example with safe placeholders only
[ ] Validate required env vars at startup
[ ] Production fails safely when essential config missing
[ ] Privacy, retention, and deletion policies
[ ] Collect only necessary guest data
[ ] Limit administrative access
[ ] No exposure of one guest's booking to another

--- MEDIA UPLOADS AND STORAGE READINESS ---
[ ] Admin-only uploads
[ ] Image and video MIME validation
[ ] File-size limits
[ ] Safe file names and unique storage keys
[ ] No execution of uploaded files
[ ] Image optimization for web
[ ] Responsive image delivery
[ ] Video duration and file-size policies
[ ] Media ordering and primary-image selection
[ ] Safe deletion without breaking historical data
[ ] Absence of media does not prevent other functionality

--- USER EXPERIENCE AND ACCESSIBILITY ---
[ ] Responsive design (mobile to desktop)
[ ] Readable typography
[ ] Large, comfortable buttons
[ ] Clear labels and form instructions
[ ] Visible keyboard focus
[ ] Proper semantic HTML
[ ] Accessible labels for inputs and controls
[ ] Useful empty states
[ ] Clear error messages
[ ] Loading indicators
[ ] Confirmation messages
[ ] Confirmation dialogs for destructive actions
[ ] Friendly network-error handling
[ ] Consistent date/currency formatting
[ ] No horizontal overflow on mobile
[ ] No essential info communicated only through color
[ ] Indian date presentation
[ ] ₹ for INR
[ ] Asia/Kolkata for business date/time rules
[ ] Consistent booking reference and invoice number format
[ ] Most important booking flow usable without multiple pages/dialogs

--- SEO AND PERFORMANCE ---
[ ] Page-specific metadata (titles, descriptions)
[ ] Open Graph metadata
[ ] Canonical URLs
[ ] Sitemap
[ ] Robots configuration
[ ] Clean URLs for properties and room pages
[ ] Structured data (where business qualifies)
[ ] Appropriate image alt text
[ ] Responsive media loading
[ ] Lazy loading for non-critical imagery
[ ] Optimized fonts
[ ] Caching for suitable public content
[ ] Never cache private guest records/payment details/availability results incorrectly
[ ] Availability/reservation operations consult authoritative data
[ ] No fabricated reviews, ratings, testimonials, awards, or structured-data claims

--- API ARCHITECTURE ---
[ ] List properties endpoint
[ ] Get property details endpoint
[ ] List room categories endpoint
[ ] Search availability endpoint
[ ] Retrieve rate quotes endpoint
[ ] Create temporary inventory hold endpoint
[ ] Create booking endpoint
[ ] Start payment endpoint
[ ] Verify payment endpoint
[ ] Receive payment webhooks endpoint
[ ] Retrieve booking securely endpoint
[ ] Download invoice endpoint
[ ] Download receipt endpoint
[ ] Submit cancellation request endpoint
[ ] Administrative dashboard endpoints
[ ] Manage property and room information endpoints
[ ] Manage rates and blocked inventory endpoints
[ ] View/update authorized bookings endpoints
[ ] Export authorized reports endpoints
[ ] Consistent naming and status codes
[ ] Server-side permission and business rule validation
[ ] No unnecessary guest details in public API responses
[ ] Documented request/response formats, validation failures, payment/booking states, retry behaviour

--- BOOKING AND PAYMENT STATE MANAGEMENT ---
[ ] Explicit state transitions (not arbitrary status strings)
[ ] Booking states: Pending payment, Confirmed, Cancelled, Completed, No-show
[ ] Payment states: Created, Pending, Successful, Failed, Refund pending, Partially refunded, Refunded
[ ] Booking must not confirm merely because customer visited success URL
[ ] Payment must not record as successful without verification
[ ] No duplicate notifications creating duplicate bookings/payments/receipts/invoices
[ ] Failed transaction must not permanently consume inventory
[ ] Expired holds released per well-defined strategy
[ ] Relevant state transitions recorded for troubleshooting/audit

--- DEMO MODE ---
[ ] Editable sample data for both properties
[ ] Location A - editable demo property
[ ] Location B - editable demo property
[ ] AC and Non-AC room categories
[ ] Example rates and amenities
[ ] Example food inclusion settings
[ ] Example availability
[ ] Clearly marked test bookings identified as demo data
[ ] Demo functionality (1-20 items as specified in spec)
[ ] Simulated payment clearly labelled
[ ] Visible DEMO badge or demo-mode banner
[ ] Never accept real payments in simulation mode

--- ENVIRONMENT AND CONFIGURATION ---
[ ] Database connection string
[ ] Application base URL
[ ] Authentication secret
[ ] Session/security configuration
[ ] Payment gateway public key identifier
[ ] Payment gateway secret
[ ] Payment webhook secret
[ ] Email provider configuration
[ ] Sender email
[ ] Media storage settings
[ ] Tax configuration identifiers
[ ] Demo-mode toggle
[ ] Validate required env vars at startup
[ ] Production fails safely when essential config missing

--- TESTING STRATEGY ---
[ ] Unit tests: price calculation, tax calculation, tax-inclusive/exclusive, currency rounding, date-range calculations, occupancy rules, rate selection, cancellation rules, invoice numbering, booking/payment state transitions
[ ] Integration tests: database-backed availability, booking creation, inventory holds, expired hold release, payment verification, duplicate webhook processing, invoice generation, receipt generation, authorization boundaries, admin updates to inventory, booking cancellation/inventory release
[ ] End-to-end tests: complete guest journey (homepage → property → search → room → guest details → price → simulated payment → confirmation → PDF), competing booking for last inventory, failed payment, invalid dates, invalid occupancy, expired holds, unauthorized admin access

--- DEPLOYMENT AND PRODUCTION READINESS ---
[ ] Installation instructions
[ ] Database creation instructions
[ ] Migration commands
[ ] Seed-data commands
[ ] Local development commands
[ ] Build and production-start commands
[ ] Hosting-specific deployment instructions
[ ] Environment-variable configuration
[ ] Payment gateway test-mode setup
[ ] Webhook setup
[ ] Email provider setup
[ ] Domain and HTTPS instructions
[ ] Persistent media storage instructions
[ ] Database backup recommendations
[ ] Database restoration instructions
[ ] Monitoring and error-log guidance
[ ] Rollback guidance for migrations
[ ] Never expose production debugging pages/detailed stack traces
[ ] Staging environment for payment integration before live credentials
[ ] Final checklist: property details, rates, policies, media, contact info, tax config, payment credentials, email credentials, hosting info

--- DOCUMENTATION DELIVERABLES ---
[ ] README.md
[ ] PROJECT_SPEC.md
[ ] DATABASE_SCHEMA.md
[ ] API_DOCUMENTATION.md
[ ] PAYMENT_AND_INVOICE_GUIDE.md
[ ] DEPLOYMENT_GUIDE.md
[ ] ADMIN_GUIDE.md
[ ] TESTING_GUIDE.md
[ ] .env.example (safe placeholders only)

--- IMPLEMENTATION METHOD ---
[ ] Phase 1 — Foundation (project setup, Prisma, basic shell, initial homepage)
[ ] Phase 2 — Properties and Rooms (property pages, room categories, amenities, media placeholders, server-side pricing)
[ ] Phase 3 — Availability (date validation, availability service, inventory transactions, holds, concurrency)
[ ] Phase 4 — Bookings (guest details, booking summary, creation, reference, guest lookup, admin workflow)
[ ] Phase 5 — Payments and Documents (simulated payments, real gateway integration, verification, webhooks, PDF receipts, invoices)
[ ] Phase 6 — Administration (authenticated admin, dashboard, property/room/pricing/booking/guest management, reports, audit logs)
[ ] Phase 7 — Quality Assurance (type checking, linting, builds, unit/integration/e2e tests, mobile/tablet/desktop testing, security, inventory correctness, PDF output, defect fixes)
[ ] Phase 8 — Deployment Preparation (verify commands, migrations, env vars, staging test, deployment checklist, production readiness)

--- RULES FOR AI CODING AGENTS ---
[ ] Inspect existing repository before editing
[ ] Preserve useful implementations, avoid unnecessary rewrites
[ ] Written implementation plan and task tracking
[ ] Strict TypeScript, avoid 'any' unless justified
[ ] Keep business logic separate from UI
[ ] No duplicated booking/tax calculation logic
[ ] No hardcoded real business details/credentials/prices/tax rates
[ ] No TODO, fake API calls, or hardcoded frontend arrays
[ ] No buttons that do nothing
[ ] No silently bypassing availability/payment checks
[ ] No production operations dependent on demo-only behavior
[ ] No fake customer info appearing genuine
[ ] Appropriate loading, empty, error, success states
[ ] Versioned database schema changes via migrations
[ ] Run and fix tests after each major phase
[ ] Documented, maintained packages, avoid unnecessary dependencies
[ ] Never claim test passed unless actually run
[ ] Clearly distinguish implemented from integration-required features
[ ] Site simple enough for non-technical owners

--- FINAL ACCEPTANCE CRITERIA ---
[ ] Both locations displayed independently
[ ] Property-specific rooms/amenities load correctly
[ ] AC and Non-AC categories distinguished
[ ] Guest can search selected date range
[ ] Genuine availability from seeded database inventory
[ ] Displayed rate/tax breakdown matches server-generated quote
[ ] Guest can complete simulated booking workflow
[ ] Temporary holds expire and release inventory correctly
[ ] Completed demo booking changes availability for subsequent searches
[ ] Simultaneous booking attempts cannot oversell inventory
[ ] Booking stored in database
[ ] Guest details associated with correct booking
[ ] Demo payment record has correct status
[ ] PDF payment receipts generated and downloadable
[ ] Tax invoices use configurable test settings, not falsely presented as live
[ ] Administrator authentication functional
[ ] Administrators can view/manage both properties and room inventory
[ ] Administrators can view bookings and payment records
[ ] Guest lookup protects private information
[ ] Every major form validates input and displays useful errors
[ ] All main pages work on mobile and desktop
[ ] No essential button is decorative/non-functional
[ ] Project can be installed, migrated, seeded, tested, built using documented commands
[ ] No production secrets committed
[ ] Deployment guide identifies hosting requirements and outstanding configuration
[ ] No unverified claim that live payments, emails, GST, or hosting are ready