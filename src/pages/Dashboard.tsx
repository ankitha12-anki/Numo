import React, { useState, useEffect } from 'react';
import Calculator from '@/src/components/calculator/Calculator';
import HistoryPanel from '@/src/components/calculator/HistoryPanel';
import { motion } from 'framer-motion';
import { LogOut, User, Settings } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { calculatorApi } from '@/src/lib/api';

interface HistoryItem {
  id: string;
  expression: string;
  result: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchHistory();
  }, [navigate]);

  const fetchHistory = async () => {
    try {
      const response = await calculatorApi.getHistory();
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (err) {
      console.error('Failed to fetch history');
    }
  };

  const handleHistoryUpdate = (expression: string, result: string) => {
    // This is called locally when a calculation finishes. 
    // We already save it to the backend in Calculator.tsx.
    // We just refresh the local list or add it.
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      expression,
      result,
    };
    setHistory((prev) => [newItem, ...prev]);
  };

  const handleSelectItem = (item: HistoryItem) => {
    setSelectedItem(item);
    setIsHistoryOpen(false);
  };

  const handleClearHistory = async () => {
    try {
      await calculatorApi.deleteHistory();
      setHistory([]);
    } catch (err) {
      console.error('Failed to clear history');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    navigate('/login');
  };

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <header className="fixed top-0 left-0 right-0 z-30 border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]">
              <span className="font-black text-white italic">N</span>
            </div>
            <h1 className="text-xl font-black tracking-tighter text-white">
              NUMO<span className="text-cyan-400">.COM</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 md:flex">
              <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <User size={16} className="text-blue-200" />
              </div>
              <span className="text-sm font-medium text-blue-100">User</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-white/60 hover:text-red-400 hover:bg-red-400/10"
            >
              <LogOut size={20} />
            </Button>
          </div>
        </div>
      </header>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mt-20 flex w-full flex-col items-center"
      >
        <Calculator
          onHistoryUpdate={handleHistoryUpdate}
          onOpenHistory={() => setIsHistoryOpen(true)}
          selectedHistoryItem={selectedItem}
        />
      </motion.div>

      <HistoryPanel
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClear={handleClearHistory}
        onSelectItem={handleSelectItem}
      />

      <footer className="fixed bottom-4 text-xs text-blue-200/40 font-mono uppercase tracking-[0.3em]">
        © 2026 Numo Scientific Systems // All Rights Reserved
      </footer>
    </div>
  );
};

export default Dashboard;
