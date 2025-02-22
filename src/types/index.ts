export interface Prize {
    id: number;
    points: number;
    color: string;
    image: string;
    name: string;
    rarity?: 'legendary' | 'rare' | 'common';
  }