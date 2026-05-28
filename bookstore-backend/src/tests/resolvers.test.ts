import { Prisma } from "@prisma/client";
import { describe, expect, test, mock, beforeEach } from "bun:test";
import { resolvers } from "../graphql/resolvers";
import { prisma } from "../db/prisma";

mock.module("../db/prisma", () => ({
  prisma: {
    books: {
      findMany: mock(),
    },
  },
}));

describe("Query Resolvers", () => {
  beforeEach(() => {
    (prisma.books.findMany as any).mockReset();
  });

  test("should return all books", async () => {
    const mockBooks = [
      {
        book_id: "1",
        title: "Rich Dad Poor Dad",
        author: "Robert Kiyosaki",
        genre: "Finance",
        price: new Prisma.Decimal(499),

        stock: 10,
        image: null,
        description: null,
        publishedyear: 1997,
        createdat: new Date(),
        updatedat: new Date(),
      },
    ];

    (prisma.books.findMany as any).mockResolvedValue(mockBooks);

    const result = await resolvers.Query.books({}, {} as any);

    expect(result).toEqual(mockBooks);
  });
});
