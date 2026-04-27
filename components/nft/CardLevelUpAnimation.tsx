"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Sparkles, Trophy, Zap } from "lucide-react";

interface CardLevelUpAnimationProps {
  previousLevel: number;
  newLevel: number;
  previousPrestige?: number;
  newPrestige?: number;
  xpGained: number;
  onComplete?: () => void;
  duration?: number;
}

export function CardLevelUpAnimation({
  previousLevel,
  newLevel,
  previousPrestige = 0,
  newPrestige = 0,
  xpGained,
  onComplete,
  duration = 3000,
}: CardLevelUpAnimationProps) {
  const [show, setShow] = useState(true);
  const isPrestige = newPrestige > previousPrestige;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  const particles = Array.from({ length: 20 }, (_, i) => i);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          {/* Animated Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {particles.map((i) => (
              <motion.div
                key={i}
                initial={{
                  opacity: 0,
                  scale: 0,
                  x: "50%",
                  y: "50%",
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                }}
                transition={{
                  duration: 2,
                  delay: Math.random() * 0.5,
                  ease: "easeOut",
                }}
                className="absolute"
              >
                <Star className="h-6 w-6 text-yellow-400" />
              </motion.div>
            ))}
          </div>

          {/* Main Animation Container */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", damping: 12, stiffness: 200 }}
            className="relative z-10"
          >
            {/* Outer Glow Ring */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 via-purple-500 to-blue-500 blur-xl"
            />

            {/* Main Circle */}
            <div className="relative flex h-64 w-64 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 via-purple-500 to-blue-500 p-1">
              <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-gray-900">
                {/* Sparkles Icon */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-12 w-12 text-yellow-400" />
                </motion.div>

                {/* Level Up Text */}
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-4 text-3xl font-bold text-white"
                >
                  LEVEL UP!
                </motion.h2>

                {/* Level Display */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="mt-2 flex items-center gap-2"
                >
                  <Star className="h-8 w-8 text-yellow-400" />
                  <span className="text-5xl font-bold text-yellow-400">
                    {newLevel}
                  </span>
                </motion.div>

                {/* XP Gained */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-4 text-lg text-gray-300"
                >
                  +{xpGained.toLocaleString()} XP
                </motion.p>

                {/* Prestige Badge */}
                {isPrestige && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-4 flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 px-4 py-2"
                  >
                    <Trophy className="h-5 w-5 text-white" />
                    <span className="font-bold text-white">
                      PRESTIGE {newPrestige}!
                    </span>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Bonus Stats Display */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-20 z-10 flex gap-4"
          >
            <div className="flex items-center gap-2 rounded-lg bg-green-500/20 px-4 py-2 backdrop-blur-sm">
              <Zap className="h-5 w-5 text-green-400" />
              <span className="text-sm font-semibold text-green-400">
                Odds Bonus Increased!
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-blue-500/20 px-4 py-2 backdrop-blur-sm">
              <Trophy className="h-5 w-5 text-blue-400" />
              <span className="text-sm font-semibold text-blue-400">
                Spin Bonus Increased!
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Simpler inline version for use within cards
interface InlineLevelUpAnimationProps {
  show: boolean;
  level: number;
  xpGained: number;
}

export function InlineLevelUpAnimation({
  show,
  level,
  xpGained,
}: InlineLevelUpAnimationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400/90 via-purple-500/90 to-blue-500/90"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
            className="flex flex-col items-center gap-2 text-white"
          >
            <Star className="h-10 w-10" />
            <span className="text-2xl font-bold">Level {level}!</span>
            <span className="text-sm">+{xpGained} XP</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
