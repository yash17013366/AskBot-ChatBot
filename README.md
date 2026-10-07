# AskBot — AI Chatbot

AskBot is a clean, modular, and responsive web chatbot powered by the **Google Gemini API** (using the official `google-genai` SDK and `gemini-2.5-flash`). It offers persona-driven answers (Student, IT Person, Explorer), live API key validation, conversational context memory (latest 5 exchanges), a dedicated "Tell me more" explanation expansion feature, and dark/light mode.

AskBot was engineered with simplicity and maintainability in mind — keeping the architecture transparent and easy to explain in a technical interview without over-engineering.

---

## 1. Features

- **Persona Selection**:
  - 🎓 **Student**: Friendly, simplified analogies with a touch of humor; avoids excessive jargon.
  - 💻 **IT Person**: Direct, technical, and precise; focused on architecture, code, and practical details.
  - 🧭 **Explorer**: Balanced and curious; provides broader perspective and conceptual insights.
- **Client-Provided Gemini API Key**: Users bring their own Gemini API key. No hardcoded or server-persisted secrets.
- **Live Key Verification**: Fast, authenticated test ping to Gemini (`POST /api/connect`) before opening the chat window.
- **ChatGPT-Style Chat Interface**:
  - Clean markdown rendering (bold, lists, inline code, formatted code blocks).
  - Keyboard shortcuts: `Enter` to send, `Shift + Enter` for new lines.
  - Smooth auto-scrolling to newest replies.
  - Loading states and disabled send buttons during generation.
- **"Tell me more" Expansion**: An interactive action button below every AI response that triggers `POST /api/expand` to explain the topic in greater depth according to the active persona.
- **Conversation Context Window**: Sends the latest 5 user-assistant exchanges (up to 10 messages) to Gemini to maintain natural conversational continuity while keeping payload sizes minimal.
- **Session Continuity & Refresh Resilience**:
  - Restores active conversation, persona, and API key on page refresh within the same browser session.
  - Closing the browser tab automatically wipes the key.
- **Clear Chat & Disconnect**:
  - **Clear Chat**: Empties conversation history while preserving persona and API key.
  - **Disconnect**: Completely wipes credentials and session history, returning to the welcome screen.
- **Dark & Light Mode**: Seamless theme switching with immediate toggle and persistence.

---

## 2. Tech Stack

- **Frontend**:
  - React 18 / Vite
  - TypeScript
  - Tailwind CSS
  - `react-markdown` (safe markdown rendering)
  - `lucide-react` (modern minimalist icons)
- **Backend**:
  - Python 3.12+
  - FastAPI
  - Uvicorn
  - Official Google Gen AI SDK (`google-genai` v2+)
  - Pydantic v2
- **Deployment**:
  - GitHub for source control
  - Vercel for frontend & backend hosting (as two decoupled projects from one monorepo)

---

## 3. Architecture Overview

```text
┌────────────────────────────────────────────────────────┐
│                   AskBot Frontend                      │
│                  (Vite + React + TS)                   │
│                                                        │
│   sessionStorage: API Key, Persona, Chat History       │
│   localStorage:   Theme Preference (Dark / Light)      │
└───────────────────────────┬────────────────────────────┘
                            │
               HTTP / JSON (POST Requests)
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                   AskBot Backend                       │
│                 (FastAPI + Python)                     │
│                                                        │
│  - Stateless API Layer                                 │
│  - CORS Middleware                                     │
│  - Prompts Service (Base + Personas)                   │
│  - Gemini Service (Official SDK google-genai)          │
└───────────────────────────┬────────────────────────────┘
                            │
            Authenticated HTTPS (Client API Key)
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│              Google Gemini Flash Model                 │
│                 (gemini-2.5-flash)                     │
└────────────────────────────────────────────────────────┘
```

---

## 4. Project Structure

```text
askbot/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ApiKeyForm.tsx         # API key input, visibility toggle, & verification
│   │   │   ├── ChatInput.tsx          # Auto-resizing textarea with keyboard shortcuts
│   │   │   ├── ChatMessage.tsx        # Message bubbles, markdown parser, "Tell me more"
│   │   │   ├── ChatWindow.tsx         # Scrollable message area, empty state prompts, footer
│   │   │   ├── ConnectionStatus.tsx   # Verified / error / loading banner
│   │   │   ├── Header.tsx             # Brand header, active persona badge, theme & disconnect
│   │   │   ├── PersonaCard.tsx        # Selectable card for Student / IT Person / Explorer
│   │   │   ├── ThemeToggle.tsx        # Dark/light theme switch
│   │   │   └── WelcomeScreen.tsx      # Welcome hero and step-1 persona selection
│   │   ├── services/
│   │   │   └── api.ts                 # Typed fetch client & exchange trimmer
│   │   ├── types/
│   │   │   └── chat.ts                # TypeScript interfaces & union types
│   │   ├── utils/
│   │   │   └── storage.ts             # sessionStorage vs localStorage boundaries
│   │   ├── App.tsx                    # Main state machine and screen coordinator
│   │   ├── main.tsx                   # React root mount
│   │   └── index.css                  # Tailwind styles
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── vercel.json
│
├── backend/
│   ├── main.py                        # FastAPI app setup, CORS, route inclusion
│   ├── models/
│   │   └── requests.py                # Pydantic request & chat schemas
│   ├── routes/
│   │   ├── connection.py              # POST /api/connect endpoint
│   │   └── chat.py                    # POST /api/chat & POST /api/expand endpoints
│   ├── services/
│   │   ├── gemini_service.py          # Google Gen AI SDK client & error sanitization
│   │   └── prompts.py                 # Base rules & persona system instructions
│   ├── requirements.txt               # Backend dependencies
│   ├── .env.example
│   └── vercel.json                    # Vercel Python Serverless config
│
├── README.md
├── INTERVIEW_NOTES.md
└── .gitignore
```

