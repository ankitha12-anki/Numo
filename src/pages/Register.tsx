import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import AuthCard from '@/src/components/auth/AuthCard';
import { authApi } from '@/src/lib/api';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirm) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authApi.register(formData);
      const data = await response.json();

      if (response.ok) {
        // Automatically login or redirect to login
        navigate('/login');
      } else {
        setError(JSON.stringify(data) || 'Registration failed');
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
    <AuthCard title="Create Account" description="Join the Numo community">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-2 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded">{error}</div>}
        <div className="space-y-2">
          <Label htmlFor="username" className="text-blue-100">Username</Label>
          <Input
            id="username"
            placeholder="numo_user"
            required
            value={formData.username}
            onChange={handleChange}
            className="border-white/10 bg-white/5 text-white placeholder:text-white/20 focus:border-cyan-400 focus:ring-cyan-400/20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-blue-100">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            required
            value={formData.email}
            onChange={handleChange}
            className="border-white/10 bg-white/5 text-white placeholder:text-white/20 focus:border-cyan-400 focus:ring-cyan-400/20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" size="sm" className="text-blue-100">Password</Label>
          <Input
            id="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="border-white/10 bg-white/5 text-white placeholder:text-white/20 focus:border-cyan-400 focus:ring-cyan-400/20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password_confirm" size="sm" className="text-blue-100">Confirm Password</Label>
          <Input
            id="password_confirm"
            type="password"
            required
            value={formData.password_confirm}
            onChange={handleChange}
            className="border-white/10 bg-white/5 text-white placeholder:text-white/20 focus:border-cyan-400 focus:ring-cyan-400/20"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 font-bold text-white hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
        >
          {loading ? 'Creating account...' : 'Register'}
        </Button>
        <div className="text-center text-sm text-blue-200/60">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">
            Login
          </Link>
        </div>
      </form>
    </AuthCard>
  );
};

export default Register;
