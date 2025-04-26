import { db } from "~/server/db";
import { dog_info } from "~/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const { name, age, gender, breed, location } = data;

  await db.insert(dog_info).values({
    name_dog: name,
    age: parseInt(age),
    gender,
    breed,
    location,
    userId,
  });

  return NextResponse.json({ success: true });
}

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ hasDogProfile: false });
  }

  const dogProfile = await db
    .select()
    .from(dog_info)
    .where(eq(dog_info.userId, userId))
    .then(res => res[0]);
    
  return NextResponse.json({ hasDogProfile: !!dogProfile });
}