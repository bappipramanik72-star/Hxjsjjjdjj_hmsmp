export interface ShopItem {
  id: string;
  name: string;
  price: number; // in INR (₹)
  type: 'rank' | 'claim' | 'mace' | 'money';
  description: string;
  perks: string[];
  emoji?: string;
  color?: string;
  badge?: string;
  tagline?: string;
}

export interface CartItem {
  item: ShopItem;
  quantity: number;
}

export interface TeamMember {
  name: string;
  role: 'OWNER' | 'FOUNDER' | 'ADMIN' | 'DEVELOPER' | 'HELPER';
  skin: string; // Minecraft username for 3D/flat avatar rendering
  quote: string;
  focus: string;
  badgeColor: string;
  headingColor: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface Ticket {
  id: string;
  subject: string;
  status: 'OPEN' | 'RESOLVED';
  createdAt: string;
  messages: Message[];
}
