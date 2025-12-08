"use client"

import { useEffect, useRef } from "react"
import type { Specimen } from "@/model/Specimen"

interface InteractiveMapProps {
  specimens: Specimen[]
  onSpecimenSelect: (specimenId: string) => void

  selectedSpecimen: string | null
}

export function InteractiveMap({ specimens, onSpecimenSelect, selectedSpecimen }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  // Initialize map once
  useEffect(() => {
    if (typeof window === "undefined") return
    let L: any

    const initMap = async () => {
      L = await import("leaflet")

      // Ensure Leaflet CSS is loaded
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link")
        link.id = "leaflet-css"
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)
      }

      if (mapRef.current && !mapInstanceRef.current) {
        // Fix default marker icon path
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        })

        // Initial map → regional view
        mapInstanceRef.current = L.map(mapRef.current, {
          zoomControl: true,
          scrollWheelZoom: true,
        }).setView([8.0292, 124.2977], 8)

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(mapInstanceRef.current)
      }
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Render markers whenever specimens / selected changes
  useEffect(() => {
    if (!mapInstanceRef.current) return

    const updateMarkers = async () => {
      const L = await import("leaflet")

      // Clear markers
      markersRef.current.forEach((m) => mapInstanceRef.current.removeLayer(m))
      markersRef.current = []

      // Status → color
      const getMarkerColor = (status: string) => {
        switch (status) {
          case "Least Concern": return "#22c55e"
          case "Near Threatened": return "#eab308"
          case "Vulnerable": return "#f97316"
          case "Endangered": return "#ef4444"
          case "Critically Endangered": return "#dc2626"
          default: return "#6b7280"
        }
      }

      // Marker icon
      const createCustomIcon = (status: string, isSelected: boolean) => {
        const color = getMarkerColor(status)
        const size = isSelected ? 38 : 26

        return L.divIcon({
          className: "",
          html: `
            <div style="
              width: ${size}px;
              height: ${size}px;
              background: ${color};
              border: 3px solid #fff;
              border-radius: 50%;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              ${isSelected ? "transform: scale(1.2);" : ""}
            "></div>
          `,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        })
      }

      // Add each specimen marker
      specimens.forEach((specimen) => {
        const lat = specimen.location.coordinates.lat
        const lng = specimen.location.coordinates.lng

        if (!lat || !lng) return

        const marker = L.marker([lat, lng], {
          icon: createCustomIcon(specimen.conservationStatus, selectedSpecimen === specimen.id),
        })

        marker.on("click", () => onSpecimenSelect(specimen.id))

        marker.addTo(mapInstanceRef.current)
        markersRef.current.push(marker)
      })

      // Auto-fit to all markers
      if (markersRef.current.length > 0) {
        const group =  L.featureGroup(markersRef.current)
        mapInstanceRef.current.fitBounds(group.getBounds().pad(0.15))
      }
    }

    updateMarkers()
  }, [specimens, selectedSpecimen, onSpecimenSelect])

  return (
    <div
      ref={mapRef}
      className="w-full h-full bg-muted rounded-lg"
      style={{ minHeight: "400px" }}
    />
  )
}
