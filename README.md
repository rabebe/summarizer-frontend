# Summarizer Frontend

The **Summarizer Frontend** is a Next.js/React application that allows users to submit text and receive AI-generated summaries. It integrates with **Summarizer/RefineBot Backend API** and includes user **email verification** to ensure secure access.

---

## Overview

Users submit long-form text (articles, blog posts, reports) and observe the summarization process in real time as the backend refines drafts, evaluates them with an LLM-as-a-Judge, and emits a final approved summary.

The application handles authentication, email verification, loading states, error handling, and incremental rendering of streamed responses from the backend.

---

## Key Features

- Text submission for AI-powered summarization
- Real-time rendering of streamed summary updates (NDJSON)
- Integration with agentic backend summarization pipeline
- Email verification flow for authenticated users
- Clear loading, error, and success states
- Responsive UI for desktop and mobile
- Secure communication with backend API via HTTP-only JWT cookies

---

## Tech Stack

- **Framework:** Next.js (React)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Data Fetching:** Fetch API
- **Auth Handling:** Cookie-based JWT (via backend)
- **Deployment:** Vercel

---

## System Architecture

```mermaid
flowchart LR
    U[User Browser]
    FE[Next.js Frontend]
    API[Summarizer Backend API]
    R[(Redis)]
    DB[(PostgreSQL)]

    U --> FE
    FE -->|HTTP + NDJSON| API
    API --> R
    API --> DB

sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant API as Backend API

    U->>FE: Submit text
    FE->>API: POST /api/summarize-stream
    API-->>FE: refined_summary events
    API-->>FE: judge_decision events
    API-->>FE: final_summary event
    FE-->>U: Incremental UI updates
```

---

## Backend Integration
This frontend integrates with the Summarizer Backend, which is responsible for:
- Agentic summarization using LangGraph
- LLM-based evaluation and refinement
- Streaming responses via NDJSON
- Authentication, quotas, and caching

### Backend Repository
https://github.com/rabebe/chatbot

## Project Structure
```text
src/
├── app/
│   ├── page.tsx           # Main summarization UI
│   ├── verify-email/      # Email verification page
│   └── layout.tsx         # App layout
├── components/
│   ├── TextInput.tsx      # Text submission form
│   ├── SummaryStream.tsx # Streaming summary renderer
│   └── LoadingState.tsx
├── lib/
│   └── api.ts             # Backend API helpers
├── styles/
│   └── globals.css
```

---

## Setup & Local Development
Prerequisites
- Node.js 18+
- Running instance of the Summarizer Backend API
* * * * *

### Installation
```
git clone https://github.com/rabebe/summarizer-frontend.git
cd summarizer-frontend
npm install
```

### Environment variables
Create a `.env.local` file
```
NEXT_PUBLIC_API_URL=http://localhost:5002
```
---

## Run Locally
```
npm run dev
```

App runs at:
```
http://localhost:3000
```

---

## Email Verification Flow
1. User signs up or submits their email
2. Backend sends a verification email with a token
3. Email links to /verify-email?token=<token>
4. Frontend extracts the token and calls the backend verification endpoint
5. Success or failure feedback is displayed to the user

---

## Available Scripts
| Script | Description |
| --- | --- |
| `npm run dev` | Starts the development server |
| `npm run build` | Builds the production version |
| `npm run start` | Runs the production build locally |
| `npm run lint` | Runs ESLint to check code quality |
| `npm run format` | Runs Prettier to format code |

---

## Deployment
The application is deployed on Vercel.

To deploy:
1. Push the repository to GitHub
2. Import into Vercel
3. Set environment variables
4. Deploy

---

## Design Decisions
- Used streaming rendering to mirror backend agent execution in real time
- Relied on backend-managed authentication to avoid duplicating auth logic
- Kept frontend stateless with respect to summarization logic
- Used Fetch API directly for transparency and control over streaming responses

---

## Related Repositories
- Summarizer Backend: https://github.com/rabebe/chatbot