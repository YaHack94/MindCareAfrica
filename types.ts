export type NavigationItem = 'dashboard' | 'chat' | 'journal' | 'resources' | 'community' | 'professionals';

export interface User {
  id: string; // email or phone number
  pseudonym: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  country: string;
  pin: string; // NOTE: Storing PIN in plaintext is insecure. For demo purposes only.
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  mood: Mood;
  note: string;
}

export type Mood = 'radieux' | 'heureux' | 'neutre' | 'triste' | 'terrible';

export interface Resource {
  id: string;
  type: 'video' | 'podcast' | 'article';
  title: string;
  description: string;
  imageUrl: string;
  source: string;
  contentUrl?: string;
}

export interface ForumPost {
    id: string;
    author: string;
    title: string;
    content: string;
    timestamp: string;
    date: string; // For sorting
    replies: number;
    category: 'Gestion du stress' | 'Petites victoires' | 'Relations' | 'Soutien';
    isNew?: boolean; // For highlighting new/updated posts
}

export interface Psychologist {
  id: string;
  name: string;
  specialty: string;
  imageUrl: string;
  description: string;
}