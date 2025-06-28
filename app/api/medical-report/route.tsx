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

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Generate the report inside this file
    const report = generateReport(sessionDetail?.selectedDoctor?.specialist, messages);

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

// ✅ Generate report logic
type Report = {
  sessionId: string;
  agent: string;
  user: string;
  timestamp: string;
  symptoms: string[];
  duration: string;
  severity: string;
  medications: string[];
  recommendations: string[];
  treatment: string;
  precautions: string[];
  diagnosis: string;
};

function generateReport(specialist: string = "General Physician", messages: any[]): any {
  const text = messages.map((m) => m.text.toLowerCase()).join(" ");

  let report: Report = {
    sessionId: "",
    agent: specialist,
    user: "Anonymous",
    timestamp: new Date().toISOString(),
    symptoms: [],
    duration: "2-3 days",
    severity: "Moderate",
    diagnosis: "",
    medications: [],
    recommendations: [],
    precautions: [],
    treatment: "",
  };

  if (specialist.includes("Dermatologist")) {
    report.symptoms = extractKeywords(text, ["acne", "rash", "itching", "eczema"]);
    report.diagnosis = "Possible skin inflammation";
    report.medications = ["Topical cream"];
    report.recommendations = ["Use mild soap", "Keep area clean"];
    report.precautions = ["Avoid scratching"];
    report.treatment = "Apply prescribed ointment";
  } else if (specialist.includes("Cardiologist")) {
    report.symptoms = extractKeywords(text, ["chest pain", "heart", "palpitations", "bp"]);
    report.diagnosis = "Possible hypertension or angina";
    report.medications = ["Aspirin"];
    report.recommendations = ["Monitor blood pressure", "Reduce salt intake"];
    report.precautions = ["Avoid heavy lifting"];
    report.treatment = "Lifestyle modifications & follow-up tests";
  } else if (specialist.includes("Psychiatrist")) {
    report.symptoms = extractKeywords(text, ["anxiety", "depression", "stress", "sleep"]);
    report.diagnosis = "Mild anxiety disorder";
    report.medications = ["SSRIs"];
    report.recommendations = ["Practice relaxation techniques"];
    report.precautions = ["Avoid caffeine"];
    report.treatment = "Counseling and therapy sessions";
  } else if (specialist.includes("Orthopedic")) {
    report.symptoms = extractKeywords(text, ["back pain", "joint", "knee", "fracture"]);
    report.diagnosis = "Possible muscular strain";
    report.medications = ["Pain reliever"];
    report.recommendations = ["Use ergonomic chairs"];
    report.precautions = ["Avoid sudden movements"];
    report.treatment = "Physical therapy exercises";
  } else if (specialist.includes("ENT")) {
    report.symptoms = extractKeywords(text, ["ear", "nose", "throat", "sinus", "hearing"]);
    report.diagnosis = "Possible sinusitis or throat infection";
    report.medications = ["Nasal spray"];
    report.recommendations = ["Steam inhalation"];
    report.precautions = ["Avoid dusty areas"];
    report.treatment = "Decongestants & hydration";
  } else if (specialist.includes("Gynecologist")) {
    report.symptoms = extractKeywords(text, ["period", "pregnancy", "menstruation", "cramps"]);
    report.diagnosis = "Normal menstrual symptoms";
    report.medications = ["Painkillers"];
    report.recommendations = ["Warm compress on abdomen"];
    report.precautions = ["Track cycle regularly"];
    report.treatment = "Symptomatic management";
  } else if (specialist.includes("Pediatrician")) {
    report.symptoms = extractKeywords(text, ["child", "baby", "fever", "vomiting", "diarrhea"]);
    report.diagnosis = "Mild viral infection";
    report.medications = ["ORS solution"];
    report.recommendations = ["Monitor hydration"];
    report.precautions = ["Maintain hygiene"];
    report.treatment = "Home care & observation";
  } else if (specialist.includes("Neurologist")) {
    report.symptoms = extractKeywords(text, ["headache", "migraine", "seizure", "nerve", "spine"]);
    report.diagnosis = "Possible migraine";
    report.medications = ["Triptans"];
    report.recommendations = ["Dark, quiet room rest"];
    report.precautions = ["Avoid bright lights"];
    report.treatment = "Medication & lifestyle adjustments";
  } else if (specialist.includes("Gastroenterologist")) {
    report.symptoms = extractKeywords(text, ["stomach", "digestion", "acidity", "liver", "bloating"]);
    report.diagnosis = "Acid reflux / gastritis";
    report.medications = ["Antacids"];
    report.recommendations = ["Small frequent meals"];
    report.precautions = ["Avoid spicy food"];
    report.treatment = "Diet control & medication";
  } else {
    // Default for General Physician
    report.symptoms = extractKeywords(text, ["fever", "cold", "cough", "headache"]);
    report.diagnosis = "Likely viral infection";
    report.medications = ["Paracetamol"];
    report.recommendations = ["Stay hydrated", "Get adequate rest"];
    report.precautions = ["Avoid cold drinks"];
    report.treatment = "OTC medication & home care";
  }

  return report;
}

// ✅ Extract matching keywords from text
function extractKeywords(text: string, keywords: string[]): string[] {
  return keywords.filter((keyword) => text.includes(keyword));
}
