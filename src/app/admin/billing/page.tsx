"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, BedDouble, Calculator, CalendarDays, FileText, Printer, ReceiptText } from "lucide-react";
import { formatINR, type BillingQuote } from "../../../lib/billing";

const roomOptions = [
  { name: "Location A · Non-AC Standard", rate: 1500 },
  { name: "Location A · AC Deluxe", rate: 2500 },
  { name: "Location A · Family Room", rate: 4000 },
  { name: "Location B · Non-AC Standard", rate: 1600 },
  { name: "Location B · AC Deluxe", rate: 2800 },
  { name: "Location B · Cottage Suite", rate: 3500 },
];

export default function BillingPage() {
  const [guest, setGuest] = useState("");
  const [reference, setReference] = useState("");
  const [businessName, setBusinessName] = useState("Kunja Homestay");
  const [businessAddress, setBusinessAddress] = useState("");
  const [gstin, setGstin] = useState("");
  const [roomIndex, setRoomIndex] = useState(1);
  const [roomCount, setRoomCount] = useState(1);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [quote, setQuote] = useState<BillingQuote | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const selectedRoom = roomOptions[roomIndex];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const guestParam = params.get("guest");
    const referenceParam = params.get("reference");
    const checkInParam = params.get("checkIn");
    const checkOutParam = params.get("checkOut");
    const roomIndexRaw = params.get("roomIndex");
    const roomIndexParam = roomIndexRaw === null ? -1 : Number(roomIndexRaw);
    if (guestParam) setGuest(guestParam);
    if (referenceParam) setReference(referenceParam);
    if (checkInParam && /^\d{4}-\d{2}-\d{2}$/.test(checkInParam)) setCheckIn(checkInParam);
    if (checkOutParam && /^\d{4}-\d{2}-\d{2}$/.test(checkOutParam)) setCheckOut(checkOutParam);
    if (Number.isInteger(roomIndexParam) && roomIndexParam >= 0 && roomIndexParam < roomOptions.length) setRoomIndex(roomIndexParam);
  }, []);

  async function generateQuote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setQuote(null);
    setLoading(true);
    try {
      const response = await fetch("/api/billing/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkIn, checkOut, roomCount, nightlyRatePaise: selectedRoom.rate * 100 }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not calculate the bill.");
      setQuote(result);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not calculate the bill. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#292521]">
      <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-[#eee9e2] bg-white/95 px-5 backdrop-blur sm:px-8">
        <a href="/admin" className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[var(--primary-terracotta)]"><ArrowLeft size={17} /> Admin dashboard</a>
        <a href="/" className="text-sm font-semibold">Kunja Homestay</a>
      </header>
      <div className="mx-auto max-w-6xl space-y-7 p-5 sm:p-8">
        <section><p className="text-sm font-medium text-[var(--primary-terracotta)]">ADMIN WORKSPACE / BILLING</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Create a bill</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">Calculate a stay total from room rate, number of rooms and nights. GST is shown separately at 5%.</p></section>

        <div className="grid items-start gap-6 lg:grid-cols-[1fr_0.9fr]">
          <form onSubmit={generateQuote} className="space-y-5 rounded-2xl border border-[#eee9e2] bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-center gap-3 border-b border-[#f0eeeb] pb-4"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f8eee9] text-[var(--primary-terracotta)]"><Calculator size={20} /></span><div><h2 className="font-semibold">Stay details</h2><p className="text-xs text-gray-500">Enter the booking details to calculate</p></div></div>
            <div className="rounded-xl border border-[#eee9e2] p-4"><h3 className="text-sm font-semibold">Business details for the bill</h3><p className="mt-1 text-xs text-gray-500">Fill in verified details before issuing an invoice.</p><div className="mt-3 grid gap-3 sm:grid-cols-2"><Field label="Business name"><input value={businessName} onChange={(e) => setBusinessName(e.target.value)} className={inputClass} maxLength={120} required /></Field><Field label="GSTIN (if applicable)"><input value={gstin} onChange={(e) => setGstin(e.target.value.toUpperCase())} placeholder="Enter registered GSTIN" className={inputClass} maxLength={15} /></Field><div className="sm:col-span-2"><Field label="Business address"><textarea value={businessAddress} onChange={(e) => setBusinessAddress(e.target.value)} placeholder="Enter registered business address" className={`${inputClass} min-h-20 resize-y`} maxLength={500} /></Field></div></div></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Guest name"><input value={guest} onChange={(e) => setGuest(e.target.value)} placeholder="Guest name" className={inputClass} maxLength={100} /></Field>
              <Field label="Booking reference"><input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Optional reference" className={inputClass} maxLength={40} /></Field>
            </div>
            <Field label="Property and room type"><select value={roomIndex} onChange={(e) => { setRoomIndex(Number(e.target.value)); setQuote(null); }} className={inputClass}>{roomOptions.map((room, index) => <option key={room.name} value={index}>{room.name} · {formatINR(room.rate * 100)} / night</option>)}</select></Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Check-in"><input type="date" required value={checkIn} onChange={(e) => { setCheckIn(e.target.value); setQuote(null); }} className={inputClass} /></Field>
              <Field label="Check-out"><input type="date" required value={checkOut} onChange={(e) => { setCheckOut(e.target.value); setQuote(null); }} className={inputClass} /></Field>
              <Field label="Rooms"><input type="number" required min={1} max={50} step={1} value={roomCount} onChange={(e) => { setRoomCount(Number(e.target.value)); setQuote(null); }} className={inputClass} /></Field>
            </div>
            <div className="rounded-xl bg-[#faf7f4] p-4 text-sm text-gray-600"><BedDouble size={17} className="mr-2 inline text-[var(--primary-terracotta)]" />Rate used: <strong className="text-[#292521]">{formatINR(selectedRoom.rate * 100)}</strong> per room, per night</div>
            {error && <p role="alert" className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
            <button disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary-terracotta)] px-5 py-3 font-semibold text-white transition hover:brightness-95 disabled:cursor-wait disabled:opacity-60"><Calculator size={17} />{loading ? "Calculating…" : "Calculate bill"}</button>
          </form>

          <section aria-live="polite" className="overflow-hidden rounded-2xl border border-[#eee9e2] bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-[#eee9e2] bg-[#fffdfa] p-5 sm:p-7"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f8eee9] text-[var(--primary-terracotta)]"><ReceiptText size={20} /></span><div><h2 className="font-semibold">Bill preview</h2><p className="text-xs text-gray-500">Draft estimate · Not issued</p></div></div>
            {quote ? <div className="space-y-5 p-5 sm:p-7">
              <div className="flex justify-between gap-3 text-sm"><div><strong className="block">{businessName.trim() || "Business name"}</strong><span className="block whitespace-pre-line text-gray-500">{businessAddress.trim() || "Business address not provided"}</span>{gstin && <span className="mt-1 block text-gray-500">GSTIN: {gstin}</span>}<strong className="mt-3 block text-[#292521]">Bill to: {guest.trim() || "Guest name"}</strong><span className="text-gray-500">{reference.trim() || "No booking reference"}</span></div><FileText size={18} className="shrink-0 text-gray-400" /></div>
              <div className="rounded-xl border border-[#eee9e2] p-4 text-sm"><div className="flex items-start gap-2"><CalendarDays size={17} className="mt-0.5 shrink-0 text-[var(--primary-terracotta)]" /><div><strong className="block">{selectedRoom.name}</strong><span className="text-gray-500">{checkIn} → {checkOut}</span><span className="mt-1 block text-gray-500">{quote.nights} {quote.nights === 1 ? "night" : "nights"} × {quote.roomCount} {quote.roomCount === 1 ? "room" : "rooms"} × {formatINR(quote.nightlyRatePaise)}</span></div></div></div>
              <div className="space-y-3 text-sm"><TotalRow label={`Room charges · ${quote.nights} ${quote.nights === 1 ? "night" : "nights"}`} value={formatINR(quote.subtotalPaise)} /><TotalRow label={`GST (${quote.gstRatePercent}%)`} value={formatINR(quote.gstPaise)} /><div className="border-t border-dashed border-[#ddd6ce] pt-4"><TotalRow label="Total amount including GST" value={formatINR(quote.totalPaise)} strong /></div></div>
              <div className="rounded-lg bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800">Draft estimate only. Confirm the applicable GST treatment and business details, then add the final invoice template before issuing a tax invoice.</div>
              <button type="button" onClick={() => window.print()} className="print:hidden inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#e8e2db] px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-[#faf9f7]"><Printer size={16} /> Print preview</button>
            </div> : <div className="flex min-h-80 flex-col items-center justify-center px-8 py-12 text-center"><span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#faf7f4] text-[#a69a8f]"><ReceiptText size={24} /></span><h3 className="mt-4 font-semibold">Your bill will appear here</h3><p className="mt-2 max-w-xs text-sm leading-6 text-gray-500">Add the stay dates and room details, then calculate to see the subtotal, GST and final total.</p></div>}
          </section>
        </div>
        <p className="text-center text-xs text-gray-400">Demo billing workspace · Rates are sample values and calculations are not saved.</p>
      </div>
      <style jsx global>{`@media print { body { background: #fff !important; } body * { visibility: hidden; } [aria-live="polite"], [aria-live="polite"] * { visibility: visible; } [aria-live="polite"] { position: absolute; inset: 0; border: 0 !important; box-shadow: none !important; width: 100%; } }`}</style>
    </main>
  );
}

const inputClass = "mt-1.5 w-full rounded-lg border border-[#e7e2dc] bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[var(--primary-terracotta)] focus:ring-2 focus:ring-[var(--primary-terracotta)]/10";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-gray-700">{label}{children}</label>;
}

function TotalRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return <div className={`flex items-center justify-between gap-3 ${strong ? "text-base font-bold" : "text-gray-600"}`}><span>{label}</span><span className={strong ? "text-[var(--primary-terracotta)]" : "font-medium text-[#292521]"}>{value}</span></div>;
}
