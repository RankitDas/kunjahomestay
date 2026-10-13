"use client";

import { useState } from "react";
import { Activity, ArrowDownRight, ArrowUpRight, BedDouble, CalendarDays, Check, ChevronDown, CircleDollarSign, Download, LayoutDashboard, LogOut, Menu, MoreHorizontal, ReceiptText, Search, Settings, Users, X } from "lucide-react";

const bookings = [
  { ref: "KH-2026-1048", guest: "Ananya Mukherjee", email: "ananya.m@example.com", property: "Location A", checkIn: "Oct 18, 2026", checkOut: "Oct 21, 2026", amount: "₹7,875", status: "Confirmed" },
  { ref: "KH-2026-1047", guest: "Rahul Sen", email: "rahul.sen@example.com", property: "Location B", checkIn: "Oct 19, 2026", checkOut: "Oct 22, 2026", amount: "₹8,820", status: "Pending" },
  { ref: "KH-2026-1046", guest: "Priya Das", email: "priya.das@example.com", property: "Location A", checkIn: "Oct 20, 2026", checkOut: "Oct 23, 2026", amount: "₹4,725", status: "Confirmed" },
  { ref: "KH-2026-1045", guest: "Arjun Chatterjee", email: "arjun.c@example.com", property: "Location B", checkIn: "Oct 22, 2026", checkOut: "Oct 25, 2026", amount: "₹10,500", status: "Confirmed" },
  { ref: "KH-2026-1044", guest: "Meera Roy", email: "meera.roy@example.com", property: "Location A", checkIn: "Oct 24, 2026", checkOut: "Oct 26, 2026", amount: "₹5,250", status: "Cancelled" },
];

const navItems = ["Overview", "Bookings", "Properties", "Rooms & rates", "Guests", "Reports", "Settings"];

