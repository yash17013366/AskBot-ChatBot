# Antigravity Prompt — AskBot AI Chatbot

Build a complete web application called **AskBot** based on the specification below.

This is a technical assessment project for a software/AI role. The application must be polished enough for a live company demo, but the implementation must remain **simple, clean, modular, and easy to explain in an interview**.

---

# 1. PROJECT GOAL

AskBot is a clean, responsive web chatbot powered by the **Google Gemini API**.

The user should be able to:

1. Select a persona:
   - Student
   - IT Person
   - Explorer
2. Enter their own Gemini API key.
3. Verify that the API key actually works before entering the chat.
4. Chat with Gemini through a clean ChatGPT-style interface.
5. Get a **"Tell me more"** button below every AI response.
6. Clear the conversation.
7. Disconnect/change the Gemini API key.
8. Switch between light and dark mode.

The application should feel like a polished technical assessment project, not an over-engineered production platform.

---

# 2. IMPORTANT DEVELOPMENT PRINCIPLES

## Keep the code SIMPLE

This is extremely important.

Do NOT over-engineer the application.

Do NOT introduce unnecessary:

- design patterns
- complex abstractions
- Redux or other unnecessary state-management libraries
- databases
- authentication systems
- microservices
- complex caching
- unnecessary TypeScript generics
- complicated custom hooks
- complicated API layers
- unnecessary dependencies

Every implementation decision must be something I can understand and explain during an interview.

Prefer:

**simple → readable → modular → maintainable**

over:

**complex → clever → over-engineered**

Use clear variable names, small functions, and straightforward logic.

---

# 3. TECHNOLOGY STACK

## Frontend

- React
- TypeScript
- Vite
- Current stable Tailwind CSS setup
- `react-markdown` for rendering Gemini markdown responses

## Backend

- Python
- FastAPI
- Official current Google Gen AI Python SDK

Before implementing the Gemini integration, check the current official Google Gemini API documentation and use the currently supported SDK/API approach.

Use a fast **Flash-class Gemini model** appropriate for this application.

Do not hardcode the model name throughout the code.

Create one clearly named backend constant such as:

```python
GEMINI_MODEL = "current-supported-flash-model"
```

Use the exact currently supported model name from the official Google documentation.

If the SDK or model naming has changed, follow the current official documentation rather than relying on outdated examples.

## Deployment

Use:

- GitHub for source control
- Vercel for frontend deployment
- Vercel for backend deployment

The frontend and backend will be deployed as **two separate Vercel projects from the same GitHub repository**.

---

# 4. DEPLOYMENT ARCHITECTURE

The repository should have:

```text
askbot/
│
├── frontend/
│
└── backend/
```

Create **two Vercel projects**:

```text
GitHub Repository
       │
       ├── frontend/
       │       ↓
       │   Vercel Project 1
       │
       └── backend/
               ↓
           Vercel Project 2
```

The frontend must communicate with the deployed backend through an environment variable.

## Frontend environment variable

Local development:

```text
VITE_API_URL=http://localhost:8000
```

Production:

```text
VITE_API_URL=<deployed-backend-url>
```

Do NOT hardcode the production backend URL in React source code.

## Backend

Configure FastAPI CORS correctly.

During development, allow the local frontend origin.

For production, allow the deployed frontend origin.

Do not use `allow_origins=["*"]` as the final production configuration if the actual frontend URL is known.

Check the current Vercel documentation for deploying FastAPI/Python applications and configure the backend accordingly.

The application must work both locally and after deployment.

---

# 5. NO DATABASE

Do NOT create a database.

Do NOT use:

- MongoDB
- PostgreSQL
- Supabase
- SQLite
- Firebase
- Redis

The application does not need permanent user accounts or permanent chat storage.

The backend should remain essentially stateless.

The browser handles temporary session data.

---

# 6. BROWSER STORAGE RULES

Use storage deliberately.

