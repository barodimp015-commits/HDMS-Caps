"use client"

import { useEffect, useRef } from "react"
import type { Specimen } from "@/lib/mock-data"

interface InteractiveMapProps {
  specimens: Specimen[]
  onSpecimenSelect: (specimenId: string) => void
  selectedSpecimen: string | null
}

export function InteractiveMap({ specimens, onSpecimenSelect, selectedSpecimen }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])

  useEffect(() => {
    if (typeof window === "undefined") return

    // Dynamically import Leaflet to avoid SSR issues
    import("leaflet").then((L) => {
      // Import Leaflet CSS
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)
      }

      if (mapRef.current && !mapInstanceRef.current) {
        // Initialize map centered on Michigan
        mapInstanceRef.current = L.map(mapRef.current).setView([44.3148, -85.6024], 7)

        // Add tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapInstanceRef.current)

        // Fix for default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        })
      }
    })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current || typeof window === "undefined") return

    import("leaflet").then((L) => {
      // Clear existing markers
      markersRef.current.forEach((marker) => {
        mapInstanceRef.current.removeLayer(marker)
      })
      markersRef.current = []

      // Create color mapping for conservation status
      const getMarkerColor = (status: string) => {
        switch (status) {
          case "Least Concern":
            return "#22c55e" // green
          case "Near Threatened":
            return "#eab308" // yellow
          case "Vulnerable":
            return "#f97316" // orange
          case "Endangered":
            return "#ef4444" // red
          case "Critically Endangered":
            return "#dc2626" // dark red
          default:
            return "#6b7280" // gray
        }
      }

      // Create custom icon function
      const createCustomIcon = (status: string, isSelected: boolean) => {
        const color = getMarkerColor(status)
        const size = isSelected ? 35 : 25

        return L.divIcon({
          className: "custom-marker",
          html: `
            <div style="
              width: ${size}px;
              height: ${size}px;
              background-color: ${color};
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              ${isSelected ? "transform: scale(1.2);" : ""}
              transition: all 0.2s ease;
            "></div>
          `,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        })
      }

      // Add markers for each specimen
      specimens.forEach((specimen) => {
        const isSelected = selectedSpecimen === specimen.id
        const marker = L.marker([specimen.location.coordinates.lat, specimen.location.coordinates.lng], {
          icon: createCustomIcon(specimen.conservationStatus, isSelected),
        })

        // Create popup content
        const popupContent = `
          <div style="min-width: 200px; font-family: system-ui, -apple-system, sans-serif;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; font-style: italic; color: #374151;">
              ${specimen.scientificName}
            </h3>
            <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
              ${specimen.commonName}
            </p>
            <div style="margin-bottom: 8px;">
              <span style="display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 500; background-color: ${getMarkerColor(specimen.conservationStatus)}20; color: ${getMarkerColor(specimen.conservationStatus)};">
                ${specimen.conservationStatus}
              </span>
            </div>
            <div style="font-size: 12px; color: #6b7280; line-height: 1.4;">
              <div><strong>Family:</strong> ${specimen.family}</div>
              <div><strong>Location:</strong> ${specimen.location.county}, ${specimen.location.state}</div>
              <div><strong>Collector:</strong> ${specimen.collector}</div>
              <div><strong>Date:</strong> ${new Date(specimen.collectionDate).toLocaleDateString()}</div>
            </div>
          </div>
        `

        marker.bindPopup(popupContent)

        // Add click event
        marker.on("click", () => {
          onSpecimenSelect(specimen.id)
        })

        marker.addTo(mapInstanceRef.current)
        markersRef.current.push(marker)
      })

      // Fit map to show all markers if there are any
      if (specimens.length > 0) {
        const group = new L.featureGroup(markersRef.current)
        mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1))
      }
    })
  }, [specimens, selectedSpecimen, onSpecimenSelect])

  return <div ref={mapRef} className="w-full h-full bg-muted rounded-lg" style={{ minHeight: "400px" }} />
}
