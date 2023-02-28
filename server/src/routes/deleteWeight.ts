import { Express } from "express";
import { MongoClient, ObjectId } from "mongodb";

import { Response } from "./types";
import { authenticated, getId } from "../middleware";
import { body } from "express-validator";

export function RegisterDeleteWeight(app: Express) {
  app
    .use(authenticated)
    .post("/delete_weight", body("name").isString(), async (req, res) => {
      const name = req.body.name;

      const _id = getId(req);
      try {
        console.log('[DeleteWeight] Starting...')
        const result = await DeleteWeight(_id, name);
        console.log('[DeleteWeight] Sending Response...')
        res.status(result.statusCode).send(JSON.stringify(result.body));
      } catch (e) {
        console.log('[DeleteWeight] Sending Error...')
        res.status(500).send(JSON.stringify({ error: e.message }));
      }
    });
}

const DeleteWeight = async (_id: string, name: string): Promise<Response> => {
  const client = new MongoClient(process.env.DB_URL);

  try {
    await client.connect();
    const db = client.db("weight_management");
    const users = db.collection("users");

    const result = await users.updateOne(
      { _id: new ObjectId(_id) },
      { $pull: { weights: { name } } }
    );

    if (!result.acknowledged) {
      throw new Error("Authentication failed. User does not exist.");
    }

    return {
      statusCode: 200,
      body: { message: "success" },
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
