export interface Listing {
  id: string;
  title: string;
  price: string;
  description: string;
  category: string;
  subcategory?: string;
  location: string;
  citySlug: string;
  imageUrl: string;
  gallery?: string[];
  latitude?: number;
  longitude?: number;
  coordinates?: {
    type: string;
    coordinates: [number, number]; // [lng, lat]
  };
  timestamp: number;
  featured?: boolean;
  status: 'active' | 'pending' | 'sold' | 'flagged';
  seller?: {
    id: string;
    name: string;
    rating: number;
    phoneVerified: boolean;
    joinedDate: string;
  };
  attributes?: Record<string, string>;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

export interface Section {
  id: string;
  title: string;
  categories: Category[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  verified: boolean;
  avatarUrl?: string;
  postedAdsCount: number;
}
