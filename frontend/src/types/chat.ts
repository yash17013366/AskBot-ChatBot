export type PersonaId = 'student' | 'it_person' | 'explorer';

export interface Persona {
  id: PersonaId;
  name: string;
  tagline: string;
  description: string;
  icon: string;
}

export interface ChatMessageItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  originalQuestion?: string; // Stored on assistant message for the "Tell me more" expansion
}

export interface ApiExchange {
  role: 'user' | 'assistant';
  content: string;
}

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';
