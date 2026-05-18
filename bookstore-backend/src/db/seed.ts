import { pool } from "./pool";

const books = [
  {
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self Help",
    price: 499,
    stock: 10,
    description: "A practical guide to building good habits.",
    publishedyear: 2018,
    image:
      "https://images-na.ssl-images-amazon.com/images/I/91bYsX41DVL.jpg",
  },
  {
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    genre: "Finance",
    price: 399,
    stock: 5,
    description: "Personal finance and investing lessons.",
    publishedyear: 1997,
    image:
      "https://images-na.ssl-images-amazon.com/images/I/81bsw6fnUiL.jpg",
  },
  {
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J.K. Rowling",
    genre: "Fantasy",
    price: 699,
    stock: 3,
    description: "A young wizard begins his magical journey.",
    publishedyear: 1997,
    image:
      "https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg",
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    genre: "Fiction",
    price: 299,
    stock: 7,
    description: "A philosophical story about destiny.",
    publishedyear: 1988,
    image:
      "https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg",
  },
  {
    title: "Ikigai",
    author: "Hector Garcia",
    genre: "Self Help",
    price: 450,
    stock: 8,
    description: "Japanese secrets for a long and happy life.",
    publishedyear: 2016,
    image:
      "https://images-na.ssl-images-amazon.com/images/I/81l3rZK4lnL.jpg",
  },
  {
    title: "Deep Work",
    author: "Cal Newport",
    genre: "Productivity",
    price: 550,
    stock: 0,
    description: "Rules for focused success in a distracted world.",
    publishedyear: 2016,
    image:
      "https://images-na.ssl-images-amazon.com/images/I/71QKQ9mwV7L.jpg",
  },
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    genre: "Programming",
    price: 899,
    stock: 6,
    description: "A handbook of agile software craftsmanship.",
    publishedyear: 2008,
    image:
      "https://images-na.ssl-images-amazon.com/images/I/41SH-SvWPxL.jpg",
  },
  {
    title: "The Psychology of Money",
    author: "Morgan Housel",
    genre: "Finance",
    price: 499,
    stock: 10,
    description: "Timeless lessons on wealth and behavior.",
    publishedyear: 2020,
    image:
      "https://images-na.ssl-images-amazon.com/images/I/71g2ednj0JL.jpg",
  },
  {
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian",
    price: 350,
    stock: 4,
    description: "A dystopian novel about surveillance and control.",
    publishedyear: 1949,
    image:
      "https://images-na.ssl-images-amazon.com/images/I/71kxa1-0mfL.jpg",
  },
  {
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt",
    genre: "Programming",
    price: 950,
    stock: 5,
    description: "Journey to mastery for modern developers.",
    publishedyear: 1999,
    image:
      "https://images-na.ssl-images-amazon.com/images/I/518FqJvR9aL.jpg",
  },
];

async function seedBooks() {
  try {
    for (const book of books) {
      await pool.query(
        `
        INSERT INTO books (
          title,
          author,
          genre,
          price,
          stock,
          description,
          publishedyear,
          image
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `,
        [
          book.title,
          book.author,
          book.genre,
          book.price,
          book.stock,
          book.description,
          book.publishedyear,
          book.image
        ]
      );
    }

    console.log("10 books inserted successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

seedBooks();