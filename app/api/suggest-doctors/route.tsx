// // app/api/suggest-doctors/route.tsx
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { notes } = await req.json();

    if (!notes) {
      return NextResponse.json({ error: "Missing notes" }, { status: 400 });
    }

    let suggestedDoctor = {
      id: 1,
      specialist: "General Physician",
      description: "Handles general health and common symptoms.",
      image: "/doctor1.png",
      agentPrompt: "You're a general physician, well-versed in diagnosing common illnesses and offering general health advice.",
    };

    const text = notes.toLowerCase();

    if (text.includes("skin") || text.includes("rash") || text.includes("pimple")) {
      suggestedDoctor = {
        id: 2,
        specialist: "Dermatologist",
        description: "Expert in skin conditions and dermatological treatments.",
        image: "/doctor2.png",
        agentPrompt: "You're a skin expert dermatologist. Provide detailed and friendly advice regarding skin-related issues.",
      };
    } else if (text.includes("heart") || text.includes("chest pain")) {
      suggestedDoctor = {
        id: 3,
        specialist: "Cardiologist",
        description: "Specializes in heart-related conditions and cardiovascular health.",
        image: "/doctor3.png",
        agentPrompt: "You're a skilled cardiologist. Offer professional insight on heart and chest-related health conditions.",
      };
    } else if (text.includes("bone") || text.includes("joint") || text.includes("knee")) {
      suggestedDoctor = {
        id: 4,
        specialist: "Orthopedic Surgeon",
        description: "Treats bone, joint, and musculoskeletal issues.",
        image: "/doctor4.png",
        agentPrompt: "You're an orthopedic surgeon. Assist with skeletal or joint issues in a confident yet approachable tone.",
      };
    } else if (text.includes("anxiety") || text.includes("depression") || text.includes("mental")) {
      suggestedDoctor = {
        id: 5,
        specialist: "Psychiatrist",
        description: "Deals with mental health and emotional well-being.",
        image: "/doctor5.png",
        agentPrompt: "You're a caring psychiatrist. Provide mental health support and guidance with empathy and expertise.",
      };
    }

    return NextResponse.json({ suggestedDoctor });
  } catch (error) {
    return NextResponse.json({ error: "Error suggesting doctor" }, { status: 500 });
  }
}

// import { NextRequest, NextResponse } from "next/server";
// import { AIDoctorAgents } from "@/shared/list";
// import { openai } from "@/config/OpenAiModel";
// export async function POST(req: NextRequest) {
//   const { notes } = await req.json();

//   try {
//     const completion = await openai.chat.completions.create({
//       model: "google/gemini-2.5-flash-preview-05-20",
//       messages: [
//         {
//           role: "system",
//           content: JSON.stringify(AIDoctorAgents),
//         },
//         {
//           role: "user",
//           content: "User Notes/Symptoms: " + notes,
//         },
//       ],
//     });

//     const rawResp = completion.choices[0].message;
//     //@ts-ignore
//     const Resp = rawResp.content.trim().replace(/```json|```/g, "");
//     const JSONResp = JSON.parse(Resp);

//     return NextResponse.json(JSONResp);
//   } catch (e) {
//     return NextResponse.json({ error: "Failed to suggest doctor", details: e });
//   }
// }
