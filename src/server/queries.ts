"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { dog_info, decision } from "./db/schema";

export async function getDogImage() {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  const images = await db.query.image.findMany();

  return images;
}

export async function getDogInfo() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const userDog = await getUserDog(userId);

  if (!userDog) return [];

  const likedDogs = await db
    .select({ to: decision.to })
    .from(decision)
    .where(eq(decision.from, userDog.id));

  const likedIds = likedDogs.map((entry) => entry.to);

  const allDogs = await db.select().from(dog_info);

  const filteredDogs = allDogs.filter(
    (dog) => dog.id !== userDog.id && !likedIds.includes(dog.id)
  );

  return filteredDogs;
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
