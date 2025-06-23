"use client";
import React from "react";
import Image from "next/image";

type Props = {
  doctorAgent: {
    id: number;
    specialist: string;
    description: string;
    image: string;
    agentPrompt: string;
  };
  setSelectedDoctor: (doc: any) => void;
  selectedDoctor: any;
};

function SuggestedDoctorCard({ doctorAgent, setSelectedDoctor, selectedDoctor }: Props) {
  return (
    <div
      className={`flex flex-col items-center rounded-2xl shadow p-5 cursor-pointer 
        hover:border-blue-500 
        ${selectedDoctor?.id === doctorAgent?.id ? "border-blue-500 border" : ""}`}
      onClick={() => setSelectedDoctor(doctorAgent)}
    >
      <Image src={doctorAgent?.image} alt={doctorAgent?.specialist} width={70} height={70} className="w-[50px] h-[50px] rounded-4xl object-cover" />
      <h2 className="font-bold text-sm text-center mt-2">{doctorAgent?.specialist}</h2>
      <p className="text-xs text-center line-clamp-2 mt-1">{doctorAgent?.description}</p>
    </div>
  );
}

export default SuggestedDoctorCard;