## sessionStorage

Store:

- Gemini API key
- selected persona
- current chat history

The API key must be stored in **sessionStorage only**.

This means it is cleared when the browser tab/session is closed.

## localStorage

Store only:

- light/dark theme preference

Do NOT store the Gemini API key in localStorage.

## React state

Use React state for temporary UI state such as:

- loading
- errors
- current input
- connection status
- UI state

Do not create a complicated state management system.

---

# 7. REFRESH BEHAVIOR

If the user refreshes the page during the same browser session:

1. Read the Gemini API key from sessionStorage.
2. Read the selected persona.
3. Read the current chat history.
4. Restore the session.
5. If the API key exists, show the chat screen instead of forcing the user to enter the key again.
6. Keep the theme from localStorage.

The user should be able to refresh the page without losing the current session.

If no API key exists, show the connection screen.

---

# 8. SECURITY RULES

NEVER:

- hardcode a Gemini API key
- commit a Gemini API key
- store the user's API key in a database
- store the API key in localStorage
- print the API key in logs
- return the API key in API responses
- put the API key in source code
- put the API key in a URL or query parameter

The API key must be sent in the **POST request body**.

Example:

```text
POST /api/chat
```

with JSON containing the key.

Never:

```text
/api/chat?api_key=...
```

The user will enter their real Gemini API key directly into the AskBot UI during testing.

**Never ask the user to paste their real API key into Antigravity, source code, prompts, README files, or GitHub.**

The backend should receive the key, use it for the Gemini request, and never persist it.

---

# 9. PROJECT STRUCTURE

Use a clean structure similar to:

```text
askbot/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── WelcomeScreen.tsx
│   │   │   ├── PersonaCard.tsx
│   │   │   ├── ApiKeyForm.tsx
│   │   │   ├── ConnectionStatus.tsx
│   │   │   ├── ChatWindow.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── Header.tsx
│   │   │   └── ThemeToggle.tsx
│   │   │
│   │   ├── services/
│   │   │   └── api.ts
│   │   │
│   │   ├── types/
│   │   │   └── chat.ts
│   │   │
│   │   ├── utils/
│   │   │   └── storage.ts
│   │   │
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   │
│   └── package.json
│
├── backend/
│   ├── main.py
│   ├── models/
│   │   └── requests.py
│   ├── routes/
│   │   ├── connection.py
│   │   └── chat.py
│   ├── services/
│   │   ├── gemini_service.py
│   │   └── prompts.py
│   ├── requirements.txt
│   └── .env.example
│
├── README.md
├── INTERVIEW_NOTES.md
└── .gitignore
```

This structure is intentionally small.

Do not create unnecessary files just to make the project look more modular.

---

# 10. USER FLOW

The application should follow:

```text
Welcome Screen
      ↓
Choose Persona
      ↓
Enter Gemini API Key
      ↓
Click "Connect"
      ↓
Backend verifies Gemini API key
      ↓
   ┌───────────────┐
   │               │
 SUCCESS          ERROR
   │               │
   ↓               ↓
LLM Connected   Friendly error
   │
   ↓
Chat Screen
```

The user should not be able to start chatting until the Gemini key successfully passes the connection test.

---

# 11. WELCOME SCREEN

Create a clean welcome screen.

Heading:

**AskBot**

Subtitle:

**Your simple, personalized AI assistant.**

Show three persona cards.

### Student

Friendly explanations with a little humor.

### IT Person

Precise, technical, and to the point.

### Explorer

Balanced answers for curious minds.

Each card should have a simple icon and a clear selected state.

After selecting a persona, continue to the API key connection screen.

---

# 12. PERSONAS

All personas must follow the same base AskBot behavior.

## Base AskBot rules

```text
You are AskBot, a friendly and concise AI assistant.

Rules:
- Be helpful.
- Keep answers reasonably short.
- Use simple and clear language.
- Admit when you do not know something.
- Do not invent information.
- Avoid unnecessarily long explanations.
- Answer the user's question directly.
```

