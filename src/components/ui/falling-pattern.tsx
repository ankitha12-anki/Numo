import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const symbols = ['+', '-', '×', '÷', '√', 'π', 'Σ', '∫', 'log', 'sin', 'cos', 'tan', 'x²', 'yˣ', '(', ')', '!', 'ln'];

export const FallingPattern = () => {
  const [particles, setParticles] = useState<{ id: number; x: number; symbol: string; duration: number; delay: number; size: number }[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      duration: 15 + Math.random() * 20,
      delay: Math.random() * -20,
      size: 14 + Math.random() * 24,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: -100, opacity: 0 }}
          animate={{ 
            y: ['0vh', '110vh'],
            opacity: [0, 0.15, 0.15, 0],
            rotate: [0, 360]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear"
          }}
          className="absolute text-primary/20 font-mono select-none"
          style={{ 
            left: `${p.x}%`,
            fontSize: `${p.size}px`
          }}
        >
          {p.symbol}
        </motion.div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
    </div>
  );
};
