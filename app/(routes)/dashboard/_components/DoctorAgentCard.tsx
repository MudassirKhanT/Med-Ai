// "use client";

// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { useAuth } from "@clerk/nextjs";
// import { IconArrowRight } from "@tabler/icons-react";
// import Image from "next/image";
// import React from "react";
// import axios from "axios";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { Loader, Loader2Icon } from "lucide-react";
// export type doctorAgent = {
//   id: number;
//   specialist: string;
//   description: string;
//   image: string;
//   agentPrompt: string;
//   keywords: string[];
//   voiceId: string;
//   subscriptionRequired: boolean;
// };

// type props = {
//   doctorAgent: doctorAgent;
// };

// function DoctorAgentCard({ doctorAgent }: props) {
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const { has } = useAuth();
//   //@ts-ignore
//   const paidUser = has && has({ plan: "pro" });

//   const onStartConsultation = async () => {
//     setLoading(true);

//     const result = await axios.post("/api/session-chart", {
//       notes: "New Conversation",
//       selectedDoctor: doctorAgent,
//     });

//     console.log(result.data.sessionId);
//     router.push("/dashboard/medical-agent/" + result.data.sessionId);
//     setLoading(false);
//   };

//   return (
//     <div className="relative">
//       {doctorAgent?.subscriptionRequired && <Badge className="absolute m-2 right-0">Premium</Badge>}
//       <Image src={doctorAgent?.image} alt={doctorAgent?.specialist} width={200} height={300} className="w-full h-[250px] object-cover rounded-xl" />
//       <h2 className="font-bold text-lg mt-1">{doctorAgent.specialist}</h2>
//       <p className="line-clamp-2  text-sm text-gray-500">{doctorAgent?.description}</p>
//       <Button className="w-full mt-2" disabled={!paidUser && doctorAgent?.subscriptionRequired} onClick={onStartConsultation}>
//         Start Consultation {loading ? <Loader2Icon /> : <IconArrowRight />}
//       </Button>
//     </div>
//   );
// }

// export default DoctorAgentCard;

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth, useUser } from "@clerk/nextjs";
import { IconArrowRight } from "@tabler/icons-react";
import Image from "next/image";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";

export type doctorAgent = {
  id: number;
  specialist: string;
  description: string;
  image: string;
  agentPrompt: string;
  keywords: string[];
  voiceId: string;
  subscriptionRequired: boolean;
};

type props = {
  doctorAgent: doctorAgent;
};

function DoctorAgentCard({ doctorAgent }: props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useUser();
  const { has } = useAuth();
  //@ts-ignore
  const paidUser = has && has({ plan: "pro" });

  const onStartConsultation = async () => {
    if (!user) return; // protect if user not loaded yet

    const sessionId = crypto.randomUUID();
    const createdOn = new Date().toISOString();
    const createdBy = user.primaryEmailAddress?.emailAddress;

    setLoading(true);
    try {
      const result = await axios.post("/api/session-chart", {
        sessionId,
        notes: "New Conversation",
        createdBy,
        createdOn,
        selectedDoctor: doctorAgent,
      });
      console.log("Session saved:", result.data);
      router.push("/dashboard/medical-agent/" + sessionId);
    } catch (err) {
      console.error("API error:");
    }
    setLoading(false);
  };

  return (
    <div className="relative">
      {doctorAgent.subscriptionRequired && <Badge className="absolute m-2 right-0">Premium</Badge>}
      <Image src={doctorAgent.image} alt={doctorAgent.specialist} width={200} height={300} className="w-full h-[250px] object-cover rounded-xl" />
      <h2 className="font-bold text-lg mt-1">{doctorAgent.specialist}</h2>
      <p className="line-clamp-2 text-sm text-gray-500">{doctorAgent.description}</p>
      <Button className="w-full mt-2" disabled={loading || (!paidUser && doctorAgent.subscriptionRequired)} onClick={onStartConsultation}>
        {loading ? (
          <Loader2Icon className="animate-spin" />
        ) : (
          <>
            Start Consultation <IconArrowRight />
          </>
        )}
      </Button>
    </div>
  );
}

export default DoctorAgentCard;
