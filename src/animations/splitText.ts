import SplitType from "split-type";
import { gsap } from "./gsap";

export function splitAndAnimate(element: HTMLElement | string, options?: {
  types?: "chars" | "words" | "lines",
  delay?: number,
  stagger?: number,
  duration?: number,
  y?: number,
  opacity?: number,
  ease?: string,
  scrollTrigger?: any
}) {
  const text = new SplitType(element, { types: options?.types || "chars,words" });
  
  const target = options?.types === "words" ? text.words : text.chars;
  
  if (!target || target.length === 0) return null;

  gsap.fromTo(target, 
    { 
      y: options?.y !== undefined ? options.y : 40,
      opacity: options?.opacity !== undefined ? options.opacity : 0,
      rotateX: 20
    },
    {
      y: 0,
      opacity: 1,
      rotateX: 0,
      duration: options?.duration || 1,
      stagger: options?.stagger || 0.05,
      ease: options?.ease || "power3.out",
      delay: options?.delay || 0,
      scrollTrigger: options?.scrollTrigger
    }
  );

  return text;
}
