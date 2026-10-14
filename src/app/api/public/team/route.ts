import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { TeamMember } from "@/lib/models/TeamMember";
import { seedDefaultTeamIfEmpty } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();
    await seedDefaultTeamIfEmpty();
    const team = await TeamMember.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      team: JSON.parse(JSON.stringify(team)),
    });
  } catch (error: unknown) {
    console.error("Error fetching public team:", error);
    return NextResponse.json(
      { success: false, message: (error as Error).message, team: [] },
      { status: 500 }
    );
  }
}
