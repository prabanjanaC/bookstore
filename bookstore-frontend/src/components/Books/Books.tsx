import { useMutation } from "@apollo/client/react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  CardActions,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useState } from "react";
import { ADD_TO_CART, GET_CART_ITEMS } from "../../graphql/mutation";

const Books = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);

  const [addToCart] = useMutation(ADD_TO_CART, {
    refetchQueries: [
      {
        query: GET_CART_ITEMS,
      },
    ],
  });

  // Add to cart
  const handleAddToCart = async (book_id: string) => {
    try {
      await addToCart({
        variables: {
          book_id,
          quantity: 1,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpen = (book: any) => {
    setSelectedBook(book);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBook(null);
  };

  return (
    <>
      <Grid
        container
        spacing={3}
        sx={{
          padding: 3,
          margin: 3,
        }}
      >
        {data?.books?.length === 0 ? (
          <Box
            sx={{
              width: "100%",
              textAlign: "center",
              mt: 5,
            }}
          >
            <Typography variant="h5">No books found</Typography>

            <Typography color="text.secondary">
              Try searching with another keyword
            </Typography>
          </Box>
        ) : (
          data?.books?.map((book: any) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={book.id}>
              <Card
                onClick={() => handleOpen(book)}
                sx={{
                  height: "100%",
                  boxShadow: 4,
                  borderRadius: 3,
                  transition: "0.3s",
                  "&:hover": {
                    boxShadow: 8,
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="250"
                  sx={{
                    objectFit: "contain",
                    padding: 2,
                  }}
                  image={
                    book.image ||
                    "https://via.placeholder.com/300x250?text=Book+Image"
                  }
                  alt={book.title}
                />

                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {book.title}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Author: {book.author}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Genre: {book.genre}
                  </Typography>

                  <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                    ₹ {book.price}
                  </Typography>

                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {book.description}
                  </Typography>
                </CardContent>

                <CardActions>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(book.book_id);
                    }}
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{selectedBook?.title}</DialogTitle>

        <DialogContent>
          <Box
            sx={{
              display: "flex",
              gap: 4,
              flexDirection: {
                xs: "column",
                md: "row",
              },
            }}
          >
            {/* Image */}

            <Box
              component="img"
              src={
                selectedBook?.image ||
                "https://via.placeholder.com/300x250?text=Book+Image"
              }
              alt={selectedBook?.title}
              sx={{
                width: 300,
                objectFit: "contain",
              }}
            />

            {/* Details */}

            <Box>
              <Typography variant="h5" gutterBottom>
                {selectedBook?.title}
              </Typography>

              <Typography sx={{ mb: 1 }}>
                <strong>Author:</strong> {selectedBook?.author}
              </Typography>

              <Typography sx={{ mb: 1 }}>
                <strong>Genre:</strong> {selectedBook?.genre}
              </Typography>

              <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                ₹ {selectedBook?.price}
              </Typography>

              <Typography>{selectedBook?.description}</Typography>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Close</Button>

          <Button
            variant="contained"
            onClick={() => {
              handleAddToCart(selectedBook.book_id);
            }}
          >
            Add to Cart
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Books;
