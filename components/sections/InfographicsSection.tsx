"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, createElement } from "react";
import {
  Globe,
  Award,
  Package,
  Truck,
  ShieldCheck,
  Clock,
  Leaf,
  Users,
  Briefcase,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  globe: Globe,
  award: Award,
  package: Package,
  truck: Truck,
  shield: ShieldCheck,
  clock: Clock,
  leaf: Leaf,
  users: Users,
  briefcase: Briefcase,
  trending: TrendingUp,
};

type Capability = {
  _id: string;
  title: string;
  description: string;
  metric?: string;
  icon?: string;
};

interface InfographicsSectionProps {
  capabilities: Capability[];
}

export default function InfographicsSection({ capabilities }: InfographicsSectionProps) {
  if (!capabilities || capabilities.length === 0) return null;

  return (
    <section className="py-16 md:py-24 relative bg-sand/90" aria-labelledby="infographics-heading">
      <div className="container mx-auto px-4 md:px-6 lg:px-10">
        <div className="text-center mb-16 md:mb-24">
          <h2
            id="infographics-heading"
            className="text-3xl md:text-4xl font-bold text-deep-brown font-heading mb-4"
          >
            Our Capabilities
          </h2>
          <p className="text-deep-brown/80 max-w-2xl mx-auto">
            Delivering excellence through a robust global network and rigorous quality standards to
            support your business growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {capabilities.map((item, index) => (
            <StatCard key={item._id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ item, index }: { item: Capability; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px" });

  const { number, suffix, prefix, isTextOnly, textMetric } = parseMetric(item.metric);

  const Icon = (item.icon && ICON_MAP[item.icon.toLowerCase()]) || getIconFromTitle(item.title);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
    >
      {/* Decorative background element */}
      <div className="absolute -right-4 -top-4 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity transform group-hover:scale-110 duration-500 rotate-12">
        {createElement(Icon, { className: "w-32 h-32 text-deep-brown" })}
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-gold/10 to-gold/20 flex items-center justify-center text-gold group-hover:from-gold group-hover:to-gold-dark group-hover:text-white transition-all duration-300 shadow-inner group-hover:shadow-lg">
            {createElement(Icon, { className: "w-7 h-7" })}
          </div>

          {item.metric ? (
            <div className="font-bold text-3xl text-deep-brown font-heading flex items-baseline">
              {isTextOnly ? (
                <span>{textMetric}</span>
              ) : (
                <>
                  {prefix}
                  <Counter from={0} to={number} duration={2} start={isInView} />
                  <span className="ml-1">{suffix}</span>
                </>
              )}
            </div>
          ) : null}
        </div>

        <h3 className="text-xl font-bold text-deep-brown mb-3 group-hover:text-gold-dark transition-colors">
          {item.title}
        </h3>
        <p className="text-deep-brown/70 text-sm leading-relaxed">{item.description}</p>
      </div>
    </motion.div>
  );
}

function Counter({
  from,
  to,
  duration,
  start,
}: {
  from: number;
  to: number;
  duration: number;
  start: boolean;
}) {
  const [count, setCount] = useState(from);

  useEffect(() => {
    if (!start) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setCount(Math.floor(from + (to - from) * easeProgress));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [from, to, duration, start]);

  return <>{count}</>;
}

function parseMetric(metric?: string) {
  if (!metric) return { number: 0, suffix: "", prefix: "", isTextOnly: true };

  const match = metric.match(/^([^0-9]*)([0-9,]+)(.*)$/);

  if (match) {
    const rawNum = (match[2] ?? "").replace(/,/g, "");
    return {
      prefix: match[1] || "",
      number: parseInt(rawNum, 10) || 0,
      suffix: match[3] || "",
      isTextOnly: false,
    };
  }

  return { number: 0, suffix: "", prefix: "", isTextOnly: true, textMetric: metric };
}

function getIconFromTitle(title: string): LucideIcon {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes("global") || lowerTitle.includes("sourc")) return Globe;
  if (lowerTitle.includes("quality") || lowerTitle.includes("iso")) return Award;
  if (lowerTitle.includes("packag")) return Package;
  if (lowerTitle.includes("distribut") || lowerTitle.includes("deliver")) return Truck;
  if (lowerTitle.includes("assurance") || lowerTitle.includes("test")) return ShieldCheck;
  if (lowerTitle.includes("experienc") || lowerTitle.includes("year")) return Clock;
  if (lowerTitle.includes("sustain")) return Leaf;
  if (lowerTitle.includes("team") || lowerTitle.includes("partner")) return Users;

  return Briefcase;
}
