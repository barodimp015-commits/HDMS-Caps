"use client"

import React from 'react'
import { useParams } from "next/navigation";
import SpecimenDetailsPage from '@/components/detailsSpecimen';

export default function SpecimenDetail() {
  const { id } = useParams();


  return  <SpecimenDetailsPage specimenId={id as string} />
}
