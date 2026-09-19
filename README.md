# TruthLens

> **EVIDENCE BEFORE BELIEF.**
>
> TruthLens is an open-source, evidence-first verification workspace designed to help people investigate claims before they become beliefs, posts, forwarded messages, or decisions.

[![Live Demo](https://img.shields.io/badge/Live-Demo-0b8f67?style=flat-square)](https://truthlenses.netlify.app/)
[![Open Source](https://img.shields.io/badge/Open%20Source-MIT-111827?style=flat-square)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Gemini](https://img.shields.io/badge/AI-Gemini-4285f4?style=flat-square)](https://ai.google.dev/)
[![MongoDB](https://img.shields.io/badge/Data-MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

**TruthLens is not a "truth button." It is an evidence layer between information and belief.**

[Live Demo](https://truthlenses.netlify.app/) · [GitHub](https://github.com/shivamkumar71/TruLance) · [Portfolio](https://shivamkumar71.netlify.app)

---

## Why TruthLens?

The internet makes information easy to access and difficult to evaluate.

A search engine can help you find information. A general-purpose AI assistant can help explain it. TruthLens focuses on a different workflow:

**Claim → Research → Evidence → Compare → Explain**

Instead of returning an unexplained yes/no answer, TruthLens is designed to expose the evidence behind a verification result — including supporting evidence, contradicting evidence, context, source relationships, confidence, and direct source links.

The goal is simple:

> **Make verification inspectable, not just answerable.**

---

## What TruthLens does

TruthLens currently supports:

- **Text verification** — submit a claim directly.
- **Image & screenshot verification** — analyze submitted visual content.
- **PDF verification** — extract and investigate document content.
- **DOCX verification** — process supported Word documents.
- **Claim extraction & context analysis** — identify the factual assertion being investigated.
- **Live public-source discovery** — search for relevant evidence.
- **Evidence comparison** — organize evidence as `SUPPORTS`, `CONTRADICTS`, `CONTEXT`, or `NEUTRAL`.
- **Source transparency** — show publisher, date, domain, relationship, source type, and an actionable source link.
- **Verdict + confidence** — return a structured verification result rather than a generic chat response.
- **Temporal context** — account for dates and time-sensitive claims.
- **Evidence strength** — surface how strong the available evidence is.
- **Verification history** — keep recent checks available locally in the browser.
- **Feedback collection** — store product feedback in MongoDB.
- **Verification persistence** — store verification records and result metadata in MongoDB.
- **Light/dark UI** — switch between themes while keeping the verification workspace readable.

### Verdict vocabulary

| Verdict | Meaning |
| --- | --- |
| `TRUE` | The available evidence clearly supports the claim. |
| `LIKELY TRUE` | The available evidence strongly supports the claim, while some details may remain unresolved. |
| `MIXED` | The claim contains a mixture of supported, unsupported, or context-dependent information. |
| `LIKELY FALSE` | The available evidence strongly conflicts with the claim. |
| `FALSE` | Reliable evidence directly refutes the claim. |
| `UNVERIFIED` | Available evidence is insufficient or inconclusive. |

These labels describe the **available evidence**, not an absolute guarantee of reality.

---

## Product workflow

```mermaid
flowchart LR
    A["Text / Image / PDF / DOCX"] --> B["Claim & Context"]
    B --> C["Research Queries"]
    C --> D["Public Source Discovery"]
    D --> E["Evidence Comparison"]
    E --> F["Verdict + Confidence"]
    F --> G["Evidence Trail + Sources"]
    G --> H["MongoDB Persistence"]
```

### Evidence model

TruthLens does not treat a single webpage as automatically true.

The verification pipeline is designed to:

1. Identify the claim and relevant context.
2. Form research queries.
3. Discover relevant public sources.
4. Compare evidence against the claim.
5. Separate supporting, contradicting, contextual, and neutral material.
6. Produce a structured verdict with uncertainty where appropriate.
7. Preserve source provenance so the user can inspect the evidence directly.

A result can therefore be **MIXED** or **UNVERIFIED** when the available evidence does not justify a definitive conclusion.

---

## Architecture

```text
┌───────────────────────────────┐
│        React + Vite UI        │
│ Verification workspace        │
│ Result / Evidence / Feedback  │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│     Express / Netlify API     │
│  /api/verify  /api/feedback   │
│  /api/health                  │
└───────┬───────────────┬───────┘
        │               │
        ▼               ▼
┌───────────────┐   ┌────────────────┐
│ Google Gemini │   │ MongoDB Atlas  │
│ AI analysis   │   │ truthlens DB   │
└───────────────┘   │ feedbacks      │
                    │ queries        │
                    └────────────────┘
```

### Core stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, TypeScript, Vite |
| UI | Tailwind CSS, Motion, Lucide React |
| Backend | Node.js, Express |
| AI | Google Gemini API |
| Documents | Mammoth |
| Database | MongoDB Atlas |
| Deployment | Netlify Functions |
| Validation | TypeScript |
| Local persistence | Browser localStorage |

The AI model is an implementation component; the product's focus is the **verification workflow, evidence trail, provenance, and user experience**.

---

## Data model

TruthLens uses the same MongoDB database with separate collections:

```text
truthlens
├── feedbacks
└── queries
```

### `feedbacks`

Stores submitted product feedback:

```json
{
  "name": "Example User",
  "email": "user@example.com",
  "message": "The evidence trail was useful.",
  "createdAt": "2026-09-20T00:00:00.000Z"
}
```

### `queries`

Stores verification metadata and the structured verification result:

```json
{
  "query": "Claim submitted for verification",
  "inputType": "text",
  "claim": "Example claim",
  "verdict": "UNVERIFIED",
  "confidence": 62,
  "evidenceStrength": "Moderate",
  "sourcesCount": 4,
  "createdAt": "2026-09-20T00:00:00.000Z"
}
```

The actual stored verification record can contain the full structured result returned by the verification pipeline.

---

## Trust, safety & privacy

TruthLens is intentionally designed around **evidence and uncertainty rather than certainty theater**.

- Search failure is not treated as proof that a claim is false.
- A source is not automatically treated as correct simply because it was discovered online.
- Supporting and contradicting evidence can be surfaced together.
- Confidence is not the same thing as a mathematical probability that a claim is true.
- AI-origin detection is probabilistic and should not be treated as authorship proof.
- Users should inspect cited sources before making high-impact decisions.
- Uploaded content is processed for the verification request and is not intentionally persisted by the application as an upload archive.
- Verification records and feedback are persisted in MongoDB as described above.
- The Gemini API key and MongoDB credentials must remain server-side.
- Never commit `.env`, credentials, API keys, or private user data.

**TruthLens does not guarantee truth.** It provides an evidence-based verification workflow intended to help users make better-informed judgments.

---

## Quick start

### Requirements

- Node.js 18+
- npm
- Google Gemini API key
- MongoDB Atlas account/database user if persistence is enabled

### Clone & install

```bash
git clone https://github.com/shivamkumar71/TruLance.git
cd TruLance
npm install
```

### Environment variables

Create a local `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DB=truthlens
```

**Never commit this file.**

For local development, keep MongoDB credentials in `.env`. For Netlify, add the same variables through the site's protected environment-variable settings.

### Run locally

```bash
npm run dev
```

The local development server is configured to run on port `3000`.

### Production build

```bash
npm run lint
npm run build
npm start
```

---

## API

### `GET /api/health`

Lightweight service check.

### `POST /api/verify`

Accepts at least one of `text`, `userContext`, or `fileBase64`.

Example:

```json
{
  "text": "The claim to verify",
  "userContext": "India, 2026"
}
```

Supported upload metadata includes `fileBase64`, `mimeType`, and `fileName`.

### `POST /api/feedback`

Accepts:

```json
{
  "name": "Example User",
  "email": "user@example.com",
  "message": "Your feedback here"
}
```

Successful feedback is persisted to the `feedbacks` collection.

---

## Deployment

TruthLens is configured for Netlify.

### Netlify configuration

The repository includes:

- `netlify.toml`
- `netlify/functions/api.ts`
- Express API integration
- Vite production build
- server-side environment variables

Recommended production environment variables:

| Variable | Purpose |
| --- | --- |
| `GEMINI_API_KEY` | Gemini API authentication |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `MONGODB_DB` | MongoDB database name, normally `truthlens` |

Never place secrets in frontend code or `VITE_*` variables.

### Deployment checklist

Before deploying:

- [ ] Environment variables are configured in Netlify.
- [ ] MongoDB Atlas network access allows the deployment runtime.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] `/api/health` responds successfully.
- [ ] Text verification works.
- [ ] Image/PDF/DOCX verification works.
- [ ] Feedback is persisted to MongoDB.
- [ ] Verification records are persisted to MongoDB.
- [ ] No secrets are committed to Git.

---

## Project structure

```text
.
├── assets/                     # Static assets
├── netlify/
│   └── functions/api.ts        # Netlify serverless entry
├── src/
│   ├── components/             # UI and verification views
│   ├── context/                # Shared React context
│   ├── App.tsx                 # App state and navigation
│   ├── main.tsx                # React entry point
│   ├── types.ts                # Verification contracts
│   └── index.css               # Global/theme styles
├── server.ts                   # Express API + verification orchestration
├── local-server.ts             # Local development host
├── netlify.toml                # Netlify configuration
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite configuration
```

---

## Development

Available scripts:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start local development server |
| `npm run lint` | TypeScript type-check |
| `npm run build` | Build frontend and production server |
| `npm start` | Run compiled production server |
| `npm run preview` | Preview the Vite build |

### Contribution workflow

TruthLens is currently **open source** and welcomes focused contributions.

1. Fork the repository.
2. Create a feature branch.
3. Make a focused change.
4. Run:

```bash
npm install
npm run lint
npm run build
```

5. Open a pull request with:
   - what changed,
   - why it changed,
   - how it was tested,
   - any privacy/security/deployment impact.

For verification-related changes, explain how the change affects evidence quality, source handling, uncertainty, or user trust.

---

## Current limitations

TruthLens is an evolving open-source project. Important limitations include:

- Verification quality depends on the availability, freshness, relevance, and quality of discovered sources.
- Source quantity does not automatically mean source independence.
- AI reasoning can make mistakes and should be reviewed against the cited evidence.
- AI-origin detection is probabilistic.
- Browser history is local to the user's browser/device.
- The application currently has no built-in user authentication.
- There is no comprehensive automated end-to-end test suite yet.
- Rate limiting and abuse prevention require further hardening.
- MongoDB persistence is currently focused on verification records and feedback rather than a complete user-account system.

These limitations are part of the project's development roadmap, not hidden assumptions.

---

## Roadmap

### Current
- [x] Text verification
- [x] Image/screenshot verification
- [x] PDF/DOCX verification
- [x] Public-source discovery
- [x] Evidence relationships
- [x] Structured verdicts and confidence
- [x] Source transparency
- [x] Verification history
- [x] MongoDB feedback persistence
- [x] MongoDB verification persistence
- [x] Netlify deployment

### Next
- [ ] URL verification
- [ ] Video verification
- [ ] Voice input
- [ ] Richer provenance and source-independence analysis
- [ ] Multilingual verification
- [ ] Stronger evaluation benchmarks
- [ ] Verification API for developers
- [ ] More comprehensive automated testing
- [ ] Rate limiting and abuse protection

### Long-term direction

TruthLens is exploring a broader idea:

> **Evidence & Verification Infrastructure**

The long-term goal is not simply to answer whether a claim is true. It is to make the **evidence behind information traceable, inspectable, and reusable** across products and workflows.

---

## Open-source principles

TruthLens is being kept open source because verification systems benefit from scrutiny.

We want contributors to be able to inspect:

- how verification requests are processed,
- how evidence is represented,
- how sources are surfaced,
- where uncertainty is exposed,
- how data is persisted,
- and where the system still has limitations.

If you find a reliability, privacy, security, or evidence-quality issue, please open an issue with enough detail to reproduce or investigate it. For security-sensitive disclosures, avoid posting credentials or private user data publicly.

---

## Author

### Shivam Kumar

Founder / Builder of TruthLens

- Portfolio: https://shivamkumar71.netlify.app
- GitHub: https://github.com/shivamkumar71

TruthLens is an evolving project. The product, architecture, verification methodology, and roadmap will continue to change as the system is tested against real-world claims and feedback from users and contributors.

---

## License

TruthLens is released under the **MIT License**. See [LICENSE](LICENSE) for details.
