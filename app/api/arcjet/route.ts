import { NextResponse } from "next/server";
import { protectRoute } from "../project"; // Import your existing logic

export async function GET(req: Request) {
  try {
    const result = await protectRoute(req);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 401 });
  }
}

// Also support POST if needed
export async function POST(req: Request) {
  return GET(req);
}
