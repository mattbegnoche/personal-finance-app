# Personal Finance App

Track budgets, pots, recurring bills, and transactions.

## Getting Started

The app reads its data from a mock REST API, so both processes need to run:

```bash
pnpm install
pnpm server   # json-server on http://localhost:8000, backed by db.json
pnpm dev      # Next.js on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000).

Set `API_BASE_URL` to point the app at a different backend; it defaults to
`http://localhost:8000`.

## Testing

```bash
pnpm test         # single run
pnpm test:watch   # watch mode
```

Vitest covers the pure logic: formatting, pagination, query parsing, and the
transactions API client (with `fetch` stubbed).

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Zod for validating API responses
- json-server as the mock API
- Vitest for unit tests

## Design

Design system (colors, typography, spacing) lives in the
[Figma style guide](https://www.figma.com/design/BNp9tEaqR9LapLfZN2MKxg/personal-finance-app?node-id=259-3803).
