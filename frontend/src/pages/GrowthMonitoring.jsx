import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { childrenApi, growthApi } from '../services/api';
import { classifyChildGrowth } from '../services/whoGrowthStandards';
import WhoGrowthChart from '../components/WhoGrowthChart';
import { 
  Activity, 
  Baby, 
  Scale, 
  Ruler, 
  Save, 
  AlertTriangle, 
  CheckCircle, 
  Calendar, 
  TrendingUp, 
  HeartHandshake,
  ShieldAlert,
  Info
} from 'lucide-react';

export default function GrowthMonitoring() {
  const { currentCenterId, activeCenter } = useAuth();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialChildId = queryParams.get('childId');

  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(initialChildId || '');
  const [growthHistory, setGrowthHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Form input
  const todayStr = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState({
    date: todayStr,
    weightKg: '12.5',
    heightCm: '88.0',
    notes: 'Regular monthly Poshan growth assessment.'
  });

  useEffect(() => {
    loadChildren();
  }, [currentCenterId]);

  useEffect(() => {
    if (selectedChildId) {
      loadGrowthHistory(selectedChildId);
    }
  }, [selectedChildId]);

  const loadChildren = async () => {
    setLoading(true);
    try {
      const data = await childrenApi.getAll({ centerId: currentCenterId });
      setChildren(data || []);
      if (!selectedChildId && data && data.length > 0) {
        setSelectedChildId(data[0].id);
      }
    } catch (err) {
      console.warn("Error loading children:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadGrowthHistory = async (childId) => {
    try {
      const records = await growthApi.getAll({ childId });
      setGrowthHistory(records || []);
      if (records && records.length > 0) {
        // Pre-fill with latest values
        setFormData(prev => ({
          ...prev,
          weightKg: String(records[0].weightKg),
          heightCm: String(records[0].heightCm)
        }));
      }
    } catch (err) {
      console.warn("Error loading growth history:", err);
    }
  };

  const selectedChild = children.find(c => c.id === selectedChildId) || children[0];

  // Real-time WHO classification preview
  const liveClassification = selectedChild ? classifyChildGrowth(
    selectedChild.ageMonths,
    selectedChild.gender,
    formData.weightKg || 10,
    formData.heightCm || 85
  ) : null;

  const handleSaveGrowth = async (e) => {
    e.preventDefault();
    if (!selectedChild) return;

    setSaving(true);
    try {
      const result = await growthApi.record({
        childId: selectedChild.id,
        childName: selectedChild.name,
        centerId: currentCenterId,
        date: formData.date,
        weightKg: parseFloat(formData.weightKg),
        heightCm: parseFloat(formData.heightCm),
        ageMonths: selectedChild.ageMonths,
        gender: selectedChild.gender,
        notes: formData.notes
      });

      if (result.offlineQueued) {
        setStatusMessage('Growth measurement saved offline and queued for sync!');
      } else {
        setStatusMessage('Growth record saved & WHO category updated!');
      }

      loadGrowthHistory(selectedChild.id);
      setTimeout(() => setStatusMessage(''), 4000);
    } catch (err) {
      alert('Failed to save growth record: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header-flex">
        <div>
          <h1 className="page-title">Child Growth & Nutrition Monitoring (WHO वृद्धि निगरानी)</h1>
          <p className="page-subtitle">
            WHO Age & Sex-Specific Child Growth Standards for {activeCenter?.name}
          </p>
        </div>

        {/* Child Selector Dropdown */}
        <div className="child-selector-box">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Select Child</label>
          <select
            value={selectedChildId}
            onChange={(e) => setSelectedChildId(e.target.value)}
            className="form-select font-medium text-slate-800"
          >
            {children.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({Math.floor(c.ageMonths / 12)}y {c.ageMonths % 12}m • {c.gender})
              </option>
            ))}
          </select>
        </div>
      </div>

      {statusMessage && (
        <div className="alert-callout success mb-4">
          <CheckCircle size={20} className="text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {selectedChild && (
        <>
          {/* Selected Child Demographics Card */}
          <div className="card-box mb-6 bg-gradient-to-r from-slate-50 to-emerald-50/30">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="profile-avatar-big">
                  {selectedChild.gender === 'Female' ? '👧' : '👦'}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedChild.name}</h2>
                  <p className="text-sm text-slate-600">
                    Age: <strong>{selectedChild.ageMonths} months</strong> ({Math.floor(selectedChild.ageMonths / 12)} yrs {selectedChild.ageMonths % 12} mos) • 
                    Gender: <strong>{selectedChild.gender}</strong> • Mother: <strong>{selectedChild.motherName}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`status-badge large ${selectedChild.nutritionCategory ? selectedChild.nutritionCategory.toLowerCase() : 'normal'}`}>
                  {selectedChild.nutritionCategory === 'SAM' ? '🚨 SAM Severe Alert' : (selectedChild.nutritionCategory === 'MAM' ? '⚠️ MAM Moderate Alert' : '✅ Normal Healthy Growth')}
                </span>
              </div>
            </div>
          </div>

          {/* Grid: Measurement Form & Real-time Live Classification */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Left: Input Form */}
            <div className="card-box">
              <div className="card-box-header">
                <div>
                  <h3 className="card-box-title">Record Monthly Measurement (मासिक माप दर्ज करें)</h3>
                  <p className="card-box-subtitle">Enter height and weight to assess growth status</p>
                </div>
              </div>

              <form onSubmit={handleSaveGrowth} className="mt-3">
                <div className="form-group mb-4">
                  <label className="form-label">Measurement Date (माप की तिथि)</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="form-input"
                  />
                </div>

                <div className="form-grid-2 mb-4">
                  <div className="form-group">
                    <label className="form-label">
                      <Scale size={16} className="inline-icon text-emerald-600" /> Weight in kg (वजन) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="2"
                      max="40"
                      required
                      value={formData.weightKg}
                      onChange={(e) => setFormData(prev => ({ ...prev, weightKg: e.target.value }))}
                      className="form-input text-lg font-bold"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Ruler size={16} className="inline-icon text-blue-600" /> Height in cm (लंबाई/ऊंचाई) *
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="45"
                      max="130"
                      required
                      value={formData.heightCm}
                      onChange={(e) => setFormData(prev => ({ ...prev, heightCm: e.target.value }))}
                      className="form-input text-lg font-bold"
                    />
                  </div>
                </div>

                <div className="form-group mb-4">
                  <label className="form-label">Observations / Clinical Notes</label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="form-textarea"
                    placeholder="Notes on child activity, appetite, or illnesses..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary w-full"
                >
                  <Save size={18} />
                  <span>{saving ? 'Saving...' : 'Save Growth Measurement'}</span>
                </button>
              </form>
            </div>

            {/* Right: Live WHO Classification Preview Card */}
            {liveClassification && (
              <div className="card-box">
                <div className="card-box-header">
                  <div>
                    <h3 className="card-box-title">WHO Standards Analysis (विश्व स्वास्थ्य संगठन मानक)</h3>
                    <p className="card-box-subtitle">Calculated automatically against WHO growth curves</p>
                  </div>
                  <span className={`status-badge-inline ${liveClassification.statusColor}`}>
                    {liveClassification.badgeText}
                  </span>
                </div>

                <div className="who-analysis-grid mt-4">
                  <div className="who-analysis-item">
                    <span className="who-analysis-label">Weight-for-Age (WFA)</span>
                    <span className="who-analysis-val font-semibold">{liveClassification.wfaStatus}</span>
                    <small className="text-slate-500">
                      WHO Standard Median: {liveClassification.thresholds.median} kg • -2SD: {liveClassification.thresholds.sdMinus2} kg
                    </small>
                  </div>

                  <div className="who-analysis-item">
                    <span className="who-analysis-label">Body Mass Index (BMI)</span>
                    <span className="who-analysis-val font-semibold">{liveClassification.bmi} kg/m²</span>
                    <small className="text-slate-500">Calculated from weight and height</small>
                  </div>

                  <div className="who-analysis-item col-span-full">
                    <span className="who-analysis-label">Height-for-Age (HFA Stunting Assessment)</span>
                    <span className="who-analysis-val font-semibold">{liveClassification.hfaStatus}</span>
                  </div>
                </div>

                {/* Advice Box */}
                <div className={`clinical-advice-box mt-4 ${liveClassification.statusColor}`}>
                  <div className="advice-title">
                    {liveClassification.statusColor === 'red' ? (
                      <span className="flex items-center gap-1.5 text-red-700 font-bold">
                        <AlertTriangle size={18} /> Critical SAM Protocol Triggered:
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-slate-800 font-bold">
                        <Info size={18} /> ICDS Poshan Guidance:
                      </span>
                    )}
                  </div>
                  <p className="advice-text mt-1 text-sm">{liveClassification.advice}</p>
                </div>
              </div>
            )}
          </div>

          {/* Interactive WHO Growth Curve Chart */}
          <div className="card-box mb-6">
            <WhoGrowthChart
              childName={selectedChild.name}
              gender={selectedChild.gender}
              currentAge={selectedChild.ageMonths}
              history={growthHistory}
            />
          </div>

          {/* Growth History Table */}
          <div className="card-box">
            <div className="card-box-header">
              <h3 className="card-box-title">Historical Growth Measurements for {selectedChild.name}</h3>
            </div>

            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Age</th>
                    <th>Weight</th>
                    <th>Height</th>
                    <th>BMI</th>
                    <th>WHO Status</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {growthHistory.map((rec) => (
                    <tr key={rec.id}>
                      <td><strong>{rec.date}</strong></td>
                      <td>{rec.ageMonths} mos</td>
                      <td className="font-semibold">{rec.weightKg} kg</td>
                      <td>{rec.heightCm} cm</td>
                      <td>{rec.bmi}</td>
                      <td>
                        <span className={`status-badge ${rec.overallCategory?.toLowerCase()}`}>
                          {rec.overallCategory === 'SAM' ? '🚨 SAM' : (rec.overallCategory === 'MAM' ? '⚠️ MAM' : '✅ Normal')}
                        </span>
                      </td>
                      <td className="text-slate-600 text-sm">{rec.notes || 'Routine check'}</td>
                    </tr>
                  ))}
                  {growthHistory.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-6 text-slate-500">
                        No growth measurements recorded yet for this child. Enter one above!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
