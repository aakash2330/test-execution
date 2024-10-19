import prisma from "@/lib/prisma";
import { submissionResultSchema } from "@/schema/submissionResult";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { values } = await request.json();
    const parsedValues = submissionResultSchema.safeParse(values);
    if (!parsedValues.success) {
      throw new Error("Error parsing Data");
    }
    const { id, executionTime, status } = parsedValues.data;
    await prisma.submission.update({
      where: { id },
      data: { executionTime, status },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error({ error });
    return NextResponse.json({ success: false });
  }
}
