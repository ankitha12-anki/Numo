import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import AuthCard from '@/src/components/auth/AuthCard';
import { authApi } from '@/src/lib/api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [passwords, setPasswords] = useState({ new_password: '', password_confirm: '' });

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authApi.forgotPassword(email);
      if (response.ok) {
        setStep('otp');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Connection failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto focus next
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const otpCode = otp.join('');
      const response = await authApi.verifyOtp(email, otpCode);
      if (response.ok) {
        setStep('reset');
      } else {
        setError('Invalid or expired OTP');
      }
    } catch (err) {
      setError('Connection failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new_password !== passwords.password_confirm) {
      setError("Passwords don't match");
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await authApi.resetPassword({
        email,
        otp_code: otp.join(''),
        ...passwords
      });
      if (response.ok) {
        alert('Password reset successful! Please login.');
        navigate('/login');
      } else {
        setError('Failed to reset password');
      }
    } catch (err) {
      setError('Connection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title={step === 'email' ? 'Forgot Password' : step === 'otp' ? 'Verify OTP' : 'Reset Password'}
      description={
        step === 'email' ? 'Enter your email to receive a reset code' : 
        step === 'otp' ? 'Enter the 6-digit code sent to your email' :
        'Enter your new password below'
      }
    >
      {error && <div className="p-2 mb-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded">{error}</div>}
      
      {step === 'email' && (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-blue-100">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-white/10 bg-white/5 text-white placeholder:text-white/20 focus:border-cyan-400 focus:ring-cyan-400/20"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 font-bold text-white hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
          >
            {loading ? 'Sending...' : 'Send Reset Code'}
          </Button>
        </form>
      )}

      {step === 'otp' && (
        <form onSubmit={handleOtpSubmit} className="space-y-4">
          <div className="flex justify-between gap-2">
            {otp.map((val, i) => (
              <Input
                key={i}
                id={`otp-${i}`}
                type="text"
                maxLength={1}
                value={val}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                className="h-12 w-10 border-white/10 bg-white/5 text-center text-xl font-bold text-white focus:border-cyan-400 focus:ring-cyan-400/20"
                required
              />
            ))}
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 font-bold text-white hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </Button>
        </form>
      )}

      {step === 'reset' && (
        <form onSubmit={handleResetSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new_password" size="sm" className="text-blue-100">New Password</Label>
            <Input
              id="new_password"
              type="password"
              required
              value={passwords.new_password}
              onChange={(e) => setPasswords({...passwords, new_password: e.target.value})}
              className="border-white/10 bg-white/5 text-white placeholder:text-white/20 focus:border-cyan-400 focus:ring-cyan-400/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password_confirm" size="sm" className="text-blue-100">Confirm Password</Label>
            <Input
              id="password_confirm"
              type="password"
              required
              value={passwords.password_confirm}
              onChange={(e) => setPasswords({...passwords, password_confirm: e.target.value})}
              className="border-white/10 bg-white/5 text-white placeholder:text-white/20 focus:border-cyan-400 focus:ring-cyan-400/20"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 font-bold text-white hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
          >
            {loading ? 'Resetting...' : 'Update Password'}
          </Button>
        </form>
      )}

      <div className="mt-4 text-center text-sm">
        <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">
          Back to Login
        </Link>
      </div>
    </AuthCard>
  );
};

export default ForgotPassword;
