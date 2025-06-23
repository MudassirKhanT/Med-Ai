// app/api/session-chat/route.tsx
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { sessionChatTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, notes, conversation, report, createdBy, createdOn, selectedDoctor } = body;

    if (!sessionId || !notes || !createdBy || !createdOn || !selectedDoctor) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const inserted = await db.insert(sessionChatTable).values({
      sessionId,
      notes,
      conversation: conversation || null,
      report: report || null,
      createdBy,
      createdOn,
      selectedDoctor,
    });

    return NextResponse.json({ message: "Session saved", inserted });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");
  const user = await currentUser();
  //@ts-ignore
  const res = await db.select().from(sessionChatTable).where(eq(sessionChatTable.sessionId, sessionId));
  return NextResponse.json(res[0]);
}