Then add the selected persona.

## Student

```text
The user is a student.

Use a friendly and slightly humorous tone.
Explain concepts clearly.
Use simple examples when helpful.
Avoid unnecessary technical jargon.
```

## IT Person

```text
The user is an IT professional or technically experienced user.

Use a precise, clean, and professional tone.
Technical terminology is acceptable.
Focus on accuracy and practical details.
Avoid unnecessary explanations.
```

## Explorer

```text
The user is curious and enjoys exploring topics.

Use a balanced tone between friendly and professional.
Explain ideas clearly.
Include useful context when it improves understanding.
Keep the response concise.
```

Keep the prompt construction in:

```text
backend/services/prompts.py
```

Do not put the full system prompt inside the route functions.

---

# 13. API KEY CONNECTION

Create a clean API key connection screen.

Include:

- Gemini API key input
- Show/hide API key button
- Connect button
- "Get a free Gemini API key" link

The link should point to the official Google AI Studio API key page.

When the user clicks Connect, do NOT merely check whether the key is non-empty.

The backend must make a lightweight authenticated Gemini request using the supplied key.

Flow:

```text
React
  ↓
POST /api/connect
  ↓
FastAPI
  ↓
Create Gemini client using supplied key
  ↓
Small test request to Gemini
  ↓
Return success/error
```

Success:

```text
✓ LLM Connected
```

Invalid key:

```text
✕ Invalid Gemini API key. Please check your key and try again.
```

Handle other failures gracefully:

- invalid API key
- quota/rate limit
- API unavailable
- network/service error
- unexpected Gemini error

Do not expose raw Python stack traces to the user.

---

# 14. CHAT INTERFACE

Create a clean ChatGPT-style interface.

Header:

```text
AskBot
[Current Persona]
                    [Theme] [Disconnect]
```

Main area:

- user messages
- AI messages
- markdown rendering
- code blocks when Gemini returns code
- loading indicator
- clean empty state

Bottom:

```text
[ Type your message...                  ] [Send]
                         [Clear Chat]
```

Requirements:

- Pressing Enter sends the message.
- Shift + Enter creates a new line.
- Automatically scroll to the newest message.
- Disable Send while a request is processing.
- Show a simple loading indicator.
- Prevent empty messages from being submitted.

The interface must be responsive on desktop and mobile.

---

# 15. MARKDOWN RENDERING

Gemini may return markdown such as:

```text
**bold**
### headings
- lists
`inline code`
```code blocks```
```

Use `react-markdown` to render AI responses properly.

Keep the styling clean and readable.

Do not allow unsafe HTML rendering unnecessarily.

---

# 16. CHAT HISTORY

This application does NOT need permanent conversation memory.

Maintain the current chat history in React and sessionStorage.

## Important rule

For every new chat request, send the **latest 5 user-assistant exchanges** to Gemini as conversation context.

One exchange means:

```text
User question
+
AI answer
```

Therefore, the context can contain up to:

```text
5 exchanges
=
10 individual messages
```

Example:

```text
Exchange 1
User: What is RAG?
AI: RAG stands for...

Exchange 2
User: Why is it useful?
AI: It is useful because...

Exchange 3
User: Give me an example.
AI: For example...

Exchange 4
User: RAG vs fine-tuning?
AI: ...

Exchange 5
User: Which should I use?
AI: ...
```

When the user asks another question, keep the full visible conversation in the UI, but send only the latest 5 exchanges to Gemini.

This keeps the implementation simple and prevents unnecessarily large requests.

## Important distinction

The UI may display the entire current session conversation.

Gemini only receives the latest 5 exchanges as context.

Do NOT create a database for this.

---

# 17. CHAT REQUEST

The frontend should send a request conceptually containing:

