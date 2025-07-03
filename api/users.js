import express from "express";
const userRouter = express.Router();
export default userRouter;

import requireBody from "#middleware/requireBody";
import { createUser, getUserByUsernameAndPassword } from "#db/queries/users";
import { createToken } from "#utils/jwt";

userRouter.route("/register")
  .post(
    requireBody(["username", "password"]),
    async (req, res) => {
      const newUser = await createUser(req.body.username, req.body.password);
      const token = createToken(newUser);
      res.status(201).send(token);
});

userRouter.route("/login")
  .post(
    requireBody(["username", "password"]),
    async (req, res) => {
      const user = await getUserByUsernameAndPassword(req.body.username, req.body.password);
      if (!user) return res.status(401).send("Invalid username or password");
      const token = createToken(user);
      res.send(token);
});