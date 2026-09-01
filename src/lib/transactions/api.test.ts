import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { ApiError } from "@/lib/api/fetch-json";
import { fetchTransactions } from "./api";
import { DEFAULT_TRANSACTION_QUERY, type TransactionQuery } from "./query";

const TRANSACTION = {
  id: "y8bNIKOJaFo",
  avatar: "./assets/images/avatars/savory-bites-bistro.jpg",
  name: "Savory Bites Bistro",
  category: "Dining Out",
  date: "2024-08-19T20:23:11Z",
  amount: -55.5,
  recurring: false,
};

function mockResponse(
  body: unknown,
  init: { ok?: boolean; status?: number } = {},
) {
  return {
    ok: init.ok ?? true,
    status: init.status ?? 200,
    json: async () => body,
  } as Response;
}

/** The URL the last `fetch` call was made with. */
function requestedUrl(fetchMock: ReturnType<typeof vi.fn>): URL {
  return new URL(fetchMock.mock.calls[0][0] as string);
}

function query(overrides: Partial<TransactionQuery> = {}): TransactionQuery {
  return { ...DEFAULT_TRANSACTION_QUERY, ...overrides };
}

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn(async () =>
    mockResponse({
      first: 1,
      prev: null,
      next: 2,
      last: 5,
      pages: 5,
      items: 49,
      data: [TRANSACTION],
    }),
  );
  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("fetchTransactions", () => {
  test("requests the transactions collection with paging params", async () => {
    await fetchTransactions(query());
    const url = requestedUrl(fetchMock);

    expect(url.pathname).toBe("/transactions");
    expect(url.searchParams.get("_page")).toBe("1");
    expect(url.searchParams.get("_per_page")).toBe("10");
  });

  test("never caches the response, so pages using it stay dynamic", async () => {
    await fetchTransactions(query());

    expect(fetchMock.mock.calls[0][1]).toMatchObject({ cache: "no-store" });
  });

  test("returns the parsed page with avatars rooted for the browser", async () => {
    const page = await fetchTransactions(query());

    expect(page).toEqual({
      transactions: [
        {
          ...TRANSACTION,
          avatar: "/assets/images/avatars/savory-bites-bistro.jpg",
        },
      ],
      page: 1,
      pageCount: 5,
      totalItems: 49,
    });
  });

  test.each([
    ["latest", "-date"],
    ["oldest", "date"],
    ["a-to-z", "name"],
    ["z-to-a", "-name"],
    ["highest", "-amount"],
    ["lowest", "amount"],
  ] as const)("maps the %s sort option to _sort=%s", async (sort, apiSort) => {
    await fetchTransactions(query({ sort }));

    expect(requestedUrl(fetchMock).searchParams.get("_sort")).toBe(apiSort);
  });

  test("asks the API for a case-insensitive name match when searching", async () => {
    await fetchTransactions(query({ search: "emma" }));

    expect(requestedUrl(fetchMock).searchParams.get("name:contains")).toBe(
      "emma",
    );
  });

  test("omits the search param when the term is empty", async () => {
    await fetchTransactions(query());

    expect(requestedUrl(fetchMock).searchParams.has("name:contains")).toBe(
      false,
    );
  });

  test("filters by category when one is selected", async () => {
    await fetchTransactions(query({ category: "Dining Out" }));

    expect(requestedUrl(fetchMock).searchParams.get("category")).toBe(
      "Dining Out",
    );
  });

  test("omits the category param when showing all transactions", async () => {
    await fetchTransactions(query());

    expect(requestedUrl(fetchMock).searchParams.has("category")).toBe(false);
  });

  test("asks for a custom page size when one is given", async () => {
    await fetchTransactions(query(), 5);

    expect(requestedUrl(fetchMock).searchParams.get("_per_page")).toBe("5");
  });

  test("requests the page named in the query", async () => {
    await fetchTransactions(query({ page: 3 }));

    expect(requestedUrl(fetchMock).searchParams.get("_page")).toBe("3");
  });

  test("raises a user-facing error when the API is unreachable", async () => {
    fetchMock.mockRejectedValue(new TypeError("fetch failed"));

    await expect(fetchTransactions(query())).rejects.toThrow(ApiError);
    await expect(fetchTransactions(query())).rejects.toThrow(/pnpm server/);
  });

  test("raises a user-facing error when the API returns a failure status", async () => {
    fetchMock.mockResolvedValue(mockResponse(null, { ok: false, status: 500 }));

    await expect(fetchTransactions(query())).rejects.toThrow(/500/);
  });

  test("raises a user-facing error when the body is not JSON", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => {
        throw new SyntaxError("Unexpected token");
      },
    } as unknown as Response);

    await expect(fetchTransactions(query())).rejects.toThrow(/unreadable/);
  });

  test("rejects a payload that is not a paginated envelope", async () => {
    fetchMock.mockResolvedValue(mockResponse([TRANSACTION]));

    await expect(fetchTransactions(query())).rejects.toThrow(/paginated/i);
  });
});
