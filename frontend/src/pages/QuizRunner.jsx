import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Timer, CheckCircle } from 'lucide-react';

const QuizRunner = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { quiz } = location.state || {};
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!quiz) {
      navigate('/dashboard');
      return;
    }
    // Set timer based on number of questions (e.g. 1 min per question)
    setTimeLeft(quiz.questions.length * 60);
  }, [quiz, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) {
        if(quiz && Object.keys(answers).length > 0) {
            handleSubmit();
        }
        return;
    }
    
    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const handleOptionSelect = (questionId, option) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/quiz/${quiz._id}/submit`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ answers })
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Failed to submit quiz');

      // Navigate to Results
      navigate('/results', { state: { result: data, quiz, answers } });
    } catch (err) {
      console.error(err);
      alert(err.message);
      setLoading(false);
    }
  };

  if (!quiz || quiz.questions.length === 0) return <div className="container mt-8">Loading...</div>;

  const currentQuestion = quiz.questions[currentQuestionIndex];
  
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="container mt-8 animate-fade-in" style={{ maxWidth: '800px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{quiz.examName} - {quiz.topic}</h2>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-error)', padding: '0.5rem 1rem', borderRadius: '20px', fontWeight: 600 }}>
          <Timer size={18} />
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="glass-panel">
        <h3 style={{ fontSize: '1.25rem', marginBottom: '2rem', lineHeight: '1.5' }}>
          {currentQuestion.question}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {currentQuestion.options.map((option, idx) => {
            const isSelected = answers[currentQuestion._id] === option;
            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(currentQuestion._id, option)}
                style={{
                  padding: '1rem',
                  background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(15, 23, 42, 0.6)',
                  border: `1px solid ${isSelected ? 'var(--primary-color)' : 'var(--glass-border)'}`,
                  borderRadius: '8px',
                  color: 'var(--text-main)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  fontSize: '1rem'
                }}
              >
                <div style={{ 
                  width: '24px', height: '24px', borderRadius: '50%', 
                  border: `2px solid ${isSelected ? 'var(--primary-color)' : 'var(--text-muted)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {isSelected && <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary-color)' }} />}
                </div>
                {option}
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
        <button 
          className="btn btn-secondary" 
          onClick={handlePrev}
          disabled={currentQuestionIndex === 0}
          style={{ opacity: currentQuestionIndex === 0 ? 0.5 : 1 }}
        >
          Previous
        </button>
        
        {currentQuestionIndex === quiz.questions.length - 1 ? (
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Submitting...' : <><CheckCircle size={18}/> Submit Quiz</>}
          </button>
        ) : (
          <button className="btn btn-primary" onClick={handleNext}>
            Next
          </button>
        )}
      </div>

    </div>
  );
};

export default QuizRunner;
