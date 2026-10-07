# AskBot — Technical Interview & Presentation Notes

These notes are prepared to help you confidently present AskBot during your interview, walk through architecture decisions, and answer technical questions with precision.

---

## 1. The One-Minute Pitch

> "AskBot is a clean, responsive AI chatbot web app powered by Google's Gemini Flash model and built with React, TypeScript, and FastAPI.
> 
> Rather than relying on hardcoded credentials or a database, it puts privacy and simplicity first: users select a tailored persona (Student, IT Person, or Explorer) and bring their own Gemini API key. Before entering the chat, AskBot verifies the key with a live test request. In the chat, it remembers the last 5 conversation exchanges for context, renders full Markdown formatting, and gives users a one-click 'Tell me more' button under every answer to explore topics deeper without bloating prompt payloads.
> 
> The code is intentionally clean, modular, and unbloated, designed for high reliability and straightforward deployment across two decoupled Vercel services."

---

## 2. Architecture Explanation

AskBot follows a **decoupled, stateless client-server architecture**:

- **Frontend (Client)**: A Vite-powered React single-page application (SPA). It maintains temporary session data (active key, persona, messages) in `sessionStorage` and user preferences (dark/light theme) in `localStorage`.
- **Backend (API)**: A lightweight FastAPI service. It contains zero state, zero database connections, and zero session caches. Each HTTP request contains the user's ephemeral API key, allowing the backend to act as a secure proxy to Google Gemini.
- **LLM Provider**: The official Google Gen AI Python SDK (`google-genai`) communicates with `gemini-2.5-flash`.

---

## 3. Why React?

- **Component-Driven UI**: Chat apps are naturally composed of independent, interactive units (message bubbles, auto-resizing text inputs, persona selector cards, dark mode toggles).
- **Predictable State Flow**: Simple React hooks (`useState`, `useEffect`) manage screen transitions and message history without needing heavy external stores like Redux.
- **Fast Developer Ergonomics**: Combined with Vite and TypeScript, builds are near-instantaneous and types prevent runtime bugs.

---

## 4. Why FastAPI?

- **High Asynchronous Performance**: Built on Starlette and Pydantic, FastAPI handles concurrent I/O requests to the Gemini API effortlessly.
- **Automatic Request Validation**: Pydantic models automatically validate incoming request bodies (e.g., verifying `api_key` and non-empty messages) and generate clear OpenAPI schemas.
- **Minimal Boilerplate**: A complete, production-ready REST API with clean CORS and error handling can be built in fewer than 100 lines of code.

---

## 5. Why Gemini & Flash Model?

- **Ultra-Low Latency**: Gemini Flash models (`gemini-2.5-flash`) offer near-instant token generation, crucial for real-time conversational chatbots.
- **Cost & Efficiency**: Designed for high-frequency interactive tasks, making it ideal for assessment demos and personal API keys.
- **Official Modern SDK**: Google's unified `google-genai` SDK provides clean client lifecycle management and built-in type safety.

---

## 6. How API Key Validation Works

Rather than simply checking if the key string is non-empty:
1. When the user clicks **Connect to AskBot**, the client issues a `POST /api/connect` request.
2. The backend instantiates a temporary `genai.Client(api_key=key)` and sends a minimal token-capped ping (`contents="Hi"`, `max_output_tokens=5`).
3. If Google authenticates the request, the backend returns `{ "success": true, "message": "LLM Connected" }` and the chat interface unlocks.
4. If invalid, Google raises an `APIError` (code 400/401/403), which the backend translates to: `"Invalid Gemini API key. Please check your key and try again."`

---

## 7. How the API Key is Handled Securely

- **Never Hardcoded or Committed**: No developer key exists in the repository or backend environment.
- **Per-Request Ephemeral Scope**: The backend receives the key in the encrypted HTTPS request body, uses it to initialize the Gemini client for that specific call, and drops it from memory once the response finishes.
- **Never Logged or Returned**: Error sanitizers explicitly strip headers and payloads to ensure keys never appear in server logs or client error toasts.
- **Scoped to Browser Session**: Stored strictly in `sessionStorage`. Closing the tab permanently deletes the key.

---

## 8. Why There is No Database

- **Privacy & Compliance**: By not persisting conversations or API keys, there is zero risk of data leaks or user data retention liabilities.
- **Assessment Scope**: The goal of AskBot is to demonstrate clean LLM orchestration, persona prompting, and frontend-backend architecture. Introducing PostgreSQL or MongoDB would add unnecessary maintenance overhead without adding user value.
- **Zero Cost & Stateless Scalability**: The backend can scale horizontally to zero or hundreds of serverless instances because no shared state or database locks exist.

---

## 9. How `sessionStorage` vs `localStorage` Are Used

| Storage Mechanism | What is Stored | Why |
| :--- | :--- | :--- |
| **`sessionStorage`** | Gemini API Key, Selected Persona, Chat History | Cleared immediately when the browser tab closes. Survives page refreshes during the session. |
| **`localStorage`** | Theme preference (`dark` or `light`) | Persistent preference that improves user experience across repeat visits without storing sensitive data. |

---

## 10. How Chat History & Context Window Work

- The visible UI retains the entire conversation of the current session.
- However, sending an unbounded conversation history to an LLM leads to token inflation, high latency, and eventual context window errors.
- **AskBot Solution**: The frontend function `extractLatestExchanges()` slices only the **latest 5 user-assistant exchanges** (up to 10 messages) to send with each `/api/chat` request.
- This gives Gemini the necessary immediate context for follow-ups (e.g. "Can you give an example of that?") while keeping requests lean and fast.

---

## 11. How Persona Prompts Work

