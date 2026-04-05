import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/src/components/ui/scroll-area';
import { Button } from '@/src/components/ui/button';
import { Trash2, History as HistoryIcon, X } from 'lucide-react';

interface HistoryItem {
  id: string;
  expression: string;
  result: string;
}

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onClear: () => void;
  onSelectItem: (item: HistoryItem) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ isOpen, onClose, history, onClear, onSelectItem }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-80 border-l border-white/10 bg-black/80 backdrop-blur-2xl shadow-2xl"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-white/10 p-4">
                <div className="flex items-center gap-2 text-cyan-400">
                  <HistoryIcon size={20} />
                  <h2 className="text-lg font-bold tracking-tight">History</h2>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="text-white/60 hover:text-white">
                  <X size={20} />
                </Button>
              </div>
              <ScrollArea className="flex-1 p-4">
                {history.length === 0 ? (
                  <div className="flex h-40 flex-col items-center justify-center text-white/40">
                    <p>No history yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {history.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group relative cursor-pointer rounded-lg border border-white/5 bg-white/5 p-3 transition-colors hover:bg-white/10"
                        onClick={() => onSelectItem(item)}
                      >
                        <div className="text-xs text-blue-200/60">{item.expression}</div>
                        <div className="text-lg font-bold text-cyan-400">= {item.result}</div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </ScrollArea>
              <div className="border-t border-white/10 p-4">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-red-400 hover:bg-red-400/10 hover:text-red-300"
                  onClick={onClear}
                  disabled={history.length === 0}
                >
                  <Trash2 size={18} />
                  Clear History
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default HistoryPanel;
