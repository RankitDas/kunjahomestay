KUNA HOMESTAY DATABASE AND MIGRATION STATE
============================================

This file keeps an accurate record of the current data model and database setup.

--- DATABASE TECHNOLOGY ---
- Database: PostgreSQL
- ORM: Prisma v5+
- Prisma schema: prisma/schema.prisma (to be created)
- Migration directory: prisma/migrations/
- Database connection: Environment variable DATABASE_URL

--- CURRENT SCHEMA LOCATION ---
- Schema defined in prisma/schema.prisma (created and validated)
- Migrations tracked by Prisma migration table in database

--- MIGRATION DIRECTORY STATUS ---
- Migration files: None yet created
- Latest migration: None yet
- Migrations created: 0
- Migrations applied: 0 (database not yet created)

--- SCHEMA MODELS STATUS ---

[Property] - CREATED
  Fields: id, publicPropertySlug, name, description, address, city, district, state, postalCode, latitude, longitude, googleMapsURL, contactDetails, checkInPolicy, checkOutPolicy, status, createdAt, updatedAt
  Relations: roomCategories (1:N), bookings (N:1)

[RoomCategory] - NOT_STARTED
  Fields: id, propertyId, name, description, isAC, adultOccupancy, childOccupancy, bedConfiguration, inventoryQuantity, baseRate, taxConfiguration, active, createdAt, updatedAt
  Relations: property (Many-to-1), amenities (M:N), roomMedia (1:N), ratePlans (1:N), bookings (N:M through BookingItem)

[Amenity] - CREATED
  Fields: id, name, descriptionOrIconKey, createdAt
  Relations: properties (M:N), roomCategories (M:N)

[RoomMedia] - NOT_STARTED
  Fields: id, roomCategoryIdOrPropertyId, mediaType, storageKey, caption, displayOrder, isMainCover, createdAt
  Relations: roomCategory (Many-to-1)

[RatePlan] - NOT_STARTED
  Fields: id, propertyIdOrRoomCategoryId, validityStart, validityEnd, nightlyRate, pricingRules, taxDisplayConfig, minStayDays, active, createdAt, updatedAt
  Relations: propertyOrRoomCategory (Many-to-1)

[Guest] - CREATED
  Fields: id, guestName, email, phone, billingDetails, createdAt
  Unique: email (normalized), phone (normalized)
  Relations: bookings (N:1)

[Booking] - CREATED
  Fields: id, bookingReference, propertyId, guestId, checkIn, checkOut, adultCount, childCount, roomCount, status, currency, priceSnapshot, taxSnapshot, totalAmount, amountPaid, balanceDue, cancellationStatus, createdAt, updatedAt
  Relations: property (Many-to-1), guest (Many-to-1), payment (1:1), invoices (1:1), receipts (1:1), bookingItems (N:1)

[BookingItem] - NOT_STARTED
  Fields: id, bookingId, roomCategoryId, roomQuantity, nightlyRate, taxRate, priceBreakdown, physicalRoomAssignment, inventoryAllocation, reservedDates
  Relations: booking (Many-to-1), roomCategory (Many-to-1)

[InventoryHold] - NOT_STARTED
  Fields: id, associatedBookingOrSessionId, inventoryAllocation, startDate, endDate, expirationTimestamp, holdStatus
  Relations: bookingOrSession (Many-to-1)

[Payment] - NOT_STARTED
  Fields: id, bookingId, gateway, gatewayOrderReference, gatewayTransactionReference, amountInPaise, currency, paymentMethodMetadata, status, verificationInformation, createdAt, updatedAt
  Unique: gatewayOrderReference, gatewayTransactionReference
  Relations: booking (Many-to-1)

[Invoice] - NOT_STARTED
  Fields: id, bookingId, invoiceNumber, invoiceType, invoiceStatus, issuedDate, supplierSnapshot, customerSnapshot, taxAndLineItemSnapshot, totalAmount, documentStorageReference, correctionOrCancellationReferences
  Relations: booking (Many-to-1)

