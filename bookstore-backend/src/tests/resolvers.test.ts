import { describe, expect, test, mock, beforeEach } from "bun:test";
import { resolvers } from "../graphql/resolvers";
import { pool } from "../db/pool";

mock.module("../db/pool", () => ({
  pool: {
    query: mock(),
  },
}));

describe("Query Resolvers", () => {
  beforeEach(() => {
    (pool.query as any).mockReset();
  });

  test("should return all books", async () => {
    const mockBooks = [
      {
        book_id: "1",
        title: "Rich Dad Poor Dad",
      },
    ];
    (pool.query as any).mockResolvedValue({
      rows: mockBooks,
    });
    const result = await resolvers.Query.books({}, {});
    expect(result).toEqual(mockBooks);
  });
});
