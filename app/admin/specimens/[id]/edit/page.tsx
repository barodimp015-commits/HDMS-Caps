"use client"

import UpdateSpecimenForm from "@/components/updateSpecimenForm";
import { useParams } from "next/navigation";

export default function EditSpecimenPage() {
  const { id } = useParams();

  return <UpdateSpecimenForm specimenId={id as string} />;
}
