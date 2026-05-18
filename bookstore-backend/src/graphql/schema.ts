export const typeDefs = `#graphql

type Book {
  book_id: ID!
  title: String!
  author: String!
  genre: String!
  price: Float!
  stock: Int!
  image: String!
  description: String
  publishedyear: Int!
  createdat: String!
  updatedat: String!
}

type CartItem {
  id: ID!
  quantity: Int!
  book: Book!
}

type CartResponse {
  success: Boolean!
  message: String!
}

type Mutation {
  addToCart(
    book_id: ID!
    quantity: Int!
  ): CartResponse!

  updateCart(
    cartItemId: ID!
    quantity: Int!
  ): CartResponse!

  deleteCartItem(
    cartItemId: ID!
  ): CartResponse!
  clearCart: CartResponse!
  checkoutCart: CartResponse!
}

type Query {
  books(
    search: String
    genre: String
  ): [Book!]!
  book(id: ID!): Book
  cartItems: [CartItem!]!
}
`;
