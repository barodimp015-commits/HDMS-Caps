export interface Specimen {
  id: string
  scientificName: string
  commonName: string
  family: string
  genus: string
  collector: string
  collectionDate: string
  location: {
    country: string
    state: string
    county: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  habitat: string
  conservationStatus: "Least Concern" | "Near Threatened" | "Vulnerable" | "Endangered" | "Critically Endangered"
  images: string[]
  notes: string
  catalogNumber: string
}
