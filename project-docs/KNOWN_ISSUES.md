KUNA HOMESTAY KNOWN ISSUES
===========================

This file maintains a persistent list of known bugs, technical debt, and unresolved questions.

--- KNOWN ISSUES ---

[ISSUE-001] Date selection timezone handling
Description: Guest date selection must be validated against Asia/Kolkata timezone; client-side date pickers may submit dates in local timezone that need conversion.
Severity: High
Status: OPEN
Reproduction steps: Not yet applicable - timezone conversion logic not yet implemented
Expected behavior: All date comparisons use Asia/Kolkata timezone
Actual behavior: Not yet implemented
Files or modules involved: Availability validation, Booking model
What has already been attempted: None
Current diagnosis: Suspected - need to implement timezone-aware date handling
Proposed fix: Convert guest-selected dates to Asia/Kolkata before database comparison
Regression tests required: End-to-end booking with cross-midnight dates

[ISSUE-002] Overbooking protection in concurrent bookings
Description: Two simultaneous booking attempts for the last available room may both succeed before inventory hold transactions complete.
Severity: Critical
Status: OPEN
Reproduction steps: Not yet tested - concurrent booking scenario not yet implemented
Expected behavior: Only one booking succeeds; second either waits or is rejected
Actual behavior: Not yet implemented
Files or modules: InventoryHold model, Booking creation transaction
What has already been attempted: None
Current diagnosis: Suspected - need transactional inventory validation
Proposed fix: Use Prisma transaction with isolation level to prevent race conditions
Regression tests required: Simultaneous booking attempts for last available room

[ISSUE-003] Payment webhook security
Description: Payment gateway webhooks must be verified server-side; browser redirect to success page is not proof of payment.
Severity: High
Status: OPEN
Reproduction steps: Not yet applicable - webhook handler not yet implemented
Expected behavior: Webhook signature verified against raw request body before booking confirmation
Actual behavior: Not yet implemented
Files or modules: Webhook handler, Payment model, Booking confirmation
What has already been attempted: None
Current diagnosis: Suspected - need Razorpay webhook signature verification
Proposed fix: Implement Razorpay webhook signature verification pattern
Regression tests: Mock webhook with valid/invalid signatures

[ISSUE-004] GST invoice configuration for demo mode
Description: Demo mode must use clearly identified test tax settings that are not falsely presented as live business tax invoices.
Severity: Medium
Status: OPEN
Reproduction steps: Not yet applicable - tax configuration not yet set up
Expected behavior: Invoice generation clearly marks test/demo tax settings
Actual behavior: Not yet implemented
Files or modules: Tax configuration, Invoice model, Demo mode flags
What has already been attempted: None
Current diagnosis: Suspected - need demo/toggle-based tax display logic
Proposed fix: Admin-configurable tax status with demo mode indicator
Regression tests: Invoice generation in demo vs production mode

[ISSUE-005] Admin authentication credential management
Description: Admin credentials stored in database; loss of credentials requires recovery procedure.
Severity: Medium
Status: OPEN
Reproduction steps: Not yet applicable - admin auth not yet implemented
Expected behavior: Admin can reset credentials through defined procedure
Actual behavior: Not yet implemented
Files or modules: AdminUser model, Authentication routes
What has already been attempted: None
Current diagnosis: Suspected - need admin recovery flow
Proposed fix: Email-based recovery or super-admin setup
Regression tests: Admin login lockout and recovery scenario

[ISSUE-006] Media upload storage backend
Description: Initial version uses placeholder media; storage backend not yet configured for production uploads.
Severity: Low
Status: OPEN
Reproduction steps: Not applicable - placeholder media in use
Expected behavior: Admin can upload and delete room images/videos through configured storage
Actual behavior: Placeholder CSS blocks used instead of real media
Files or modules: RoomMedia model, Upload API (not yet created)
What has already been attempted: None - placeholder approach selected
Current diagnosis: Confirmed - placeholder approach intentional for v1
Proposed fix: Configure cloud storage (S3, Cloudinary) when deployment plan confirmed
Regression tests: Upload, delete, and replace media operations

[ISSUE-007] CSV export data integrity
Description: Revenue reports must clearly distinguish collected amounts from booked amounts; unpaid reservations should not appear as collected revenue.
Severity: Medium
Status: OPEN
Reproduction steps: Not yet applicable - reporting not yet implemented
Expected behavior: Reports identify source data, date range, payment-status filters, and whether totals represent collected or booked amounts
Actual behavior: Not yet implemented
Files or modules: Report generation, CSV export
What has already been attempted: None
Current diagnosis: Suspected - need payment-status-filtered revenue aggregation
Proposed fix: Separate revenue queries for collected vs booked, with clear labels
Regression tests: Report generation with various payment-status filters

[ISSUE-008] Booking reference unpredictability
Description: Booking references should not be guessable sequential IDs; need opaque or randomized references.
Severity: Medium
Status: OPEN
Reproduction steps: Not yet applicable - booking reference generation not yet implemented
Expected behavior: Booking references are opaque strings that cannot be guessed
Actual behavior: Not yet implemented
Files or modules: Booking model, Reference generation
What has already been attempted: None
Current diagnosis: Suspected - need UUID or custom opaque reference format
Proposed fix: Use UUIDv4 or custom base62-encoded reference
Regression tests: Attempt to guess booking references

[ISSUE-009] Form validation completeness
Description: All major forms must validate input and display useful errors; some edge cases may be missed during initial implementation.
Severity: Low
Status: OPEN
Reproduction steps: Not yet applicable - forms not yet fully implemented
Expected behavior: Each form validates required fields, shows specific error messages, prevents submission with invalid data
Actual behavior: Not yet implemented
Files or modules: All form components
What has already been attempted: None
Current diagnosis: Suspected - will address as forms are built
Proposed fix: Centralized validation with clear error messages
Regression tests: Form submission with various invalid inputs

[ISSUE-010] Mobile date picker accessibility
Description: Date selection on mobile devices must be keyboard-accessible and work with screen readers.
Severity: Low
Status: OPEN
Reproduction steps: Not yet applicable - mobile date pickers not yet designed
Expected behavior: Accessible date picker that works with keyboard and screen readers
Actual behavior: Not yet implemented
Files or modules: Date selector components
What has already been attempted: None
Current diagnosis: Suspected - need to use native accessible date inputs
Proposed fix: Use HTML5 <input type="date"> with proper labeling
Regression tests: Keyboard navigation and screen reader testing

--- RESOLUTION TRACKING ---
- Issues marked OPEN will be reviewed at each checkpoint
- Issues marked RESOLVED will preserve the record with fix description
- Issues marked DEFERRED will have rationale documented
- No issues should be silently deleted

Regression tests required for each issue before VERIFICATION status.