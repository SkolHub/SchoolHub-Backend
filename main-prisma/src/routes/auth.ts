import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, oneOf } from "express-validator";
import prisma from "../../prisma/prisma-client";
import { validate } from "../middleware/validator";

const router = express.Router();

const key = "your_secret_key";

const loginValidator = [
  oneOf([
    body("username").optional().isString(),
    body("email").optional().isString(),
  ]),
  body("password").exists().isString(),
];

router.post(
  "/login",
  loginValidator,
  validate,
  (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    prisma.user
      .findUnique({
        where: username ? { username } : { email },
      })
      .then((user) => {
        if (!user) return res.status(404).json({ message: "User not found" });

        bcrypt
          .compare(password, user.password)
          .then((validPassword) => {
            if (!validPassword)
              return res.status(401).json({ message: "Wrong password" });

            res.json({ token: jwt.sign({ id: user.id }, key) });
          })
          .catch((e) => {
            res.status(500).send("Internal Server Error");
          });
      })
      .catch((e) => {
        res.status(500).send("Internal Server Error");
      });
  }
);

const registerValidator = [
  body("username").exists().isString().isLength({ min: 3, max: 255 }),
  body("email").exists().isEmail(),
  body("password").exists().isString().isLength({ min: 4, max: 255 }),
  body("firstName").exists().isString().isLength({ min: 1, max: 255 }),
  body("lastName").exists().isString().isLength({ min: 1, max: 255 }),
];

router.post(
  "/register",
  registerValidator,
  validate,
  async (req: Request, res: Response) => {
    const { username, password, email, firstName, lastName } = req.body;

    bcrypt
      .hash(password, 10)
      .then((hashedPassword) => {
        prisma.user
          .create({
            data: {
              username,
              password: hashedPassword,
              email,
              firstName,
              lastName,
            },
          })
          .then((user) => {
            res.json(user);
          })
          .catch((e) => {
            res.status(500).send("Internal Server Error");
          });
      })
      .catch((e) => {
        res.status(500).send("Internal Server Error");
      });
  }
);

export default router;
