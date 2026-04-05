import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/src/components/ui/button';
import { calculatorApi } from '@/src/lib/api';
import { History as HistoryIcon, Delete, Equal, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalculatorProps {
  onHistoryUpdate: (expression: string, result: string) => void;
  onOpenHistory: () => void;
  selectedHistoryItem?: { expression: string; result: string } | null;
}

const Calculator: React.FC<CalculatorProps> = ({ onHistoryUpdate, onOpenHistory, selectedHistoryItem }) => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedHistoryItem) {
      setExpression(selectedHistoryItem.expression);
      setResult(selectedHistoryItem.result);
    }
  }, [selectedHistoryItem]);

  const handleButtonClick = async (value: string) => {
    if (value === 'AC') {
      setExpression('');
      setResult('0');
    } else if (value === 'DEL') {
      setExpression((prev) => prev.slice(0, -1));
    } else if (value === '=') {
      if (!expression) return;
      setLoading(true);
      try {
        const response = await calculatorApi.calculate(expression);
        const data = await response.json();
        if (response.ok) {
          const resStr = data.result.toString();
          setResult(resStr);
          onHistoryUpdate(expression, resStr);
          // Save to backend history
          await calculatorApi.saveHistory(expression, resStr);
        } else {
          setResult('Error');
        }
      } catch (err) {
        setResult('Conn Error');
      } finally {
        setLoading(false);
      }
    } else {
      setExpression((prev) => prev + value);
    }
  };

  const buttons = [
    ['sin', 'cos', 'tan', 'AC', 'DEL'],
    ['log', 'ln', '(', ')', '÷'],
    ['√', '7', '8', '9', '×'],
    ['x²', '4', '5', '6', '-'],
    ['xʸ', '1', '2', '3', '+'],
    ['π', 'e', '0', '.', '='],
  ];

  const getButtonClass = (btn: string) => {
    if (btn === '=') return 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.5)]';
    if (['AC', 'DEL'].includes(btn)) return 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500/30';
    if (['+', '-', '×', '÷'].includes(btn)) return 'bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border-blue-600/30';
    if (isNaN(Number(btn)) && btn !== '.') return 'bg-white/5 hover:bg-white/10 text-cyan-200 border-white/10';
    return 'bg-white/10 hover:bg-white/20 text-white border-white/10';
  };

  const mapDisplayValue = (btn: string) => {
    if (btn === '×') return '*';
    if (btn === '÷') return '/';
    if (btn === 'x²') return '^2';
    if (btn === 'xʸ') return '^';
    return btn;
  };

  return (
    <div className="w-full max-w-lg space-y-6">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,212,255,0.1)]">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-cyan-400/60 text-xs font-bold tracking-widest uppercase">
            <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            Scientific Engine v2.0
          </div>
          <Button variant="ghost" size="icon" onClick={onOpenHistory} className="text-cyan-400 hover:bg-cyan-400/10">
            <HistoryIcon size={20} />
          </Button>
        </div>
        <div className="space-y-2 text-right">
          <div className="h-8 overflow-x-auto text-blue-200/60 font-mono text-lg whitespace-nowrap scrollbar-hide">
            {expression || '0'}
          </div>
          <div className="h-16 overflow-x-auto text-white font-bold text-5xl tracking-tighter whitespace-nowrap scrollbar-hide">
            {result}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {buttons.flat().map((btn) => (
          <motion.button
            key={btn}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleButtonClick(mapDisplayValue(btn))}
            className={cn(
              'flex h-14 items-center justify-center rounded-2xl border text-sm font-bold transition-all duration-200',
              getButtonClass(btn),
              btn === '=' && 'col-span-1'
            )}
          >
            {btn}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default Calculator;
