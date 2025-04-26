"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "./db";

export async function getDogImage() {
    const user = await auth();

    if (!user?.userId) throw new Error("Unauthorized");

    const images = await db.query.image.findMany();

    return images
}

export async function getDogInfo() {
    const user = await auth();

    if (!user?.userId) throw new Error("Unauthorized");

    const infos = await db.query.dog_info.findMany();

    return infos
}