import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import {
  getProgressForUser,
  mergeLocalProgress,
  upsertProgress,
} from "@/lib/auth/users";

export const runtime = "nodejs";

export async function GET() {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const progress = getProgressForUser(session.id);
  return NextResponse.json({
    lessons: Object.fromEntries(
      progress.map((p) => [
        `${p.track}:${p.slug}`,
        {
          completed: Boolean(p.completed),
          quizScore: p.quiz_score ?? undefined,
          quizTotal: p.quiz_total ?? undefined,
          stepIndex: p.step_index ?? undefined,
          updatedAt: p.updated_at,
        },
      ]),
    ),
  });
}

export async function POST(req: Request) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as {
    track?: string;
    slug?: string;
    completed?: boolean;
    quizScore?: number;
    quizTotal?: number;
    stepIndex?: number;
    merge?: Record<
      string,
      {
        completed?: boolean;
        quizScore?: number;
        quizTotal?: number;
        stepIndex?: number;
        updatedAt?: string;
      }
    >;
  };

  if (body.merge) {
    mergeLocalProgress(session.id, body.merge);
  } else if (body.track && body.slug) {
    upsertProgress(session.id, {
      track: body.track,
      slug: body.slug,
      completed: body.completed,
      quizScore: body.quizScore,
      quizTotal: body.quizTotal,
      stepIndex: body.stepIndex,
    });
  } else {
    return NextResponse.json({ error: "Missing progress payload" }, { status: 400 });
  }

  const progress = getProgressForUser(session.id);
  return NextResponse.json({
    lessons: Object.fromEntries(
      progress.map((p) => [
        `${p.track}:${p.slug}`,
        {
          completed: Boolean(p.completed),
          quizScore: p.quiz_score ?? undefined,
          quizTotal: p.quiz_total ?? undefined,
          stepIndex: p.step_index ?? undefined,
          updatedAt: p.updated_at,
        },
      ]),
    ),
  });
}
