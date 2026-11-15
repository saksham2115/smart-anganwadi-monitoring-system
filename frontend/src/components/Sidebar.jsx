import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  UtensilsCrossed,
  ActivitySquare,
  Sparkles,
  BarChart3,
  FileSpreadsheet,
  X,
  AlertTriangle,
  Building2,
  HeartHandshake
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const { isSupervisor, t, activeCenter, user } = useAuth();

  const navItems = [
    {
      to: isSupervisor ? '/supervisor' : '/',
      icon: LayoutDashboard,
      label: isSupervisor ? t('navSupervisor') : t('navDashboard'),
      badge: null
    },
    {
      to: '/children',
      icon: Users,
      label: t('navChildren'),
      badge: '22'
    },
    {
      to: '/attendance',
      icon: CalendarCheck,
      label: t('navAttendance'),
      badge: null
    },
    {
      to: '/meals',
      icon: UtensilsCrossed,
      label: t('navMeals'),
      badge: null
    },
    {
      to: '/growth',
      icon: ActivitySquare,
      label: t('navGrowth'),
      badge: 'WHO'
    },
    {
      to: '/activities',
      icon: Sparkles,
      label: t('navActivities'),
      badge: null
    },
    ...(isSupervisor ? [
      {
        to: '/supervisor',
        icon: BarChart3,
        label: t('navSupervisor'),
        badge: 'CDPO'
      }
    ] : []),
    {
      to: '/reports',
      icon: FileSpreadsheet,
      label: t('navReports'),
      badge: 'MPR'
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header-mobile">
          <div className="brand-logo-small">
            <span className="brand-emblem-small">🌱</span>
            <span className="brand-title-small">{t('appTitle')}</span>
          </div>
          <button 
            type="button" 
            className="close-sidebar-btn" 
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Worker & Center Profile Card */}
        <div className="sidebar-center-card">
          <div className="center-card-badge">
            <Building2 size={14} />
            <span>{activeCenter?.code || 'AW-102'}</span>
          </div>
          <h4 className="center-card-title">{activeCenter?.name?.replace('Anganwadi Centre', '') || 'Rampur West'}</h4>
          <p className="center-card-worker">
            <HeartHandshake size={13} />
            <span>{isSupervisor ? user?.name : (activeCenter?.workerName || 'Worker')}</span>
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="sidebar-nav">
          <div className="nav-section-title">MAIN NAVIGATION / मुख्य मेनू</div>
          <ul className="nav-list">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to} className="nav-item">
                  <NavLink
                    to={item.to}
                    end={item.to === '/' || item.to === '/supervisor'}
                    onClick={onClose}
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={20} className="nav-icon" />
                    <span className="nav-label">{item.label}</span>
                    {item.badge && (
                      <span className="nav-badge">{item.badge}</span>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ICDS Mission Poshan Banner at bottom */}
        <div className="sidebar-footer">
          <div className="poshan-banner">
            <div className="poshan-title">🇮🇳 POSHAN Abhiyaan</div>
            <div className="poshan-text">Integrated Child Development Services (ICDS) Govt. of India</div>
          </div>
        </div>
      </aside>
    </>
  );
}
