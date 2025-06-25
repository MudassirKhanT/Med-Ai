"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { doctorAgent } from "../../_components/DoctorAgentCard";
import { Circle, PhoneCall, PhoneOff, Slice } from "lucide-react";
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
type messages = {
  role: string;
  text: string;
};

function MedicalVoiceAgent() {
  const { sessionId } = useParams();
  const [sessionDetail, setSessionDetail] = useState<SessionDetail>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [callStarted, setCallStarted] = useState(false);
  const [vapiInstance, setVapiInstance] = useState<any>();
  const [currentRole, setCurrentRole] = useState<string | null>();
  const [liveTranscript, setLiveTranscript] = useState<string>();
  const [messages, setMessages] = useState<messages[]>([]);

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

    const VapiAgentConfig = {
      name: "AI Medical Doctor Voice Agent",
      firstMessage: "Hi there! I'm your AI Medical Assistant. I'm here to help you with health questions or concerns you might have today.How are you feeling?",
      transcriber: {
        provider: "assembly-ai",
        language: "en",
      },
      voice: {
        provider: "playht",
        voiceId: sessionDetail?.selectedDoctor?.voiceId,
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: sessionDetail?.selectedDoctor?.agentPrompt,
          },
        ],
      },
    };
    //@ts-ignore
    vapi.start(VapiAgentConfig);

    vapi.on("call-start", () => {
      console.log("Call started");
      setCallStarted(true);
    });

    vapi.on("call-end", () => {
      console.log("Call ended or terminated by the system.");
      setCallStarted(false);
      setVapiInstance(null);
    });

    vapi.on("message", (message) => {
      if (message.type === "transcript") {
        const { role, transcriptType, transcript } = message;
        console.log(`${role}: ${transcript}`);
        if (transcriptType === "partial") {
          setLiveTranscript(transcript);
          setCurrentRole(role);
        } else if (transcriptType === "final") {
          setMessages((prev) => [...prev, { role, text: transcript }]);
          setLiveTranscript("");
          setCurrentRole(null);
        }
      }
    });

    vapi.on("speech-start", () => {
      console.log("Assistant started speaking");
      setCurrentRole("assistant");
    });

    vapi.on("speech-end", () => {
      console.log("Assistant stopped speaking");
      setCurrentRole("user");
    });
    vapi.on("error", (error) => {
      if (error.message?.includes("quota")) {
        alert("You've hit the usage limit for your Vapi account.");
      }
      console.error("Vapi error:", error);
      setCallStarted(false);
      setVapiInstance(null);
    });
  };

  const endCall = () => {
    if (!vapiInstance) return;

    try {
      vapiInstance.stop();

      // Safely remove listeners only if defined
      vapiInstance.off("call-start", () => {});
      vapiInstance.off("call-end", () => {});
      vapiInstance.off("message", () => {});
      vapiInstance.off("speech-start", () => {});
      vapiInstance.off("speech-end", () => {});
    } catch (err) {
      console.error("Error while ending call:", err);
    }

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

          <div className="mt-12 overflow-y-auto flex flex-col items-center px-10 md:px-20 lg:px-52 xl:px-72">
            {messages?.slice(-4).map((message: messages, index) => (
              <h2 className="text-gray-400 p-2" key={index}>
                {message.role} : {message.text}
              </h2>
            ))}
            {liveTranscript && liveTranscript?.length > 0 ? (
              <h2 className="text-lg">
                {currentRole} : {liveTranscript}
              </h2>
            ) : (
              ""
            )}
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
