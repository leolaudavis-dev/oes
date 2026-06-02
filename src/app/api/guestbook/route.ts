import { promises as fs } from "fs";
import path from "path";

export type GuestEntry = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "guestbook.json");

async function readEntries(): Promise<GuestEntry[]> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // File doesn't exist yet (or is unreadable) — start empty.
    return [];
  }
}

async function writeEntries(entries: GuestEntry[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(entries, null, 2), "utf8");
}

export async function GET() {
  const entries = await readEntries();
  // Newest first.
  entries.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
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

  const entries = await readEntries();
  entries.push(entry);
  await writeEntries(entries);

  return Response.json({ entry }, { status: 201 });
}
