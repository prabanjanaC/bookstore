import { client } from "../graphql/client";

import {
  ADD_TO_CART,
  GET_CART_ITEMS,
  DELETE_CART_ITEM,
  CLEAR_CART,
  CHECKOUT_CART,
} from "../graphql/queries";

export async function addToCart(bookId: string, qty: string) {
  const quantity = Number(qty);

  // Validation
  if (quantity <= 0) {
    console.log("Invalid quantity");

    return;
  }

  try {
    const data = await client.request(ADD_TO_CART, {
      book_id: bookId,
      quantity,
    });

    console.log(data.addToCart.message);
  } catch (error: any) {
    const message = error?.response?.errors?.[0]?.message;
    console.log(message || "Unexpected error");
  }
}

export async function showCart() {
  try {
    const data = await client.request(GET_CART_ITEMS);

    const cartItems = data.cartItems;

    if (cartItems.length === 0) {
      console.log("Cart is empty");

      return;
    }

    console.table(
      cartItems.map((item: any) => ({
        id: item.id,
        title: item.book.title,
        quantity: item.quantity,
        price: item.book.price,
        total: item.book.price * item.quantity,
      })),
    );

    const totalPrice = cartItems.reduce(
      (acc: number, item: any) => acc + item.book.price * item.quantity,
      0,
    );

    console.log("\nTotal Items:", cartItems.length);

    console.log("Total Price: ₹", totalPrice);
  } catch (error) {
    console.log("Failed to fetch cart");
  }
}

export async function removeCartItem(cartItemId: string) {
  try {
    const data = await client.request(DELETE_CART_ITEM, {
      cartItemId,
    });

    console.log(data.deleteCartItem.message);
  } catch (error: any) {
    console.log(error.response?.errors?.[0]?.message || "Failed");
  }
}

export async function clearCart() {
  try {
    const data = await client.request(CLEAR_CART);

    console.log(data.clearCart.message);
  } catch (error) {
    console.log("Failed to clear cart");
  }
}

export async function checkoutCart() {
  try {
    const data = await client.request(CHECKOUT_CART);

    console.log(data.checkoutCart.message);
  } catch (error) {
    console.log("Checkout failed");
  }
}
