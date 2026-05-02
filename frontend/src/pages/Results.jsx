import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Trophy, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { result, quiz, answers } = location.state || {};

  if (!result || !quiz) {
    return (
      <div className="container mt-8 text-center">
        <h2>No results found.</h2>
        <button className="btn btn-primary mt-4" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  const percentage = Math.round((result.score / result.total) * 100);
  
  let resultColor = 'var(--accent-error)';
  if (percentage >= 80) resultColor = 'var(--accent-success)';
  else if (percentage >= 50) resultColor = '#fbbf24'; // Yellow

  return (
    <div className="container mt-8 animate-fade-in" style={{ maxWidth: '800px', paddingBottom: '4rem' }}>
      
      <div style={{ marginBottom: '2rem' }}>
        <button onClick={() => navigate('/dashboard')} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
      </div>

      <div className="glass-panel text-center mb-8" style={{ borderTop: `4px solid ${resultColor}` }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
          <Trophy color={resultColor} size={40} />
        </div>
        <h2 style={{ fontSize: '2.5rem', margin: '0.5rem 0' }}>{result.score} / {result.total}</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>You scored {percentage}%</p>
        
        {result.weakAreas && result.weakAreas.length > 0 && (
          <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', display: 'inline-block', textAlign: 'left' }}>
            <h4 style={{ color: 'var(--accent-error)', marginBottom: '0.5rem' }}>Areas for Improvement:</h4>
            <ul style={{ color: 'var(--text-main)', paddingLeft: '1.5rem', fontSize: '0.9rem' }}>
              {result.weakAreas.map((area, idx) => <li key={idx}>{area}</li>)}
            </ul>
          </div>
        )}
      </div>

      <h3 className="mb-4">Detailed Review</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {quiz.questions.map((q, idx) => {
          const userAnswer = answers[q._id];
          const isCorrect = userAnswer === q.correctAnswer;
          
          return (
            <div key={idx} className="glass-panel" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: isCorrect ? 'var(--accent-success)' : 'var(--accent-error)' }} />
              
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ marginTop: '0.2rem' }}>
                  {isCorrect ? <CheckCircle color="var(--accent-success)" size={24} /> : <XCircle color="var(--accent-error)" size={24} />}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>{idx + 1}. {q.question}</h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                    {q.options.map((opt, i) => {
                      let bgColor = 'rgba(15, 23, 42, 0.6)';
                      let borderColor = 'var(--glass-border)';
                      
                      if (opt === q.correctAnswer) {
                        bgColor = 'rgba(16, 185, 129, 0.1)';
                        borderColor = 'var(--accent-success)';
                      } else if (opt === userAnswer && !isCorrect) {
                        bgColor = 'rgba(239, 68, 68, 0.1)';
                        borderColor = 'var(--accent-error)';
                      }

                      return (
                        <div key={i} style={{ padding: '0.75rem', background: bgColor, border: `1px solid ${borderColor}`, borderRadius: '6px', fontSize: '0.9rem' }}>
                          {opt}
                        </div>
                      );
                    })}
                  </div>
                  
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                    <strong style={{ color: 'var(--primary-color)' }}>Explanation:</strong> {q.explanation}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default Results;
