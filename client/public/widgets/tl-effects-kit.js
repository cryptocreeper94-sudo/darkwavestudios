/**
 * DarkWave Effects Kit v1.0
 * Complete UI effects system — drop-in CSS + React hooks + utilities
 * 
 * Includes:
 *   1. Glassmorphism (glass, glass-card, glass-strong)
 *   2. 3D Card Hover (card-3d)
 *   3. Shimmer Skeleton Loading (shimmer-skeleton, shimmer-text, shimmer-circle, shimmer-card)
 *   4. Scroll-Triggered Animations (scroll-fade-in, scroll-slide-left, scroll-slide-right, scroll-scale-in)
 *   5. Haptic Feedback (navigator.vibrate patterns)
 *   6. Micro-Interactions (btn-press, hover-elevate, ripple-effect, toggle-switch)
 *
 * Usage:
 *   - CSS: Include the stylesheet below in your <head> or import into your CSS
 *   - React hooks: Copy useScrollAnimation + ScrollReveal into your hooks directory
 *   - Haptic utility: Copy the haptic() function into your lib directory
 *
 * No external dependencies required. Works with any framework or vanilla HTML/CSS/JS.
 *
 * © DarkWave Studios — https://darkwavestudios.com
 * Licensed for use in one project per purchase. See LICENSE for details.
 */

// ============================================
// SECTION 1: CSS EFFECTS STYLESHEET
// ============================================
// Inject this into your app via <style> tag, CSS file import, or Tailwind @layer

const DARKWAVE_EFFECTS_CSS = `
/* =============================================
   DarkWave Effects Kit — CSS Module
   ============================================= */

/* --- Glassmorphism --- */
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}
.glass-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(139, 92, 246, 0.15);
  border-color: rgba(139, 92, 246, 0.2);
}

.glass-strong {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* --- 3D Card Hover --- */
.card-3d {
  perspective: 800px;
  transform-style: preserve-3d;
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}
.card-3d:hover {
  transform: translateZ(20px) rotateX(2deg) rotateY(-2deg);
  box-shadow: 0 20px 60px rgba(139, 92, 246, 0.2), 0 0 40px rgba(139, 92, 246, 0.1);
}

/* --- Shimmer / Skeleton Loading --- */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.shimmer-skeleton {
  background: linear-gradient(
    90deg,
    rgba(139, 92, 246, 0.05) 25%,
    rgba(139, 92, 246, 0.15) 50%,
    rgba(139, 92, 246, 0.05) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 2s ease-in-out infinite;
  border-radius: 8px;
}

.shimmer-text {
  height: 14px;
  margin-bottom: 8px;
}
.shimmer-text.shimmer-skeleton { width: 80%; }
.shimmer-text:nth-child(2).shimmer-skeleton { width: 60%; }
.shimmer-text:nth-child(3).shimmer-skeleton { width: 70%; }

.shimmer-circle {
  border-radius: 50%;
}
.shimmer-circle.shimmer-skeleton {
  width: 48px;
  height: 48px;
}

.shimmer-card {
  padding: 16px;
  border-radius: 12px;
  border: 1px solid rgba(139, 92, 246, 0.1);
}

/* --- Scroll-Triggered Animations --- */
.scroll-fade-in {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.7s ease-out, transform 0.7s ease-out;
}
.scroll-fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}

.scroll-slide-left {
  opacity: 0;
  transform: translateX(-40px);
  transition: opacity 0.7s ease-out, transform 0.7s ease-out;
}
.scroll-slide-left.visible {
  opacity: 1;
  transform: translateX(0);
}

.scroll-slide-right {
  opacity: 0;
  transform: translateX(40px);
  transition: opacity 0.7s ease-out, transform 0.7s ease-out;
}
.scroll-slide-right.visible {
  opacity: 1;
  transform: translateX(0);
}

.scroll-scale-in {
  opacity: 0;
  transform: scale(0.92);
  transition: opacity 0.7s ease-out, transform 0.7s ease-out;
}
.scroll-scale-in.visible {
  opacity: 1;
  transform: scale(1);
}

/* --- Micro-Interactions --- */
.btn-press {
  transition: transform 0.1s ease;
}
.btn-press:active {
  transform: scale(0.95);
}

.hover-elevate {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.hover-elevate:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

@keyframes ripple-expand {
  0% {
    transform: scale(0);
    opacity: 0.6;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}
.ripple-effect {
  position: relative;
  overflow: hidden;
}
.ripple-effect::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 24px;
  height: 24px;
  margin: -12px 0 0 -12px;
  border-radius: 50%;
  background: rgba(139, 92, 246, 0.4);
  transform: scale(0);
  opacity: 0;
  pointer-events: none;
}
.ripple-effect:active::after {
  animation: ripple-expand 0.5s ease-out;
}

.toggle-switch {
  width: 44px;
  height: 24px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  cursor: pointer;
  transition: background 0.3s ease;
}
.toggle-switch::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: white;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
.toggle-switch.active {
  background: rgba(139, 92, 246, 0.6);
  border-color: rgba(139, 92, 246, 0.8);
}
.toggle-switch.active::after {
  transform: translateX(20px);
}
`;

