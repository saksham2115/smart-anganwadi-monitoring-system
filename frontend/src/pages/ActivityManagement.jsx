import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { activitiesApi } from '../services/api';
import { 
  Sparkles, 
  Music, 
  BookOpen, 
  Palette, 
  Activity as GameIcon, 
  ShieldCheck, 
  Save, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle2, 
  Droplet, 
  Smile,
  HeartHandshake
} from 'lucide-react';

export default function ActivityManagement() {
  const { currentCenterId, activeCenter, user } = useAuth();
  const todayStr = new Date().toISOString().split('T')[0];

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Daily Operational Checklist State
  const [operations, setOperations] = useState({
    drinkingWaterChecked: true,
    firstAidKitReady: true,
    handwashingDemoDone: true,
    toiletCleaned: true,
    toysSanitized: true
  });

  // Activity Form State
  const [form, setForm] = useState({
    date: todayStr,
    title: "Baal Geet & Action Rhymes: 'Machhli Jal Ki Rani'",
    category: "Storytelling & Rhymes",
    durationMinutes: 45,
    childrenPresent: 7,
    description: "Children recited the rhyme with body gestures and expressive hand movements.",
    learningOutcome: "Rhythm recognition, joyful participation, vocabulary, and motor coordination.",
    photoEmoji: "🎵🐟"
  });

  useEffect(() => {
    loadActivities();
  }, [currentCenterId]);

  const loadActivities = async () => {
    setLoading(true);
    try {
      const data = await activitiesApi.getAll(currentCenterId);
      setActivities(data || []);
    } catch (err) {
      console.warn("Error loading activities:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveActivity = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const result = await activitiesApi.record({
        centerId: currentCenterId,
        conductedBy: user?.name || activeCenter?.workerName || 'Anganwadi Worker',
        ...form
      });

      if (result.offlineQueued) {
        setStatusMessage('Activity logged offline and queued for automatic synchronization!');
      } else {
        setStatusMessage('Activity successfully recorded in daily log!');
      }

      loadActivities();
      setTimeout(() => setStatusMessage(''), 4000);
    } catch (err) {
      alert('Failed to save activity: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const categories = [
    { name: "Storytelling & Rhymes", icon: "🎵", desc: "कविता, बाल गीत एवं कहानी" },
    { name: "Drawing & Art", icon: "🎨", desc: "चित्रकला, रंग भरना व आकृतियाँ" },
    { name: "Motor Play & Games", icon: "⚽", desc: "शारीरिक खेल व संतुलन" },
    { name: "Cognitive & Numeracy", icon: "🧩", desc: "गिनती, अक्षर व रंग पहचान" },
    { name: "Swachhata & Habits", icon: "🧼", desc: "स्वच्छता व अच्छी आदतें" }
  ];

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header-flex">
        <div>
          <h1 className="page-title">Pre-School Learning & Operational Records (दैनिक गतिविधियाँ)</h1>
          <p className="page-subtitle">
            Early childhood development sessions and center hygiene checks in {activeCenter?.name}
          </p>
        </div>
      </div>

      {statusMessage && (
        <div className="alert-callout success mb-4">
          <CheckCircle2 size={20} className="text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Daily Center Operational Hygiene Checklist */}
      <div className="card-box mb-6 bg-gradient-to-r from-emerald-50/50 to-blue-50/30 border-emerald-200">
        <div className="card-box-header">
          <div className="flex items-center gap-2">
            <ShieldCheck size={22} className="text-emerald-600" />
            <div>
              <h3 className="card-box-title">Daily Center Operational Checklist (केंद्र स्वच्छता व सुरक्षा)</h3>
              <p className="card-box-subtitle">Mandatory ICDS quality & hygiene checklist for today</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-3">
          <label className="checklist-pill-label">
            <input
              type="checkbox"
              checked={operations.drinkingWaterChecked}
              onChange={(e) => setOperations(p => ({ ...p, drinkingWaterChecked: e.target.checked }))}
              className="form-checkbox"
            />
            <span>Safe & Filtered Drinking Water Available</span>
          </label>

          <label className="checklist-pill-label">
            <input
              type="checkbox"
              checked={operations.firstAidKitReady}
              onChange={(e) => setOperations(p => ({ ...p, firstAidKitReady: e.target.checked }))}
              className="form-checkbox"
            />
            <span>First Aid & Medicine Kit Stocked</span>
          </label>

          <label className="checklist-pill-label">
            <input
              type="checkbox"
              checked={operations.handwashingDemoDone}
              onChange={(e) => setOperations(p => ({ ...p, handwashingDemoDone: e.target.checked }))}
              className="form-checkbox"
            />
            <span>Handwashing with Soap Conducted</span>
          </label>

          <label className="checklist-pill-label">
            <input
              type="checkbox"
              checked={operations.toiletCleaned}
              onChange={(e) => setOperations(p => ({ ...p, toiletCleaned: e.target.checked }))}
              className="form-checkbox"
            />
            <span>Center Premises & Toilet Sanitized</span>
          </label>

          <label className="checklist-pill-label">
            <input
              type="checkbox"
              checked={operations.toysSanitized}
              onChange={(e) => setOperations(p => ({ ...p, toysSanitized: e.target.checked }))}
              className="form-checkbox"
            />
            <span>ECE Learning Toys & Mats Cleaned</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left: Activity Form */}
        <div className="card-box">
          <div className="card-box-header">
            <div>
              <h3 className="card-box-title">Log Today's Learning Activity (गतिविधि दर्ज करें)</h3>
              <p className="card-box-subtitle">Record preschool sessions and student participation</p>
            </div>
          </div>

          <form onSubmit={handleSaveActivity} className="mt-4">
            <div className="form-group mb-4">
              <label className="form-label">Activity Category (गतिविधि प्रकार)</label>
              <div className="category-select-grid">
                {categories.map((c) => (
                  <button
                    type="button"
                    key={c.name}
                    onClick={() => setForm(p => ({ ...p, category: c.name, photoEmoji: c.icon }))}
                    className={`category-select-btn ${form.category === c.name ? 'active' : ''}`}
                  >
                    <span className="text-xl">{c.icon}</span>
                    <span className="font-semibold text-xs block mt-1">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group mb-4">
              <label className="form-label">Activity Title (शीर्षक / विषय) *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Baal Geet, Clay Modeling, Color sorting..."
                className="form-input"
              />
            </div>

            <div className="form-grid-2 mb-4">
              <div className="form-group">
                <label className="form-label">
                  <Clock size={15} className="inline-icon text-slate-500" /> Duration (Minutes)
                </label>
                <input
                  type="number"
                  min="10"
                  max="120"
                  value={form.durationMinutes}
                  onChange={(e) => setForm(p => ({ ...p, durationMinutes: parseInt(e.target.value, 10) || 30 }))}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Users size={15} className="inline-icon text-slate-500" /> Participating Children
                </label>
                <input
                  type="number"
                  min="1"
                  value={form.childrenPresent}
                  onChange={(e) => setForm(p => ({ ...p, childrenPresent: parseInt(e.target.value, 10) || 1 }))}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group mb-4">
              <label className="form-label">Description (गतिविधि का विवरण)</label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="Briefly describe what the children did in this session..."
                className="form-textarea"
              />
            </div>

            <div className="form-group mb-4">
              <label className="form-label">Learning Outcome (सीखने के परिणाम)</label>
              <input
                type="text"
                value={form.learningOutcome}
                onChange={(e) => setForm(p => ({ ...p, learningOutcome: e.target.value }))}
                placeholder="e.g. Fine motor skills, color identification, peer sharing..."
                className="form-input"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn-primary w-full"
            >
              <Save size={18} />
              <span>{saving ? 'Saving...' : 'Save & Publish Activity'}</span>
            </button>
          </form>
        </div>

        {/* Right: Feed of Conducted Activities */}
        <div className="card-box">
          <div className="card-box-header">
            <div>
              <h3 className="card-box-title">Conducted Activities Feed (गतिविधि इतिहास)</h3>
              <p className="card-box-subtitle">Past pre-school sessions logged in this centre</p>
            </div>
          </div>

          <div className="activities-feed-stack mt-4">
            {activities.map((act) => (
              <div key={act.id} className="activity-feed-card">
                <div className="activity-emoji-box">
                  {act.photoEmoji || '🎨'}
                </div>

                <div className="activity-content-flex">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="activity-card-title">{act.title}</h4>
                    <span className="activity-date-tag">{act.date}</span>
                  </div>

                  <div className="activity-meta-line">
                    <span className="category-pill">{act.category}</span>
                    <span>• {act.durationMinutes} mins</span>
                    <span>• {act.childrenPresent} Children</span>
                  </div>

                  <p className="activity-desc-text mt-2">{act.description}</p>

                  {act.learningOutcome && (
                    <div className="activity-outcome-pill mt-2">
                      <strong>Outcome:</strong> {act.learningOutcome}
                    </div>
                  )}

                  <div className="text-xs text-slate-400 mt-2">
                    Conducted by: {act.conductedBy || 'Anganwadi Worker'}
                  </div>
                </div>
              </div>
            ))}

            {activities.length === 0 && (
              <div className="empty-state-box">
                <Sparkles size={36} className="text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500">No activities recorded yet for this centre. Add your first session!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
