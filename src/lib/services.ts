export interface WYLI_Service {
  id: string;
  name: string;
  category: 'Hair' | 'Skin' | 'Grooming' | 'Makeup';
  gender: 'Men' | 'Women' | 'All';
  description: string;
  price: number;
  duration: number;
  featured?: boolean;
}

export interface CartItem {
  service: WYLI_Service;
  quantity: number;
}

export interface BookingDraft {
  items: CartItem[];
  category: string;
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  notes: string;
}

export interface BookingContextValue {
  draft: BookingDraft;
  addService: (service: WYLI_Service) => void;
  removeService: (serviceId: string) => void;
  updateQuantity: (serviceId: string, quantity: number) => void;
  setDate: (date: string) => void;
  setTime: (time: string) => void;
  setCustomerName: (name: string) => void;
  setCustomerPhone: (phone: string) => void;
  setCustomerEmail: (email: string) => void;
  setNotes: (notes: string) => void;
  totalPrice: number;
  totalDuration: number;
  itemCount: number;
  clearCart: () => void;
}

export const SERVICES: WYLI_Service[] = [
  {
    id: 'haircut-men',
    name: 'Haircut',
    category: 'Hair',
    gender: 'Men',
    description: 'Precision cut tailored to your face shape and style preference.',
    price: 150,
    duration: 30,
  },
  {
    id: 'haircut-women',
    name: 'Haircut',
    category: 'Hair',
    gender: 'Women',
    description: 'Customized cut with shaping, texturizing, and finish.',
    price: 300,
    duration: 45,
  },
  {
    id: 'hair-styling',
    name: 'Hair Styling',
    category: 'Hair',
    gender: 'All',
    description: 'Blow-dry, setting, and finish for any occasion.',
    price: 250,
    duration: 40,
  },
  {
    id: 'hair-spa',
    name: 'Hair Spa',
    category: 'Hair',
    gender: 'All',
    description: 'Deep nourishment with massage, steam, and premium products.',
    price: 500,
    duration: 60,
  },
  {
    id: 'hair-color',
    name: 'Hair Colour',
    category: 'Hair',
    gender: 'All',
    description: 'Subtle blending or bold transformation with lasting colour.',
    price: 800,
    duration: 90,
  },
  {
    id: 'facial-basic',
    name: 'Basic Facial',
    category: 'Skin',
    gender: 'All',
    description: 'Cleansing, exfoliation, and hydration for refreshed skin.',
    price: 600,
    duration: 45,
  },
  {
    id: 'clean-up',
    name: 'Clean-Up',
    category: 'Skin',
    gender: 'All',
    description: 'Quick refresh with cleansing and moisturizing.',
    price: 350,
    duration: 30,
  },
  {
    id: 'mens-facial',
    name: "Men's Facial",
    category: 'Skin',
    gender: 'Men',
    description: 'Deep-cleansing facial designed for men skin types.',
    price: 500,
    duration: 45,
  },
  {
    id: 'beard-trim',
    name: 'Beard Trim & Shape-Up',
    category: 'Grooming',
    gender: 'Men',
    description: 'Precision beard shaping with hot towel finish.',
    price: 100,
    duration: 20,
  },
  {
    id: 'clean-shave',
    name: 'Clean Shave',
    category: 'Grooming',
    gender: 'Men',
    description: 'Classic straight-razor shave with oils and aftercare.',
    price: 120,
    duration: 25,
  },
  {
    id: 'makeup-everyday',
    name: 'Everyday Makeup',
    category: 'Makeup',
    gender: 'Women',
    description: 'Light, breathable finish for daily confidence.',
    price: 500,
    duration: 40,
  },
  {
    id: 'makeup-party',
    name: 'Party Makeup',
    category: 'Makeup',
    gender: 'Women',
    description: 'Dramatic, long-lasting look for events and celebrations.',
    price: 1200,
    duration: 60,
  },
  {
    id: 'makeup-bridal',
    name: 'Bridal Makeup',
    category: 'Makeup',
    gender: 'Women',
    description: 'Complete bridal package with trial, touch-ups, and premium products.',
    price: 5000,
    duration: 120,
    featured: true,
  },
  {
    id: 'threading',
    name: 'Threading & Waxing',
    category: 'Grooming',
    gender: 'Women',
    description: 'Smooth finish with hygiene-first threading and warm wax.',
    price: 200,
    duration: 25,
  },
  {
    id: 'hair-treatment',
    name: 'Hair Treatment',
    category: 'Hair',
    gender: 'All',
    description: 'Targeted treatment for damage, fall, or scalp concerns.',
    price: 700,
    duration: 50,
  },
];

export function getServicesByGender(gender: 'All' | 'Men' | 'Women'): WYLI_Service[] {
  if (gender === 'All') return SERVICES;
  return SERVICES.filter((s) => s.gender === gender || s.gender === 'All');
}
