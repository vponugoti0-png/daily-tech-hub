import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import { getProgressForUser } from "@/lib/auth/users";

export const runtime = "nodejs";

export async function GET() {
  const session = await readSession();
  if (!session) return NextResponse.json({ user: null });
  const progress = getProgressForUser(session.id);
  return NextResponse.json({
    user: session,
    progress: progress.map((p) => ({
      track: p.track,
      slug: p.slug,
      completed: Boolean(p.completed),
      quizScore: p.quiz_score ?? undefined,
      quizTotal: p.quiz_total ?? undefined,
      stepIndex: p.step_index ?? undefined,
      updatedAt: p.updated_at,
    })),
  });
}
