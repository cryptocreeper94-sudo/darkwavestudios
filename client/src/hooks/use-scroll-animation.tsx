import React, { useEffect, useRef, useState } from "react";

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

export function ScrollReveal({
  children,
  animation = "fade-in",
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
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
