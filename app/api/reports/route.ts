import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      qr_type,
      qr_data,
      category,
      details,
      location,
      security_status,
      security_checks,
    } = body;

    if (!qr_type || !qr_data || !category) {
      return NextResponse.json(
        { error: "Missing required fields: qr_type, qr_data, category" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("reports")
      .insert([
        {
          qr_type,
          qr_data,
          category,
          details: details || null,
          location: location || null,
          security_status: security_status || null,
          security_checks: security_checks || null,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to submit report", details: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    let query = supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    if (status && status !== "all") {
      query = query.eq("security_status", status);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch reports", details: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data, count }, { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
