import { Express } from "express";
import { MongoClient, ObjectId } from "mongodb";

import { Response } from "./types";
import { authenticated, getId } from "../middleware";

export function RegisterGetWeightHistory(app: Express) {
  app.use(authenticated).get("/get_weight_history", async (req, res) => {
    const _id = getId(req);
    
    try {
      console.log('[GetWeightHistory] Starting...')
      const result = await GetWeightHistory(_id);
      console.log('[GetWeightHistory] Sending Response...')
      res.status(result.statusCode).send(JSON.stringify(result.body));
    } catch (e) {
      console.log('[GetWeightHistory] Sending Error...')
      res.status(500).send(JSON.stringify({ error: e.message }));
    }
  });
}

const GetWeightHistory = async (_id: string): Promise<Response> => {
  const client = new MongoClient(process.env.DB_URL);

  try {
    await client.connect();
    const db = client.db("weight_management");
    const users = db.collection("users");

    const user = await users.findOne({ _id: new ObjectId(_id) });

    if (!user) {
      throw new Error("Authentication failed. User does not exist.");
    }

    return {
      statusCode: 200,
      body: {
        weights: user.weights,
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