```json
{
  "api_key": "user-provided-key",
  "persona": "student",
  "message": "Explain transformers",
  "history": [
    {
      "role": "user",
      "content": "What is an LLM?"
    },
    {
      "role": "assistant",
      "content": "An LLM is..."
    }
  ]
}
```

The frontend is responsible for selecting the latest 5 exchanges before sending the request.

The backend should combine:

```text
Base AskBot instructions
+
Persona instructions
+
Recent conversation history
+
New user message
```

and send the request to Gemini.

---

# 18. CHAT RESPONSE

When Gemini responds:

1. Add the user message to the visible chat.
2. Add the AI response to the visible chat.
3. Save updated chat history in sessionStorage.
4. Render the AI response using markdown.
5. Show the "Tell me more" button below the AI response.

Do not permanently store conversations anywhere else.

---

# 19. TELL ME MORE

Every AI response should have:

**Tell me more**

When clicked, the frontend should call:

```text
POST /api/expand
```

The request must include:

- API key
- selected persona
- user's original question
- previous AI answer

Conceptually:

```json
{
  "api_key": "user-provided-key",
  "persona": "student",
  "question": "What is RAG?",
  "answer": "RAG combines retrieval with generation..."
}
```

The backend should ask Gemini to expand on the same answer.

The expanded response should:

- stay on the same topic
- explain more deeply
- remain understandable
- follow the selected persona
- avoid unnecessary repetition
- not become excessively long

Do not require the entire chat history for `/api/expand`.

---

# 20. CLEAR CHAT

Add a **Clear Chat** button.

When clicked:

- remove visible messages
- clear chat history from sessionStorage
- keep selected persona
- keep Gemini connection active
- remain on the chat screen

---

# 21. DISCONNECT / CHANGE KEY

Add a **Disconnect** option in the top-right.

When clicked:

- remove Gemini API key from sessionStorage
- clear chat history
- clear selected persona if appropriate
- return to the API key connection screen

The user should be able to enter another Gemini API key.

---

# 22. DARK/LIGHT MODE

Add a simple dark/light mode toggle.

Requirements:

- clean dark theme
- clean light theme
- remember theme using localStorage
- no unnecessary theme architecture

Only the theme preference should use localStorage.

---

# 23. API ENDPOINTS

Keep the API simple.

```text
GET  /api/health
POST /api/connect
POST /api/chat
POST /api/expand
```

## GET /api/health

Checks whether the FastAPI backend is running.

## POST /api/connect

Verifies the supplied Gemini API key with a lightweight Gemini request.

## POST /api/chat

Generates the AskBot response.

Request includes:

- API key
- persona
- new message
- latest 5 exchanges

## POST /api/expand

Expands a previous response.

Request includes:

- API key
- persona
- original user question
- previous AI answer

---

# 24. BACKEND RESPONSIBILITIES

## main.py

- create FastAPI application
- configure CORS
- include routers

## routes/connection.py

- connection endpoint
- validation/error handling

## routes/chat.py

- chat endpoint
- expand endpoint
- request validation

## services/gemini_service.py

Responsible for:

- creating the Gemini client
- calling the Gemini API
- connection test
- normal chat generation
- expansion generation
- handling Gemini API errors

Keep the Gemini SDK logic here rather than scattering it across route files.

## services/prompts.py

Responsible for:

- base AskBot prompt
- Student prompt
- IT Person prompt
- Explorer prompt
- combining base + persona instructions

## models/requests.py

Define simple request models for:

- connect
- chat
- expand

Do not create unnecessarily complex schemas.

---

# 25. ERROR HANDLING

Errors must never crash the application.

## Frontend

Handle:

- empty API key
- invalid API key
- empty message
- failed request
- backend unavailable
- Gemini failure
- loading states

## Backend

Handle:

- malformed request
- invalid Gemini key
- quota/rate limit
- Gemini API errors
- unexpected exceptions

Return simple JSON responses.

Example:

