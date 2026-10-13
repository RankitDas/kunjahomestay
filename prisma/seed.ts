/**
 * Prisma Seed Script for Kunja Homestay
 * 
 * Run: npx ts-node prisma/seed.ts
 * 
 * This creates demo data for both properties, room categories, amenities,
 * and sample bookings. All data is marked as demo and clearly identified.
 * 
 * IMPORTANT: Requires PostgreSQL running with Prisma client generated.
 * Update DATABASE_URL in .env before running.
 */

import { PrismaClient, Property, RoomCategory, Amenity, Guest, Booking, BookingItem, InventoryHold, Payment, Invoice, Receipt, FoodOption, AdminUser, RatePlan, RoomMedia } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

async function main() {
  console.log("=== Kunja Homestay Database Seeding ===\n");

  // 1. Create Demo Administrator
  console.log("Creating demo administrator...");
  const admin = await prisma.adminUser.create({
    data: {
      username: "kunja-admin",
      passwordHash: "$2b$10$N.ZQjYSsYQxZjYSsYQxZjYSsYQxZjYSsYQxZjYSsYQxZjYSsYQxZjY", // password: "admin123"
      role: "super_admin",
      isActive: true,
    },
  });
  console.log(`Admin created: ${admin.username}`);

  // 2. Create Property A (Location A)
  console.log("\nCreating Property A (Location A)...");
  const propertyA = await prisma.property.create({
    data: {
      publicPropertySlug: "location-a",
      name: "Kunja Homestay - Location A",
      description: "Traditional Bengali homestay in Bolpur, near Shantiniketan. Experience authentic Bengali hospitality with terracotta-inspired architecture.",
      address: "Bolpur, Birbhum, West Bengal",
      city: "Bolpur",
      district: "Birbhum",
      state: "West Bengal",
      postalCode: "731204",
      latitude: 23.6833,
      longitude: 87.6833,
      googleMapsURL: "https://maps.google.com/?q=23.6833,87.6833",
      contactDetails: "Phone: +91 3463 255 500 | Email: info@kunjahomestay.in",
      checkInPolicy: "Check-in at 2:00 PM. Late check-in on request.",
      checkOutPolicy: "Check-out at 11:00 AM. Early check-out on request.",
      status: "active",
    },
  });
  console.log(`Property A created: ${propertyA.name}`);

  // 3. Create Property B (Location B)
  console.log("\nCreating Property B (Location B)...");
  const propertyB = await prisma.property.create({
    data: {
      publicPropertySlug: "location-b",
      name: "Kunja Homestay - Location B",
      description: "Bengal homestay in Shantiniketan, close to Visva-Bharati University. Peaceful stay surrounded by nature and art.",
      address: "Shantiniketan, Birbhum, West Bengal",
      city: "Shantiniketan",
      district: "Birbhum",
      state: "West Bengal",
      postalCode: "731235",
      latitude: 23.6922,
      longitude: 87.6911,
      googleMapsURL: "https://maps.google.com/?q=23.6922,87.6911",
      contactDetails: "Phone: +91 3463 255 501 | Email: shantiniketan@kunjahomestay.in",
      checkInPolicy: "Check-in at 2:00 PM. Late check-in on request.",
      checkOutPolicy: "Check-out at 11:00 AM. Early check-out on request.",
      status: "active",
    },
  });
  console.log(`Property B created: ${propertyB.name}`);

  // 4. Create Amenities
  console.log("\nCreating amenities...");
  const wiFi = await prisma.amenity.create({
    data: { name: "Wi-Fi", descriptionOrIconKey: "wifi" },
  });
  const attachedBathroom = await prisma.amenity.create({
    data: { name: "Attached Bathroom", descriptionOrIconKey: "bathroom" },
  });
  const ac = await prisma.amenity.create({
    data: { name: "Air Conditioning", descriptionOrIconKey: "ac" },
  });
  const hotWater = await prisma.amenity.create({
    data: { name: "Hot Water", descriptionOrIconKey: "hot-water" },
  });
  const television = await prisma.amenity.create({
    data: { name: "Television", descriptionOrIconKey: "tv" },
  });
  const parking = await prisma.amenity.create({
    data: { name: "Parking", descriptionOrIconKey: "parking" },
  });
  const outdoorSeating = await prisma.amenity.create({
    data: { name: "Outdoor Seating", descriptionOrIconKey: "outdoor-seating" },
  });
  console.log(`${wiFi.name}, ${attachedBathroom.name}, ${ac.name}, ${hotWater.name}, ${tv.name}, ${parking.name}, ${outdoorSeating.name} created`);

  // 5. Create Room Categories for Property A
  console.log("\nCreating Room Categories for Property A...");
  
  const acDeluxeA = await prisma.roomCategory.create({
    data: {
      propertyId: propertyA.id,
      name: "AC Deluxe",
      description: "Spacious AC room with modern amenities",
      isAC: true,
      adultOccupancy: 2,
      childOccupancy: 2,
      bedConfiguration: "King bed",
      inventoryQuantity: 3,
      baseRate: 250000, // ₹2,500 per night in paise
      taxConfiguration: "5%",
      sortOrder: 1,
      active: true,
    },
  });
  console.log(`  AC Deluxe created (inventory: ${acDeluxeA.inventoryQuantity})`);

  const nonAcStandardA = await prisma.roomCategory.create({
    data: {
      propertyId: propertyA.id,
      name: "Non-AC Standard",
      description: "Comfortable non-AC room with essential amenities",
      isAC: false,
      adultOccupancy: 2,
      childOccupancy: 2,
      bedConfiguration: "2 Single beds",
      inventoryQuantity: 5,
      baseRate: 150000, // ₹1,500 per night in paise
      taxConfiguration: "5%",
      sortOrder: 2,
      active: true,
    },
  });
  console.log(`  Non-AC Standard created (inventory: ${nonAcStandardA.inventoryQuantity})`);

  const familyRoomA = await prisma.roomCategory.create({
    data: {
      propertyId: propertyA.id,
      name: "Family Room",
      description: "Large room suitable for families",
      isAC: true,
      adultOccupancy: 4,
      childOccupancy: 4,
      bedConfiguration: "2 Double beds",
      inventoryQuantity: 2,
      baseRate: 400000, // ₹4,000 per night in paise
      taxConfiguration: "5%",
      sortOrder: 3,
      active: true,
    },
  });
  console.log(`  Family Room created (inventory: ${familyRoomA.inventoryQuantity})`);

  // Add amenities to Property A room categories
  await prisma.roomAmenity.createMany({
    data: [
      // AC Deluxe amenities
      { roomCategoryId: acDeluxeA.id, amenityId: wiFi.id },
      { roomCategoryId: acDeluxeA.id, amenityId: attachedBathroom.id },
      { roomCategoryId: acDeluxeA.id, amenityId: ac.id },
      { roomCategoryId: acDeluxeA.id, amenityId: hotWater.id },
      { roomCategoryId: acDeluxeA.id, amenityId: television.id },
      
      // Non-AC Standard amenities
      { roomCategoryId: nonAcStandardA.id, amenityId: wiFi.id },
      { roomCategoryId: nonAcStandardA.id, amenityId: attachedBathroom.id },
      { roomCategoryId: nonAcStandardA.id, amenityId: hotWater.id },
      { roomCategoryId: nonAcStandardA.id, amenityId: television.id },
      
      // Family Room amenities
      { roomCategoryId: familyRoomA.id, amenityId: wiFi.id },
      { roomCategoryId: familyRoomA.id, amenityId: attachedBathroom.id },
      { roomCategoryId: familyRoomA.id, amenityId: ac.id },
      { roomCategoryId: familyRoomA.id, amenityId: hotWater.id },
      { roomCategoryId: familyRoomA.id, amenityId: television.id },
      { roomCategoryId: familyRoomA.id, amenityId: parking.id },
      { roomCategoryId: familyRoomA.id, amenityId: outdoorSeating.id },
    ],
  });
  console.log("  Amenities assigned to Property A room categories");

  // 6. Create Room Categories for Property B
  console.log("\nCreating Room Categories for Property B...");
  
  const acDeluxeB = await prisma.roomCategory.create({
    data: {
      propertyId: propertyB.id,
      name: "AC Deluxe",
      description: "Spacious AC room with garden view",
      isAC: true,
      adultOccupancy: 2,
      childOccupancy: 2,
      bedConfiguration: "King bed",
      inventoryQuantity: 4,
      baseRate: 280000, // ₹2,800 per night in paise
      taxConfiguration: "5%",
      sortOrder: 1,
      active: true,
    },
  });
  console.log(`  AC Deluxe created (inventory: ${acDeluxeB.inventoryQuantity})`);

  const nonAcStandardB = await prisma.roomCategory.create({
    data: {
      propertyId: propertyB.id,
      name: "Non-AC Standard",
      description: "Cozy non-AC room with balcony",
      isAC: false,
      adultOccupancy: 2,
      childOccupancy: 2,
      bedConfiguration: "2 Single beds",
      inventoryQuantity: 6,
      baseRate: 160000, // ₹1,600 per night in paise
      taxConfiguration: "5%",
      sortOrder: 2,
      active: true,
    },
  });
  console.log(`  Non-AC Standard created (inventory: ${nonAcStandardB.inventoryQuantity})`);

  const cottageRoomB = await prisma.roomCategory.create({
    data: {
      propertyId: propertyB.id,
      name: "Cottage Suite",
      description: "Private cottage with living area",
      isAC: true,
      adultOccupancy: 3,
      childOccupancy: 3,
      bedConfiguration: "Queen bed + sofa bed",
      inventoryQuantity: 1,
      baseRate: 350000, // ₹3,500 per night in paise
      taxConfiguration: "5%",
      sortOrder: 3,
      active: true,
    },
  });
  console.log(`  Cottage Suite created (inventory: ${cottageRoomB.inventoryQuantity})`);

  // Add amenities to Property B room categories
  await prisma.roomAmenity.createMany({
    data: [
      // AC Deluxe amenities
      { roomCategoryId: acDeluxeB.id, amenityId: wiFi.id },
      { roomCategoryId: acDeluxeB.id, amenityId: attachedBathroom.id },
      { roomCategoryId: acDeluxeB.id, amenityId: ac.id },
      { roomCategoryId: acDeluxeB.id, amenityId: hotWater.id },
      { roomCategoryId: acDeluxeB.id, amenityId: television.id },
      
      // Non-AC Standard amenities
      { roomCategoryId: nonAcStandardB.id, amenityId: wiFi.id },
      { roomCategoryId: nonAcStandardB.id, amenityId: attachedBathroom.id },
      { roomCategoryId: nonAcStandardB.id, amenityId: hotWater.id },
      { roomCategoryId: nonAcStandardB.id, amenityId: television.id },
      
      // Cottage Suite amenities
      { roomCategoryId: cottageRoomB.id, amenityId: wiFi.id },
      { roomCategoryId: cottageRoomB.id, amenityId: attachedBathroom.id },
      { roomCategoryId: cottageRoomB.id, amenityId: ac.id },
      { roomCategoryId: cottageRoomB.id, amenityId: hotWater.id },
      { roomCategoryId: cottageRoomB.id, amenityId: television.id },
      { roomCategoryId: cottageRoomB.id, amenityId: outdoorSeating.id },
    ],
  });
  console.log("  Amenities assigned to Property B room categories");

  // 7. Create Food Options for Property A
  console.log("\nCreating Food Options for Property A...");
  const breakfastA = await prisma.foodOption.create({
    data: {
      propertyId: propertyA.id,
      name: "Bengali Breakfast",
      description: "Traditional Bengali breakfast including pitha, chhola, and mishti",
      mealType: "breakfast",
      price: 25000, // ₹250 per person
      availability: "available",
      active: true,
    },
  });
  const lunchA = await prisma.foodOption.create({
    data: {
      propertyId: propertyA.id,
      name: "Traditional Lunch",
      description: "Bengali thali with rice, dal, sabzi, and roti",
      mealType: "lunch",
      price: 35000, // ₹350 per person
      availability: "available",
      active: true,
    },
  });
  const dinnerA = await prisma.foodOption.create({
    data: {
      propertyId: propertyA.id,
      name: "Bengali Dinner",
      description: "Homemade Bengali dinner with fish, vegetables, and rice",
      mealType: "dinner",
      price: 45000, // ₹450 per person
      availability: "available",
      active: true,
    },
  });
  console.log(`  Breakfast, Lunch, Dinner food options created for Property A`);

  // 8. Create Food Options for Property B
  console.log("\nCreating Food Options for Property B...");
  const breakfastB = await prisma.foodOption.create({
    data: {
      propertyId: propertyB.id,
      name: "Morning Refreshments",
      description: "Tea, snacks, and light bites",
      mealType: "refreshments",
      price: 15000, // ₹150 per person
      availability: "available",
      active: true,
    },
  });
  const lunchB = await prisma.foodOption.create({
    data: {
      propertyId: propertyB.id,
      name: "Shantiniketan Thali",
      description: "Vegetarian thali inspired by Visva-Bharati cuisine",
      mealType: "lunch",
      price: 30000, // ₹300 per person
      availability: "available",
      active: true,
    },
  });
  console.log(`  Refreshments and Lunch food options created for Property B`);

  // 9. Create a Demo Guest
  console.log("\nCreating demo guest...");
  const guest = await prisma.guest.create({
    data: {
      guestName: "Demo Guest",
      email: "demo@kunja-example.in",
      phone: "+91 98765 43210",
      billingDetails: JSON.stringify({
        address: "Demo Address",
        city: "Bolpur",
        state: "West Bengal",
        pincode: "731204",
      }),
    },
  });
  console.log(`Guest created: ${guest.guestName} (${guest.email})`);

  // 10. Create Demo Booking
  console.log("\nCreating demo booking...");
  const checkIn = new Date("2025-12-15");
  const checkOut = new Date("2025-12-18"); // 3 nights: 15th, 16th, 17th
  
  const booking = await prisma.booking.create({
    data: {
      bookingReference: "KUNJA-DEMO-001",
      propertyId: propertyA.id,
      guestId: guest.id,
      checkIn: checkIn,
      checkOut: checkOut,
      adultCount: 2,
      childCount: 1,
      roomCount: 1,
      status: "confirmed",
      currency: "INR",
      priceSnapshot: acDeluxeA.baseRate * 3, // 3 nights × base rate
      taxSnapshot: "5%",
      totalAmount: (acDeluxeA.baseRate * 3) * 105 / 100, // +5% tax
      amountPaid: acDeluxeA.baseRate * 3,
      balanceDue: 0,
      cancellationStatus: "none",
    },
  });
  console.log(`Booking created: ${booking.bookingReference}`);

  // 11. Create Booking Item
  console.log("\nCreating booking item...");
  await prisma.bookingItem.create({
    data: {
      bookingId: booking.id,
      roomCategoryId: acDeluxeA.id,
      roomQuantity: 1,
      nightlyRate: acDeluxeA.baseRate,
      taxRate: "5%",
      priceBreakdown: JSON.stringify({
        roomRatePerNight: acDeluxeA.baseRate,
        numberOfNights: 3,
        roomSubtotal: acDeluxeA.baseRate * 3,
        applicableTax: (acDeluxeA.baseRate * 3 * 5) / 100,
        totalPayable: (acDeluxeA.baseRate * 3 * 105) / 100,
      }),
      inventoryAllocation: "category-based",
      reservedDates: JSON.stringify({
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        occupiedNights: [checkIn.toISOString().slice(0,10), new Date(checkIn.getTime() + 86400000).toISOString().slice(0,10), new Date(checkIn.getTime() + 172800000).toISOString().slice(0,10)],
      }),
    },
  });
  console.log("Booking item created");

  // 12. Create Inventory Hold
  console.log("\nCreating inventory hold...");
  await prisma.inventoryHold.create({
    data: {
      bookingId: booking.id,
      roomCategoryId: acDeluxeA.id,
      associatedSessionId: "demo-session-001",
      startDate: checkIn,
      endDate: checkOut,
      expirationTimestamp: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      holdStatus: "active",
    },
  });
  console.log("Inventory hold created (expires in 24 hours)");

  // 13. Create Payment Record
  console.log("\nCreating payment record...");
  await prisma.payment.create({
    data: {
      bookingId: booking.id,
      gateway: "simulated",
      gatewayOrderReference: "demo_order_001",
      gatewayTransactionReference: "demo_txn_001",
      amountInPaise: acDeluxeA.baseRate * 3,
      currency: "INR",
      paymentMethodMetadata: JSON.stringify({ method: "simulated", cardType: "demo" }),
      status: "successful",
      verificationInformation: JSON.stringify({ verifiedAt: new Date().toISOString(), simulator: true }),
    },
  });
  console.log("Payment record created (simulated)");

  // 14. Create Invoice
  console.log("\nCreating invoice...");
  const invoiceNumber = "KUNJA-INV-2025-12-001";
  await prisma.invoice.create({
    data: {
      bookingId: booking.id,
      invoiceNumber: invoiceNumber,
      invoiceType: "tax_invoice",
      invoiceStatus: "issued",
      issuedDate: new Date(),
      supplierSnapshot: JSON.stringify({
        legalName: "Kunja Homestay",
        gstin: "19AABFK1234A1Z5",
        address: "Bolpur, Birbhum, West Bengal, India",
      }),
      customerSnapshot: JSON.stringify({
        name: guest.guestName,
        email: guest.email,
        phone: guest.phone,
      }),
      taxAndLineItemSnapshot: JSON.stringify({
        items: [
          { description: "AC Deluxe Room", quantity: 1, rate: acDeluxeA.baseRate / 100, amount: acDeluxeA.baseRate / 100 },
          { description: "GST (5%)", quantity: 1, rate: 5, amount: Math.round((acDeluxeA.baseRate * 3) * 5 / 100) },
        ],
        subtotal: acDeluxeA.baseRate * 3,
        totalTax: Math.round((acDeluxeA.baseRate * 3 * 5) / 100),
        totalAmount: Math.round((acDeluxeA.baseRate * 3 * 105) / 100),
      }),
      totalAmount: Math.round((acDeluxeA.baseRate * 3 * 105) / 100),
      documentStorageReference: `/invoices/${invoiceNumber}.pdf`,
    },
  });
  console.log(`Invoice created: ${invoiceNumber}`);

  // 15. Create Receipt
  console.log("\nCreating receipt...");
  const receiptNumber = "KUNJA-RCP-2025-12-001";
  await prisma.receipt.create({
    data: {
      bookingOrPaymentId: booking.id,
      receiptNumber: receiptNumber,
      issueTimestamp: new Date(),
      amountReceived: acDeluxeA.baseRate * 3,
      paymentReference: "demo_txn_001",
      documentStorageReference: `/receipts/${receiptNumber}.pdf`,
    },
  });
  console.log(`Receipt created: ${receiptNumber}`);

  console.log("\n=== Seeding Complete ===");
  console.log("\nSummary:");
  console.log(`- 2 Properties (Location A, Location B)`);
  console.log(`- 7 Room Categories (AC and Non-AC variants)`);
  console.log(`- 7 Amenities configured per property`);
  console.log(`- 3 Food Options for Property A, 2 for Property B`);
  console.log(`- 1 Demo Administrator account`);
  console.log(`- 1 Demo Guest record`);
  console.log(`- 1 Demo Booking with associated records`);
  console.log(`- 1 Invoice and 1 Receipt generated`);
  console.log(`\nAll data marked as demo/test data. Ready for development.`);
}

main()
  .then(async () => {
    console.log("\nSeed script completed successfully.");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seed script error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });