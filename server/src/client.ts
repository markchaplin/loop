import { Collection, Document, MongoClient } from "mongodb";

export function getUsersCollection(client: MongoClient): Collection<Document> {
  console.log("Getting weight_management database......");
  const db = client.db("weight_management");

  console.log("Getting users collection......");
  const users = db.collection("users");
  return users;
}
