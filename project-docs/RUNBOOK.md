KUNA HOMESTAY RUNBOOK
=====================

This file is the operational guide for the Kunja Homestay Booking Platform.

--- REQUIRED SOFTWARE AND RUNTIMES ---
- Node.js (v18 or v20 recommended)
- npm (comes with Node.js)
- PostgreSQL (local or managed service)
- Git (for version control)

--- DEPENDENCY INSTALLATION COMMANDS ---
# Initialize project (run once)
npm init -y

# Install core Next.js dependencies
npm install next react react-dom

# Install TypeScript and types
npm install -D typescript @types/react @types/node ts-node @prisma/client

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer

# Install Lucide React icons
npm install lucide-react

# Generate Prisma client (after schema created)
npm install -D @prisma/cli

--- ENVIRONMENT SETUP ---
1. Create .env file in project root
2. Add required environment variables (see .env.example)
3. Ensure PostgreSQL is running and accessible
4. Set DATABASE_URL to your PostgreSQL connection string

--- .env.example ---
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# Application
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NODE_ENV="development"

# Security
NEXTAUTH_SECRET="change-this-to-a-random-secret"

# Demo mode
DEMO_MODE="true"

# Payment (sandbox/test mode)
RAZORPAY_KEY_ID="rzp_test_xxxxxxxx"
RAZORPAY_KEY_SECRET="your_razorpay_secret"
RAZORPAY_WEBHOOK_SECRET="your_webhook_secret"

# Email (SMTP configuration, optional for demo)
SMTP_HOST="smtp.example.com"
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER="your_email@example.com"
SMTP_PASSWORD="your_smtp_password"
SENDER_EMAIL="no-reply@kunjahomestay.in"

# Media storage (optional, for future uploads)
# CLOUDINARY_URL="cloudinary://key:secret@cloud_name"
# AWS_S3_BUCKET="your-bucket-name"

--- HOW TO START THE LOCAL DEVELOPMENT SERVER ---
1. Ensure PostgreSQL is running
2. Run: npm run dev
3. Application will be available at http://localhost:3000
4. Admin dashboard at http://localhost:3000/admin (login required)

--- HOW TO CREATE AND MIGRATE THE DATABASE ---
1. Create the database: createdb kunja_homestay (or use your PostgreSQL GUI)
2. Generate Prisma client: npx prisma generate
3. Create initial migration: npx prisma migrate init (creates migrations dir)
4. Run migration: npx prisma migrate dev --name init (applies and opens studio)
5. To apply production migration: npx prisma migrate deploy

--- HOW TO LOAD DEMO DATA ---
1. Ensure database is migrated and Prisma client generated
2. Run: npm run seed (or: node prisma/seed.js)
3. Seed script creates: two demo properties, room categories, amenities, sample data
4. Demo administrator account is created with test credentials
5. Application runs in DEMO_MODE=true

--- HOW TO RUN TYPE CHECKING AND LINTING ---
- Type check: npx tsc --noEmit
- Lint: npm run lint (if eslint configured)
- Build: npm run build

--- HOW TO RUN TESTS ---
- Unit tests: npm test (or: npx vitest run if vitest configured)
- Integration tests: Specific test scripts for booking/inventory/payment workflows
- End-to-end tests: Complete guest journey tests

--- HOW TO CREATE THE PRODUCTION BUILD ---
1. Set NODE_ENV=production in .env
2. Run: npm run build
3. Start production server: npm start (or: node .next/standalone/server.js)

--- HOW TO DIAGNOSE COMMON STARTUP ERRORS ---
- "Port 3000 already in use": Kill existing process or change port
- "Database connection failed": Check DATABASE_URL and PostgreSQL status
- "Prisma client not generated": Run npx prisma generate
- "Tailwind not working": Check content paths in tailwind.config.ts
- "TypeScript errors": Run npx tsc --noEmit to identify issues

--- HOW TO ACCESS THE DEMO WEBSITE ---
- Public website: http://localhost:3000
- Browse both properties (Location A and Location B)
- Use booking search with sample dates
- Complete demo booking workflow

--- HOW THE ADMINISTRATOR ACCOUNT IS PROVISIONED ---
1. During seed data creation, admin user is created
2. Default credentials are printed to console at startup
3. Admin can login at /admin/login
4. It is strongly recommended to change default password after first login
5. Admin credentials are stored in database with hashed password

--- HOW TO CONFIGURE SANDBOX PAYMENT INTEGRATION ---
1. Create Razorpay account at https://razorpay.com
2. Enable sandbox mode and obtain test credentials
3. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env
4. Set RAZORPAY_WEBHOOK_SECRET from Razorpay dashboard
5. Deploy a publicly accessible webhook endpoint (use ngrok during development):
   ngrok http 3000
6. Configure webhook URL in Razorpay dashboard: http(s)://YOUR_HOST/payment/webhook
7. Test webhook by triggering a test payment in Razorpay sandbox

--- HOW TO GENERATE AND INSPECT PDF RECEIPTS ---
1. Complete a demo booking in the application
2. Navigate to booking confirmation page
3. Click "Download Receipt" button
4. PDF is generated server-side and provided as download link
5. Inspect PDF content to verify all required fields are present

--- HOW TO VERIFY INVENTORY UPDATES ---
1. Search for room availability on a date range
2. Note the availability count displayed
3. Complete a booking for that date range
4. Re-search the same dates
5. Availability count should decrease by the booked quantity
6. Attempt to book the same dates again - should show reduced or no availability

--- HOW TO DEPLOY TO THE CHOSEN COMPATIBLE HOSTING ENVIRONMENT ---
1. Ensure selected GoDaddy/Hostinger plan supports Node.js
2. Upload built files (.next/, package.json, node_modules)
3. Set up environment variables in hosting control panel
4. Start application: npm start
5. Configure domain and HTTPS through hosting provider
6. Verify all functionality works in production

--- HOW TO GENERATE AND INSPECT PDF INVOICES ---
1. Ensure business GST configuration is complete in admin dashboard
2. Complete a booking with payment
3. Navigate to invoice generation in admin dashboard
4. Click "Generate Invoice" 
5. PDF is generated with GST-compliant fields
6. Download and verify invoice contains required tax information

--- TROUBLESHOOTING COMMON ISSUES ---
- Build fails: Check TypeScript errors, ensure all imports are correct
- Database connection errors: Verify DATABASE_URL, PostgreSQL running, migration applied
- Payment not working: Check Razorpay credentials, webhook endpoint, demo/production mode
- Admin login fails: Verify admin user exists, credentials correct, DEMO_MODE setting
- Availability showing incorrectly: Check inventory hold logic, date timezone handling
- PDF not generating: Check server-side PDF generation dependencies, booking record exists

--- MONITORING AND ERROR-LOG GUIDANCE ---
- Application logs errors to console/file (avoid credentials/payment secrets)
- Monitor for failed booking attempts, payment failures, webhook errors
- Check database connection pool if using connection pooling
- Review error logs after each deployment

--- ROLLBACK GUIDANCE FOR DATABASE MIGRATIONS ---
- To rollback last migration: npx prisma migrate rollback --name <migration_name>
- To rollback to specific migration: npx prisma migrate reset (destructive, use with caution)
- Always backup database before running rollback commands
- Test rollback on development before production
- If rollback is not possible, create new migration to reverse changes