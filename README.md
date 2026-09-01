# Personal Finance App

A personal finance dashboard — budgets, savings pots, recurring bills, and a
searchable transaction ledger. Built with Next.js 16, React 19, TypeScript and
Tailwind CSS v4, from a [Frontend Mentor](https://www.frontendmentor.io/) design.

```bash
pnpm install && pnpm dev
```

That's the whole setup. No backend, no database, no API keys.

## What it does

- **Overview** — balance, spending against budgets, savings progress and upcoming bills at a glance
- **Transactions** — search, filter by category, six sort orders, paginated
- **Budgets** — set a monthly limit per category and watch spending against it
- **Pots** — save toward a target, moving money in and out of your balance
- **Recurring bills** — what's paid, what's coming, and what's due soon

Every layout is built for mobile, tablet and desktop.

## Things worth a look

**The interesting data isn't stored — it's derived.** The sample data holds a
budget's _limit_ but not what's been spent against it, and has no bills table at
all. Spending is computed from the month's transactions per category; a bill is
the newest recurring charge from a merchant, with paid/upcoming/due-soon falling
out of when that charge landed.

**No backend, by design.** Sample data ships with the bundle and each visitor's
changes live in their own browser via `localStorage`, read through React's
`useSyncExternalStore`. Every route builds to static output, so it deploys
anywhere that serves files.

**Built to be used, not just looked at.** Filters live in the URL, so the back
button works and a filtered view is a shareable link. Modals are native
`<dialog>` elements, so focus trapping and `Esc` behave the way people expect.
The transaction ledger is a real table on desktop and a card list on mobile,
rather than one pretending to be the other.

**187 tests** covering the parts where correctness actually matters — the
derivation logic, filtering, form validation, and the immutable state updates.

```bash
pnpm test
```

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Zod · Vitest
