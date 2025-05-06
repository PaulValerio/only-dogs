import { db } from "~/server/db";
import { matches, dog_info, image } from "~/server/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, or, inArray, } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json([], { status: 401 });

  const currentDog = await db.query.dog_info.findFirst({
    where: eq(dog_info.userId, userId),
  });

  if (!currentDog) return NextResponse.json([], { status: 404 });

  const matched = await db.query.matches.findMany({
    where: or(
      eq(matches.dog1_id, currentDog.id),
      eq(matches.dog2_id, currentDog.id)
    ),
  });

  const otherDogIds = matched.map((match) =>
    match.dog1_id === currentDog.id ? match.dog2_id : match.dog1_id
  );

  const matchedDogs = await db.query.dog_info.findMany({
    where: inArray(dog_info.id, otherDogIds),
  });

  const allImages = await db.query.image.findMany({
    where: inArray(image.userId, matchedDogs.map((d) => d.userId)),
  });

  const result = matchedDogs.map((dog) => {
    const dogImage = allImages.find((img) => img.userId === dog.userId);
    return {
      id: dog.id,
      name: dog.name_dog,
      imageUrl: dogImage?.url ?? "/images/defaultDog.png",
    };
  });

  return NextResponse.json(result);
}