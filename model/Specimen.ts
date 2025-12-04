
export type specimenStatus = "Least Concern" | "Near Threatened" | "Vulnerable" | "Endangered" | "Critically Endangered"

export interface Specimen {
  id:string
  scientificName: string
  commonName: string
  family: string
  genus: string
  collector: string
  collectionDate: string
  location: {
    country: string
    state: string
    city: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  habitat: string
  conservationStatus: string,
  imageUrl: string
  notes: string
  createdAt?: string 
}
