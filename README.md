# APIVault

**Open-source API key management.** Generate, revoke, and monitor API keys across all your projects — with per-key usage logs and rate limiting built in.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[**Live Demo →**](https://apivault.spencerstiles.dev) | [**Hosted ($15/mo) →**](https://cal.com/spencerstiles)

---

## Quick Start

```bash
git clone https://github.com/SpencerStiles/apivault
cd apivault
pnpm install && pnpm prisma generate && pnpm prisma migrate dev
cp .env.example .env.local
pnpm dev
```

## Features

- **Project Organization** — Group API keys by project for clean separation
- **Secure Key Generation** — Cryptographically random keys, stored as SHA-256 hashes (full key shown only on creation)
- **Instant Revocation** — Revoke keys with a timestamped audit trail
- **Usage Monitoring** — Per-key logs with method, endpoint, status, latency, IP
- **Rate Limiting** — Configurable per-key rate limits
- **Stats Dashboard** — Project count, total keys, active keys, request volume

## Use Case

Ideal for teams building internal APIs or platforms where you need to issue and manage API credentials per customer or service.

## Tech Stack

Next.js 14 · TypeScript · NextAuth · Prisma · SQLite / PostgreSQL · Tailwind CSS

## Hosted Version

Managed version with team accounts, PostgreSQL, and SSO. **$15/mo.** [Sign up →](https://cal.com/spencerstiles)

## License

MIT
