"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { doctorAgent } from "../../_components/DoctorAgentCard";
import { Circle, PhoneCall, PhoneOff } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Vapi from "@vapi-ai/web";

type SessionDetail = {
  id: number;
  notes: string;
  sessionId: string;
  report: JSON;
  selectedDoctor: doctorAgent;
  createdOn: string;
};

function MedicalVoiceAgent() {
  const { sessionId } = useParams();
  const [sessionDetail, setSessionDetail] = useState<SessionDetail>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [callStarted, setCallStarted] = useState(false);
  const [vapiInstance, setVapiInstance] = useState<any>();

  useEffect(() => {
    if (sessionId) {
      GetSessionDetails();
    }
  }, [sessionId]);

  const GetSessionDetails = async () => {
    try {
      const result = await axios.get(`/api/session-chart?sessionId=${sessionId}`);
      setSessionDetail(result.data);
      setLoading(false);
    } catch (err: any) {
      console.error("Failed to fetch session:", err);
      setError("Failed to load session data.");
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">Loading session...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!sessionDetail) return <div className="p-4">No session found.</div>;

  const StartCall = () => {
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
    setVapiInstance(vapi);

    // Start voice conversation
    vapi.start(process.env.NEXT_PUBLIC_VAPI_VOICE_ASSISTANT_ID);

    // Listen for events
    vapi.on("call-start", () => {
      console.log("Call started");
      setCallStarted(true);
    });
    vapi.on("call-end", () => {
      console.log("Call ended");
      setCallStarted(false);
    });
    vapi.on("message", (message) => {
      if (message.type === "transcript") {
        console.log(`${message.role}: ${message.transcript}`);
      }
    });
  };
  const endCall = () => {
    if (!vapiInstance) return;
    vapiInstance.stop();
    vapiInstance.off("call-start");
    vapiInstance.off("call-end");
    vapiInstance.off("message");

    setCallStarted(false);
    setVapiInstance(null);
  };
  return (
    <div className="p-5 border rounded-3xl bg-secondary">
      <div className="flex justify-between items-center">
        <h2 className="p-1 px-2 border rounded-md flex gap-2 items-center">
          <Circle className={`h-4 w-4 rounded-full ${callStarted ? "bg-green-500" : "bg-red-500"}`} />
          {callStarted ? "Connected..." : "Not Connected"}
        </h2>
        <h2 className="font-bold text-xl text-gray-400">00:00</h2>
      </div>
      {sessionDetail && (
        <div className="flex flex-col items-center mt-10">
          <Image src={sessionDetail?.selectedDoctor?.image} alt={sessionDetail?.selectedDoctor?.specialist} width={120} height={120} className="h-[120px] w-[120px] object-cover rounded-full" />
          <h2 className="mt-2 text-lg">{sessionDetail?.selectedDoctor?.specialist}</h2>
          <p className="text-sm text-gray-400">AI Medical Voice Agent</p>

          <div className="mt-32">
            <h2 className="text-gray-400">Assistant Msg</h2>
            <h2 className="text-lg">User Msg</h2>
          </div>

          {!callStarted ? (
            <Button className="mt-20" onClick={StartCall}>
              <PhoneCall /> Start Call
            </Button>
          ) : (
            <Button variant={"destructive"} onClick={endCall}>
              {" "}
              <PhoneOff /> Disconnect
            </Button>
          )}
        </div>
      )}

      {/* 🔽 Add your chatbot or voice agent component here */}
    </div>
  );
}

export default MedicalVoiceAgent;
