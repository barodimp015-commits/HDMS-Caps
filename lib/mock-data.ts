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

export const mockSpecimens: Specimen[] = [
  {
    id: "1",
    scientificName: "Trillium grandiflorum",
    commonName: "Large-flowered Trillium",
    family: "Melanthiaceae",
    genus: "Trillium",
    collector: "Dr. Sarah Johnson",
    collectionDate: "2024-05-15",
    location: {
      country: "United States",
      state: "Michigan",
      county: "Ingham",
      coordinates: { lat: 42.3314, lng: -84.5467 },
    },
    habitat: "Rich deciduous woods, often on slopes",
    conservationStatus: "Least Concern",
    images: ["/large-flowered-trillium.png"],
    notes: "Specimen found in mature oak-maple forest. Flowers were in peak bloom.",
    catalogNumber: "MSU-001234",
  },
  {
    id: "2",
    scientificName: "Acer saccharum",
    commonName: "Sugar Maple",
    family: "Sapindaceae",
    genus: "Acer",
    collector: "Dr. Michael Chen",
    collectionDate: "2024-03-22",
    location: {
      country: "United States",
      state: "Michigan",
      county: "Washtenaw",
      coordinates: { lat: 42.2808, lng: -83.743 },
    },
    habitat: "Mesic hardwood forest",
    conservationStatus: "Least Concern",
    images: ["/placeholder-7pp4r.png"],
    notes: "Large mature specimen, approximately 80 years old based on core sample.",
    catalogNumber: "MSU-001235",
  },
  {
    id: "3",
    scientificName: "Cypripedium reginae",
    commonName: "Showy Lady's Slipper",
    family: "Orchidaceae",
    genus: "Cypripedium",
    collector: "Dr. Emily Rodriguez",
    collectionDate: "2024-06-08",
    location: {
      country: "United States",
      state: "Michigan",
      county: "Kalamazoo",
      coordinates: { lat: 42.2917, lng: -85.5872 },
    },
    habitat: "Calcareous wetland, cedar swamp",
    conservationStatus: "Vulnerable",
    images: ["/showy-lady-slipper.png"],
    notes: "Rare orchid species. Population of approximately 15 individuals observed.",
    catalogNumber: "MSU-001236",
  },
  {
    id: "4",
    scientificName: "Quercus alba",
    commonName: "White Oak",
    family: "Fagaceae",
    genus: "Quercus",
    collector: "Dr. James Wilson",
    collectionDate: "2024-04-10",
    location: {
      country: "United States",
      state: "Michigan",
      county: "Kent",
      coordinates: { lat: 42.9634, lng: -85.6681 },
    },
    habitat: "Upland oak savanna",
    conservationStatus: "Least Concern",
    images: ["/white-oak-leaves-acorns.png"],
    notes: "Specimen from restored prairie-oak savanna ecosystem.",
    catalogNumber: "MSU-001237",
  },
  {
    id: "5",
    scientificName: "Lilium michiganense",
    commonName: "Michigan Lily",
    family: "Liliaceae",
    genus: "Lilium",
    collector: "Dr. Lisa Thompson",
    collectionDate: "2024-07-12",
    location: {
      country: "United States",
      state: "Michigan",
      county: "Berrien",
      coordinates: { lat: 41.9403, lng: -86.4526 },
    },
    habitat: "Wet meadow, prairie edge",
    conservationStatus: "Near Threatened",
    images: ["/michigan-lily.png"],
    notes: "State flower candidate. Found in remnant wet prairie habitat.",
    catalogNumber: "MSU-001238",
  },
]

export const getSpecimenStats = () => {
  const totalSpecimens = mockSpecimens.length
  const families = new Set(mockSpecimens.map((s) => s.family)).size
  const locations = new Set(mockSpecimens.map((s) => s.location.county)).size

  return {
    totalSpecimens,
    families,
    locations,
  }
}
