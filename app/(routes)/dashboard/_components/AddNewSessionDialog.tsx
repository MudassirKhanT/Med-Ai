// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { useAuth } from "@clerk/nextjs";
// import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { ArrowRight, Loader2 } from "lucide-react";
// import SuggestedDoctorCard from "./SuggestedDoctorCard";
// import { doctorAgent } from "./DoctorAgentCard";
// import { SessionDetail } from "../medical-agent/[sessionId]/page";

// function AddNewSessionDialog() {
//   const [note, setNote] = useState<string>("");
//   const [loading, setLoading] = useState(false);
//   const [suggestedDoctors, setSuggestedDoctors] = useState<doctorAgent[]>([]);
//   const [selectedDoctor, setSelectedDoctor] = useState<doctorAgent>();
//   const [historyList, setHistoryList] = useState<SessionDetail[]>([]);
//   const router = useRouter();

//   const { has } = useAuth();
//   const paidUser = has && has({ plan: "pro" });

//   useEffect(() => {
//     GetHistoryList();
//   }, []);

//   const GetHistoryList = async () => {
//     const result = await axios.get("/api/session-chart?sessionId=all");
//     setHistoryList(result.data);
//   };

//   const OnClickNext = async () => {
//     setLoading(true);
//     const result = await axios.post("/api/suggest-doctors", {
//       notes: note,
//     });

//     setSuggestedDoctors(result.data);
//     setLoading(false);
//   };

//   const onStartConsultation = async () => {
//     setLoading(true);

//     const result = await axios.post("/api/session-chart", {
//       notes: note,
//       selectedDoctor,
//     });

//     router.push("/dashboard/medical-agent/" + result.data.sessionId);
//     setLoading(false);
//   };

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button className="mt-3" disabled={!paidUser && historyList.length >= 1}>
//           + Start a Consultation
//         </Button>
//       </DialogTrigger>

//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Add Basic Details</DialogTitle>
//           <DialogDescription asChild>
//             {!suggestedDoctors.length ? (
//               <div>
//                 <h2 className="mb-1">Add Symptoms or Any Other Details</h2>
//                 <Textarea placeholder="Add detail here..." className="h-[200px] mt-1" onChange={(e) => setNote(e.target.value)} />
//               </div>
//             ) : (
//               <div>
//                 <h2 className="mb-3">Select the Doctor</h2>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                   {suggestedDoctors.map((doctor, index) => (
//                     <SuggestedDoctorCard
//                       doctorAgent={doctor}
//                       key={index}
//                       setSelectedDoctor={() => setSelectedDoctor(doctor)}
//                       // @ts-ignore
//                       selectedDoctor={selectedDoctor}
//                     />
//                   ))}
//                 </div>
//               </div>
//             )}
//           </DialogDescription>
//         </DialogHeader>

//         <DialogFooter>
//           <DialogClose asChild>
//             <Button variant={"outline"}>Cancel</Button>
//           </DialogClose>

//           {!suggestedDoctors.length ? (
//             <Button disabled={!note || loading} onClick={OnClickNext}>
//               {loading ? <Loader2 className="animate-spin mr-2" /> : <ArrowRight className="mr-2" />}
//               Next
//             </Button>
//           ) : (
//             <Button disabled={loading || !selectedDoctor} onClick={onStartConsultation}>
//               {loading ? <Loader2 className="animate-spin mr-2" /> : <ArrowRight className="mr-2" />}
//               Start Consultation
//             </Button>
//           )}
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

// export default AddNewSessionDialog;

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth, useUser } from "@clerk/nextjs";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Loader2 } from "lucide-react";
import SuggestedDoctorCard from "./SuggestedDoctorCard";
import { doctorAgent } from "./DoctorAgentCard";
import { SessionDetail } from "../medical-agent/[sessionId]/page";

function AddNewSessionDialog() {
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [suggestedDoctors, setSuggestedDoctors] = useState<doctorAgent[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<doctorAgent>();
  const [historyList, setHistoryList] = useState<SessionDetail[]>([]);
  const router = useRouter();

  const { has } = useAuth();
  const { user } = useUser();
  const paidUser = has && has({ plan: "pro" });

  useEffect(() => {
    GetHistoryList();
  }, []);

  const GetHistoryList = async () => {
    const result = await axios.get("/api/session-chart?sessionId=all");
    setHistoryList(result.data);
  };

  const OnClickNext = async () => {
    setLoading(true);
    try {
      const result = await axios.post("/api/suggest-doctors", { notes: note });
      setSuggestedDoctors(result.data.suggestedDoctors || []);
    } catch (err) {
      console.error("Error fetching suggested doctors:", err);
      setSuggestedDoctors([]);
    }
    setLoading(false);
  };

  const onStartConsultation = async () => {
    setLoading(true);
    const payload = {
      sessionId: Math.random().toString(36).substr(2, 9),
      notes: note,
      conversation: [],
      report: {},
      createdBy: user?.primaryEmailAddress?.emailAddress || "unknown",
      createdOn: new Date().toISOString(),
      selectedDoctor,
    };

    try {
      const result = await axios.post("/api/session-chart", payload);
      router.push("/dashboard/medical-agent/" + payload.sessionId);
    } catch (err) {
      console.error("Error starting consultation:", err);
    }
    setLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-3" disabled={!paidUser && historyList.length >= 1}>
          + Start a Consultation
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Basic Details</DialogTitle>
          <DialogDescription asChild>
            {!suggestedDoctors.length ? (
              <div>
                <h2 className="mb-1">Add Symptoms or Any Other Details</h2>
                <Textarea placeholder="Add detail here..." className="h-[200px] mt-1" onChange={(e) => setNote(e.target.value)} />
              </div>
            ) : (
              <div>
                <h2 className="mb-3">Select the Doctor</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {suggestedDoctors.map((doctor, index) => (
                    <SuggestedDoctorCard doctorAgent={doctor} key={doctor.id || index} setSelectedDoctor={() => setSelectedDoctor(doctor)} selectedDoctor={selectedDoctor} />
                  ))}
                </div>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"}>Cancel</Button>
          </DialogClose>

          {!suggestedDoctors.length ? (
            <Button disabled={!note || loading} onClick={OnClickNext}>
              {loading ? <Loader2 className="animate-spin mr-2" /> : <ArrowRight className="mr-2" />}
              Next
            </Button>
          ) : (
            <Button disabled={loading || !selectedDoctor} onClick={onStartConsultation}>
              {loading ? <Loader2 className="animate-spin mr-2" /> : <ArrowRight className="mr-2" />}
              Start Consultation
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewSessionDialog;
