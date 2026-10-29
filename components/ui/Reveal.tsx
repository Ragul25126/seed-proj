'use client';
import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';

export function Reveal({
  children,
  delay = 0,
  className,
  as: As = 'div',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: any;
}) {
  const reduce = useReducedMotion();
  const MotionTag = As === 'div' ? motion.div : (motion as any)[As] || motion.div;
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}

export function Stagger({
  children,
  className,
  delay = 0.08,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '0px 0px -40px 0px' }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: reduce ? 0 : 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {children}
    </motion.div>
  );
}
