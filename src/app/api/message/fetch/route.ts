import { db } from "~/server/db";
import { messages } from "~/server/db/schema";
import { eq, or, and } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { dog1Id, dog2Id } = await req.json();

  const msgs = await db
    .select()
    .from(messages)
    .where(
      or(
        and(eq(messages.sender_id, dog1Id), eq(messages.receiver_id, dog2Id)),
        and(eq(messages.sender_id, dog2Id), eq(messages.receiver_id, dog1Id)),
      ),
    )
    .orderBy(messages.createdAt);

  return NextResponse.json(msgs);
}
