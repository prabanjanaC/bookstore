import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  TextField,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
  Badge,
  IconButton,
} from "@mui/material";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

const Header = ({
  search,
  setSearch,
  genre,
  setGenre,
  totalItems,
  setCartOpen,
}) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Book Store
          </Typography>

          {/* Search Input */}

          <TextField
            size="small"
            variant="outlined"
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              bgcolor: "white",
              borderRadius: 1,
              mr: 2,
              width: 300,
            }}
          />

          {/* Genre Filter */}

          <FormControl
            size="small"
            sx={{
              bgcolor: "white",
              borderRadius: 1,
              mr: 2,
              minWidth: 180,
            }}
          >
            <InputLabel>Select genre..</InputLabel>

            <Select
              value={genre}
              label="Genre"
              onChange={(e) => setGenre(e.target.value)}
            >
              <MenuItem value="">All Genres</MenuItem>

              <MenuItem value="Fiction">Fiction</MenuItem>

              <MenuItem value="Dystopian">Dystopian</MenuItem>

              <MenuItem value="Programming">Programming</MenuItem>

              <MenuItem value="Productivity">Productivity</MenuItem>

              <MenuItem value="Self Help">Self Help</MenuItem>

              <MenuItem value="Fantasy">Fantasy</MenuItem>

              <MenuItem value="History">History</MenuItem>
            </Select>
          </FormControl>

          <IconButton color="inherit" onClick={() => setCartOpen(true)}>
            <Badge badgeContent={totalItems} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
