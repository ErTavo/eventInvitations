// ── App-level types (rich, used in components) ──────────────────────────────

export type ModuleType =
  | "carousel"
  | "music"
  | "map"
  | "rsvp"
  | "countdown"
  | "gallery"
  | "dress_code"
  | "itinerary"
  | "gifts"
  | "parents";

export type AttendanceStatus = "pending" | "confirmed" | "declined";

export type ThemeId = "vintage" | "elegant" | "modern" | "floral" | "minimal" | "custom";

export interface EventStyle {
  theme: ThemeId;
  primaryColor: string;   // headings, buttons, accents
  secondaryColor: string; // page background
  accentColor: string;    // dividers, borders, muted elements
  textColor: string;      // body text
  fontFamily: string;
  backgroundImage?: string;
  sealInitials?: string;  // up to 2 initials shown on the wax seal (elegant theme)
}

export interface ModuleConfig {
  images?: string[];
  autoplay?: boolean;
  musicUrl?: string;
  musicTitle?: string;
  mapAddress?: string;
  mapLng?: number;
  mapLat?: number;
  mapEmbedUrl?: string;
  // Dress code
  dressCodeText?: string;
  dressCodeColors?: string[];
  dressCodeFemaleImage?: string;
  dressCodeFemaleDescription?: string;
  dressCodeMaleImage?: string;
  dressCodeMaleDescription?: string;
  itineraryItems?: { time: string; description: string }[];
  giftsText?: string;
  giftStoreUrl?: string;
  rsvpDeadline?: string;
  // Parents module
  sectionTitle?: string;
  brideParentsLabel?: string;
  brideParentNames?: string[];
  groomParentsLabel?: string;
  groomParentNames?: string[];
  godfathersLabel?: string;
  godfatherNames?: string[];
}

// App-level row types (typed JSONB, use these in components)
export interface Event {
  id: string;
  created_at: string;
  name: string;
  date: string;
  location: string | null;
  description: string | null;
  cover_image: string | null;
  slug: string;
  is_published: boolean;
  style: EventStyle;
}

export interface Module {
  id: string;
  created_at: string;
  event_id: string;
  type: ModuleType;
  is_active: boolean;
  order: number;
  config: ModuleConfig;
}

export interface Participant {
  id: string;
  created_at: string;
  event_id: string;
  name: string;
  companions: number;
  attendance: AttendanceStatus;
  notes: string | null;
  invitation_viewed: boolean;
  invitation_viewed_at: string | null;
}

// ── Database type for Supabase client (uses Json for JSONB columns) ──────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Json = any;

export type Database = {
  public: {
    Tables: {
      events: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          date: string;
          location: string | null;
          description: string | null;
          cover_image: string | null;
          slug: string;
          is_published: boolean;
          style: Json;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          date: string;
          location?: string | null;
          description?: string | null;
          cover_image?: string | null;
          slug: string;
          is_published?: boolean;
          style?: Json;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          date?: string;
          location?: string | null;
          description?: string | null;
          cover_image?: string | null;
          slug?: string;
          is_published?: boolean;
          style?: Json;
        };
      };
      modules: {
        Row: {
          id: string;
          created_at: string;
          event_id: string;
          type: string;
          is_active: boolean;
          order: number;
          config: Json;
        };
        Insert: {
          id?: string;
          created_at?: string;
          event_id: string;
          type: string;
          is_active?: boolean;
          order?: number;
          config?: Json;
        };
        Update: {
          id?: string;
          created_at?: string;
          event_id?: string;
          type?: string;
          is_active?: boolean;
          order?: number;
          config?: Json;
        };
      };
      participants: {
        Row: {
          id: string;
          created_at: string;
          event_id: string;
          name: string;
          companions: number;
          attendance: string;
          notes: string | null;
          invitation_viewed: boolean;
          invitation_viewed_at: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          event_id: string;
          name: string;
          companions?: number;
          attendance?: string;
          notes?: string | null;
          invitation_viewed?: boolean;
          invitation_viewed_at?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          event_id?: string;
          name?: string;
          companions?: number;
          attendance?: string;
          notes?: string | null;
          invitation_viewed?: boolean;
          invitation_viewed_at?: string | null;
        };
      };
    };
  };
};
