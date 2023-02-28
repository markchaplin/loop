import { Express } from "express";
import { body } from "express-validator";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { Response } from "./types";
import { getUsersCollection } from "../client";

export function RegisterSignup(app: Express) {
  app.post(
    "/signup",
    body("email").isEmail(),
    body("password").isLength({ min: 8 }),
    async (req, res) => {
      const email = req.body.email;
      const password = req.body.password;

      try {
        console.log('[SignUp] Starting...')
        const result = await SignUp(email, password);
        console.log('[SignUp] Sending Response...')
        res.status(result.statusCode).send(JSON.stringify(result.body));
      } catch (e) {
        console.log('[SignUp] Sending Error...')
        res.status(500).send(JSON.stringify({ error: e.message }));
      }
    }
  );
}

const SignUp = async (email: string, password: string): Promise<Response> => {
  const client = new MongoClient(process.env.DB_URL);

  try {
    await client.connect();

    const users = getUsersCollection(client);

    const user = await users.findOne({ email });

    if (user) {
      throw new Error("Authentication failed. User already exists.");
    }

    const insertResult = await users.insertOne({
      email,
      hash_password: bcrypt.hashSync(password, 10),
    });

    if (!insertResult.acknowledged) {
      throw new Error("Authentication failed. Could not create new user.");
    }

    return {
      statusCode: 200,
      body: {
        token: jwt.sign(
          { email, _id: insertResult.insertedId.toString() },
          process.env.SECRET_KEY
        ),
      },
    };
  } catch (e) {
    return {
      statusCode: 400,
      body: { message: e.message },
    };
  } finally {
    await client.close();
  }
};
