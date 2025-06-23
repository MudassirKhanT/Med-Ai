// "use client";
// import React, { useState } from "react";
// import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { DialogClose } from "@radix-ui/react-dialog";
// import { ArrowRight } from "lucide-react";
// function AddNewSessionDialog() {
//   const [note, setNote] = useState<string>();
//   return (
//     <Dialog>
//       <DialogTrigger>
//         <Button className="mt-3">+ Start a Consultation</Button>
//       </DialogTrigger>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Add Basic Details</DialogTitle>
//           <DialogDescription asChild>
//             <div>
//               <h2>Add Symptoms or Any Other Details</h2>
//               <Textarea placeholder="Add Details here..." className="h-[200px] mt-1" onChange={(e) => setNote(e.target.value)} />
//             </div>
//           </DialogDescription>
//         </DialogHeader>
//         <DialogFooter>
//           <DialogClose>
//             <Button variant={"outline"}>Cancel</Button>
//           </DialogClose>
//           <Button disabled={!note}>
//             Next <ArrowRight />
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

// export default AddNewSessionDialog;

"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader, ArrowRight } from "lucide-react";

import { doctorAgent } from "./DoctorAgentCard";
import SuggestedDoctorCard from "./SuggestedDoctorCard";

function AddNewSessionDialog() {
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [suggestedDoctors, setSuggestedDoctors] = useState<doctorAgent[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<doctorAgent | null>(null);

  const router = useRouter();

  const onClickNext = async () => {
    setLoading(true);
    try {
      const result = await axios.post("/api/suggest-doctors", { notes: note });
      console.log(result.data);
      setSuggestedDoctors(result.data);
    } catch (error) {
      console.error("Error suggesting doctors:", error);
    }
    setLoading(false);
  };

  const onStartConsultation = async () => {
    setLoading(true);
    try {
      const result = await axios.post("/api/session-chat", {
        notes: note,
        selectedDoctor,
      });

      console.log(result.data);

      if (result.data?.sessionId) {
        router.push("/dashboard/medical-agent/" + result.data.sessionId);
      }
    } catch (error) {
      console.error("Error starting consultation:", error);
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <Textarea placeholder="Enter your symptoms..." value={note} onChange={(e) => setNote(e.target.value)} className="mb-4" />
      <Button onClick={onClickNext} disabled={loading}>
        {loading ? <Loader className="animate-spin" /> : "Next"}
      </Button>

      <div className="grid grid-cols-2 gap-4 mt-4">
        {suggestedDoctors.map((doctor) => (
          <SuggestedDoctorCard key={doctor.id} doctorAgent={doctor} selectedDoctor={selectedDoctor} setSelectedDoctor={setSelectedDoctor} />
        ))}
      </div>

      {selectedDoctor && (
        <Button className="mt-6 bg-green-600 text-white" onClick={onStartConsultation} disabled={loading}>
          {loading ? <Loader className="animate-spin" /> : "Start Consultation"}
        </Button>
      )}
    </div>
  );
}

export default AddNewSessionDialog;
