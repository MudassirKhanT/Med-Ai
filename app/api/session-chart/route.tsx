// app/api/session-chat/route.tsx
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { sessionChatTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
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

// export async function GET(req: NextRequest) {
//   const { searchParams } = new URL(req.url);
//   const sessionId = searchParams.get("sessionId");
//   const user = await currentUser();
//   if (sessionId == "all") {
//     //@ts-ignore
//     const res = await db.select().from(sessionChatTable).where(eq(sessionChatTable.createdBy, user?.primaryEmailAddress?.emailAddress)).orderBy(desc(sessionChatTable.id));
//     return NextResponse.json(res[0]);
//   } else {
//     //@ts-ignore
//     const res = await db.select().from(sessionChatTable).where(eq(sessionChatTable.sessionId, sessionId));
//     return NextResponse.json(res[0]);
//   }
// }

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (sessionId === "all") {
      const res = await db.select().from(sessionChatTable).where(eq(sessionChatTable.createdBy, user.primaryEmailAddress?.emailAddress!)).orderBy(desc(sessionChatTable.id));

      return NextResponse.json(res); // ✅ Return all sessions
    } else {
      //@ts-ignore
      const res = await db.select().from(sessionChatTable).where(eq(sessionChatTable.sessionId, sessionId));

      if (!res[0]) {
        return NextResponse.json({ error: "Session not found" }, { status: 404 });
      }

      return NextResponse.json(res[0]); // ✅ Return single session
    }
  } catch (err) {
    console.error("GET /api/session-chat error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
