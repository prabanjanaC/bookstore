import express from "express";
import cors from "cors";
import { createSchema, createYoga } from "graphql-yoga";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";

const app = express();

app.use(cors());

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  graphqlEndpoint: "/graphql",
  maskedErrors: false,
});

app.use("/graphql", yoga);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
