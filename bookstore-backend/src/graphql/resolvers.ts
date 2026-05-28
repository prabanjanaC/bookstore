import { prisma } from "../db/prisma";

export const resolvers = {
  Query: {
    // GET ALL BOOKS
    books: async (
      _: unknown,
      args: {
        search?: string;
        genre?: string;
      },
    ) => {
      const { search, genre } = args;

      const books = await prisma.books.findMany({
        where: {
          AND: [
            search
              ? {
                  OR: [
                    {
                      title: {
                        contains: search,
                        mode: "insensitive",
                      },
                    },
                    {
                      author: {
                        contains: search,
                        mode: "insensitive",
                      },
                    },
                  ],
                }
              : {},

            genre
              ? {
                  genre: {
                    equals: genre,
                    mode: "insensitive",
                  },
                }
              : {},
          ],
        },

        orderBy: {
          createdat: "desc",
        },
      });

      return books;
    },

    // GET SINGLE BOOK
    book: async (
      _: unknown,
      args: {
        id: string;
      },
    ) => {
      return await prisma.books.findUnique({
        where: {
          book_id: args.id,
        },
      });
    },

    // GET CART ITEMS
    cartItems: async () => {
      const cartItems = await prisma.cart_items.findMany({
        include: {
          books: true,
        },
      });

      return cartItems.map((item) => ({
        id: item.id,
        quantity: item.quantity,

        book: item.books,
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
      const { book_id, quantity } = args;

      // Invalid quantity
      if (quantity <= 0) {
        throw new Error("Invalid quantity");
      }

      // Find book
      const book = await prisma.books.findUnique({
        where: {
          book_id,
        },
      });

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
      const existingCart = await prisma.cart_items.findUnique({
        where: {
          book_id,
        },
      });

      // Update existing cart
      if (existingCart) {
        const newQuantity = existingCart.quantity + quantity;

        if (newQuantity > book.stock) {
          throw new Error("Quantity exceeds stock");
        }

        await prisma.cart_items.update({
          where: {
            id: existingCart.id,
          },

          data: {
            quantity: newQuantity,
          },
        });
      } else {
        // Create new cart item
        await prisma.cart_items.create({
          data: {
            book_id,
            quantity,
          },
        });
      }

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

      if (quantity <= 0) {
        throw new Error("Invalid quantity");
      }

      const cartItem = await prisma.cart_items.findUnique({
        where: {
          id: cartItemId,
        },

        include: {
          books: true,
        },
      });

      if (!cartItem) {
        throw new Error("Cart item not found");
      }

      if (cartItem.books.stock === 0) {
        throw new Error("Out of stock");
      }

      if (quantity > cartItem.books.stock) {
        throw new Error("Quantity exceeds stock");
      }

      await prisma.cart_items.update({
        where: {
          id: cartItemId,
        },

        data: {
          quantity,
        },
      });

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
      const cartItem = await prisma.cart_items.findUnique({
        where: {
          id: args.cartItemId,
        },
      });

      if (!cartItem) {
        throw new Error("Cart item not found");
      }

      await prisma.cart_items.delete({
        where: {
          id: args.cartItemId,
        },
      });

      return {
        success: true,
        message: "Cart item removed",
      };
    },

    // CLEAR CART
    clearCart: async () => {
      await prisma.cart_items.deleteMany();

      return {
        success: true,
        message: "Cart cleared",
      };
    },

    // CHECKOUT
    checkoutCart: async () => {
      await prisma.cart_items.deleteMany();

      return {
        success: true,
        message: "Checkout successful",
      };
    },
  },
};
