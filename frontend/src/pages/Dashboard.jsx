import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Activity, Clock } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [formData, setFormData] = useState({ examName: 'SSC', topic: '', difficulty: 'Medium' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await fetch('/api/quiz/dashboard', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setQuizzes(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateQuiz = async (e) => {
    e.preventDefault();
    if (!formData.topic) {
      setError('Please enter a topic');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Failed to generate quiz');

      // Navigate to Quiz Runner with quiz data
      navigate('/quiz', { state: { quiz: data } });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="container mt-8 animate-fade-in">
      <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Dashboard</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        
        {/* Create Quiz Panel */}
        <div className="glass-panel" style={{ height: 'fit-content' }}>
          <h3 className="mb-4" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Play size={20} color="var(--primary-color)"/> Generate New Quiz
          </h3>
          
          {error && <div style={{ color: 'var(--accent-error)', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}
          
          <form onSubmit={handleGenerateQuiz}>
            <div className="form-group">
              <label className="form-label">Exam Type</label>
              <select 
                className="form-select"
                value={formData.examName}
                onChange={(e) => setFormData({...formData, examName: e.target.value})}
              >
                <option value="SSC">SSC</option>
                <option value="UPSC">UPSC</option>
                <option value="JEE">JEE</option>
                <option value="NEET">NEET</option>
                <option value="Banking">Banking</option>
                <option value="Railway">Railway</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Topic</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Indian History, Thermodynamics"
                value={formData.topic}
                onChange={(e) => setFormData({...formData, topic: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Difficulty</label>
              <select 
                className="form-select"
                value={formData.difficulty}
                onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary w-full justify-center mt-4" disabled={loading}>
              {loading ? 'Generating AI Quiz...' : 'Start Quiz Now'}
            </button>
          </form>
        </div>

        {/* Recent Quizzes Panel */}
        <div className="glass-panel">
          <h3 className="mb-4" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Activity size={20} color="var(--secondary-color)"/> Recent Performance
          </h3>
          
          {quizzes.length === 0 ? (
            <div className="text-center" style={{ color: 'var(--text-muted)', padding: '2rem 0' }}>
              <p>No quizzes taken yet. Generate one to get started!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {quizzes.map(quiz => (
                <div key={quiz._id} style={{ padding: '1rem', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '8px', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>{quiz.topic}</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                       <Clock size={14}/> {new Date(quiz.createdAt).toLocaleDateString()} • {quiz.examName} ({quiz.difficulty})
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 700, color: quiz.score !== null ? 'var(--accent-success)' : 'var(--text-muted)' }}>
                      {quiz.score !== null ? `${quiz.score}/${quiz.questions.length}` : 'Pending'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default Dashboard;