```json
{
  "success": false,
  "message": "Invalid Gemini API key."
}
```

Do not expose:

- stack traces
- internal file paths
- API keys
- sensitive implementation details

---

# 26. CORS

Because frontend and backend are separate Vercel projects, CORS must be configured correctly.

Development should allow the local frontend origin.

Production should allow the deployed frontend origin.

Use a configuration/environment variable where appropriate rather than hardcoding multiple production domains throughout the code.

Do not leave unrestricted `*` CORS in the final production configuration if the frontend URL is known.

---

# 27. UI DESIGN

The UI should feel:

- modern
- minimal
- professional
- clean
- responsive
- easy to understand

Avoid:

- excessive animations
- excessive gradients
- unnecessary 3D effects
- clutter
- too many colors
- complicated navigation

Use subtle transitions where useful.

The application should look like a polished **company technical assessment**, not a template overloaded with features.

---

# 28. CODE QUALITY

Follow these rules:

- meaningful variable names
- small readable functions
- simple logic
- comments only when they add value
- no dead code
- no duplicate code
- no unnecessary dependencies
- no huge files
- no huge functions
- no hardcoded API keys
- proper error handling
- clear separation between UI, API calls, prompts, and Gemini logic

If something can be implemented simply, do not make it complicated.

---

# 29. README

Create a clear `README.md` containing:

1. Project overview
2. Features
3. Tech stack
4. Architecture
5. Project structure
6. Browser storage strategy
7. How Gemini API key validation works
8. How chat history works
9. How to run frontend locally
10. How to run backend locally
11. Environment variables
12. API endpoints
13. Error handling
14. Vercel deployment
15. Security notes

Include a simple architecture diagram in text/Markdown.

---

# 30. INTERVIEW NOTES

Create:

```text
INTERVIEW_NOTES.md
```

This file must explain the project in simple language that I can study before the Aress presentation.

Include:

1. One-minute project explanation
2. Architecture explanation
3. Why React?
4. Why FastAPI?
5. Why Gemini?
6. How API key validation works
7. How the API key is handled securely
8. Why there is no database
9. How sessionStorage and localStorage are used
10. How chat history works
11. Why only the latest 5 exchanges are sent
12. How persona prompts work
13. How Tell Me More works
14. How React communicates with FastAPI
15. How CORS works
16. How errors are handled
17. How the application is deployed on Vercel
18. 10 likely technical interview questions with simple answers

Keep the explanations beginner-friendly and consistent with the actual implementation.

Do not document features that were not implemented.

---

# 31. DO NOT INVENT FEATURES

Only implement the features described in this specification.

Do NOT add:

- authentication
- user accounts
- database
- payment
- analytics dashboard
- admin panel
- voice chat
- file uploads
- RAG
- vector database
- web search
- AI agents
- unnecessary memory systems
- unnecessary external services

The goal is a **simple but polished LLM chatbot**.

---

# 32. DEVELOPMENT PROCESS

Build the application incrementally.

## Phase 1 — Project setup

Create:

- frontend
- backend
- basic project structure
- Vite + React + TypeScript
- current stable Tailwind setup
- FastAPI
- official Google Gen AI SDK
- basic health endpoint

Stop and show what works.

## Phase 2 — Welcome + personas

Implement:

- AskBot welcome screen
- three persona cards
- persona selection
- clean UI

Stop and show what works.

## Phase 3 — Gemini connection

Implement:

- API key input
- show/hide key
- Connect button
- `/api/connect`
- real Gemini validation request
- success/error status
- sessionStorage handling

Stop and test with a real key entered manually through the UI.

## Phase 4 — Chat

Implement:

- chat screen
- message input
- Send
- Enter / Shift+Enter behavior
- loading state
- markdown rendering
- latest 5 exchanges sent as context
- sessionStorage chat history
- auto-scroll

Stop and test.

## Phase 5 — Tell Me More

Implement:

