import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPoints(points: number): string {
  if (points >= 1000) {
    return `${(points / 1000).toFixed(1)}k`;
  }
  return points.toString();
}

export function formatHours(hours: number): string {
  if (hours < 1) {
    return `${Math.round(hours * 60)} min`;
  }
  return `${hours} ${hours === 1 ? 'hr' : 'hrs'}`;
}

export function calculateLevel(points: number): number {
  // Level thresholds: 0-999 (1), 1000-2499 (2), 2500-3999 (3), 4000+ (4)
  if (points < 1000) return 1;
  if (points < 2500) return 2;
  if (points < 4000) return 3;
  return 4;
}

export function getLevelName(level: number): string {
  const levels = ['Explorer', 'Specialist', 'Architect', 'World-Class'];
  return levels[level - 1] || 'Explorer';
}

export function calculateProgress(current: number, target: number): number {
  return Math.min(Math.round((current / target) * 100), 100);
}
