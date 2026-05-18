import { gql } from "@apollo/client";

// GET CART ITEMS
export const GET_CART_ITEMS = gql`
  query GetCartItems {
    cartItems {
      id
      quantity

      book {
        book_id
        title
        author
        genre
        price
        stock
        image
      }
    }
  }
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($book_id: ID!, $quantity: Int!) {
    addToCart(book_id: $book_id, quantity: $quantity) {
      success
      message
    }
  }
`;

// UPDATE CART
export const UPDATE_CART = gql`
  mutation UpdateCart($cartItemId: ID!, $quantity: Int!) {
    updateCart(cartItemId: $cartItemId, quantity: $quantity) {
      success
      message
    }
  }
`;

// DELETE CART ITEM
export const DELETE_CART_ITEM = gql`
  mutation DeleteCartItem($cartItemId: ID!) {
    deleteCartItem(cartItemId: $cartItemId) {
      success
      message
    }
  }
`;

export const GET_BOOKS = gql`
  query Books($search: String, $genre: String) {
    books(search: $search, genre: $genre) {
      book_id
      title
      author
      genre
      price
      description
      image
    }
  }
`;
