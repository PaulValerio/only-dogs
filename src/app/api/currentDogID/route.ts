import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserDog } from "~/server/queries";

export async function GET() {
    const { userId } = await auth();
  
    const dog = await getUserDog(userId!);
  
    if (!dog) {
      return NextResponse.json({ currentDogId: null });
    }
  
    return NextResponse.json({ currentDogId: dog.id });
  }