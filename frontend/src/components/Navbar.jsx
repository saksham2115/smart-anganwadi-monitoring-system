import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrainCircuit, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
        <Link to="/" className="logo">
          <BrainCircuit color="var(--primary-color)" size={28} />
          <span className="text-gradient">PrepAI</span>
        </Link>
        
        <div className="nav-links">
          {token ? (
            <>
              <Link to="/dashboard" className="btn btn-secondary">Dashboard</Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: '1rem' }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={18} /> {user?.name}
                </span>
                <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.5rem' }}>
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
