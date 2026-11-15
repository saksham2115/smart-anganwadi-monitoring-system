import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  CalendarCheck, 
  UtensilsCrossed, 
  Activity, 
  Sparkles, 
  BarChart3, 
  WifiOff, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function Home() {
  const { user, isSupervisor } = useAuth();

  return (
    <div className="page-container">
      <div className="dashboard-hero-card">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="live-dot"></span>
            <span>Digital India • POSHAN Abhiyaan (ICDS)</span>
          </div>
          <h1 className="hero-title">Smart Aanganbadi System</h1>
          <p className="hero-subtitle">
            A Progressive Web App (PWA) digitizing attendance, nutrition distribution, WHO child growth monitoring, and pre-school education.
          </p>
        </div>

        <div className="hero-actions">
          <Link to={isSupervisor ? "/supervisor" : "/"} className="btn-primary-gradient">
            <span>Open {isSupervisor ? 'Supervisor Hub' : 'Worker Console'}</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      <div className="metrics-grid mb-6">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">1. Attendance Tracking</span>
            <CalendarCheck size={20} className="text-emerald-600" />
          </div>
          <p className="text-sm text-slate-600 mt-2">
            1-tap digital attendance recording with automated 3-day chronic absence drop-out alerts.
          </p>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">2. Nutrition & Meals</span>
            <UtensilsCrossed size={20} className="text-amber-600" />
          </div>
          <p className="text-sm text-slate-600 mt-2">
            Supplementary Nutrition Programme (SNP) tracking for calories, protein, and Take-Home Ration (THR).
          </p>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">3. WHO Child Growth</span>
            <Activity size={20} className="text-blue-600" />
          </div>
          <p className="text-sm text-slate-600 mt-2">
            WHO Age & Sex-Specific Growth Standards with instant SAM/MAM malnutrition classification & referral.
          </p>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">4. Offline-First PWA</span>
            <WifiOff size={20} className="text-purple-600" />
          </div>
          <p className="text-sm text-slate-600 mt-2">
            Workers can enter daily data in remote areas without internet; synchronizes automatically when online.
          </p>
        </div>
      </div>
    </div>
  );
}