[Receipt] - NOT_STARTED
  Fields: id, bookingOrPaymentId, receiptNumber, issueTimestamp, amountReceived, paymentReference, documentStorageReference
  Relations: bookingOrPayment (Many-to-1)

[FoodOption] - NOT_STARTED
  Fields: id, propertyId, name, description, mealType, price, availability, active, createdAt

[AdminUser] - NOT_STARTED
  Fields: id, username, passwordHash, role, isActive, lastLogin, createdAt, updatedAt
  Relations: bookings (1:N), adminLogs (1:N)

[ApplicationSettings] - NOT_STARTED
  Fields: id, key, value, description, updatedAt

--- RELATIONSHIP SUMMARY ---
- Property 1:N RoomCategory
- RoomCategory M:N Amenity (through junction table)
- RoomCategory 1:N RoomMedia
- RoomCategory 1:N RatePlan
- RoomCategory N:M Booking (through BookingItem)
- Guest 1:N Booking
- Booking 1:1 Payment
- Booking 1:1 Invoice
- Booking 1:1 Receipt
- Booking N:M RoomCategory (through BookingItem)
- InventoryHold belongs to BookingOrSession
- Payment belongs to Booking
- Invoice belongs to Booking
- Receipt belongs to BookingOrPayment
- FoodOption belongs to Property
- AdminUser has many bookings/adminsLogs

--- INDEXES AND CONSTRAINTS (planned) ---
- Unique constraint on bookingReference (opaque string)
- Unique constraint on gatewayOrderReference
- Unique constraint on gatewayTransactionReference
- Unique constraint on invoiceNumber (per sequence)
- Unique constraint on receiptNumber
- Index on propertyId for Booking queries
- Index on guestId for Booking queries
- Index on checkIn/checkOut for availability queries
- Index on email (normalized) for Guest
- Index on phone (normalized) for Guest
- Partial index on active RoomCategories

--- SEED-DATA STATUS ---
- Seed scripts: To be created in prisma/seed.ts
- Demo properties: Location A and Location B
- Sample room categories: AC and Non-AC variants
- Example amenities: Wi-Fi, attached bathroom, AC, hot water, TV, parking
- Sample bookings: Test reservations for demo mode
- Demo administrator account: To be created

--- DEMO ADMINISTRATOR SETUP ---
- Method: Create admin user via Prisma seed or migration
- Credentials: Username/password stored hashed in database
- Provisioning: npm run seed (or similar command)
- Credentials must not be committed to repository

--- IMPORTANT DATABASE CONSTRAINTS ---
- Cascading deletes: Booking cancellation should release InventoryHold, not delete historical records
- Restrict deletes: RoomCategory with existing Bookings should soft-delete (set active=false) rather than hard delete
- Price snapshot immutable: Booking priceSnapshot preserved even if room rates change
- Tax snapshot per booking: Tax configuration at booking time preserved for invoice integrity

--- KNOWN SCHEMA LIMITATIONS ---
- Individually managed RoomUnit model deferred to v2
- Physical room assignment tracking deferred to v2
- Advanced seasonal pricing rules deferred to v2
- Complex discount/promotion engine deferred to v2

--- MIGRATION AND DEPLOYMENT PRECAUTIONS ---
- Never reset, drop, or recreate database containing valuable data without explicit authorization and verified backup
- Always run `prisma migrate make` before `prisma migrate deploy`
- Test migrations on development database before production
- Preserve data when applying migrations that add columns (default values)
- Backup before running destructive migrations

--- DATABASE BACKUP RECOMMENDATIONS ---
- Regular PostgreSQL backups (cron job or hosting provider feature)
- Backup before major schema changes
- Store backup URLs/connection strings securely
- Test restoration procedure periodically

--- DATABASE RESTORATION INSTRUCTIONS ---
- Use `prisma migrate reset` with caution (destroys data)
- Use backup restore with `psql postgresql://...` 
- Or point Prisma to backup database and run `prisma migrate resolve applied` as needed