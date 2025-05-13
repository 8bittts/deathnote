export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'family' | 'friend' | 'colleague' | 'other';
} 