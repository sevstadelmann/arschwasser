import React, { useRef } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame
} from 'framer-motion';
import { wrap } from '@motionone/utils';

interface MarqueeProps {
  text: string;
  className?: string;
  baseVelocity?: number;
}

export const Marquee: React.FC<MarqueeProps> = ({ text, className = "", baseVelocity = 5 }) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 400,
    stiffness: 50
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 600], [0, 5], {
    clamp: false
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef<number>(1);

  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 2000);

    /**
     * This is what changes the direction of the scroll once we
     * switch scrolling directions.
     */
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className={`overflow-hidden whitespace-nowrap py-4 flex ${className}`}>
      <motion.div className="flex flex-nowrap" style={{ x }}>
        {Array(8).fill(text).map((item, i) => (
           <span key={i} className="text-4xl md:text-6xl brand-font tracking-widest px-4 block">
             {item} •
           </span>
        ))}
      </motion.div>
    </div>
  );
};