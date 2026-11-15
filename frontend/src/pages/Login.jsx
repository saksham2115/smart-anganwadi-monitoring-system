import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';
import { 
  UserCheck, 
  ShieldAlert, 
  Lock, 
  Mail, 
  Sparkles, 
  ArrowRight, 
  Baby, 
  HeartHandshake,
  CheckCircle2,
  Building2
} from 'lucide-react';

export default function Login() {
  const { loginAsRole, setUser } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCustomLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await authApi.login({ email, password });
      if (res && res.user) {
        setUser(res.user);
        if (res.token) localStorage.setItem('anganwadi_token', res.token);
        navigate(res.user.role === 'supervisor' ? '/supervisor' : '/');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role) => {
    setLoading(true);
    try {
      await loginAsRole(role);
      navigate(role === 'supervisor' ? '/supervisor' : '/');
    } catch (err) {
      setError('Failed to log in with quick demo account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-card-container">
        {/* Brand Banner */}
        <div className="login-brand-header">
          <div className="login-logo-circle">
            <span className="text-3xl">🌱</span>
          </div>
          <h1 className="login-title">Smart Anganwadi</h1>
          <p className="login-subtitle">
            Digital Child Development & Centre Monitoring Platform (PWA)
          </p>
          <div className="poshan-tag">
            <span>🇮🇳 POSHAN Abhiyaan • ICDS Digital Initiative</span>
          </div>
        </div>

        {error && (
          <div className="alert-callout critical mb-4">
            <span>{error}</span>
          </div>
        )}

        {/* 1-Click Fast Login for Evaluators & Workers */}
        <div className="demo-login-box">
          <div className="demo-login-heading">
            <Sparkles size={16} className="text-amber-500" />
            <span>Fast 1-Click Demo Login (त्वरित प्रवेश)</span>
          </div>

          <div className="demo-buttons-grid">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickLogin('worker')}
              className="demo-role-btn worker"
            >
              <div className="role-btn-icon bg-emerald-100 text-emerald-700">
                <UserCheck size={20} />
              </div>
              <div className="role-btn-text">
                <div className="role-btn-title">Anganwadi Worker</div>
                <div className="role-btn-sub">Smt. Meena Kumari (AW-102 Rampur)</div>
              </div>
              <ArrowRight size={18} className="role-btn-arrow" />
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickLogin('supervisor')}
              className="demo-role-btn supervisor"
            >
              <div className="role-btn-icon bg-indigo-100 text-indigo-700">
                <ShieldAlert size={20} />
              </div>
              <div className="role-btn-text">
                <div className="role-btn-title">Supervisor / CDPO</div>
                <div className="role-btn-sub">Dr. Ananya Sharma (Multi-Centre Oversight)</div>
              </div>
              <ArrowRight size={18} className="role-btn-arrow" />
            </button>
          </div>
        </div>

        <div className="divider-text">
          <span>OR SIGN IN WITH CREDENTIALS</span>
        </div>

        {/* Email / Password Form */}
        <form onSubmit={handleCustomLogin} className="login-form">
          <div className="form-group mb-4">
            <label className="form-label">Email Address (ईमेल)</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="worker@anganwadi.gov.in"
                className="form-input with-left-icon"
              />
            </div>
          </div>

          <div className="form-group mb-6">
            <label className="form-label">Password (पासवर्ड)</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input with-left-icon"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-base"
          >
            {loading ? 'Signing In...' : 'Sign In to Portal'}
          </button>
        </form>

        {/* PWA Offline Highlight */}
        <div className="pwa-highlight-footer">
          <div className="pwa-feature-badge">
            <CheckCircle2 size={14} className="text-emerald-600" />
            <span>Progressive Web App (PWA): Works fully offline with local sync!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
