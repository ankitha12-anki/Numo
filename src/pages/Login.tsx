import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import AuthCard from '@/src/components/auth/AuthCard';
import { authApi } from '@/src/lib/api';

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authApi.login(formData);
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.access);
        localStorage.setItem('refresh', data.refresh);
        navigate('/dashboard');
      } else {
        setError(data.detail || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection failed. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <AuthCard title="Welcome Back" description="Login to your Numo account">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-2 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded">{error}</div>}
        <div className="space-y-2">
          <Label htmlFor="username" className="text-blue-100">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="Username"
            required
            value={formData.username}
            onChange={handleChange}
            className="border-white/10 bg-white/5 text-white placeholder:text-white/20 focus:border-cyan-400 focus:ring-cyan-400/20"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-blue-100">Password</Label>
            <Link to="/forgot-password" size="sm" className="text-xs text-cyan-400 hover:text-cyan-300">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="border-white/10 bg-white/5 text-white placeholder:text-white/20 focus:border-cyan-400 focus:ring-cyan-400/20"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 font-bold text-white hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
        <div className="text-center text-sm text-blue-200/60">
          Don't have an account?{' '}
          <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-medium">
            Register
          </Link>
        </div>
      </form>
    </AuthCard>
  );
};

export default Login;
