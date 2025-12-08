"use client"

import { useEffect, useRef } from "react"
import type { Specimen } from "@/model/Specimen"

interface InteractiveMapProps {
  specimens?: Specimen[]
  onSpecimenSelect?: (specimenId: string) => void

  enablePicking?: boolean
  onLocationPick?: (lat: number, lng: number) => void

  initialLat?: number | null
  initialLng?: number | null
}

export function InteractiveMap({
  specimens = [],
  onSpecimenSelect,
  enablePicking = false,
  onLocationPick,
  initialLat = null,
  initialLng = null,
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const pickerMarkerRef = useRef<any>(null)
  const specimenMarkersRef = useRef<any[]>([])

  useEffect(() => {
    if (typeof window === "undefined") return

    import("leaflet").then((L) => {
      // Load leaflet css
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)
      }

      // Initialize map
      if (mapRef.current && !mapInstanceRef.current) {
        mapInstanceRef.current = L.map(mapRef.current).setView(
          [initialLat ?? 8.0292, initialLng ?? 124.2977],
          initialLat && initialLng ? 12 : 6
        )

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(mapInstanceRef.current)

        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
          iconUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        })

        // If editing, place existing marker
        if (initialLat && initialLng) {
          pickerMarkerRef.current = L.marker([initialLat, initialLng], {
            draggable: enablePicking,
          }).addTo(mapInstanceRef.current)

          pickerMarkerRef.current.on("dragend", () => {
            const pos = pickerMarkerRef.current.getLatLng()
            onLocationPick?.(pos.lat, pos.lng)
          })
        }

        // Picking mode
        if (enablePicking) {
          mapInstanceRef.current.on("click", (e: any) => {
            const { lat, lng } = e.latlng

            onLocationPick?.(lat, lng)

            if (!pickerMarkerRef.current) {
              pickerMarkerRef.current = L.marker([lat, lng], {
                draggable: true,
              }).addTo(mapInstanceRef.current)

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
  }, [initialLat, initialLng, enablePicking])

  // ⭐ Render specimen markers whenever "specimens" changes
  useEffect(() => {
    if (!mapInstanceRef.current) return

    import("leaflet").then((L) => {
      // Remove old markers
      specimenMarkersRef.current.forEach((m) =>
        mapInstanceRef.current.removeLayer(m)
      )
      specimenMarkersRef.current = []

      // Add new markers
      specimens.forEach((specimen) => {
        const coords = specimen.location?.coordinates

        // Validate coordinates
        if (
          !coords ||
          !Array.isArray(coords) ||
          coords.length !== 2 ||
          typeof coords[0] !== "number" ||
          typeof coords[1] !== "number"
        ) {
          return
        }

        const marker = L.marker([coords[0], coords[1]])

        marker.on("click", () => {
          onSpecimenSelect?.(specimen.id)
        })

        marker.addTo(mapInstanceRef.current)
        specimenMarkersRef.current.push(marker)
      })
    })
  }, [specimens])

  return (
    <div
      ref={mapRef}
      className="w-full bg-muted rounded-lg"
      style={{ minHeight: "600px" }}
    />
  )
}
