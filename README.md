# Personal Finance App

Track budgets, pots, recurring bills, and transactions.

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

There is no backend and nothing to configure. Every page builds to static
output, so the app can be deployed anywhere that serves files.

## How the data works

The sample data in [`db.json`](db.json) is bundled at build time and is what a
visitor sees on their first visit. Anything they change — adding a budget,
moving money into a pot — is kept in their own browser via `localStorage` and
survives a refresh. Nothing leaves the device, and no two visitors share state.
"Reset to sample data" at the foot of every page restores the original.

Two things are derived rather than stored, because `db.json` does not hold them:

- **Budget spending** is the sum of the month's debits in each category. The
  file stores only the limit.
- **Recurring bills** are the newest `recurring` debit per merchant. Whether one
  is paid, upcoming or due soon follows from whether that charge landed in the
  current month.

Both need a notion of "today". `src/lib/reference-date.ts` uses the newest
transaction date, which tracks the real date with live data and keeps the views
meaningful with the bundled data, which ends in August 2024.

## Testing

```bash
pnpm test          # single run
pnpm test:watch    # watch mode
pnpm test:coverage # with a coverage report
```

Vitest covers the pure logic: formatting, pagination, query parsing, filtering,
budget and bill derivation, form validation, the immutable mutations, and the
storage round-trip.

## Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Zod for validating the seed data and anything read back from storage
- Vitest for unit tests

## Design

Design system (colors, typography, spacing) lives in the
[Figma style guide](https://www.figma.com/design/BNp9tEaqR9LapLfZN2MKxg/personal-finance-app?node-id=259-3803).
