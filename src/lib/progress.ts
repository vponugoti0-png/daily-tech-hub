"use client";

import type { TrackId } from "./types";

const KEY = "dth-progress-v2";

export interface LessonProgress {
  completed: boolean;
  quizScore?: number;
  quizTotal?: number;
  stepIndex?: number;
  updatedAt: string;
}

export interface ProgressState {
  lessons: Record<string, LessonProgress>;
}

function lessonKey(track: TrackId | string, slug: string) {
  return `${track}:${slug}`;
}

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return { lessons: {} };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { lessons: {} };
    return JSON.parse(raw) as ProgressState;
  } catch {
    return { lessons: {} };
  }
}

export function saveProgress(state: ProgressState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function getLessonProgress(track: string, slug: string): LessonProgress | undefined {
  return loadProgress().lessons[lessonKey(track, slug)];
}

export function upsertLessonProgress(
  track: string,
  slug: string,
  patch: Partial<LessonProgress>,
): ProgressState {
  const state = loadProgress();
  const key = lessonKey(track, slug);
  const prev = state.lessons[key] ?? {
    completed: false,
    updatedAt: new Date().toISOString(),
  };
  state.lessons[key] = {
    ...prev,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  saveProgress(state);
  return state;
}

export function markLessonComplete(track: string, slug: string) {
  return upsertLessonProgress(track, slug, { completed: true });
}

export function trackCompletion(
  track: string,
  slugs: string[],
): { done: number; total: number; pct: number } {
  const state = loadProgress();
  const done = slugs.filter((s) => state.lessons[lessonKey(track, s)]?.completed).length;
  const total = slugs.length;
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}