---

## 5. Browser Storage Strategy

AskBot does **not** use a database. Storage is carefully partitioned:

1. **`sessionStorage`** (Temporary & Session-Scoped):
   - **Gemini API Key**: Kept only for the duration of the browser tab. Cleared immediately upon tab closure.
   - **Selected Persona**: Retained during active navigation.
   - **Chat History**: Preserved across page refreshes during the session.
2. **`localStorage`** (Persistent across sessions):
   - **Theme Preference (`askbot_theme`)**: Remembers whether the user prefers light or dark mode. No sensitive data is ever placed in `localStorage`.

---

## 6. Security Principles

- **No Hardcoded Keys**: No API key is ever embedded in frontend bundles, backend environment variables, or Git repositories.
- **Ephemeral Key Handling**: The client passes the API key in the JSON body of authenticated POST requests (`/api/connect`, `/api/chat`, `/api/expand`). The backend instantiates a per-request client and never persists, caches, or logs the key.
- **Sanitized Errors**: Raw Python stack traces and sensitive error payloads are intercepted by `sanitize_error()` to prevent leaking API keys, file paths, or internal headers.

---

## 7. How API Key Validation Works

When the user enters their Gemini key and clicks **Connect to AskBot**:
1. Frontend makes a `POST /api/connect` request with `{ "api_key": "..." }`.
2. Backend instantiates `genai.Client(api_key=api_key)`.
3. Backend runs a lightweight test generation call (`contents="Hi"`, `max_output_tokens=5`, `temperature=0.1`).
4. If valid, the backend responds with `{ "success": true, "message": "LLM Connected" }`.
5. If invalid or unauthorized, the exception is caught and mapped to a clean user-facing error (e.g., `401: Invalid Gemini API key`).
6. The chat screen unlocks only upon verification success.

---

## 8. Chat Context Window (Latest 5 Exchanges)

To ensure smooth conversational context without accumulating unbounded token payloads:
- An exchange is defined as one pair: **1 User Message + 1 AI Response** (2 messages).
- 5 exchanges = **up to 10 messages**.
- The frontend utility `extractLatestExchanges(messages)` selects the latest 10 messages from the session array and formats them into the standard `{ role, content }` payload sent to `/api/chat`.
- The full conversation remains visually displayed to the user in the UI.

---

## 9. How "Tell Me More" Works

1. Every assistant reply renders a subtle **Tell me more** button.
2. When clicked, the frontend issues a `POST /api/expand` request containing:
   - `api_key`
   - `persona`
   - `question` (the original user prompt that prompted the answer)
   - `answer` (the initial concise response)
3. The backend builds a targeted expansion prompt that instructs Gemini to go deeper into the same concept, adhere to the chosen persona tone, avoid phrasing repetition, and maintain clarity without becoming verbose.
4. The expanded response is appended directly into the message list.

---

## 10. Local Development Setup

### Prerequisites
- Node.js (v18+) & npm
- Python (3.10+)

### 1. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the FastAPI server
uvicorn backend.main:app --reload --port 8000
```
Backend will be live at: `http://localhost:8000`.  
Health check: `http://localhost:8000/api/health`.

### 2. Frontend Setup
In a separate terminal:
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
Frontend will be live at: `http://localhost:5173`.

---

## 11. Environment Variables

### Backend (`backend/.env`)
```env
FRONTEND_ORIGIN=http://localhost:5173
PORT=8000
# Optional model override (defaults to gemini-2.5-flash)
# GEMINI_MODEL=gemini-2.5-flash
```

### Frontend (`frontend/.env`)
```env
# URL pointing to your running FastAPI backend
VITE_API_URL=http://localhost:8000
```

---

## 12. API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check to verify backend status |
| `POST` | `/api/connect` | Verifies user's Gemini key with live lightweight request |
| `POST` | `/api/chat` | Generates response using persona + 5-exchange context |
| `POST` | `/api/expand` | Generates deeper explanation on a previous answer |

---

## 13. Vercel Deployment

Deploy frontend and backend as **two separate Vercel projects** linked to the same GitHub repository:

### Project 1: Backend
- **Root Directory**: `backend`
- **Framework Preset**: Other / None
- **Environment Variables**:
  - `FRONTEND_ORIGIN`: `https://<your-frontend-project>.vercel.app`

### Project 2: Frontend
- **Root Directory**: `frontend`
- **Framework Preset**: Vite
- **Environment Variables**:
  - `VITE_API_URL`: `https://<your-backend-project>.vercel.app`
