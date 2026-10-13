"use client";

import { useState, useEffect, useMemo } from "react";
import { ArrowRight, Building, Check, Coffee, MapPin, Menu, UsersRound, Wifi, X } from "lucide-react";
import { AmenityCard } from "../components/ui/amenity-card";
import { FacilityCard } from "../components/ui/facility-card";

export default function Homepage() {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [showAvailability, setShowAvailability] = useState(false);
  const [availabilityResults, setAvailabilityResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(true);
  const [showDemoBadge, setShowDemoBadge] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredRoomId, setHoveredRoomId] = useState<string | null>(null);

  // Navigation and routing

  // Property data (will be loaded from admin/dashboard later)
  const properties = useMemo(() => [
    {
      id: "location-a",
      slug: "location-a",
      name: "Kunja Homestay - Location A",
      address: "Bolpur, Birbhum, West Bengal",
      coordinates: "23.6833, 87.6833",
      googleMapsURL: "https://maps.google.com/?q=23.6833,87.6833",
      description: "Traditional Bengali homestay with terracotta-inspired architecture. Experience authentic Bengali hospitality.",
      facilities: ["Wi-Fi", "Attached Bathroom", "Air Conditioning", "Hot Water", "Television", "Parking"],
      roomCategories: [
        { id: "ac-deluxe-a", name: "AC Deluxe", isAC: true, maxOccupancy: 2, pricePerNight: 2500, inventoryQuantity: 4, taxConfiguration: "5", hasFood: false },
        { id: "non-ac-standard-a", name: "Non-AC Standard", isAC: false, maxOccupancy: 2, pricePerNight: 1500, inventoryQuantity: 3, taxConfiguration: "5", hasFood: false },
        { id: "family-room-a", name: "Family Room", isAC: true, maxOccupancy: 4, pricePerNight: 4000, inventoryQuantity: 2, taxConfiguration: "5", hasFood: true },
      ],
    },
    {
      id: "location-b",
      slug: "location-b",
      name: "Kunja Homestay - Location B",
      address: "Shantiniketan, Birbhum, West Bengal",
      coordinates: "23.6922, 87.6911",
      googleMapsURL: "https://maps.google.com/?q=23.6922,87.6911",
      description: "Peaceful homestay near Visva-Bharati University, surrounded by nature and art.",
      facilities: ["Wi-Fi", "Attached Bathroom", "Air Conditioning", "Hot Water", "Television", "Outdoor Seating"],
      roomCategories: [
        { id: "ac-deluxe-b", name: "AC Deluxe", isAC: true, maxOccupancy: 2, pricePerNight: 2800, inventoryQuantity: 3, taxConfiguration: "5", hasFood: false },
        { id: "non-ac-standard-b", name: "Non-AC Standard", isAC: false, maxOccupancy: 2, pricePerNight: 1600, inventoryQuantity: 4, taxConfiguration: "5", hasFood: false },
        { id: "cottage-suite-b", name: "Cottage Suite", isAC: true, maxOccupancy: 3, pricePerNight: 3500, inventoryQuantity: 2, taxConfiguration: "5", hasFood: true },
      ],
    },
  ], []);

  // Validate dates
  useEffect(() => {
    if (checkIn && checkOut) {
      if (checkOut <= checkIn) {
        setError("Check-out date must be later than check-in date");
      } else {
        setError(null);
        // Search for availability
        searchAvailability();
      }
    }
  }, [checkIn, checkOut]);

  // Prevent past dates
  useEffect(() => {
    const today = new Date();
    if (checkIn && checkIn < today) {
      setError("Past dates are not accepted for new bookings");
    }
  }, [checkIn]);

  const searchAvailability = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would call an API endpoint
      // For demo, we'll calculate availability based on simple logic
      const selectedProperty = properties.find(p => p.slug === selectedLocation);
      if (!selectedProperty) return;
      
      const today = new Date();
      if (!checkIn || !checkOut) return;
      const checkInDate = checkIn;
      const checkOutDate = checkOut;
      
      // Check if dates are in the past
      if (checkInDate < today) {
        setError("Past dates are not accepted");
        setLoading(false);
        return;
      }
      
      // Generate availability results based on room categories
      const results = selectedProperty.roomCategories.map((category) => {
        // Simple availability logic: some categories will be available, some won't
        const occupiedNights = [];
        for (let d = new Date(checkInDate); d < checkOutDate; d = new Date(d.getTime() + 86400000)) {
          occupiedNights.push(d.toISOString().slice(0, 10));
        }
        
        // Simulate availability - randomly some will be available, some won't
        // In production, this would check the database
        const isAvailable = adults + children <= category.maxOccupancy && category.inventoryQuantity >= rooms;
        const remainingUnits = isAvailable ? category.inventoryQuantity - rooms : 0;
        
        let availabilityMessage = "Available";
        if (!isAvailable) {
          availabilityMessage = "Sold out for the selected dates";
        } else if (remainingUnits <= 1) {
          availabilityMessage = `Only ${remainingUnits} room${remainingUnits > 1 ? 's' : ''} remaining`;
        }
        
        // Calculate price
        const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / 86400000);
        const basePrice = category.pricePerNight * nights * rooms;
        const taxRate = parseFloat(category.taxConfiguration) || 5;
        const taxAmount = Math.round(basePrice * taxRate / 100);
        const totalWithTax = basePrice + taxAmount;
        
        return {
          id: category.id,
          name: category.name,
          isAC: category.isAC,
          maxOccupancy: category.maxOccupancy,
          pricePerNight: category.pricePerNight,
          nights,
          basePrice,
          taxAmount,
          totalWithTax,
          availability: isAvailable ? "available" : "sold_out",
          availabilityMessage,
          remainingUnits,
        };
      });
      
      setAvailabilityResults(results);
      setShowAvailability(true);
    } catch (err) {
      console.error("Availability search error:", err);
      setError("Failed to search availability. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLocation = (locationSlug: string) => {
    setSelectedLocation(locationSlug);
    setCheckIn(null);
    setCheckOut(null);
    setAvailabilityResults([]);
    setShowAvailability(false);
    setError(null);
  };

  const handleDateSelect = (date: Date, type: "check-in" | "check-out") => {
    if (type === "check-in") {
      setCheckIn(date);
      // Set check-out to 2 nights later if not set
      if (!checkOut) {
        const laterDate = new Date(date);
        laterDate.setDate(laterDate.getDate() + 2);
        setCheckOut(laterDate);
      }
    } else {
      setCheckOut(date);
    }
  };

  const handleSearch = () => {
    if (!selectedLocation) {
      setError("Please select a location first");
      return;
    }
    if (!checkIn || !checkOut) {
      setError("Please select both check-in and check-out dates");
      return;
    }
    searchAvailability();
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "Select date";
    return `${date.getDate()} ${["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][date.getMonth()]}`;
  };

  // Demo mode handling
  const simulatePayment = () => {
    // Simulate a payment flow
    setTimeout(() => {
      // Create a booking and show confirmation
      alert("Simulated payment completed! Booking confirmed.");
      setShowAvailability(false);
      setShowDemoBadge(false);
    }, 1500);
  };

  return (
      <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 border-b border-gray-200/50 bg-white/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[var(--primary-terracotta)] flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7 7 7-7"/>
                </svg>
              </div>
              <span className="text-lg font-bold tracking-tight sm:text-xl">Kunja Homestay</span>
            </div>
            <div className="hidden items-center gap-8 md:flex">
              <a href="#rooms" className="text-sm font-medium text-[var(--dark-charcoal)] transition-colors hover:text-[var(--primary-terracotta)]">Rooms</a>
              <a href="#locations" className="text-sm font-medium text-[var(--dark-charcoal)] transition-colors hover:text-[var(--primary-terracotta)]">Locations</a>
              <a href="#booking" className="text-sm font-medium text-[var(--dark-charcoal)] transition-colors hover:text-[var(--primary-terracotta)]">Book a stay</a>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button type="button" aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="rounded-lg border border-gray-200 p-2 text-[var(--dark-charcoal)] md:hidden">
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
          <div className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-200 md:hidden ${mobileMenuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
            <div className="min-h-0"><div className="flex flex-col border-t border-gray-100 px-4 py-2">
              {[["Rooms", "#rooms"], ["Locations", "#locations"], ["Book a stay", "#booking"]].map(([label, href]) => <a key={label} href={href} onClick={() => setMobileMenuOpen(false)} className="rounded-md px-3 py-3 text-sm font-medium text-[var(--dark-charcoal)] hover:bg-[var(--warm-cream)]">{label}</a>)}
            </div></div>
          </div>
        </nav>

        {/* Travel-inspired booking hero */}
        <section className="relative isolate overflow-hidden bg-[#f5e8d6]">
          <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#e5c49f]/30 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-[#9eaa70]/20 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:py-16">
            <div className="animate-rise-in relative z-10 text-center lg:text-left">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#b99a6e]/30 bg-white/65 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#6e624e] shadow-sm sm:text-sm">
                <MapPin size={14} className="text-[var(--primary-terracotta)]" /> Bolpur · Shantiniketan · West Bengal
              </div>
              <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-[#292521] sm:text-5xl lg:text-[3.65rem]">
                Find your <span className="text-[var(--primary-terracotta)]">Bengal</span> stay.
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#554b40]/85 sm:text-lg lg:mx-0">
                Wake to red-earth paths, sal forests and the unhurried rhythm of Shantiniketan. Choose a welcoming homestay and book your dates in a few simple steps.
              </p>
              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                <a href="#booking" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[var(--primary-terracotta)] px-6 py-3 text-base font-semibold text-white shadow-lg shadow-[#a65335]/20 transition duration-200 hover:-translate-y-0.5 hover:bg-[var(--deep-burnt-sienna)] hover:shadow-xl">
                  Find a stay <ArrowRight size={18} />
                </a>
                <a href="#locations" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#a65335]/25 bg-white/60 px-6 py-3 text-base font-semibold text-[#563e30] transition duration-200 hover:bg-white">Explore the area</a>
              </div>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-[#64594c] lg:justify-start">
                <span className="inline-flex items-center gap-2"><Check size={16} className="text-[var(--leaf-green)]" /> Direct booking</span>
                <span className="inline-flex items-center gap-2"><Check size={16} className="text-[var(--leaf-green)]" /> Two local stays</span>
                <span className="inline-flex items-center gap-2"><Check size={16} className="text-[var(--leaf-green)]" /> Warm Bengali hospitality</span>
              </div>
            </div>

            <div className="animate-rise-in relative mx-auto w-full max-w-[650px]" style={{ animationDelay: "140ms" }}>
              <div className="travel-art overflow-hidden rounded-[2rem] border border-white/70 shadow-[0_28px_70px_-34px_rgba(64,50,35,0.45)]">
                <svg viewBox="0 0 900 620" role="img" aria-label="Illustration of a quiet Bengal village surrounded by fields at sunset" className="h-auto w-full">
                  <defs>
                    <linearGradient id="bengal-sky" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#e9b78a"/><stop offset="1" stopColor="#f7e2bd"/></linearGradient>
                    <linearGradient id="bengal-field" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#9eaa70"/><stop offset="1" stopColor="#526749"/></linearGradient>
                    <linearGradient id="bengal-path" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#d8aa70"/><stop offset="1" stopColor="#b77d4f"/></linearGradient>
                  </defs>
                  <rect width="900" height="620" fill="url(#bengal-sky)" />
                  <circle cx="685" cy="155" r="72" fill="#fff2cf" opacity=".88" />
                  <path d="M0 305 Q160 220 322 296 T650 282 T900 270 V620 H0Z" fill="#aab17a" />
                  <path d="M0 360 Q185 292 350 354 T690 334 T900 330 V620 H0Z" fill="url(#bengal-field)" />
                  <path d="M260 620 Q370 450 485 391 Q590 334 710 327 Q582 396 577 620Z" fill="url(#bengal-path)" />
                  <path d="M0 420 Q125 383 244 418 V620 H0Z" fill="#66794c" opacity=".75" />
                  <path d="M0 492 Q110 458 246 500 M4 526 Q116 492 246 534 M20 562 Q126 526 244 571" fill="none" stroke="#d4bd77" strokeWidth="5" opacity=".68" />
                  <path d="M641 405 L710 349 L779 405 V486 H641Z" fill="#bc6946" />
                  <path d="M624 406 L710 333 L796 406Z" fill="#694438" />
                  <path d="M677 432 H701 V472 H677Z M725 428 H751 V454 H725Z" fill="#f2cf91" />
                  <path d="M686 486 Q720 470 748 486" fill="none" stroke="#633f2b" strokeWidth="7" />
                  <g fill="#40553b"><circle cx="160" cy="310" r="53"/><circle cx="112" cy="332" r="38"/><circle cx="204" cy="340" r="38"/><path d="M151 335h20v96h-20z" fill="#70503b"/><circle cx="828" cy="295" r="54"/><circle cx="782" cy="317" r="36"/><circle cx="868" cy="324" r="35"/><path d="M817 323h20v108h-20z" fill="#70503b"/></g>
                  <g fill="#f7e2bd" opacity=".78"><circle cx="112" cy="163" r="4"/><circle cx="174" cy="114" r="3"/><circle cx="337" cy="181" r="3"/><circle cx="547" cy="121" r="4"/><circle cx="769" cy="234" r="3"/></g>
                </svg>
              </div>
              <div className="absolute -bottom-4 left-3 flex items-center gap-3 rounded-2xl border border-white/80 bg-white/95 px-4 py-3 shadow-xl sm:left-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3ead9] text-[var(--primary-terracotta)]"><Coffee size={20} /></span>
                <span><strong className="block text-sm text-[#292521]">Slow mornings, local stories</strong><span className="text-xs text-gray-500">Your Shantiniketan escape</span></span>
              </div>
              <div className="absolute right-3 top-4 rounded-full border border-white/70 bg-[#fff9ef]/90 px-3 py-1.5 text-xs font-semibold text-[#594838] shadow-sm sm:right-6 sm:top-6">A little closer to Bengal</div>
            </div>
          </div>

          <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-3 px-4 pb-10 pt-6 sm:grid-cols-2 sm:px-6 lg:pb-14">
            {properties.map((prop, index) => (
              <button key={prop.id} type="button" onClick={() => { handleSelectLocation(prop.slug); document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" }); }} className={`animate-rise-in group flex items-center gap-4 rounded-2xl border bg-white/80 p-4 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:bg-white hover:shadow-lg sm:p-5 ${selectedLocation === prop.slug ? "border-[var(--primary-terracotta)] ring-2 ring-[var(--primary-terracotta)]/15" : "border-white/80 hover:border-[var(--primary-terracotta)]/50"}`} style={{ animationDelay: `${index * 100}ms` }}>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f4e8d6] text-[var(--primary-terracotta)] transition-transform duration-200 group-hover:scale-105"><MapPin size={22} /></span>
                <span className="min-w-0 flex-1"><strong className="block text-sm text-[#292521] sm:text-base">Stay in {index === 0 ? "Bolpur" : "Shantiniketan"}</strong><span className="mt-0.5 block text-xs text-gray-500 sm:text-sm">{prop.description}</span></span>
                <ArrowRight size={18} className="shrink-0 text-[var(--primary-terracotta)] transition-transform group-hover:translate-x-1" />
              </button>
            ))}
          </div>
          {showDemoBadge && <p className="relative mx-auto w-fit rounded-t-lg bg-[var(--deep-burnt-sienna)] px-4 py-2 text-xs font-medium text-[var(--warm-cream)]">Demo preview · Sample stays and prices</p>}
        </section>

        {/* Main Booking Search */}
        <section id="booking" className="scroll-mt-24 bg-[var(--warm-cream)] py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-[var(--dark-charcoal)] mb-4">
                  Search Available Rooms
                </h2>
                <p className="text-[var(--dark-charcoal)/70] mb-6">
                  Select your property, dates, and occupancy to find available rooms.
                </p>
                
                {/* Booking Search Form */}
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch();
                  }}
                  className="animate-rise-in space-y-4"
                >
                  {/* Location Selection */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--dark-charcoal)] mb-2">
                      Select Location
                    </label>
                    <select
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2"
                      value={selectedLocation || ""}
                      onChange={(event) => handleSelectLocation(event.target.value)}
                    >
                      <option value="">Choose a property...</option>
                      {properties.map((prop) => <option key={prop.id} value={prop.slug}>{prop.name}</option>)}
                    </select>
                    {selectedLocation && (
                      <p className="mt-2 text-xs text-[var(--dark-charcoal)/60]">
                        {properties.find(p => p.slug === selectedLocation)?.description || ""}
                      </p>
                    )}
                  </div>
                  
                  {/* Date Selection */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--dark-charcoal)] mb-2">
                      Check-in Date
                    </label>
                    <div className="flex items-center gap-2">
                      <input type="date" min={new Date().toISOString().split("T")[0]} value={checkIn?.toISOString().split("T")[0] || ""} onChange={(event) => event.target.value && handleDateSelect(new Date(`${event.target.value}T00:00:00`), "check-in")} className="flex-1" />
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.714 8.714L12 12m0 0L15.286 3.286m-5.984 5.984L21 21m0 0L3.286 15.286m5.984-5.984L12 12m0 0L3.286 8.714"/>
                      </svg>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-[var(--dark-charcoal)] mb-2">
                        Check-out Date
                      </label>
                      <div className="flex items-center gap-2">
                        <input type="date" min={checkIn?.toISOString().split("T")[0] || new Date().toISOString().split("T")[0]} value={checkOut?.toISOString().split("T")[0] || ""} onChange={(event) => event.target.value && handleDateSelect(new Date(`${event.target.value}T00:00:00`), "check-out")} className="flex-1" />
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.714 8.714L12 12m0 0L15.286 3.286m-5.984 5.984L21 21m0 0L3.286 15.286m5.984-5.984L12 12m0 0L3.286 8.714"/>
                        </svg>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[var(--dark-charcoal)] mb-2">
                        Occupancy
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input type="radio" name="occupancy" checked={adults === 2 && children === 0} onChange={() => { setAdults(2); setChildren(0); }} className="h-4 w-4 accent-[var(--primary-terracotta)]" />
                          <span className="text-sm">2 Adults</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input type="radio" name="occupancy" checked={adults === 1 && children === 2} onChange={() => { setAdults(1); setChildren(2); }} className="h-4 w-4 accent-[var(--primary-terracotta)]" />
                          <span className="text-sm">1 Adult + 2 Children</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input type="radio" name="occupancy" checked={adults === 3 && children === 0} onChange={() => { setAdults(3); setChildren(0); }} className="h-4 w-4 accent-[var(--primary-terracotta)]" />
                          <span className="text-sm">3 Adults</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-[var(--dark-charcoal)] mb-2">
                        Rooms
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setRooms((count) => Math.max(1, count - 1))}
                          aria-label="Remove a room"
                          className="rounded-md bg-[var(--primary-terracotta)] px-3 py-2 text-sm font-medium text-white hover:bg-[var(--deep-burnt-sienna)] transition-colors"
                        >
                          −
                        </button>
                        <span className="min-w-8 text-center text-sm">{rooms}</span>
                        <button
                          type="button"
                          onClick={() => setRooms((count) => Math.min(6, count + 1))}
                          aria-label="Add a room"
                          className="rounded-md bg-[var(--primary-terracotta)] px-3 py-2 text-sm font-medium text-white hover:bg-[var(--deep-burnt-sienna)] transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={!selectedLocation || loading}
                    className="w-full flex justify-center py-3 px-4 mt-6 text-lg font-medium text-white bg-[var(--primary-terracotta)] rounded-lg hover:bg-[var(--deep-burnt-sienna)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Searching..." : "Search Available Rooms"}
                  </button>
                </form>
              </div>
              
              {/* Availability Preview */}
              {selectedLocation && showAvailability && !loading && (
                <div className="animate-rise-in border-l 4 border-[var(--primary-terracotta)] p-6 bg-[var(--ivory)]">
                  <h3 className="text-xl font-bold text-[var(--dark-charcoal)] mb-4">
                    Availability Results
                  </h3>
                  {availabilityResults.map((room) => (
                    <div key={room.id} className="animate-rise-in p-4 rounded-lg mb-3 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--muted-ivory)]" style={{ animationDelay: `${availabilityResults.findIndex((item) => item.id === room.id) * 70}ms` }}>
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-[var(--dark-charcoal)]">
                          {room.name} ({room.isAC ? "AC" : "Non-AC"})
                        </span>
                        <span className="text-sm text-[var(--dark-charcoal)/60]">
                          {room.availabilityMessage}
                        </span>
                      </div>
                      <div className="text-sm text-[var(--dark-charcoal)/70] mb-2">
                        <span className="font-medium">₹{room.pricePerNight} per night</span>
                        × {room.nights} nights
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">₹{room.basePrice}</span>
                        <span className="font-semibold">₹{room.totalWithTax}</span>
                      </div>
                      {room.availability === "available" && (
                        <button
                          onClick={() => alert(`Booking ${room.name} - Availability checked`)}
                          className="mt-2 w-full py-2 px-3 text-sm font-medium text-white bg-[var(--primary-terracotta)] rounded-lg hover:bg-[var(--deep-burnt-sienna)] transition-colors"
                        >
                          Check Availability
                        </button>
                      )}
                      {room.availability === "sold_out" && (
                        <p className="mt-2 text-sm text-red-600">
                          {room.availabilityMessage}
                        </p>
                      )}
                    </div>
                  ))}
                  {availabilityResults.every(r => r.availability === "sold_out") && (
                    <p className="mt-4 text-sm text-[var(--dark-charcoal)/60]">
                      No rooms available for the selected dates. Try different dates or location.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Property Highlights */}
        <section id="rooms" className="scroll-mt-24 bg-[#f4efe5] py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
              <div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary-terracotta)]">Stay a little longer</p><h2 className="mt-2 text-3xl font-bold tracking-tight text-[var(--dark-charcoal)] sm:text-4xl">Rooms for your Bengal getaway</h2><p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--dark-charcoal)]/70 sm:text-base">Compare room styles and nightly prices. Hover or tap a room for a quick look at what’s included.</p></div>
              <a href="#booking" className="inline-flex shrink-0 items-center gap-2 self-start rounded-lg px-1 py-2 text-sm font-semibold text-[var(--primary-terracotta)] transition hover:gap-3 sm:self-auto">Check your dates <ArrowRight size={16} /></a>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {properties.flatMap((prop) => prop.roomCategories.map((cat, roomIndex) => {
                const previewOpen = hoveredRoomId === cat.id;
                const roomMood = ["from-[#d8c89c] via-[#a2ae7a] to-[#526749]", "from-[#ead5b4] via-[#c2875f] to-[#8f4d37]", "from-[#c8d2b1] via-[#93a475] to-[#596e4f]"][roomIndex % 3];
                return (
                  <article key={cat.id} onMouseEnter={() => setHoveredRoomId(cat.id)} onMouseLeave={() => setHoveredRoomId(null)} className="animate-rise-in group overflow-hidden rounded-2xl border border-[#e6ddcf] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl" style={{ animationDelay: `${roomIndex * 75}ms` }}>
                    <div className={`room-art relative h-48 overflow-hidden bg-gradient-to-br ${roomMood}`}>
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_68%_22%,rgba(255,241,197,0.9)_0,rgba(255,241,197,0.45)_13%,transparent_14%),linear-gradient(170deg,transparent_50%,rgba(43,68,43,0.18)_51%)]" />
                      <div className="absolute -bottom-10 -left-10 h-36 w-[120%] rotate-[-7deg] rounded-[50%] bg-[#536d4a]/75" />
                      <div className="absolute -bottom-14 -right-12 h-32 w-[82%] rotate-[8deg] rounded-[50%] bg-[#344e39]/75" />
                      <div className="absolute bottom-0 left-[18%] h-20 w-24"><div className="absolute bottom-0 left-1/2 h-12 w-16 -translate-x-1/2 rounded-t-sm bg-[#b66343]"/><div className="absolute bottom-10 left-1/2 h-0 w-0 -translate-x-1/2 border-b-[28px] border-l-[45px] border-r-[45px] border-b-[#62463a] border-l-transparent border-r-transparent"/><div className="absolute bottom-3 left-8 h-5 w-4 bg-[#f1d393]"/></div>
                      <span className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-[#473e32] backdrop-blur">{prop.name.split(" - ")[1]}</span>
                      <button type="button" onClick={() => setHoveredRoomId((activeId) => activeId === cat.id ? null : cat.id)} aria-expanded={previewOpen} className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-[var(--primary-terracotta)] shadow-sm transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2">{previewOpen ? "Close details" : "Quick details"}</button>
                      <div className={`absolute inset-x-3 bottom-3 rounded-xl border border-white/70 bg-white/95 p-4 shadow-xl backdrop-blur transition-all duration-300 ${previewOpen ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"}`}>
                        <p className="text-sm font-bold text-[#292521]">{cat.name} · {cat.isAC ? "Air-conditioned" : "Naturally airy"}</p>
                        <p className="mt-1 text-xs leading-relaxed text-gray-600">{cat.hasFood ? "Bengali meals can be arranged for your stay." : "A comfortable base for exploring Bolpur and Shantiniketan."}</p>
                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-[#554b40]"><span className="inline-flex items-center gap-1"><UsersRound size={14}/>{cat.maxOccupancy} guests</span><span className="inline-flex items-center gap-1"><Wifi size={14}/>Wi-Fi</span>{cat.hasFood && <span className="inline-flex items-center gap-1"><Coffee size={14}/>Food available</span>}</div>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold text-[var(--dark-charcoal)]">{cat.name}</h3><p className="mt-1 text-sm text-gray-500">{cat.isAC ? "Air-conditioned" : "Non-AC"} · up to {cat.maxOccupancy} guests</p></div><span className="shrink-0 rounded-full bg-[#f6eee2] px-2.5 py-1 text-[11px] font-semibold text-[#6e5942]">{prop.name.split(" - ")[1]}</span></div>
                      <div className="mt-5 flex items-end justify-between border-t border-gray-100 pt-4"><p className="text-xs text-gray-500">Starting from</p><p className="text-lg font-bold text-[var(--primary-terracotta)]">₹{cat.pricePerNight}<span className="text-xs font-medium text-gray-500"> / night</span></p></div>
                      <a href="#booking" onClick={() => handleSelectLocation(prop.slug)} className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[var(--primary-terracotta)] px-4 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-[var(--deep-burnt-sienna)]">Choose this stay <ArrowRight size={16}/></a>
                    </div>
                  </article>
                );
              }))}
            </div>
          </div>
        </section>

        {/* Food & Hospitality Section */}
        <section className="py-16 bg-[var(--warm-cream)]">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-4xl font-bold text-[var(--dark-charcoal)] mb-4">
                  Food & Hospitality
                </h2>
                <p className="text-[var(--dark-charcoal)/70] mb-6">
                  Our homestay offers traditional Bengali cuisine and warm hospitality. 
                  Food inclusion depends on the selected room package.
                </p>
                
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FacilityCard icon="Utensils" title="Breakfast" description="Traditional Bengali breakfast available on request" included={true} />
                  <FacilityCard icon="Utensils" title="Lunch" description="Traditional Bengali lunch (thali)" included={false} />
                  <FacilityCard icon="Utensils" title="Dinner" description="Homemade Bengali dinner" included={false} />
                  <FacilityCard icon="Leaf" title="Tea/Refreshments" description="Complimentary tea and refreshments" included={true} />
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-[var(--primary-terracotta)] mb-2">
                    Dietary Requirements
                  </h3>
                  <p className="text-sm text-[var(--dark-charcoal)/70]">
                    Vegetarian and non-vegetarian options available. Please inform us of any special dietary requests at least 24 hours before arrival.
                  </p>
                </div>
              </div>
              
              {/* Mock kitchen/food image placeholder */}
              <div className="relative h-64 rounded-2xl overflow-hidden bg-[var(--ivory)]">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--ivory)] to-[var(--warm-cream)] opacity-80" />
                <div className="relative transform-gpu rotate-y-180">
                  <div className="absolute inset-0 flex items-center justify-center text-center text-[var(--dark-charcoal)/50]">
                    <div className="w-24 h-24 rounded-xl border border-gray-200/50 flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H8mxzC3.219 13.378-1.08 18.095-1.08 18.095S3.565 22 8 22s9.055-5.348 10.917-7a15.367 15.367 0 01-1.08-2.016 8.224 8.224 0 00-6.118-2.061m0 0Z\"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Amenities Section */}
        <section className="py-16 bg-[var(--muted-ivory)]">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-[var(--dark-charcoal)] mb-8 text-center">
              Property Amenities
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* Amenity cards will be populated per property */}
              <AmenityCard name="Wi-Fi" description="High-speed internet access" />
              <AmenityCard name="Attached Bathroom" description="Private bathroom with hot and cold water" />
              <AmenityCard name="Air Conditioning" description="Individually controlled AC" />
              <AmenityCard name="Hot Water" description="24-hour hot water supply" />
              <AmenityCard name="Television" description="LED TV with cable channels" />
              <AmenityCard name="Parking" description="Free on-site parking" />
              <AmenityCard name="Outdoor Seating" description="Garden or balcony seating area" />
            </div>
          </div>
        </section>

        {/* Location & Navigation */}
        <section id="locations" className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-[var(--dark-charcoal)] mb-8 text-center">
              Our Locations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((prop) => (
                <div
                  key={prop.id}
                  className="rounded-2xl border p-6 hover:border-[var(--primary-terracotta)] transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--muted-ivory)] flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-[var(--primary-terracotta)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[var(--dark-charcoal)]">
                        {prop.name}
                      </h3>
                      <p className="mt-1 text-sm text-[var(--dark-charcoal)/70]">
                        {prop.address}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200/50">
                    <a
                      href={prop.googleMapsURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--primary-terracotta)] font-medium hover:underline"
                    >
                      Get Directions
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About & Contact */}
        <section className="py-16 bg-[var(--dark-charcoal)] text-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  About Kunja Homestay
                </h2>
                <p className="text-[var(--warm-cream)/80] leading-relaxed">
                  Kunja Homestay offers a unique hospitality experience in the heart of Bolpur-Shantiniketan, West Bengal. Inspired by traditional Bengali architecture and terracotta craftsmanship, our homestays provide a warm, welcoming environment where guests can experience authentic Bengali hospitality.
                </p>
                <p className="mt-4 text-[var(--warm-cream)/80] leading-relaxed">
                  We have two properties operating in complementary locations — Location A in Bolpur and Location B in Shantiniketan. Both properties offer comfortable accommodation with modern amenities while maintaining the cultural charm of a traditional Bengali homestay.
                </p>
              </div>
              
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded bg-[var(--primary-terracotta)] flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[var(--warm-cream)]" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7 7 7-7"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="mt-1 text-[var(--warm-cream)/70]">+91 3463 255 500</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded bg-[var(--primary-terracotta)] flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[var(--warm-cream)]" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7 7 7-7"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="mt-1 text-[var(--warm-cream)/70]">info@kunjahomestay.in</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded bg-[var(--primary-terracotta)] flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[var(--warm-cream)]" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7 7 7-7"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="mt-1 text-[var(--warm-cream)/70]">Bolpur–Shantiniketan, Birbhum, West Bengal, India</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200/50 py-12 bg-[var(--dark-charcoal)] text-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              <div className="col-span-2">
                <div className="w-12 h-12 rounded-full bg-[var(--primary-terracotta)] flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[var(--warm-cream)]" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7 7 7-7"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4">Kunja Homestay</h3>
                <p className="text-[var(--warm-cream)/70]">
                  Traditional Bengali homestay in Bolpur-Shantiniketan, West Bengal, India
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-3">Property Shortcuts</h4>
                <ul className="space-y-2 text-[var(--warm-cream)/70]">
                  <li><a href="#" className="hover:text-[var(--primary-terracotta)] transition-colors">Location A</a></li>
                  <li><a href="#" className="hover:text-[var(--primary-terracotta)] transition-colors">Location B</a></li>
                  <li><a href="#" className="hover:text-[var(--primary-terracotta)] transition-colors">Rooms</a></li>
                  <li><a href="#" className="hover:text-[var(--primary-terracotta)] transition-colors">Booking</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Policies</h4>
                <ul className="space-y-2 text-[var(--warm-cream)/70]">
                  <li><a href="#" className="hover:text-[var(--primary-terracotta)] transition-colors">Check-in/Check-out</a></li>
                  <li><a href="#" className="hover:text-[var(--primary-terracotta)] transition-colors">Cancellation</a></li>
                  <li><a href="#" className="hover:text-[var(--primary-terracotta)] transition-colors">Booking Policy</a></li>
                  <li><a href="#" className="hover:text-[var(--primary-terracotta)] transition-colors">Refund Policy</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Contact</h4>
                <ul className="space-y-2 text-[var(--warm-cream)/70]">
                  <li><a href="tel:+913463255500" className="hover:text-[var(--primary-terracotta)] transition-colors">+91 3463 255 500</a></li>
                  <li><a href="mailto:info@kunjahomestay.in" className="hover:text-[var(--primary-terracotta)] transition-colors">info@kunjahomestay.in</a></li>
                </ul>
              </div>
            </div>
            
            <div className="pt-8 border-t border-gray-700/50 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-[var(--warm-cream)/50]">
                © {new Date().getFullYear()} Kunja Homestay. All rights reserved.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-[var(--warm-cream)/50] hover:text-[var(--primary-terracotta)] transition-colors" aria-label="Twitter">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 11-6.47 2.93A9.953 9.953 0 0124 4.57zM9.97 15.53c.03-.2.04-.41.04-.63 0-.22-.18-.45-.44-.63A7.976 7.976 0 002 9.5c0-2.06 1.66-3.74 3.75-4.04.941-.15 1.84-.28 2.73-.39.17-.03.38-.05.6-.05.22 0 .44.03.6.05.44.11.85.18 1.33.26A7.956 7.956 0 0122 4.57c0 .37-.03.72-.08 1.08.01.36-.11.68-.26 1.01-.28.18-.3.26-.63.26-1.01m-13.42 6.41l1.05-.06A5.975 5.975 0 0112 5.5 5.975 5.975 0 015.98 13.07l1.05.06.51.02a1 1 0 00.77.22 5.936 5.936 0 00-1.05-.11l-.5-.03a5.941 5.941 0 00-2.25-.06l-.51-.03c-.26-.01-.51-.02-.76-.02-.26 0-.5.01-.76.02-.19.01-.4.01-.51.02a5.967 5.967 0 01-.67-.55l-.55-.15a5.904 5.904 0 01-.16-.77 5.928 5.928 0 00-.27-1.29c0-.39-.06-.78-.17-1.16a13.996 13.996 0 00-.05-2.03m0 6.32a7.996 7.996 0 014.918-1.05c.03-.02.06-.04.08-.07.06-.08.09-1.06.09-1.14 0-.08-.03-.16-.05-.25a5.956 5.956 0 01-.18-.26 5.998 5.998 0 00-.27-.03m0-6.32a7.996 7.996 0 00-4.918-1.05c-.03-.02-.06-.04-.08-.07-.05-.08-.09-1.06-.09-1.14 0-.08.03-.16.05-.25a5.956 5.956 0 01.18-.26 5.998 5.998 0 00.27-.03m-5.16 6.42l1.05.06a1 1 0 01.77.22 5.936 5.936 0 001.05-.11l.51-.03c.26-.01.51-.02.76-.02.26 0 .5.01.76.02.19.01.4.01.51.02a5.967 5.967 0 01.67.55l.55.15a5.904 5.904 0 01.16.77 5.928 5.928 0 00.27 1.29c0 .39.06.78.17 1.16a13.996 13.996 0 00.05 2.03"/>
                  </svg>
                </a>
                <a href="#" className="text-[var(--warm-cream)/50] hover:text-[var(--primary-terracotta)] transition-colors" aria-label="Facebook">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 3.525l2.25 3.556a4.884 4.884 0 00.615-.751 4.906 4.906 0 00-.177-3.094l-1.088-.085a4.896 4.896 0 00-3.508 4.028 4.936 4.936 0 002.255 2.297l.027.005zm-11.128 2.155c-.052-.174-.106-.347-.16-.52-.068-.195-.117-.395-.135-.595-.009-.059-.016-.117-.016-.176 0-.157.016-.314.049-.471a14.968 14.968 0 015.685-2.256l-.087-.006a14.973 14.973 0 015.686 2.256c.026.157.039.318.039.471 0 .195-.033.374-.102.557l1.088.094a8.017 8.017 0 005.782 1.258l-.015.003.008.005c.014.01.02.02.03.03.16.224.29 1.014.29 2.225 0 1.21-.113 2.275-.31 3.155a7.789 7.789 0 01-1.223.827l-.135.075a7.795 7.795 0 01-1.23-.83 7.8 7.8 0 01-.783-1.594c-.069-.389-.146-.815-.18-1.16-.035-.358-.066-.737-.066-1.13 0-.392.032-.769.08-1.117.067-.2.103-.42.157-.585.078-.18.17-.37.285-.57.13-.23.2-.43.246-.63.03-.1.02-.2.02-.29 0-.389 0-.766-.01-1.136a11.966 11.966 0 00-1.428-.608l-.078-.005z"/>
                  </svg>
                </a>
                <a href="#" className="text-[var(--warm-cream)/50] hover:text-[var(--primary-terracotta)] transition-colors" aria-label="Instagram">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c2.785 0 5.062 2.233 5.062 5.005 0 1.492-.41 2.828-1.128 3.871a7.795 7.795 0 00-.597 1.775c-.124.29-.26.548-.432.747a7.172 7.172 0 01-1.082.316 7.166 7.166 0 01-.887-.165 7.161 7.161 0 00-1.027-.357 7.159 7.159 0 00-.401-.856 7.165 7.165 0 00-1.119-.738 7.162 7.162 0 00-.788-1.268c.097-.638.202-1.246.308-1.838a5.486 5.486 0 01.376-1.046 5.485 5.486 0 00-.185-1.05c-.022-.33-.058-.656-.089-.979a13.912 13.912 0 00-.06-.687 13.92 13.92 0 00-.047-1.256c0-.563.134-1.096.399-1.569a5.477 5.477 0 011.028-.37 5.476 5.477 0 011.161.226c.23.088.454.16 1.226.218a13.901 13.901 0 012.162.063c.308.018.61.01 .907-.01.255-.083.496-.18.706-.23.327-.066.653-.116.955-.137a10.087 10.087 0 012.355.332c.24.033.532.046.76.05.23.01.46.01.688.01.213 0 .41-.01.6-.01.243 0 .519.01.672.02a13.949 13.949 0 00.264.075c.162.02.321.033.474.033.157 0 .313-.013.465-.033.125-.164.197-.36.22-.544.01-.229.01-.458.015-.686.01-.294 0-.577 0-.861 0a13.955 13.955 0 00-.284.037l-.006.003a11.922 11.922 0 01-.614.161c-.16.098-.33.187-.5.27a9.963 9.963 0 01-.741.264c-.134.047-.27.07-.405.07-.17 0-.339-.013-.5-.04a9.067 9.067 0 01-.3-.375l.003-.016zm5.431 11.476a6.977 6.977 0 100-13.954 6.977 6.977 0 000 13.954zM7.538 3.808c.113 0 .226.01.339.02.148.02.286.04.41.03.132-.01.274-.02.415-.03.142-.01.295 0 .432.02.138.02.27.03.403.05.128.02.257.04.382.04.137 0 .274-.02.405-.05.13-.03.258-.05.38-.08.127-.05.254-.08.375-.05.121.03.243.05.354.05.12.01.237.01.355 0 .129-.01.251-.02.363-.03.105-.01.208-.03.303-.05.096-.02.188-.04.373-.05.078-.01.153-.01.226 0 .07.01.137.02.205.03a7.792 7.792 0 00.18.316 7.788 7.788 0 00.116.332c0 .11.01.22.01.33 0 .229-.01.448-.02.653a5.987 5.987 0 01-.192.338l-.006.012c-.19.04-.449.057-.676.05-.25 0-.501 0-.741-.01a7.732 7.732 0 01-.382-.23l-.005-.002c-.078.02-.153.06-.225.08-.06.02-.12.05-.183.06-.1.02-.2.03-.288.04-.1.03-.149.05-.196.03-.059.04-.114.05-.169.05-.066 0-.132 0-.196 0a7.719 7.719 0 01-.188-.263l-.002-.003z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
  );
}
