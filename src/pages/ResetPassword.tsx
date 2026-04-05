import React from 'react';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { AuthLayout } from '@/src/components/auth/AuthLayout';
import { Link, useNavigate } from 'react-router-dom';

export const ResetPassword = () => {
  const navigate = useNavigate();

  return (
    <AuthLayout 
      title="Reset Password" 
      subtitle="Choose a strong new password"
    >
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              className="pl-10 h-12 rounded-xl bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              id="confirm-password" 
              type="password" 
              placeholder="••••••••" 
              className="pl-10 h-12 rounded-xl bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        <Button 
          onClick={() => navigate('/login')}
          className="w-full h-12 rounded-xl text-lg font-semibold shadow-lg shadow-primary/20 group"
        >
          Reset Password
          <CheckCircle2 className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
        </Button>
      </form>
    </AuthLayout>
  );
};