// ============================================
// SECTION 2: SCROLL ANIMATION HOOK (React)
// ============================================
// Copy this into your project: src/hooks/useScrollAnimation.ts

const SCROLL_ANIMATION_HOOK = `
import { useEffect, useRef, useState, ReactNode } from "react";

export type ScrollAnimationType = "fade-in" | "slide-left" | "slide-right" | "scale-in";

const classMap: Record<ScrollAnimationType, string> = {
  "fade-in": "scroll-fade-in",
  "slide-left": "scroll-slide-left",
  "slide-right": "scroll-slide-right",
  "scale-in": "scroll-scale-in",
};

export function useScrollAnimation<T extends HTMLElement = HTMLDivElement>(
  animation: ScrollAnimationType = "fade-in",
  options?: { threshold?: number; rootMargin?: string; delay?: number }
) {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.classList.add(classMap[animation]);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const delay = options?.delay || 0;
          if (delay > 0) {
            setTimeout(() => {
              el.classList.add("visible");
              setIsVisible(true);
            }, delay);
          } else {
            el.classList.add("visible");
            setIsVisible(true);
          }
          observer.unobserve(el);
        }
      },
      {
        threshold: options?.threshold ?? 0.1,
        rootMargin: options?.rootMargin ?? "0px 0px -40px 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [animation, options?.threshold, options?.rootMargin, options?.delay]);

  return { ref, isVisible };
}

/** Declarative wrapper component */
export function ScrollReveal({
  children,
  animation = "fade-in",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  animation?: ScrollAnimationType;
  delay?: number;
  className?: string;
}) {
  const { ref } = useScrollAnimation<HTMLDivElement>(animation, { delay });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
`;

// ============================================
// SECTION 3: HAPTIC FEEDBACK UTILITY
// ============================================
// Copy this into your project: src/lib/haptics.ts

const HAPTIC_UTILITY = `
type HapticPattern = "light" | "medium" | "heavy" | "success" | "error" | "selection";

const patterns: Record<HapticPattern, number | number[]> = {
  light: 10,
  medium: 25,
  heavy: 50,
  success: [10, 50, 20],
  error: [50, 30, 50, 30, 50],
  selection: [5, 10, 5],
};

/**
 * Trigger haptic feedback via the Web Vibration API.
 * Falls back silently on devices/browsers that don't support vibration.
 *
 * @param pattern - One of: "light", "medium", "heavy", "success", "error", "selection"
 */
export function haptic(pattern: HapticPattern = "light"): void {
  try {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(patterns[pattern]);
    }
  } catch {
    // Vibration API not supported — fail silently
  }
}
`;

// ============================================
// SECTION 4: AUTO-INJECTOR (optional)
// ============================================
// Drop this script into any page to auto-inject the CSS

(function() {
  if (typeof document === 'undefined') return;

  // Inject CSS
  const style = document.createElement('style');
  style.id = 'darkwave-effects-kit';
  style.textContent = DARKWAVE_EFFECTS_CSS;
  document.head.appendChild(style);

  // Auto-apply scroll animations to elements with data attributes
  function initScrollAnimations() {
    const animElements = document.querySelectorAll('[data-scroll-animate]');
    if (!animElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = parseInt(entry.target.getAttribute('data-scroll-delay') || '0', 10);
            if (delay > 0) {
              setTimeout(() => entry.target.classList.add('visible'), delay);
            } else {
              entry.target.classList.add('visible');
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    animElements.forEach((el) => {
      const animType = el.getAttribute('data-scroll-animate');
      if (animType) el.classList.add(`scroll-${animType}`);
      observer.observe(el);
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollAnimations);
  } else {
    initScrollAnimations();
  }
})();

// ============================================
// QUICK START GUIDE
// ============================================
//
// 1. CSS-Only Effects (any framework):
//    <link rel="stylesheet" href="darkwave-effects.css" />
//    <div class="glass-card">Frosted glass panel</div>
//    <div class="card-3d">3D hover card</div>
//    <div class="shimmer-skeleton shimmer-text"></div>
//    <button class="btn-press ripple-effect">Click me</button>
//    <div class="hover-elevate">Lifts on hover</div>
//
// 2. Scroll Animations (vanilla JS):
//    <div data-scroll-animate="fade-in">Fades in on scroll</div>
//    <div data-scroll-animate="slide-left" data-scroll-delay="200">Slides from left</div>
//    <div data-scroll-animate="scale-in">Scales in</div>
//
// 3. React Hook:
//    import { ScrollReveal } from './hooks/useScrollAnimation';
//    <ScrollReveal animation="fade-in"><MyComponent /></ScrollReveal>
//
// 4. Haptic Feedback (React/JS):
//    import { haptic } from './lib/haptics';
//    <button onClick={() => haptic('medium')}>Tap</button>
//
// ============================================
