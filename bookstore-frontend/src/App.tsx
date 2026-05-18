import { useState } from "react";
import { Typography, Button, Box, Drawer, Divider } from "@mui/material";

import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import Header from "./components/Header/Header";
import Books from "./components/Books/Books";
import { GET_BOOKS, GET_CART_ITEMS } from "./graphql/mutation";
import Cart from "./components/Cart/Cart";

export default function App() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");

  const [cartOpen, setCartOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(0);

  // Graphql query: fetch book, search, filter

  const { data, error } = useQuery(GET_BOOKS, {
    variables: {
      search,
      genre,
    },
  });

  // error handling
  if (error) {
    return <Typography sx={{ p: 3 }}>Error loading books</Typography>;
  }

  return (
    <>
      <Box
        sx={{
          width: "100%",
          overflowX: "hidden",
        }}
      >
        {/* navbar */}
        <Header
          search={search}
          setSearch={setSearch}
          genre={genre}
          setGenre={setGenre}
          totalItems={totalItems}
          setCartOpen={setCartOpen}
        />

        <Books data={data} />

        <Cart
          cartOpen={cartOpen}
          setCartOpen={setCartOpen}
          setTotalItems={setTotalItems}
        />
      </Box>
    </>
  );
}
