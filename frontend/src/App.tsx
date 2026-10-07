import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ApiKeyForm } from './components/ApiKeyForm';
import { ChatWindow } from './components/ChatWindow';
import { PersonaId, ChatMessageItem, ConnectionState } from './types/chat';
import {
  getStoredApiKey,
  setStoredApiKey,
  getStoredPersona,
  setStoredPersona,
  getStoredChatHistory,
  setStoredChatHistory,
  clearStoredChatHistory,
  clearFullSession,
  getStoredTheme,
  setStoredTheme,
} from './utils/storage';
import {
  verifyApiKey,
  sendChatMessage,
  expandAnswer,
  extractLatestExchanges,
} from './services/api';

type Screen = 'welcome' | 'api_key' | 'chat';

export const App: React.FC = () => {
  // Theme state persisted exclusively in localStorage
  const [theme, setTheme] = useState<'light' | 'dark'>(() => getStoredTheme());

  // Navigation and Persona state
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [selectedPersona, setSelectedPersona] = useState<PersonaId>(
    () => getStoredPersona() || 'student'
  );

  // API Key & Connection state
  const [apiKey, setApiKey] = useState<string>(() => getStoredApiKey() || '');
  const [connectionStatus, setConnectionStatus] = useState<ConnectionState>('disconnected');
  const [connectionError, setConnectionError] = useState<string>('');

  // Chat conversation state
  const [messages, setMessages] = useState<ChatMessageItem[]>(() => getStoredChatHistory());
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [expandingMessageId, setExpandingMessageId] = useState<string | null>(null);
  const [chatError, setChatError] = useState<string | null>(null);

  // Sync theme with HTML document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setStoredTheme(theme);
  }, [theme]);

  // Session restoration on mount/refresh
  useEffect(() => {
    const storedKey = getStoredApiKey();
    const storedPers = getStoredPersona();
    const storedChat = getStoredChatHistory();

    if (storedPers) {
      setSelectedPersona(storedPers);
    }

    if (storedKey) {
      setApiKey(storedKey);
      setConnectionStatus('connected');
      setCurrentScreen('chat');
      setMessages(storedChat);
    }
  }, []);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleSelectPersona = (id: PersonaId) => {
    setSelectedPersona(id);
    setStoredPersona(id);
  };

  const handleWelcomeContinue = () => {
    setStoredPersona(selectedPersona);
    setCurrentScreen('api_key');
  };

  const handleConnectApiKey = async () => {
    if (!apiKey.trim()) return;

    setConnectionStatus('connecting');
    setConnectionError('');

    const res = await verifyApiKey(apiKey.trim());

    if (res.success) {
      setStoredApiKey(apiKey.trim());
      setStoredPersona(selectedPersona);
      setConnectionStatus('connected');
      setCurrentScreen('chat');
    } else {
      setConnectionStatus('error');
      setConnectionError(res.message);
    }
  };

  const handleDisconnect = () => {
    clearFullSession();
    setApiKey('');
    setMessages([]);
    setConnectionStatus('disconnected');
    setConnectionError('');
    setChatError(null);
    setCurrentScreen('welcome');
  };

  const handleClearChat = () => {
    clearStoredChatHistory();
    setMessages([]);
    setChatError(null);
  };

  const handleSendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading || !apiKey) return;

    setChatError(null);

    const userMessage: ChatMessageItem = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    // Extract recent 5 exchanges (up to 10 messages) for Gemini context
    const recentContext = extractLatestExchanges(updatedMessages);

    const response = await sendChatMessage(
      apiKey,
      selectedPersona,
      trimmed,
      recentContext
    );

    setIsLoading(false);

    if (response.success && response.reply) {
      const assistantMessage: ChatMessageItem = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        role: 'assistant',
        content: response.reply,
        timestamp: Date.now(),
        originalQuestion: trimmed, // Retain original user question for 'Tell me more'
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      setStoredChatHistory(finalMessages);
    } else {
      setChatError(
        response.message || 'Failed to get a response from AskBot. Please try again.'
      );
    }
  };

  const handleTellMeMore = async (aiMessage: ChatMessageItem) => {
    if (!apiKey || expandingMessageId || isLoading) return;

    // Find the original question corresponding to this answer
    let question = aiMessage.originalQuestion;
    if (!question) {
      // Find the user message immediately preceding this AI message
      const idx = messages.findIndex((m) => m.id === aiMessage.id);
      if (idx > 0 && messages[idx - 1].role === 'user') {
        question = messages[idx - 1].content;
      } else {
        question = 'Can you elaborate on this?';
      }
    }

    setExpandingMessageId(aiMessage.id);
    setChatError(null);

    const response = await expandAnswer(
      apiKey,
      selectedPersona,
      question,
      aiMessage.content
    );

    setExpandingMessageId(null);

    if (response.success && response.reply) {
      const expandedMessage: ChatMessageItem = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        role: 'assistant',
        content: response.reply,
        timestamp: Date.now(),
        originalQuestion: question,
      };

      const finalMessages = [...messages, expandedMessage];
      setMessages(finalMessages);
      setStoredChatHistory(finalMessages);
    } else {
      setChatError(
        response.message || 'Failed to expand on this topic. Please try again.'
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
      <Header
        persona={selectedPersona}
        isConnected={connectionStatus === 'connected'}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onDisconnect={handleDisconnect}
      />

      <main className="flex-1 flex flex-col">
        {currentScreen === 'welcome' && (
          <WelcomeScreen
            selectedPersona={selectedPersona}
            onSelectPersona={handleSelectPersona}
            onContinue={handleWelcomeContinue}
          />
        )}

        {currentScreen === 'api_key' && (
          <ApiKeyForm
            apiKey={apiKey}
            onApiKeyChange={(k) => {
              setApiKey(k);
              if (connectionStatus === 'error') {
                setConnectionStatus('disconnected');
                setConnectionError('');
              }
            }}
            onConnect={handleConnectApiKey}
            onBack={() => setCurrentScreen('welcome')}
            connectionStatus={connectionStatus}
            errorMessage={connectionError}
            selectedPersona={selectedPersona}
          />
        )}

        {currentScreen === 'chat' && (
          <ChatWindow
            messages={messages}
            input={input}
            onInputChange={setInput}
            onSendMessage={handleSendMessage}
            onTellMeMore={handleTellMeMore}
            onClearChat={handleClearChat}
            isLoading={isLoading}
            expandingMessageId={expandingMessageId}
            errorMessage={chatError}
            persona={selectedPersona}
          />
        )}
      </main>
    </div>
  );
};

export default App;