- button under each AI response
- `/api/expand`
- original question + previous answer + persona + API key
- loading state
- error handling

Stop and test.

## Phase 6 — Clear + Disconnect

Implement:

- Clear Chat
- Disconnect/change key
- correct sessionStorage cleanup

Stop and test.

## Phase 7 — Theme

Implement:

- dark mode
- light mode
- localStorage theme preference

Stop and test.

## Phase 8 — Reliability + polish

Test:

- loading states
- empty input
- API failures
- invalid key
- quota/rate limit
- backend unavailable
- responsive UI
- CORS
- refresh behavior
- session restoration

Stop and fix issues before continuing.

## Phase 9 — Vercel deployment

Deploy the backend as one Vercel project with root directory:

```text
backend
```

Deploy the frontend as another Vercel project with root directory:

```text
frontend
```

Configure:

```text
VITE_API_URL
```

on the frontend.

Configure required backend environment variables.

Configure production CORS.

Check the current official Vercel documentation for the correct FastAPI/Python deployment configuration.

Stop and test the deployed application end-to-end.

## Phase 10 — Final testing + documentation

Create/update:

- README.md
- INTERVIEW_NOTES.md

Run a complete manual test of the deployed application.

Do not move past a phase if the current phase is broken.

---

# 33. REAL TESTING REQUIREMENT

Do not only inspect the code.

Actually run the application locally.

Run both:

```text
Frontend
Backend
```

and test them together.

Then test the deployed Vercel versions.

## Connection tests

Test:

- valid Gemini key
- invalid Gemini key
- empty key
- Gemini/API failure
- backend unavailable

## Chat tests

Test:

- normal question
- follow-up question
- multiple messages
- context from previous messages
- empty message
- long message
- Gemini failure
- markdown response

## Persona tests

Test:

- Student
- IT Person
- Explorer

Make sure the tones are noticeably different while still following the common AskBot rules.

## Tell Me More

Test:

- works on every AI response
- receives the correct original question and answer
- produces a deeper explanation
- handles API failure

## Session tests

Test:

- refresh page
- sessionStorage restoration
- chat history restoration
- persona restoration
- API key restoration
- closing tab clears session
- Clear Chat
- Disconnect

## Theme tests

Test:

- light mode
- dark mode
- refresh retains theme

## Deployment tests

Test:

- frontend can reach backend
- CORS works
- `VITE_API_URL` works
- backend health endpoint works
- Gemini requests work through deployed backend
- no localhost URLs are used in production

## Security test

Search the entire repository before finishing.

Confirm:

- no hardcoded Gemini API key
- no API key in logs
- no API key in URLs
- no API key in README
- no API key in `.env` committed to Git
- no unnecessary persistence of the API key

When testing the real API key, enter it manually through the AskBot UI. Never place the real key into the prompt or source code.

---

# 34. FINAL DELIVERABLE

After completing the application, provide:

1. Final project structure
2. What each important file does
3. How React communicates with FastAPI
4. How API-key validation works
5. How Gemini is called
6. How the model name is configured
7. How persona prompts work
8. How chat history works
9. Why only the latest 5 exchanges are sent
10. How Tell Me More works
11. How errors are handled
12. How the API key is protected
13. Why there is no database
14. How sessionStorage/localStorage are used
15. How CORS works
16. How the two Vercel deployments work
17. A 1-minute explanation I can give during the Aress presentation
18. 10 likely technical interview questions about this project with simple answers

The final explanations must match the actual code.

Do not just generate code. Make sure the resulting implementation is:

**clean, understandable, modular, secure, reliable, and easy to explain.**

---

# 35. FINAL RULE

After each development phase:

1. Stop.
2. Tell me what was implemented.
3. Tell me how to test it.
4. Show any important files or changes.
5. Wait for confirmation before moving to the next phase.

Do not build the entire application blindly in one step.

Start with **Phase 1 — project setup**.
