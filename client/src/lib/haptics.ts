type HapticPattern = "light" | "medium" | "heavy" | "success" | "error" | "selection";

const patterns: Record<HapticPattern, number | number[]> = {
  light: 10,
  medium: 25,
  heavy: 50,
  success: [10, 50, 20],
  error: [30, 50, 30, 50, 30],
  selection: 8,
};

export function haptic(pattern: HapticPattern = "light"): void {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(patterns[pattern]);
    } catch {
    }
  }
}

export function hapticOnClick(pattern: HapticPattern = "light") {
  return () => haptic(pattern);
}
