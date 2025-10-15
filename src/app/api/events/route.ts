import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "../../../server/db";

const eventCreateSchema = z.object({
  tagId: z.string().min(1, "tagId is required"),
  visitorId: z.string().min(1, "visitorId is required"),
  eventType: z.string().min(1, "eventType is required"),
  eventName: z.string().optional(),
  metadata: z.record(z.any()).optional().default({}),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validationResult = eventCreateSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Invalid request body",
          errors: validationResult.error.issues,
        },
        { status: 400 },
      );
    }

    const { tagId, visitorId, eventType, eventName, metadata } =
      validationResult.data;

    const newEvent = await prisma.event.create({
      data: {
        tagId,
        visitorId,
        eventType,
        eventName,
        metadata,
      },
    });

    return NextResponse.json(
      { message: "Event recorded successfully", event: newEvent },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error recording event:", error);
    return NextResponse.json(
      { message: "Failed to record event", error: (error as Error).message },
      { status: 500 },
    );
  }
}

const eventGetSchema = z.object({
  tagId: z.string().min(1, "tagId is required").optional(),
  since: z.string().datetime().optional(),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = Object.fromEntries(searchParams.entries());

    const validationResult = eventGetSchema.safeParse(query);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Invalid query parameters",
          errors: validationResult.error.issues,
        },
        { status: 400 },
      );
    }

    const { tagId, since } = validationResult.data;

    const whereClause: { tagId?: string; createdAt?: { gt: Date } } = {};
    let takeLimit: number | undefined = 20;

    if (tagId) {
      whereClause.tagId = tagId;
    }

    if (since) {
      whereClause.createdAt = {
        gt: new Date(since),
      };
      takeLimit = undefined;
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: takeLimit,
    });

    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { message: "Failed to fetch events", error: (error as Error).message },
      { status: 500 },
    );
  }
}
