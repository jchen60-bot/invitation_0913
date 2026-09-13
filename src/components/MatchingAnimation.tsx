import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { Sparkles, MoveHorizontal } from 'lucide-react';

interface MatchingAnimationProps {
  isMatched: boolean;
  onMatch: () => void;
}

export const MatchingAnimation: React.FC<MatchingAnimationProps> = ({ isMatched, onMatch }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for interactive dragging on touch/mouse
  const dragXLeft = useMotionValue(0);
  const dragXRight = useMotionValue(0);

  // Guide opacity decreases when matched
  const hintOpacity = useTransform(dragXLeft, [0, 40], [0.8, 0.2]);

  const handleDragEndLeft = () => {
    if (isMatched) return;
    // If dragged sufficiently to the right, trigger match
    if (dragXLeft.get() > 35) {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([20, 30, 20]);
      }
      onMatch();
    }
  };

  const handleDragEndRight = () => {
    if (isMatched) return;
    // If dragged sufficiently to the left, trigger match
    if (dragXRight.get() < -35) {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([20, 30, 20]);
      }
      onMatch();
    }
  };

  return (
    <div
      className="relative w-full h-48 sm:h-56 md:h-64 flex flex-col items-center justify-center cursor-pointer select-none overflow-visible my-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={!isMatched ? onMatch : undefined}
      title={!isMatched ? 'Drag or tap to match!' : 'Matched!'}
    >
      {/* Dynamic Ambient Glow Backdrop */}
      <div
        className={`absolute inset-0 transition-all duration-700 pointer-events-none flex items-center justify-center ${
          isMatched ? 'opacity-100 scale-110' : 'opacity-40 scale-95'
        }`}
      >
        <div className="w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-gradient-to-tr from-rose-500/25 via-fuchsia-500/20 to-indigo-500/25 blur-3xl" />
      </div>

      {/* Floating Shapes Stage */}
      <div className="relative flex items-center justify-center w-full max-w-xs sm:max-w-sm h-36 sm:h-44">
        {/* Shape A (Left: Coral / Warm Salmon with puzzle connector) */}
        <motion.div
          drag={!isMatched ? 'x' : false}
          dragConstraints={{ left: -10, right: 70 }}
          dragElastic={0.2}
          style={{ x: !isMatched ? dragXLeft : 0 }}
          onDragEnd={handleDragEndLeft}
          animate={
            isMatched
              ? {
                  x: 0,
                  y: 0,
                  rotate: 0,
                  scale: 1,
                  transition: { type: 'spring', stiffness: 360, damping: 16 },
                }
              : {
                  x: [-36, -44, -34, -36],
                  y: [0, -6, 8, 0],
                  rotate: [-6, -10, -3, -6],
                  transition: { duration: 4.2, repeat: Infinity, ease: 'easeInOut' },
                }
          }
          whileHover={!isMatched ? { scale: 1.05 } : undefined}
          whileTap={!isMatched ? { scale: 0.98 } : undefined}
          className="absolute z-10 flex items-center justify-center touch-pan-y"
        >
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-rose-400 via-rose-500 to-rose-600 shadow-2xl shadow-rose-500/40 flex items-center justify-center border-2 border-white/20">
            {/* Puzzle connector tab on right */}
            <div className="absolute -right-2 sm:-right-3 w-5 sm:w-6 h-8 sm:h-10 bg-gradient-to-r from-rose-500 to-rose-600 rounded-r-xl shadow-md border-y border-r border-white/20" />
            
            <div className="text-center">
              <span className="text-white text-2xl sm:text-3xl font-black block leading-none">✦</span>
              <span className="text-[10px] sm:text-xs font-bold text-white/80 uppercase tracking-widest mt-1 block">
                DONOR
              </span>
            </div>
          </div>
        </motion.div>

        {/* Shape B (Right: Electric Indigo / Cobalt with puzzle socket) */}
        <motion.div
          drag={!isMatched ? 'x' : false}
          dragConstraints={{ left: -70, right: 10 }}
          dragElastic={0.2}
          style={{ x: !isMatched ? dragXRight : 0 }}
          onDragEnd={handleDragEndRight}
          animate={
            isMatched
              ? {
                  x: 0,
                  y: 0,
                  rotate: 0,
                  scale: 1,
                  transition: { type: 'spring', stiffness: 360, damping: 16 },
                }
              : {
                  x: [36, 44, 34, 36],
                  y: [0, 8, -6, 0],
                  rotate: [6, 10, 3, 6],
                  transition: { duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 },
                }
          }
          whileHover={!isMatched ? { scale: 1.05 } : undefined}
          whileTap={!isMatched ? { scale: 0.98 } : undefined}
          className="absolute z-10 flex items-center justify-center touch-pan-y"
        >
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 shadow-2xl shadow-indigo-500/40 flex items-center justify-center border-2 border-white/20">
            {/* Puzzle socket indent on left */}
            <div className="absolute -left-1 sm:-left-1.5 w-4 sm:w-5 h-8 sm:h-10 bg-[#0d0d12]/50 rounded-r-xl" />

            <div className="text-center">
              <span className="text-white text-2xl sm:text-3xl font-black block leading-none">★</span>
              <span className="text-[10px] sm:text-xs font-bold text-white/80 uppercase tracking-widest mt-1 block">
                PATIENT
              </span>
            </div>
          </div>
        </motion.div>

        {/* Central Match Star Sparkle when snapped */}
        {isMatched && (
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: -45 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 500, damping: 18 }}
            className="absolute z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-amber-300 to-yellow-200 text-slate-950 font-black text-base flex items-center justify-center shadow-xl shadow-amber-300/60 border-2 border-white"
          >
            <Sparkles className="w-5 h-5 fill-current" />
          </motion.div>
        )}
      </div>

      {/* Interactive Micro-hint (Swipe / Drag or Tap) */}
      {!isMatched && (
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.2, repeat: Infinity }}
          className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium tracking-wide text-white/50 bg-white/5 px-3 py-1 rounded-full border border-white/5 mt-1"
        >
          <MoveHorizontal className="w-3.5 h-3.5 text-rose-400" />
          <span>drag shapes together or tap to match</span>
        </motion.div>
      )}
    </div>
  );
};
