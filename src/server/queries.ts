"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { dog_info } from "./db/schema";

export async function getDogImage() {
  const user = await auth();

  if (!user?.userId) throw new Error("Unauthorized");

  const images = await db.query.image.findMany();

  return images;
}

export async function getDogInfo() {
  const user = await auth();

  if (!user?.userId) throw new Error("Unauthorized");

  const infos = await db.query.dog_info.findMany();

  return infos;
}

export async function getUserDog(userId: string) {
  const user = await auth();

  if (!user?.userId) throw new Error("Unauthorized");

  const result = await db
    .select()
    .from(dog_info)
    .where(eq(dog_info.userId, userId));

  return result[0];
}
