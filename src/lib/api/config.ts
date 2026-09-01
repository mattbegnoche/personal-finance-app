/**
 * Base URL of the mock API. `pnpm server` starts json-server on this port from
 * `db.json`; override with `API_BASE_URL` to point at a real backend.
 */
export const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:8000";
