import React from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, Target, Zap, TrendingUp } from 'lucide-react';

const Home = () => {
  return (
    <div className="container mt-8 animate-fade-in">
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto', padding: '4rem 0' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', lineHeight: '1.2' }}>
          Master Your Exams with <br />
          <span className="text-gradient">AI-Powered Quizzes</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
          Stop searching for mock tests. Let our advanced AI generate personalized, 
          high-quality questions for SSC, UPSC, JEE, and more instantly.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
            Get Started Free
          </Link>
          <Link to="/login" className="btn btn-secondary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
            Login
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '4rem', paddingBottom: '4rem' }}>
        <div className="glass-panel text-center">
          <div style={{ background: 'rgba(99, 102, 241, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <BrainCircuit color="var(--primary-color)" size={32} />
          </div>
          <h3 className="mb-2">AI Generation</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Smart multiple-choice questions created dynamically based on your selected exam and topic.</p>
        </div>

        <div className="glass-panel text-center">
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Target color="var(--accent-success)" size={32} />
          </div>
          <h3 className="mb-2">Targeted Practice</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Focus on specific subjects and difficulty levels to improve exactly where you need it.</p>
        </div>

        <div className="glass-panel text-center">
          <div style={{ background: 'rgba(236, 72, 153, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Zap color="var(--secondary-color)" size={32} />
          </div>
          <h3 className="mb-2">Instant Feedback</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Get immediate scores, detailed explanations for every answer, and performance analytics.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
