// import { fetchBooks } from "../services/book.service";
import { pool } from "../db/pool";

export const resolvers = {
  Query: {
    books: async (
      _: unknown,
      args: {
        search?: string;
        genre?: string;
      },
    ) => {
      const { search, genre } = args;

      let query = `
        SELECT * FROM books
        WHERE 1=1
      `;

      const values: string[] = [];

      // Search by title or author
      if (search) {
        values.push(`%${search}%`);

        query += `
          AND (
            title ILIKE $${values.length}
            OR author ILIKE $${values.length}
          )
        `;
      }

      // Filter by genre
      if (genre) {
        values.push(genre);

        query += `
          AND genre ILIKE $${values.length}
        `;
      }

      query += `
        ORDER BY createdat DESC
      `;

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return [];
      }

      return result.rows;
    },
    book: async (
      _: unknown,
      args: {
        id: string;
      },
    ) => {
      const result = await pool.query(
        `
      SELECT *
      FROM books
      WHERE book_id = $1
      `,
        [args.id],
      );

      return result.rows[0] || null;
    },
    cartItems: async () => {
      const result = await pool.query(`
    SELECT
      cart_items.id AS cart_item_id,
      cart_items.quantity,

      books.book_id AS book_id,
      books.title,
      books.author,
      books.genre,
      books.price,
      books.stock,
      books.image,
      books.description,
      books.publishedyear,
      books.createdat,
      books.updatedat

    FROM cart_items

    INNER JOIN books
    ON cart_items.book_id = books.book_id
  `);

      return result.rows.map((row) => ({
        id: row.cart_item_id,
        quantity: row.quantity,

        book: {
          book_id: row.book_id,
          title: row.title,
          author: row.author,
          genre: row.genre,
          price: row.price,
          stock: row.stock,
          image: row.image,
          description: row.description,
          publishedyear: row.publishedyear,
          createdat: row.createdat,
          updatedat: row.updatedat,
        },
      }));
    },
  },

  Mutation: {
    // ADD TO CART
    addToCart: async (
      _: unknown,
      args: {
        book_id: string;
        quantity: number;
      },
    ) => {
      console.log("Mutation called:", args);
      const { book_id, quantity } = args;

      // Invalid quantity
      if (quantity <= 0) {
        throw new Error("Invalid quantity");
      }

      const result = await pool.query(
        `
        SELECT * FROM books
        WHERE book_id = $1
        `,
        [book_id],
      );

      const book = result.rows[0];

      // Book not found
      if (!book) {
        throw new Error("Book not found");
      }

      // Out of stock
      if (book.stock === 0) {
        throw new Error("Out of stock");
      }

      // Quantity exceeds stock
      if (quantity > book.stock) {
        throw new Error("Not enough stock available");
      }

      // Check existing cart item
      const existingCart = await pool.query(
        `
          SELECT * FROM cart_items
          WHERE book_id = $1
          `,
        [book_id],
      );

      // Update quantity if exists
      if (existingCart.rows.length > 0) {
        const existing = existingCart.rows[0];

        const newQuantity = existing.quantity + quantity;

        if (newQuantity > book.stock) {
          throw new Error("Quantity exceeds stock");
        }

        await pool.query(
          `
          UPDATE cart_items
          SET quantity = $1
          WHERE id = $2
          `,
          [newQuantity, existing.id],
        );
      } else {
        // Insert new cart item
        await pool.query(
          `
          INSERT INTO cart_items (
            book_id,
            quantity
          )
          VALUES ($1, $2)
          `,
          [book_id, quantity],
        );
      }

      // Frontend-only cart
      return {
        success: true,
        message: "Book added to cart successfully",
      };
    },
    // UPDATE CART
    updateCart: async (
      _: unknown,
      args: {
        cartItemId: string;
        quantity: number;
      },
    ) => {
      const { cartItemId, quantity } = args;

      // Invalid quantity
      if (quantity <= 0) {
        throw new Error("Invalid quantity");
      }

      const cartResult = await pool.query(
        `
          SELECT
            cart_items.*,
            books.stock

          FROM cart_items

          INNER JOIN books
          ON cart_items.book_id = books.book_id

          WHERE cart_items.id = $1
          `,
        [cartItemId],
      );

      const cartItem = cartResult.rows[0];

      if (!cartItem) {
        throw new Error("Cart item not found");
      }

      // Out of stock
      if (cartItem.stock === 0) {
        throw new Error("Out of stock");
      }

      // Quantity exceeds stock
      if (quantity > cartItem.stock) {
        throw new Error("Quantity exceeds stock");
      }

      await pool.query(
        `
        UPDATE cart_items
        SET quantity = $1
        WHERE id = $2
        `,
        [quantity, cartItemId],
      );

      return {
        success: true,
        message: "Cart updated successfully",
      };
    },
    // DELETE CART ITEM
    deleteCartItem: async (
      _: unknown,
      args: {
        cartItemId: string;
      },
    ) => {
      const { cartItemId } = args;

      const result = await pool.query(
        `
          DELETE FROM cart_items
          WHERE id = $1
          RETURNING *
          `,
        [cartItemId],
      );

      if (result.rows.length === 0) {
        throw new Error("Cart item not found");
      }

      return {
        success: true,
        message: "Cart item removed",
      };
    },
    clearCart: async () => {
      await pool.query(`
    DELETE FROM cart_items
  `);

      return {
        success: true,
        message: "Cart cleared",
      };
    },
    checkoutCart: async () => {
      await pool.query(`
    DELETE FROM cart_items
  `);

      return {
        success: true,
        message: "Checkout successful",
      };
    },
  },
};
