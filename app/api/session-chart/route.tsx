// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/config/db";
// import { sessionChatTable } from "@/config/schema";
// import { currentUser } from "@clerk/nextjs/server";
// import { desc, eq } from "drizzle-orm";

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { sessionId, notes, conversation, report, createdBy, createdOn, selectedDoctor } = body;

//     if (!sessionId || !notes || !createdBy || !createdOn || !selectedDoctor) {
//       console.error("Missing fields:", { sessionId, notes, createdBy, createdOn, selectedDoctor });
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     const inserted = await db.insert(sessionChatTable).values({
//       sessionId,
//       notes,
//       conversation: conversation || null,
//       report: report || null,
//       createdBy,
//       createdOn,
//       selectedDoctor,
//     });

//     return NextResponse.json({
//       message: "Session saved",
//       sessionId,
//       inserted,
//     });
//   } catch (error) {
//     console.error("POST /api/session-chat error:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const sessionId = searchParams.get("sessionId");
//     const user = await currentUser();

//     if (!user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     if (sessionId === "all") {
//       const allSessions = await db.select().from(sessionChatTable).where(eq(sessionChatTable.createdBy, user.primaryEmailAddress?.emailAddress!)).orderBy(desc(sessionChatTable.id));

//       return NextResponse.json(allSessions);
//     } else {
//       const session = await db.select().from(sessionChatTable).where(eq(sessionChatTable.sessionId, sessionId!));

//       if (!session[0]) {
//         return NextResponse.json({ error: "Session not found" }, { status: 404 });
//       }

//       return NextResponse.json(session[0]);
//     }
//   } catch (err) {
//     console.error("GET /api/session-chat error:", err);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { sessionChatTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { sessionId, notes, conversation, report, selectedDoctor } = body;

    if (!sessionId || !notes || !selectedDoctor) {
      console.error("Missing fields:", { sessionId, notes, selectedDoctor });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Minimal guaranteed report
    const finalReport = report || {
      agent: selectedDoctor?.specialist || "Unknown Specialist",
      user: user.primaryEmailAddress?.emailAddress || "Anonymous",
      timestamp: new Date().toISOString(),
      diagnosis: null,
      symptoms: [],
      medications: [],
      recommendations: [],
      precautions: [],
    };
    //@ts-ignore
    const inserted = await db.insert(sessionChatTable).values({
      sessionId,
      notes,
      conversation: conversation || null,
      report: finalReport,
      createdBy: user.primaryEmailAddress?.emailAddress,
      createdOn: new Date().toISOString(),
      selectedDoctor,
    });

    return NextResponse.json({
      message: "Session saved",
      sessionId,
      inserted,
    });
  } catch (error) {
    console.error("POST /api/session-chat error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (sessionId === "all") {
      const allSessions = await db.select().from(sessionChatTable).where(eq(sessionChatTable.createdBy, user.primaryEmailAddress?.emailAddress!)).orderBy(desc(sessionChatTable.id));

      return NextResponse.json(allSessions);
    } else {
      const session = await db.select().from(sessionChatTable).where(eq(sessionChatTable.sessionId, sessionId!));

      if (!session[0]) {
        return NextResponse.json({ error: "Session not found" }, { status: 404 });
      }

      return NextResponse.json(session[0]);
    }
  } catch (err) {
    console.error("GET /api/session-chat error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
