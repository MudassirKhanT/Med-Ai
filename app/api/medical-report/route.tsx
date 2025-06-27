// import { NextRequest, NextResponse } from "next/server";
// import { db } from "@/config/db";
// import { sessionChatTable } from "@/config/schema";

// export async function POST(req: NextRequest) {
//   const body = await req.json();
//   const { sessionId, sessionDetail, messages } = body;

//   if (!sessionId || !sessionDetail || !messages) {
//     return NextResponse.json({ error: "Missing sessionId, sessionDetail, or messages" }, { status: 400 });
//   }

//   try {
//     const userMessages = messages
//       .filter((msg: any) => msg.role === "user")
//       .map((msg: any) => msg.text.toLowerCase())
//       .join(" ");

//     const extract = (list: string[]) => list.filter((item) => userMessages.includes(item));

//     const symptomsList = ["fever", "cough", "headache", "cold", "fatigue", "nausea"];
//     const medicationList = ["paracetamol", "ibuprofen", "cetirizine", "antibiotic"];

//     const symptoms = extract(symptomsList);
//     const medicationsMentioned = extract(medicationList);

//     const durationMatch = userMessages.match(/(\d+ (day|days|week|weeks|month|months|hour|hours))/);
//     const duration = durationMatch ? durationMatch[0] : "unspecified";

//     const report = {
//       sessionId,
//       agent: sessionDetail?.selectedDoctor?.specialist || "AI Medical Agent",
//       user: sessionDetail?.createdBy || "Anonymous",
//       timestamp: new Date().toISOString(),
//       chiefComplaint: symptoms.length > 0 ? `Experiencing ${symptoms[0]}` : "General consultation",
//       summary: `The user discussed experiencing ${symptoms.join(", ") || "unspecified symptoms"} for ${duration}. Basic medication advice and precautions were discussed.`,
//       symptoms,
//       duration,
//       severity: "moderate",
//       medicationsMentioned,
//       diagnosis: "Likely viral infection or common flu",
//       treatmentPlan: "Take rest, stay hydrated, and take mentioned medications if symptoms persist",
//       precautions: ["Avoid cold food", "Drink warm fluids", "Get 8 hours of sleep", "Monitor temperature"],
//       recommendations: ["Consult physician if no improvement in 2 days", "Follow dosage guidelines"],
//     };

//     await db.insert(sessionChatTable).values({
//       sessionId,
//       notes: sessionDetail?.notes || "",
//       selectedDoctor: sessionDetail?.selectedDoctor || {},
//       conversation: messages,
//       report,
//       createdBy: user.primaryEmailAddress?.emailAddress!, // ✅ now tied to Clerk user
//       createdOn: new Date().toISOString(),
//     });

//     return NextResponse.json({ report }, { status: 200 });
//   } catch (err: any) {
//     console.error("Report generation error:", err);
//     return NextResponse.json({ error: "Internal Server Error", details: err.message }, { status: 500 });
//   }
// }

// // npx drizzle-kit studio

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { sessionChatTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, sessionDetail, messages } = body;

    // ✅ Get the current Clerk user
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Manually generate a medical report based on messages
    const report = {
      sessionId,
      agent: sessionDetail?.selectedDoctor?.specialist || "General Physician",
      user: "Anonymous",
      timestamp: new Date().toISOString(),
      symptoms: extractSymptoms(messages),
      duration: "2-3 days",
      severity: "Moderate",
      medications: ["Paracetamol"],
      recommendations: ["Stay hydrated", "Consult a doctor if symptoms persist"],
      treatment: "Rest and over-the-counter medication",
      precautions: ["Avoid cold drinks", "Take proper rest", "Monitor temperature regularly"],
      diagnosis: "Likely viral fever",
    };

    // ✅ Save to database
    await db.insert(sessionChatTable).values({
      sessionId,
      notes: sessionDetail?.notes || "",
      selectedDoctor: sessionDetail?.selectedDoctor || {},
      conversation: messages,
      report,
      createdBy: user.primaryEmailAddress?.emailAddress || "anonymous",
      createdOn: new Date().toISOString(),
    });

    return NextResponse.json({ message: "Report generated and saved", report });
  } catch (err) {
    console.error("Report generation failed:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ Basic symptom extractor from message texts
function extractSymptoms(messages: any[]): string[] {
  const knownSymptoms = ["fever", "cold", "cough", "headache", "body pain", "sore throat"];
  const text = messages.map((m) => m.text.toLowerCase()).join(" ");
  return knownSymptoms.filter((symptom) => text.includes(symptom));
}
