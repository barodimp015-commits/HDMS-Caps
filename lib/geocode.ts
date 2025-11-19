


export async function reverseGeocode(lat: number, lng: number) {
  const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_KEY

  const res = await fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`
  )

  const data = await res.json()

  const info = data.results[0]?.components || {}

  return {
    country: info.country || "",
    province: info.state || info.region || "",
    city: info.city || info.town || info.village || "",
  }
}
