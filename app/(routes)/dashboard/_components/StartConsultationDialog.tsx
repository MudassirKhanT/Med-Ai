"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DialogClose } from "@radix-ui/react-dialog";
import { ArrowRight } from "lucide-react";
import SuggestedDoctorCard from "./SuggestedDoctorCard";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs"; // If using Clerk auth
import { AIDoctorAgents } from "@/shared/list";

export default function StartConsultationDialog() {
  const [note, setNote] = useState("");
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const router = useRouter();
  const { user } = useUser(); // Clerk user

  const filteredDoctors = AIDoctorAgents.filter((doctor) =>
    note
      .toLowerCase()
      .split(" ")
      .some((word) => doctor.keywords.includes(word))
  );

  const handleStartConversation = async () => {
    const sessionId = crypto.randomUUID(); // Unique session ID

    const response = await fetch("/api/session-chart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        notes: note,
        createdBy: user?.id || "anonymous", // Replace with real user ID
        createdOn: new Date().toISOString(),
        selectedDoctor: {
          id: selectedDoctor.id,
          specialist: selectedDoctor.specialist,
          image: selectedDoctor.image,
          agentPrompt: selectedDoctor.agentPrompt,
        },
      }),
    });

    if (response.ok) {
      router.push(`/dashboard/medical-agent/${sessionId}`);
    } else {
      alert("Failed to create session. Try again.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-3">+ Start a Consultation</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{step === 1 ? "Add Your Symptoms" : "Suggested Doctors"}</DialogTitle>
        </DialogHeader>

        <DialogDescription asChild>
          <div className="mt-2">
            {step === 1 ? (
              <Textarea placeholder="I have chest pain and shortness of breath..." className="h-[200px] mt-1" value={note} onChange={(e) => setNote(e.target.value)} />
            ) : (
              <>
                {filteredDoctors.length === 0 ? (
                  <p className="text-red-500 text-sm">No doctors matched your symptoms.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredDoctors.map((doctor) => (
                      <SuggestedDoctorCard key={doctor.id} doctorAgent={doctor} selectedDoctor={selectedDoctor} setSelectedDoctor={setSelectedDoctor} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </DialogDescription>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          {step === 1 ? (
            <Button onClick={() => setStep(2)} disabled={!note.trim()}>
              Next <ArrowRight className="ml-1" />
            </Button>
          ) : (
            <Button onClick={handleStartConversation} disabled={!selectedDoctor}>
              Start Conversation <ArrowRight className="ml-1" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
