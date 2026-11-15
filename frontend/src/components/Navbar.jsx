import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Languages, 
  UserCheck, 
  ShieldAlert, 
  Menu, 
  MapPin, 
  LogOut 
} from 'lucide-react';

export default function Navbar({ onToggleSidebar }) {
  const { 
    user, 
    role, 
    isSupervisor, 
    centers, 
    currentCenterId, 
    setCurrentCenterId, 
    activeCenter, 
    language, 
    toggleLanguage, 
    t, 
    switchRole, 
    logout, 
    isOnline, 
    offlineQueueCount, 
    isSyncing, 
    triggerSync 
  } = useAuth();

  const [syncMessage, setSyncMessage] = useState('');
  const navigate = useNavigate();

  const handleManualSync = async () => {
    const res = await triggerSync();
    if (res?.synced > 0) {
      setSyncMessage(`Synced ${res.synced} items!`);
      setTimeout(() => setSyncMessage(''), 3500);
    }
  };

  return (
    <header className="top-navbar">
      <div className="navbar-container">
        {/* Left: Mobile Menu Toggle & Brand */}
        <div className="navbar-left">
          <button 
            type="button" 
            className="mobile-menu-btn"
            onClick={onToggleSidebar}
            aria-label="Toggle navigation menu"
          >
            <Menu size={22} />
          </button>

          <Link to="/" className="brand-logo">
            <div className="brand-icon-wrapper">
              <span className="brand-emblem">🌱</span>
            </div>
            <div className="brand-text">
              <span className="brand-title">{t('appTitle')}</span>
              <span className="brand-badge">PWA</span>
            </div>
          </Link>
        </div>

        {/* Center: Active Center Selector */}
        <div className="navbar-center">
          <div className="center-selector-badge">
            <MapPin size={15} className="pin-icon" />
            <select
              value={currentCenterId}
              onChange={(e) => setCurrentCenterId(e.target.value)}
              className="center-dropdown"
              title="Select Anganwadi Center"
            >
              {centers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} – {c.name.replace('Anganwadi Centre', '')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Actions, Sync, Language, User Role */}
        <div className="navbar-right">
          {/* Offline / Online Status Pill */}
          <div className={`status-pill ${isOnline ? 'online' : 'offline'}`}>
            {isOnline ? (
              <span className="status-flex">
                <Wifi size={14} className="text-emerald-500" />
                <span className="status-text">{t('online')}</span>
              </span>
            ) : (
              <span className="status-flex">
                <WifiOff size={14} className="text-amber-500" />
                <span className="status-text">{t('offline')}</span>
              </span>
            )}

            {offlineQueueCount > 0 && (
              <span className="queue-count-badge" title="Pending records waiting to sync">
                {offlineQueueCount}
              </span>
            )}

            {offlineQueueCount > 0 && (
              <button
                type="button"
                onClick={handleManualSync}
                disabled={isSyncing}
                className={`sync-btn ${isSyncing ? 'spinning' : ''}`}
                title="Sync queued offline records to server"
              >
                <RefreshCw size={13} />
                <span className="sync-btn-text">{isSyncing ? t('syncing') : t('syncNow')}</span>
              </button>
            )}
          </div>

          {syncMessage && (
            <span className="sync-success-pill">{syncMessage}</span>
          )}

          {/* Bilingual Language Switcher (EN / हिन्दी) */}
          <button 
            type="button" 
            onClick={toggleLanguage}
            className="lang-toggle-btn"
            title="Toggle Language / भाषा बदलें"
          >
            <Languages size={15} />
            <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>

          {/* 1-Click Role Switcher Pill */}
          <div className="role-chip" onClick={switchRole} title="Click to instantly toggle between Worker & Supervisor view">
            <div className={`role-avatar ${isSupervisor ? 'supervisor' : 'worker'}`}>
              {isSupervisor ? <ShieldAlert size={15} /> : <UserCheck size={15} />}
            </div>
            <div className="role-info-text">
              <span className="user-name">{user?.name || 'Worker'}</span>
              <span className="role-label">
                {isSupervisor ? 'Supervisor (CDPO)' : 'Anganwadi Worker'} ⇄
              </span>
            </div>
          </div>

          {/* Logout button */}
          <button
            type="button"
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="logout-icon-btn"
            title={t('logout')}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