In `backend/services/prompts.py`:
- All personas inherit from a core base instruction set:
  - *Be helpful, concise, honest when unsure, avoid hallucination, and answer directly.*
- The selected persona then applies a specialized role persona:
  - **Student**: Uses simple analogies, gentle humor, and friendly explanations without jargon.
  - **IT Person**: Uses technical terms, architectural focus, concise code, and avoids conversational filler.
  - **Explorer**: Balances accessible explanations with intriguing conceptual context and broader perspective.
- The system instructions are passed cleanly via the Gemini `GenerateContentConfig(system_instruction=...)`.

---

## 12. How "Tell Me More" Works

1. Under each AI message bubble, a **Tell me more** button is rendered.
2. Clicking it invokes `POST /api/expand` with:
   - `api_key`
   - `persona`
   - `question` (original user query)
   - `answer` (previous AI answer)
3. The prompt explicitly instructs Gemini to:
   - Delve deeper into the exact topic.
   - Match the active persona tone.
   - Avoid regurgitating the previous answer's wording.
   - Provide concrete depth without exceeding concise limits.
4. The expanded response is appended directly to the message thread with full Markdown rendering.

---

## 13. How React Communicates with FastAPI

- React uses native browser `fetch` within a dedicated `services/api.ts` module.
- All mutating actions use `POST` with JSON bodies (`application/json`).
- Environment variable `VITE_API_URL` specifies the backend destination (e.g., `http://localhost:8000` locally, or `https://askbot-backend.vercel.app` in production).

---

## 14. How CORS Works

- In development, the Vite dev server runs at `http://localhost:5173`, while FastAPI runs at `http://localhost:8000`.
- Because the origin (port) differs, the browser initiates CORS preflight requests (`OPTIONS`).
- FastAPI's `CORSMiddleware` inspects the `FRONTEND_ORIGIN` environment variable and allows the frontend to send POST requests and headers safely.

---

## 15. How Errors Are Handled Gracefully

- **Frontend**: Form validation prevents empty keys and blank messages. Network errors display friendly inline alerts rather than crashing React.
- **Backend**: The `sanitize_error()` utility inspects Google SDK exceptions and maps them:
  - 400/401 -> "Invalid Gemini API key. Please check your key and try again."
  - 429 -> "Gemini API quota or rate limit exceeded. Please try again in a few moments."
  - 502/Network -> "Unable to connect to Google Gemini. Please check your connection."
- Raw Python stack traces are never sent to the client.

---

## 16. How the Application is Deployed on Vercel

The monorepo contains both `frontend/` and `backend/`:
1. **Frontend Project**:
   - Vercel Root Directory set to `frontend`.
   - Built with Vite (`npm run build`).
   - `VITE_API_URL` set to the backend Vercel URL.
2. **Backend Project**:
   - Vercel Root Directory set to `backend`.
   - Uses Vercel's Python runtime (`@vercel/python` in `backend/vercel.json`) pointing to `main.py`.
   - `FRONTEND_ORIGIN` set to the frontend Vercel URL.

---

## 17. 10 Likely Interview Questions & Answers

### Q1: Why did you choose FastAPI over Flask or Django?
> "FastAPI offers native asynchronous request handling, which is ideal when waiting for external API calls like Gemini. It also includes automatic schema validation via Pydantic and generates interactive OpenAPI documentation out of the box."

### Q2: Why don't you store the Gemini API key in an environment variable on the backend?
> "By allowing the user to provide their own key in the UI, AskBot protects the host from API bill shock and quota exhaustion during public demos. The backend acts as a secure, stateless proxy that never persists the key."

### Q3: Why `sessionStorage` instead of `localStorage` for the API key?
> "`sessionStorage` is automatically destroyed when the browser tab is closed. If a user tests AskBot on a shared or public computer, their key is erased the moment they close the tab, whereas `localStorage` would linger indefinitely."

### Q4: Why limit conversation history to the last 5 exchanges?
> "Sending the entire conversation history accumulates tokens rapidly, increasing latency and API costs. The last 5 exchanges (10 messages) provide ample context for continuous conversational flow while keeping payload sizes predictable."

### Q5: How did you implement dark mode?
> "Using Tailwind CSS's class strategy (`darkMode: 'class'`). A state hook syncs with `document.documentElement.classList`, and the user's choice is saved in `localStorage` so their theme preference is remembered across visits."

### Q6: What happens if a user enters an invalid Gemini key?
> "Instead of failing during the chat, AskBot validates the key during connection by firing a lightweight token-capped ping. If the SDK catches an invalid credential error, the user is kept on the connect screen with a clean error message."

### Q7: How does 'Tell me more' differ from just typing 'explain more'?
> "'Tell me more' is a structured one-click feature. It sends the original question along with the previous AI answer to the backend, using a prompt designed to expand specifically on nuances not covered in the first reply while retaining the active persona."

### Q8: How is the Gemini model configured?
> "The model name is defined as a central constant `GEMINI_MODEL = os.getenv('GEMINI_MODEL', 'gemini-2.5-flash')` in `gemini_service.py`. This avoids hardcoding model strings across files and allows instant updates if a new model is released."

### Q9: How do you prevent Cross-Origin Resource Sharing (CORS) issues when deployed on Vercel?
> "The backend reads the `FRONTEND_ORIGIN` environment variable and injects it into FastAPI's `CORSMiddleware`. Localhost origins are included for local testing, while the production deployment restricts origins to the deployed frontend domain."

### Q10: How does AskBot handle markdown responses from Gemini?
> "We use `react-markdown` inside `ChatMessage.tsx`. It parses markdown tokens into safe HTML elements for headings, bold text, lists, and formatted code blocks with custom styling."
