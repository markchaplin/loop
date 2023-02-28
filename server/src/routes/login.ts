import { Express } from "express";
import { body } from "express-validator";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { Response } from "./types";
import { getUsersCollection } from "../client";

export function RegisterLogin(app: Express) {
  app.post(
    "/login",
    body("email").isEmail(),
    body("password").isLength({ min: 8 }),
    async (req, res) => {
      const email = req.body.email;
      const password = req.body.password;

      try {
        console.log('[Login] Starting...')
        const result = await Login(email, password);
        console.log('[Login] Sending Response...')
        res.status(result.statusCode).send(JSON.stringify(result.body));
      } catch (e) {
        console.log('[Login] Sending Error...')
        res.status(500).send(JSON.stringify({ error: e.message }));
      }
    }
  );
}

const Login = async (email: string, password: string): Promise<Response> => {
  const url = process.env.DB_URL
  if (!url) {
    throw new Error(`DB_URL is required`)
  }

  const client = new MongoClient(process.env.DB_URL);

  try {
    await client.connect();
    const users = getUsersCollection(client);

    const user = await users.findOne({ email: email });

    if (!user) {
      throw new Error("Authentication failed. Invalid user or password.");
    }

    if (!bcrypt.compareSync(password, user.hash_password)) {
      throw new Error("Authentication failed. Invalid user or password.");
    }

    return {
      statusCode: 200,
      body: {
        token: jwt.sign({ email, _id: user._id }, process.env.SECRET_KEY),
      },
    };
  } catch (e) {
    return {
      statusCode: 401,
      body: { message: e.message },
    };
  } finally {
    await client.close();
  }
};
