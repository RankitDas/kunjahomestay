import { NextResponse } from "next/server";
import { calculateBilling, type BillingInput } from "../../../../lib/billing";

export async function POST(request: Request) {
  let input: BillingInput;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }
  try {
    return NextResponse.json(calculateBilling(input));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to calculate this bill." }, { status: 400 });
  }
}
