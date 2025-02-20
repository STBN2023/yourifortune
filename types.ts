export interface Prize {
  id: number
  image: string
  name: string
  points: number
  rarity: "common" | "special" | "rare" | "legendary"
  color: string
}

