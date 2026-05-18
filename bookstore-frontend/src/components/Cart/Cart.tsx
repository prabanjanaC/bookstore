import {
  Box,
  Button,
  Divider,
  Drawer,
  Typography,
  CircularProgress,
} from "@mui/material";

import { useMutation, useQuery } from "@apollo/client/react";

import {
  GET_CART_ITEMS,
  UPDATE_CART,
  DELETE_CART_ITEM,
} from "../../graphql/mutation";
import { useEffect } from "react";

interface CartProps {
  cartOpen: boolean;
  setCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTotalItems: React.Dispatch<React.SetStateAction<number>>;
}

const Cart = ({ cartOpen, setCartOpen, setTotalItems }: CartProps) => {
  const { data, loading, error } = useQuery(GET_CART_ITEMS);

  const [updateCart] = useMutation(UPDATE_CART, {
    refetchQueries: [
      {
        query: GET_CART_ITEMS,
      },
    ],
    awaitRefetchQueries: true,
  });

  const [deleteCartItem] = useMutation(DELETE_CART_ITEM, {
    refetchQueries: [
      {
        query: GET_CART_ITEMS,
      },
    ],
    awaitRefetchQueries: true,
  });

  const cartItems = data?.cartItems || [];

  const totalCartItems = cartItems.length;

  useEffect(() => {
    setTotalItems(totalItems);
  }, [totalCartItems, setTotalItems]);

  // Total items
  const totalItems = cartItems.reduce(
    (acc: number, item: any) => acc + item.quantity,
    0,
  );

  // Total price
  const totalPrice = cartItems.reduce(
    (acc: number, item: any) => acc + item.book.price * item.quantity,
    0,
  );

  // Increase quantity
  const handleIncrease = async (item: any) => {
    try {
      await updateCart({
        variables: {
          cartItemId: item.id,
          quantity: item.quantity + 1,
        },
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  // Decrease quantity
  const handleDecrease = async (item: any) => {
    try {
      // Remove item if quantity becomes 0
      if (item.quantity === 1) {
        await deleteCartItem({
          variables: {
            cartItemId: item.id,
          },
        });

        return;
      }

      await updateCart({
        variables: {
          cartItemId: item.id,
          quantity: item.quantity - 1,
        },
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
      <Box
        sx={{
          width: 350,
          p: 3,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Cart Summary
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 4,
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {error && <Typography color="error">{error.message}</Typography>}

        {!loading && cartItems.length === 0 && (
          <Typography>Your cart is empty</Typography>
        )}

        {!loading && cartItems.length > 0 && (
          <>
            {cartItems.map((item: any) => (
              <Box
                key={item.id}
                sx={{
                  mb: 2,
                }}
              >
                <Typography fontWeight="bold">{item.book.title}</Typography>

                <Typography>Quantity: {item.quantity}</Typography>

                <Typography>
                  ₹ {item.book.price} × {item.quantity}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    mt: 1,
                  }}
                >
                  <Button
                    size="small"
                    variant="contained"
                    disabled={item.quantity >= item.book.stock}
                    onClick={() => handleIncrease(item)}
                  >
                    +
                  </Button>

                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => handleDecrease(item)}
                  >
                    -
                  </Button>
                </Box>

                <Typography
                  color={
                    item.book.stock === item.quantity
                      ? "error"
                      : "text.secondary"
                  }
                >
                  Stock Left: {item.book.stock - item.quantity}
                </Typography>

                <Divider sx={{ mt: 2 }} />
              </Box>
            ))}

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6">Total Items: {totalItems}</Typography>

              <Typography variant="h6">Total Price: ₹ {totalPrice}</Typography>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default Cart;
