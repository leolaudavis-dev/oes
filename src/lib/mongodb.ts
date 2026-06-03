import { MongoClient, type Db } from "mongodb";

// Reuse a single MongoClient across requests (and across HMR reloads in dev).
// Serverless functions reuse instances, so caching the connect() promise on
// globalThis avoids opening a new connection pool on every invocation.
const DB_NAME = "scrapbook";

let clientPromise: Promise<MongoClient> | undefined;

function getClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }
  if (!clientPromise) {
    const globalForMongo = globalThis as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };
    if (!globalForMongo._mongoClientPromise) {
      globalForMongo._mongoClientPromise = new MongoClient(uri).connect();
    }
    clientPromise = globalForMongo._mongoClientPromise;
  }
  return clientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise();
  return client.db(DB_NAME);
}