export default function AdminDashboard() {
  const [activeNav, setActiveNav] = useState("Overview");
  const [query, setQuery] = useState("");
  const [mobileNav, setMobileNav] = useState(false);
  const visibleBookings = bookings.filter((booking) => `${booking.ref} ${booking.guest} ${booking.property}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <main className="min-h-screen bg-[#f7f7f5] text-[#292521]">
      {mobileNav && <button aria-label="Close menu" className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setMobileNav(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-[#eee9e2] bg-white transition-transform lg:translate-x-0 ${mobileNav ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-20 items-center justify-between border-b border-[#eee9e2] px-6">
          <a href="/" className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary-terracotta)] text-white"><BedDouble size={20} /></span><span><strong className="block text-base">Kunja</strong><span className="text-xs text-gray-500">ADMIN CONSOLE</span></span></a>
          <button className="lg:hidden" aria-label="Close navigation" onClick={() => setMobileNav(false)}><X size={19} /></button>
        </div>
        <div className="px-4 pt-7 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400">Workspace</div>
        <nav className="mt-3 space-y-1 px-3">
          {navItems.map((item, index) => {
            const Icon = [LayoutDashboard, CalendarDays, BedDouble, Settings, Users, Activity, Settings][index];
            return <button key={item} onClick={() => { setActiveNav(item); setMobileNav(false); }} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${activeNav === item ? "bg-[#f8eee9] font-semibold text-[var(--primary-terracotta)]" : "text-gray-600 hover:bg-gray-50"}`}><Icon size={18} />{item}{item === "Bookings" && <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-xs text-gray-500">12</span>}</button>;
          })}
          <a href="/admin/billing" className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-gray-600 transition-colors hover:bg-gray-50"><ReceiptText size={18} />Billing</a>
        </nav>
        <div className="mt-auto border-t border-[#eee9e2] p-4">
          <div className="flex items-center gap-3 rounded-lg bg-[#faf9f7] p-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#ead6c8] text-sm font-semibold text-[#783b2d]">AK</span><span className="min-w-0 flex-1"><strong className="block truncate text-sm">Admin Kunja</strong><span className="text-xs text-gray-500">Property manager</span></span><button aria-label="Sign out" title="Sign out" className="text-gray-400 hover:text-gray-700"><LogOut size={17} /></button></div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-[#eee9e2] bg-white/95 px-5 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3"><button className="lg:hidden" aria-label="Open navigation" onClick={() => setMobileNav(true)}><Menu size={22} /></button><div><p className="text-xs text-gray-500">Workspace / {activeNav}</p><h1 className="text-lg font-semibold">{activeNav === "Overview" ? "Dashboard overview" : activeNav}</h1></div></div>
          <div className="flex items-center gap-3"><span className="hidden text-sm text-gray-500 sm:block">Tuesday, October 13, 2026</span><button className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium hover:bg-gray-50"><Settings size={16} className="inline" /> <span className="hidden sm:inline">Settings</span></button></div>
        </header>

        <div className="mx-auto max-w-7xl space-y-7 p-5 sm:p-8">
          <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm text-gray-500">Here’s what’s happening at your properties.</p><h2 className="mt-1 text-2xl font-bold tracking-tight">Good morning, Admin</h2></div><button className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium shadow-sm hover:bg-gray-50 sm:self-auto"><Download size={16} /> Export report</button></section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="Total bookings" value="248" change="12.8%" icon={CalendarDays} positive />
            <Metric label="Revenue this month" value="₹4,82,650" change="8.2%" icon={CircleDollarSign} positive />
            <Metric label="Occupancy rate" value="76.4%" change="3.1%" icon={BedDouble} positive />
            <Metric label="New guests" value="64" change="2.4%" icon={Users} positive={false} />
          </section>

          <section className="grid gap-5 xl:grid-cols-[1.65fr_1fr]">
            <div className="rounded-xl border border-[#eee9e2] bg-white p-5 sm:p-6"><div className="flex items-start justify-between"><div><h3 className="font-semibold">Revenue overview</h3><p className="mt-1 text-sm text-gray-500">Monthly earnings across both locations</p></div><button className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm">This year <ChevronDown size={15} /></button></div>
              <div className="mt-7 flex items-end justify-between gap-2" aria-label="Monthly revenue chart">
                {[42, 58, 47, 70, 61, 78, 55, 86, 68, 94, 72, 82].map((height, index) => <div key={index} className="flex flex-1 flex-col items-center gap-2"><div className="flex h-40 w-full items-end"><div className={`w-full rounded-t-md ${index === 9 ? "bg-[var(--primary-terracotta)]" : "bg-[#ead9cf]"}`} style={{ height: `${height}%` }} /></div><span className="text-[10px] text-gray-400 sm:text-xs">{["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][index]}</span></div>)}
              </div>
              <div className="mt-5 flex items-center gap-2 text-sm"><span className="font-semibold">₹4,82,650</span><span className="text-gray-500">total revenue</span><span className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-emerald-700"><ArrowUpRight size={15} /> 8.2% vs last month</span></div>
            </div>
            <div className="rounded-xl border border-[#eee9e2] bg-white p-5 sm:p-6"><div className="flex items-start justify-between"><div><h3 className="font-semibold">Property occupancy</h3><p className="mt-1 text-sm text-gray-500">Current month · October</p></div><MoreHorizontal size={19} className="text-gray-400" /></div>
              <Occupancy name="Location A" detail="Bolpur, Birbhum" value={82} rooms="18 / 22 rooms" />
              <Occupancy name="Location B" detail="Shantiniketan" value={71} rooms="15 / 21 rooms" />
              <div className="mt-5 rounded-lg bg-[#faf7f4] p-3 text-sm text-gray-600"><span className="font-semibold text-[#292521]">33 rooms occupied</span> across both properties.</div>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-[#eee9e2] bg-white">
            <div className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:px-6"><div><h3 className="font-semibold">Recent bookings</h3><p className="mt-1 text-sm text-gray-500">Track and manage guest reservations</p></div><div className="flex gap-2"><label className="flex min-w-0 items-center gap-2 rounded-lg border border-gray-200 px-3 py-2"><Search size={16} className="shrink-0 text-gray-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search bookings" className="w-full text-sm outline-none sm:w-40" /></label><button className="rounded-lg border border-gray-200 px-3 py-2 text-sm">Filter</button></div></div>
            <div className="overflow-x-auto"><table className="w-full min-w-[800px] text-left text-sm"><thead className="border-y border-[#eee9e2] bg-[#faf9f7] text-xs uppercase tracking-wide text-gray-500"><tr><th className="px-6 py-3 font-medium">Booking</th><th className="px-4 py-3 font-medium">Property</th><th className="px-4 py-3 font-medium">Stay dates</th><th className="px-4 py-3 font-medium">Amount</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3" /></tr></thead><tbody className="divide-y divide-[#f0eeeb]">{visibleBookings.map((booking) => <tr key={booking.ref} className="hover:bg-[#fdfcfa]"><td className="px-6 py-4"><strong className="block text-sm">{booking.guest}</strong><span className="text-xs text-gray-500">{booking.ref} · {booking.email}</span></td><td className="px-4 py-4">{booking.property}</td><td className="px-4 py-4"><span className="block">{booking.checkIn}</span><span className="text-xs text-gray-500">to {booking.checkOut}</span></td><td className="px-4 py-4 font-medium">{booking.amount}</td><td className="px-4 py-4"><Status value={booking.status} /></td><td className="px-4 py-4"><a className="whitespace-nowrap text-xs font-semibold text-[var(--primary-terracotta)] hover:underline" href={`/admin/billing?guest=${encodeURIComponent(booking.guest)}&reference=${encodeURIComponent(booking.ref)}&checkIn=${new Date(booking.checkIn).toISOString().slice(0, 10)}&checkOut=${new Date(booking.checkOut).toISOString().slice(0, 10)}&roomIndex=${booking.ref.endsWith("1047") ? 4 : booking.ref.endsWith("1046") ? 0 : booking.ref.endsWith("1045") ? 5 : 1}`}>Create bill</a></td></tr>)}</tbody></table>{visibleBookings.length === 0 && <p className="p-8 text-center text-sm text-gray-500">No bookings match your search.</p>}</div>
            <div className="flex items-center justify-between border-t border-[#eee9e2] px-6 py-4 text-sm text-gray-500"><span>Showing {visibleBookings.length} of 248 bookings</span><button onClick={() => setActiveNav("Bookings")} className="font-medium text-[var(--primary-terracotta)] hover:underline">View all bookings →</button></div>
          </section>
          <p className="pb-3 text-center text-xs text-gray-400">Demo dashboard · Sample booking and revenue data</p>
        </div>
      </div>
    </main>
  );
}

function Metric({ label, value, change, icon: Icon, positive }: { label: string; value: string; change: string; icon: typeof CalendarDays; positive: boolean }) {
  return <div className="rounded-xl border border-[#eee9e2] bg-white p-5"><div className="flex items-center justify-between"><span className="text-sm text-gray-500">{label}</span><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f8eee9] text-[var(--primary-terracotta)]"><Icon size={18} /></span></div><div className="mt-4 flex items-end justify-between"><strong className="text-2xl font-bold tracking-tight">{value}</strong><span className={`inline-flex items-center text-xs font-medium ${positive ? "text-emerald-700" : "text-rose-700"}`}>{positive ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}{change}</span></div><p className="mt-1 text-xs text-gray-400">vs last month</p></div>;
}

function Occupancy({ name, detail, value, rooms }: { name: string; detail: string; value: number; rooms: string }) {
  return <div className="mt-7"><div className="flex items-center justify-between"><div><strong className="text-sm">{name}</strong><p className="mt-0.5 text-xs text-gray-500">{detail}</p></div><strong className="text-sm">{value}%</strong></div><div className="mt-3 h-2 rounded-full bg-[#f0eeeb]"><div className="h-2 rounded-full bg-[var(--primary-terracotta)]" style={{ width: `${value}%` }} /></div><p className="mt-2 text-xs text-gray-500">{rooms}</p></div>;
}

function Status({ value }: { value: string }) {
  const style = value === "Confirmed" ? "bg-emerald-50 text-emerald-700" : value === "Pending" ? "bg-amber-50 text-amber-700" : "bg-gray-100 text-gray-600";
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${style}`}>{value === "Confirmed" && <Check size={13} />}{value}</span>;
}
