export const GST_RATE_PERCENT = 5;

export type BillingInput = {
  checkIn: string;
  checkOut: string;
  nightlyRatePaise: number;
  roomCount: number;
};

export type BillingQuote = {
  nights: number;
  roomCount: number;
  nightlyRatePaise: number;
  subtotalPaise: number;
  gstRatePercent: number;
  gstPaise: number;
  totalPaise: number;
};

function parseDateOnly(value: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const timestamp = Date.UTC(year, month - 1, day);
  const date = new Date(timestamp);
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return timestamp;
}

export function calculateBilling(input: BillingInput): BillingQuote {
  const checkIn = parseDateOnly(input.checkIn);
  const checkOut = parseDateOnly(input.checkOut);
  if (checkIn === null || checkOut === null) throw new Error("Enter valid check-in and check-out dates.");
  if (checkOut <= checkIn) throw new Error("Check-out must be after check-in.");
  const nights = (checkOut - checkIn) / 86_400_000;
  if (!Number.isInteger(input.roomCount) || input.roomCount < 1 || input.roomCount > 50) {
    throw new Error("Room count must be between 1 and 50.");
  }
  if (!Number.isSafeInteger(input.nightlyRatePaise) || input.nightlyRatePaise < 1 || input.nightlyRatePaise > 100_000_000) {
    throw new Error("Enter a valid nightly rate.");
  }
  if (nights > 365) throw new Error("A stay cannot exceed 365 nights.");

  const subtotalPaise = input.nightlyRatePaise * nights * input.roomCount;
  if (!Number.isSafeInteger(subtotalPaise)) throw new Error("The calculated amount is too large.");
  // All values are integer paise. Round half up to the nearest paise.
  const gstPaise = Math.floor((subtotalPaise * GST_RATE_PERCENT + 50) / 100);
  const totalPaise = subtotalPaise + gstPaise;
  if (!Number.isSafeInteger(totalPaise)) throw new Error("The calculated total is too large.");
  return { nights, roomCount: input.roomCount, nightlyRatePaise: input.nightlyRatePaise, subtotalPaise, gstRatePercent: GST_RATE_PERCENT, gstPaise, totalPaise };
}

export function formatINR(paise: number): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(paise / 100);
}
