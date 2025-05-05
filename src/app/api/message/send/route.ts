import { db } from "~/server/db";
import { messages } from "~/server/db/schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { senderId, receiverId, message } = await req.json();

  await db.insert(messages).values({
    sender_id: senderId,
    receiver_id: receiverId,
    message: message,
  });

  return NextResponse.json({ success: true });
}
