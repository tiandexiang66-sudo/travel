export type NodeType = 'destination' | 'day' | 'activity' | 'transport' | 'lodging' | 'dining' | 'tip';

export interface TravelNode {
  id: string;
  type: NodeType;
  title: string;
  time?: string;          // e.g., "09:00 - 11:30" or "Day 1" or "2小时"
  cost?: number;          // Estimated cost in CNY (元)
  description?: string;   // Detailed description/introduction of the scenic spot or route
  tips?: string[];        // Hidden tips, photo spots, warnings, ticket options
  spotRating?: number;    // 1-5 rating (for sightseeing activity)
  duration?: string;      // e.g., "2小时", "30分钟"
  transportMethod?: 'walk' | 'subway' | 'bus' | 'taxi' | 'train' | 'flight' | 'none';
  children?: TravelNode[]; // Nested hierarchical nodes
  imageUrl?: string;      // Custom user photo url or base64 data
}

export interface PackingItem {
  id: string;
  name: string;
  checked: boolean;
}

export interface PackingCategory {
  id: string;
  name: string;
  items: PackingItem[];
}

export interface Itinerary {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  budgetCategory: string; // e.g. "经济实用" | "品质舒适" | "豪华享受"
  season: string;         // e.g. "秋季/10-11月" | "冬季极光" | "四季皆宜"
  totalDays: number;
  rootNode: TravelNode;
  packingList?: PackingCategory[];
  isCustom?: boolean;     // Whether designed by user
}
