import { Command } from "commander";
import { listBooks, getBook, searchBooks } from "./commands/books";
import {
  showCart,
  removeCartItem,
  clearCart,
  checkoutCart,
} from "./commands/cart";
const program = new Command();
const books = program.command("books");
books.command("list").action(listBooks);
books.command("get").argument("<bookId>").action(getBook);
books
  .command("search")
  .option("--query <query>")
  .option("--genre <genre>")
  .action(searchBooks);
import { addToCart } from "./commands/cart";

const cart = program.command("cart");

cart.command("add").argument("<book_id>").argument("<qty>").action(addToCart);

cart.command("show").action(showCart);

cart.command("remove").argument("<cartItemId>").action(removeCartItem);

cart.command("clear").action(clearCart);

cart.command("checkout").action(checkoutCart);
program.parse();
