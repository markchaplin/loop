import { Express } from "express";
import { MongoClient, ObjectId } from "mongodb";

import { Response } from "./types";
import { authenticated, getId } from "../middleware";
import { body } from "express-validator";

export function RegisterSaveWeight(app: Express) {
  app
    .use(authenticated)
    .post(
      "/save_weight",
      body("name").isString(),
      body("weight").isNumeric(),
      async (req, res) => {
        const name = req.body.name;
        const weight = req.body.weight;
        const _id = getId(req);
        try {
          console.log('[SaveWeight] Starting...')
          const result = await SaveWeight(_id, weight, name);
          console.log('[SaveWeight] Sending Response...')
          res.status(result.statusCode).send(JSON.stringify(result.body));
        } catch (e) {
          console.log('[SaveWeight] Sending Error...')
          res.status(500).send(JSON.stringify({ error: e.message }));
        }
      }
    );
}

const SaveWeight = async (
  _id: string,
  weight: number,
  name: string
): Promise<Response> => {
  const client = new MongoClient(process.env.DB_URL);

  try {
    await client.connect();
    const db = client.db("weight_management");
    const users = db.collection("users");

    const result = await users.updateOne(
      { _id: new ObjectId(_id) },
      {
        $push: {
          weights: {
            weight,
            name,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
      }
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
