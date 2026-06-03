import { getDb } from "@/lib/mongodb";

export type GuestEntry = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

const COLLECTION = "guestbook";

export async function GET() {
  const db = await getDb();
  const entries = await db
    .collection<GuestEntry>(COLLECTION)
    .find({}, { projection: { _id: 0 } })
    // Newest first.
    .sort({ createdAt: -1 })
    .toArray();
  return Response.json({ entries });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const { name, message } = (body ?? {}) as {
    name?: unknown;
    message?: unknown;
  };

  const cleanName = typeof name === "string" ? name.trim() : "";
  const cleanMessage = typeof message === "string" ? message.trim() : "";

  if (!cleanMessage) {
    return Response.json({ error: "Message is required." }, { status: 400 });
  }

  const entry: GuestEntry = {
    id: `${Date.now()}-${Math.round(Math.random() * 1e6)}`,
    name: (cleanName || "anonymous").slice(0, 60),
    message: cleanMessage.slice(0, 500),
    createdAt: new Date().toISOString(),
  };

  const db = await getDb();
  // Spread so insertOne's added _id doesn't leak onto the response object.
  await db.collection(COLLECTION).insertOne({ ...entry });

  return Response.json({ entry }, { status: 201 });
}
