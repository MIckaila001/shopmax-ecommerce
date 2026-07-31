"use client";

import { useEffect, useRef, useState } from "react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  stagger?: boolean;
  delay?: number;
  as?: keyof JSX.IntrinsicElements;
}

/**
 * Composant qui anime ses enfants au scroll
 * Utilise Intersection Observer pour declencher l'animation
 */
export function Reveal({
  children,
  className = "",
  stagger = false,
  delay = 0,
  as: Component = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(element);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const classes = [
    stagger ? "reveal-stagger" : "reveal",
    isVisible ? "visible" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component
      ref={ref as any}
      className={classes}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Component>
  );
}
