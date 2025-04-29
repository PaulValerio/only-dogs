"use server";

import { db } from "./db";
import { likes, matches, dog_info } from "./db/schema";
import { and, eq } from "drizzle-orm";

export async function acceptDog(currentDogId: number, targetDogId: number) {
  await db.insert(likes).values({
    event: `user-${currentDogId} accepted user-${targetDogId}`,
    from: currentDogId,
    to: targetDogId,
  });
  
  const mutual = await db
    .select()
    .from(likes)
    .where(and(eq(likes.from, targetDogId), eq(likes.to, currentDogId)));

  if (mutual.length > 0) {
    const [currentDog] = await db
      .select()
      .from(dog_info)
      .where(eq(dog_info.id, currentDogId));
    const [targetDog] = await db
      .select()
      .from(dog_info)
      .where(eq(dog_info.id, targetDogId));

    if (currentDog!.location === targetDog!.location) {
      await db.insert(matches).values({
        event: `user-${currentDogId} matched with user-${targetDogId}`,
        dog1_id: currentDogId,
        dog2_id: targetDogId,
      });

      return { matched: true };
    }
  }

  return { matched: false };
}
