
export type NavigationItem = 'dashboard' | 'chat' | 'journal' | 'resources' | 'community' | 'professionals';

export interface User {
  id: string; // email or phone number
  pseudonym: string;
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
}

export interface ForumPost {
    id: string;
    author: string;
    title: string;
    content: string;
    timestamp: string;
    replies: number;
}

export interface Psychologist {
  id: string;
  name: string;
  specialty: string;
  imageUrl: string;
  description: string;
}