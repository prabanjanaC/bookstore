//import { pool } from "./pool";

// async function migrate() {
//   try {
//     await pool.query(`
//     CREATE EXTENSION IF NOT EXISTS "pgcrypto";

//     CREATE TABLE IF NOT EXISTS books (
//       book_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//       title TEXT NOT NULL,
//       author TEXT NOT NULL,
//       genre TEXT NOT NULL,
//       price NUMERIC NOT NULL CHECK (price > 0),
//       stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
//       image TEXT,
//       description TEXT,
//       publishedyear INTEGER NOT NULL,
//       createdat TIMESTAMP DEFAULT NOW(),
//       updatedat TIMESTAMP DEFAULT NOW()
//     );
//   `);

//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS cart_items (
//         id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//         book_id UUID NOT NULL UNIQUE
//         REFERENCES books(book_id)
//         ON DELETE CASCADE,
//         quantity INT NOT NULL
//         CHECK (quantity > 0),
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       );
//     `);

//     console.log("Migration completed");
//   } catch (error) {
//     console.error("Migration failed:", error);
//   } finally {
//     await pool.end();
//   }
// }

// migrate();
console.log("Prisma handles migrations using:");
console.log("bunx prisma migrate dev");
