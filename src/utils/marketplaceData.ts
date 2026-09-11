export interface MarketplaceListing {
  id: string;
  businessName: string;
  category: string;
  location: string;
  rating: number;
  reviewCount: number;
  premium: boolean;
  tagline: string;
}

export const mockListings: MarketplaceListing[] = [
  { id: 'm1', businessName: 'Mama Nkechi Tomatoes', category: 'Agriculture', location: 'Ojota Market, Lagos', rating: 4.8, reviewCount: 34, premium: true, tagline: 'Fresh tomatoes, pepper & onions daily' },
  { id: 'm2', businessName: 'Chidi Fashion House', category: 'Fashion & Beauty', location: 'Aba, Abia', rating: 4.6, reviewCount: 21, premium: true, tagline: 'Custom tailoring & Ankara styles' },
  { id: 'm3', businessName: 'Tolu Fast Delivery', category: 'Services', rating: 4.9, reviewCount: 58, location: 'Ikeja, Lagos', premium: false, tagline: 'Same-day delivery across Lagos' },
  { id: 'm4', businessName: 'Blessing Bakes', category: 'Food & Beverage', location: 'Port Harcourt, Rivers', rating: 4.7, reviewCount: 40, premium: false, tagline: 'Cakes, pastries & small chops' },
  { id: 'm5', businessName: 'Emeka Electronics Repair', category: 'Services', location: 'Onitsha, Anambra', rating: 4.5, reviewCount: 15, premium: false, tagline: 'Phone & laptop repairs, same day' },
  { id: 'm6', businessName: 'Amara Beauty Bar', category: 'Fashion & Beauty', location: 'Lekki, Lagos', rating: 4.9, reviewCount: 63, premium: true, tagline: 'Makeup, gele & bridal packages' },
];