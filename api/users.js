import { getUserByUsernameAndPassword, createUser } from "#db/queries/users";
import requireBody from "#middleware/requireBody";
import { createToken } from "#utils/jwt";
import express from "express";
const router = express.Router();
export default router;

router.post(
  "/register",
  requireBody(["username", "password"]),
  async (req, res) => {
    const { username, password } = req.body;
    const user = await createUser(username, password);
    const token = createToken({ id: user.id });
    // tests expect the raw token string in response.text, so send the token directly
    res.status(201).send(token);
  }
);

router.post(
  "/login",
  requireBody(["username", "password"]),
  async (req, res) => {
    const { username, password } = req.body;
    const user = await getUserByUsernameAndPassword(username, password);
    if (!user) return res.status(401).send("Invalid username or password");
    const token = createToken({ id: user.id });
    // send the token string (tests read response.text)
    res.send(token);
  }
);
