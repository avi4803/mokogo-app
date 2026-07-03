export interface Listing {
  id: string;
  title: string;
  locality: string;
  city: string;
  rent: number;
  roomType: 'Private' | 'Shared';
  preferredGender: 'Any' | 'Male' | 'Female';
  furnished: boolean;
  availableFrom: string;
  image?: string; // Add optional image URL/asset for UI display
}
