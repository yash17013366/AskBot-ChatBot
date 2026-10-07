import { PersonaId, ChatMessageItem } from '../types/chat';

const SESSION_KEY_API = 'askbot_gemini_api_key';
const SESSION_KEY_PERSONA = 'askbot_persona';
const SESSION_KEY_CHAT = 'askbot_chat_history';
const LOCAL_KEY_THEME = 'askbot_theme';

// =================== sessionStorage (Session Data & Secrets) ===================

export function getStoredApiKey(): string | null {
  try {
    return sessionStorage.getItem(SESSION_KEY_API);
  } catch {
    return null;
  }
}

export function setStoredApiKey(key: string): void {
  try {
    sessionStorage.setItem(SESSION_KEY_API, key);
  } catch (e) {
    console.error('Failed to save API key to sessionStorage', e);
  }
}

export function clearStoredApiKey(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY_API);
  } catch (e) {
    console.error('Failed to clear API key', e);
  }
}

export function getStoredPersona(): PersonaId | null {
  try {
    const val = sessionStorage.getItem(SESSION_KEY_PERSONA);
    if (val === 'student' || val === 'it_person' || val === 'explorer') {
      return val;
    }
    return null;
  } catch {
    return null;
  }
}

export function setStoredPersona(persona: PersonaId): void {
  try {
    sessionStorage.setItem(SESSION_KEY_PERSONA, persona);
  } catch (e) {
    console.error('Failed to save persona to sessionStorage', e);
  }
}

export function getStoredChatHistory(): ChatMessageItem[] {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY_CHAT);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function setStoredChatHistory(messages: ChatMessageItem[]): void {
  try {
    sessionStorage.setItem(SESSION_KEY_CHAT, JSON.stringify(messages));
  } catch (e) {
    console.error('Failed to save chat to sessionStorage', e);
  }
}

export function clearStoredChatHistory(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY_CHAT);
  } catch (e) {
    console.error('Failed to clear chat from sessionStorage', e);
  }
}

export function clearFullSession(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY_API);
    sessionStorage.removeItem(SESSION_KEY_CHAT);
    sessionStorage.removeItem(SESSION_KEY_PERSONA);
  } catch (e) {
    console.error('Failed to clear session', e);
  }
}

// =================== localStorage (Theme Preference Only) ===================

export function getStoredTheme(): 'light' | 'dark' {
  try {
    const val = localStorage.getItem(LOCAL_KEY_THEME);
    if (val === 'dark' || val === 'light') return val;
    // Default to system preference
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  } catch {
    return 'light';
  }
}

export function setStoredTheme(theme: 'light' | 'dark'): void {
  try {
    localStorage.setItem(LOCAL_KEY_THEME, theme);
  } catch (e) {
    console.error('Failed to save theme to localStorage', e);
  }
}
