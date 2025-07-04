import express from "express";
const app = express();
export default app;

import taskRouter from "#api/tasks";
import userRouter from "#api/users";
import getUserFromToken from "#middleware/getUserFromToken";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(getUserFromToken);

app.use("/users", userRouter);
app.use("/tasks", taskRouter);

//PostgreSQL error-handling
app.use((err, req, res, next) => {
  switch (err.code) {
    // Invalid type
    case "22P02":
      return res.status(400).send(err.message);
    // Unique constraint violation
    case "23505":
    // Foreign key violation
    case "23503":
      return res.status(400).send(err.detail);
    default:
      next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});
