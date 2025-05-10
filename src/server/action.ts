"use server";

import { db } from "./db";
import { decision, matches, dog_info } from "./db/schema";
import { and, eq, like } from "drizzle-orm";

export async function acceptDog(currentDogId: number, targetDogId: number) {
  await db.insert(decision).values({
    event: `user-${currentDogId} accepted user-${targetDogId}`,
    from: currentDogId,
    to: targetDogId,
  });

  const mutual = await db
    .select()
    .from(decision)
    .where(
      and(
        eq(decision.from, targetDogId),
        eq(decision.to, currentDogId),
        like(decision.event, `%accepted%`),
      ),
    );

  if (mutual.length > 0) {
    const [currentDog] = await db
      .select()
      .from(dog_info)
      .where(eq(dog_info.id, currentDogId));

    const [targetDog] = await db
      .select()
      .from(dog_info)
      .where(eq(dog_info.id, targetDogId));

    if (
      currentDog!.location === targetDog!.location &&
      currentDog!.gender !== targetDog!.gender
    ) {
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

export async function rejectDog(currentDogId: number, targetDogId: number) {
  await db.insert(decision).values({
    event: `user-${currentDogId} rejected user-${targetDogId}`,
    from: currentDogId,
    to: targetDogId,
  });
}
