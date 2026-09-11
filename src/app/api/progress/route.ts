import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import {
  MERGE_PAYLOAD_MAX_KEYS,
  getProgressForUser,
  mergeLocalProgress,
  upsertProgress,
} from "@/lib/auth/users";
import { assertCsrf } from "@/lib/auth/csrf";

export const runtime = "nodejs";

function lessonsPayload(userId: number) {
  const progress = getProgressForUser(userId);
  return {
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
  };
}

export async function GET() {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(lessonsPayload(session.id));
}

export async function POST(req: Request) {
  const csrf = await assertCsrf(req);
  if (!csrf.ok) {
    return NextResponse.json({ error: csrf.error }, { status: csrf.status });
  }

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
    const keyCount = Object.keys(body.merge).length;
    if (keyCount > MERGE_PAYLOAD_MAX_KEYS) {
      return NextResponse.json(
        { error: `Merge payload exceeds ${MERGE_PAYLOAD_MAX_KEYS} keys` },
        { status: 400 },
      );
    }
    try {
      mergeLocalProgress(session.id, body.merge);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Merge failed";
      return NextResponse.json({ error: msg }, { status: 400 });
    }
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

  return NextResponse.json(lessonsPayload(session.id));
}
