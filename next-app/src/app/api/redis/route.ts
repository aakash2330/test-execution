import prisma from "@/lib/prisma";
import { submissionformSchema } from "@/schema/submissionForm";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "redis";

const redisHost = process.env.REDIS_HOST || "localhost";
const redisClient = createClient({
  url: `redis://${redisHost}:6379`,
});

redisClient.on("error", (err) => {
  console.log("Redis error: ", err);
});

export async function POST(request: NextRequest) {
  try {
    // Connect Redis client once outside the transaction
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    const { values } = await request.json();
    const parsedValues = submissionformSchema.safeParse(values);
    if (!parsedValues.success) {
      return NextResponse.json({ success: false });
    }

    // Get the username, backendUrl, and websocketUrl from the body
    const { username, backendUrl, websocketUrl } = parsedValues.data;

    let reply: number = -1;

    // Add entry to DB using a transaction
    await prisma.$transaction(async (tx) => {
      await tx.submission.create({
        data: {
          username,
          backendUrl,
          websocketUrl,
          status: "in progress",
          submissionTime: Date.now().toString(),
        },
      });

      // Add the submission data to Redis
      reply = await redisClient.lPush(
        "submissions",
        JSON.stringify({ backendUrl, websocketUrl }),
      );
      console.log("Submission added to Redis queue");
    });

    return NextResponse.json({
      success: true,
      message: `Your Submission has been added to queue (${reply})`,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ success: false, message: "Submission failed" });
  } finally {
    if (redisClient.isOpen) {
      await redisClient.disconnect();
    }
  }
}
