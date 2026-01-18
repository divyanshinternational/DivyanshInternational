"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  duration?: number;
  type?: "word" | "line" | "char";
  as?: React.ElementType;
}

export default function TextReveal({
  children,
  className,
  delay = 0,
  duration = 0.5,
  as: Component = "p",
}: TextRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });

  const words = children.split(" ");

  // Variants for the container
  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (_i = 1) => ({
      opacity: 1,
      transition: {
        staggerChildren: 0.12, // Slow, deliberate stagger for "reading" feel
        delayChildren: delay,
      },
    }),
  };

  // Variants for each word
  const child: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(5px)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
        duration: duration,
      },
    },
  };

  return (
    <Component
      ref={ref}
      className={cn("inline-block", className)} // Ensure inline-block for proper layout if needed
    >
      <motion.span
        variants={container}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="inline-block"
      >
        {words.map((word, index) => (
          <motion.span
            key={index}
            variants={child}
            className="inline-block mr-[0.25em] last:mr-0" // Manage spacing manually to keep inline flow
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
      {/* Screen reader only text for accessibility */}
      <span className="sr-only">{children}</span>
    </Component>
  );
}
