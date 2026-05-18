import { gql } from "graphql-request";

export const GET_BOOKS = gql`
  query Books($search: String, $genre: String) {
    books(search: $search, genre: $genre) {
      book_id
      title
      author
      genre
      price
      stock
    }
  }
`;

export const GET_BOOK = gql`
  query Book($id: ID!) {
    book(id: $id) {
      book_id
      title
      author
      genre
      price
      stock
      description
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

export const GET_CART_ITEMS = gql`
  query {
    cartItems {
      id
      quantity
      book {
        book_id
        title
        price
      }
    }
  }
`;

export const DELETE_CART_ITEM = gql`
  mutation DeletecartItem($cartItemId: ID!) {
    deleteCartItem(cartItemId: $cartItemId) {
      success
      message
    }
  }
`;

export const CLEAR_CART = gql`
  mutation {
    clearCart {
      success
      message
    }
  }
`;

export const CHECKOUT_CART = gql`
  mutation {
    checkoutCart {
      success
      message
    }
  }
`;
