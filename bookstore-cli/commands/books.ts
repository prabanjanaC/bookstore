import { client } from "../graphql/client";

import { GET_BOOKS, GET_BOOK } from "../graphql/queries";

export async function listBooks() {
  try {
    const data = await client.request(GET_BOOKS);

    console.table(data.books);
  } catch (error) {
    console.log("Failed to fetch books");
  }
}

export async function getBook(id: string) {
  try {
    const data = await client.request(GET_BOOK, { id });

    console.log(data.book);
  } catch (error) {
    console.log("Book not found");
  }
}
export async function searchBooks(options: { query?: string; genre?: string }) {
  const data = await client.request(GET_BOOKS, {
    search: options.query,
    genre: options.genre,
  });
  console.table(data.books);
}
