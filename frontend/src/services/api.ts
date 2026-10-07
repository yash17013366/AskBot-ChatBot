import { PersonaId, ApiExchange, ChatMessageItem } from '../types/chat';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface ConnectResponse {
  success: boolean;
  message: string;
}

interface ChatResponse {
  success: boolean;
  reply?: string;
  message?: string;
}

/**
 * Extracts the latest 5 user-assistant exchanges (up to 10 messages)
 * to send as conversation context to the LLM.
 */
export function extractLatestExchanges(messages: ChatMessageItem[]): ApiExchange[] {
  const exchanges: ApiExchange[] = [];
  
  // Convert messages to user/assistant sequence
  for (const m of messages) {
    if (m.role === 'user' || m.role === 'assistant') {
      exchanges.push({
        role: m.role,
        content: m.content,
      });
    }
  }

  // 5 exchanges = max 10 messages
  const maxMessages = 10;
  if (exchanges.length > maxMessages) {
    return exchanges.slice(-maxMessages);
  }
  return exchanges;
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function verifyApiKey(apiKey: string): Promise<ConnectResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/connect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ api_key: apiKey }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        message: data.message || `Connection failed with status ${res.status}.`,
      };
    }

    return {
      success: !!data.success,
      message: data.message || 'LLM Connected',
    };
  } catch (err: unknown) {
    return {
      success: false,
      message: 'Could not reach backend server. Please verify the backend is running.',
    };
  }
}

export async function sendChatMessage(
  apiKey: string,
  persona: PersonaId,
  message: string,
  history: ApiExchange[]
): Promise<ChatResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        persona,
        message,
        history,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        message: data.message || `Request failed with status ${res.status}.`,
      };
    }

    return {
      success: true,
      reply: data.reply || '',
    };
  } catch (err: unknown) {
    return {
      success: false,
      message: 'Network error communicating with AskBot backend.',
    };
  }
}

export async function expandAnswer(
  apiKey: string,
  persona: PersonaId,
  question: string,
  answer: string
): Promise<ChatResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/expand`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        persona,
        question,
        answer,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        message: data.message || `Request failed with status ${res.status}.`,
      };
    }

    return {
      success: true,
      reply: data.reply || '',
    };
  } catch (err: unknown) {
    return {
      success: false,
      message: 'Network error communicating with AskBot backend.',
    };
  }
}
