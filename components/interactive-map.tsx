"use client"

import { useEffect, useRef } from "react"
import type { Specimen } from "@/lib/mock-data"

interface InteractiveMapProps {
  specimens?: Specimen[]
  onSpecimenSelect?: (specimenId: string) => void
  selectedSpecimen?: string | null

  // NEW for picking location
  enablePicking?: boolean
  onLocationPick?: (lat: number, lng: number) => void
}

export function InteractiveMap({
  specimens = [],
  onSpecimenSelect,
  selectedSpecimen,
  enablePicking = false,
  onLocationPick,
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const pickerMarkerRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    import("leaflet").then((L) => {
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)
      }

      if (mapRef.current && !mapInstanceRef.current) {
        mapInstanceRef.current = L.map(mapRef.current).setView([14.5995, 120.9842], 6) // PH default

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(mapInstanceRef.current)

        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        })

        // ⭐ Location picking mode
        if (enablePicking) {
          mapInstanceRef.current.on("click", (e: any) => {
            const { lat, lng } = e.latlng

            if (onLocationPick) onLocationPick(lat, lng)

            // Add or move marker
            if (!pickerMarkerRef.current) {
              pickerMarkerRef.current = L.marker([lat, lng], { draggable: true }).addTo(
                mapInstanceRef.current
              )

              pickerMarkerRef.current.on("dragend", () => {
                const pos = pickerMarkerRef.current.getLatLng()
                onLocationPick?.(pos.lat, pos.lng)
              })
            } else {
              pickerMarkerRef.current.setLatLng([lat, lng])
            }
          })
        }
      }
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  return (
    <div
      ref={mapRef}
      className="w-full bg-muted rounded-lg"
      style={{ minHeight: "400px" }}
    />
  )
}
