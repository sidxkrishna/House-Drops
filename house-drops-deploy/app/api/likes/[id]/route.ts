import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const count = (await redis.get<number>(`like:${id}`)) ?? 0;
  return NextResponse.json({ id, count });
}

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const count = await redis.incr(`like:${id}`);
  return NextResponse.json({ id, count });
}
