import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supervisorApi, alertsApi } from '../services/api';
import {
  Building2,
  Users,
  CalendarCheck,
  Utensils,
  AlertOctagon,
  FileCheck2,
  ArrowUpRight,
  Send,
  PhoneCall,
  CheckCircle,
  FileSpreadsheet,
  TrendingUp,
  Activity,
  AlertTriangle,
  Download
} from 'lucide-react';

export default function SupervisorDashboard() {
  const { setCurrentCenterId } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [actionNotes, setActionNotes] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    loadSupervisorData();
  }, []);

  const loadSupervisorData = async () => {
    setLoading(true);
    try {
      const res = await supervisorApi.getDashboard();
      setData(res);
    } catch (err) {
      console.warn("Error loading supervisor dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveAlert = async (alertId) => {
    try {
      await alertsApi.updateStatus(alertId, {
        status: 'Action Taken',
        actionTaken: actionNotes || 'CDPO approved field visit and supplementary nutrition intervention.'
      });
      setStatusMessage('Alert updated and action logged!');
      setSelectedAlert(null);
      setActionNotes('');
      loadSupervisorData();
      setTimeout(() => setStatusMessage(''), 3500);
    } catch (err) {
      alert('Failed to update alert');
    }
  };

  const kpis = data?.kpi || {
    totalCenters: 4,
    totalChildren: 76,
    avgAttendanceRate: 78,
    samCount: 2,
    mamCount: 4,
    normalCount: 70,
    pendingReportsCount: 1,
    activeAlertsCount: 3
  };

  const centerBreakdowns = data?.centerBreakdowns || [];
  const recentAlerts = data?.recentAlerts || [];

  return (
    <div className="page-container">
      {/* Supervisor District Header */}
      <div className="supervisor-hero-card">
        <div className="supervisor-hero-left">
          <div className="supervisor-badge">
            <span className="live-dot gold"></span>
            <span>Child Development Project Officer (CDPO) • District Console</span>
          </div>
          <h1 className="supervisor-hero-title">Rampur District Monitoring Dashboard</h1>
          <p className="supervisor-hero-subtitle">
            Sector Oversight • 4 Anganwadi Centres • Integrated Child Development Services (ICDS)
          </p>
        </div>

        <div className="supervisor-hero-actions">
          <Link to="/reports" className="btn-white-action">
            <FileSpreadsheet size={18} />
            <span>Generate MPR Report</span>
          </Link>
        </div>
      </div>

      {statusMessage && (
        <div className="alert-callout success mb-4">
          <CheckCircle size={20} className="text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Supervisor Top KPIs */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Monitored Centres</span>
            <div className="metric-icon-box bg-blue-100 text-blue-600">
              <Building2 size={20} />
            </div>
          </div>
          <div className="metric-value">{kpis.totalCenters}</div>
          <div className="metric-subtext">All operational in Rampur sector</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Total Enrolled Children</span>
            <div className="metric-icon-box bg-purple-100 text-purple-600">
              <Users size={20} />
            </div>
          </div>
          <div className="metric-value">{kpis.totalChildren}</div>
          <div className="metric-subtext">{kpis.normalCount} Normal • {kpis.mamCount} MAM</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">District Avg Attendance</span>
            <div className="metric-icon-box bg-emerald-100 text-emerald-600">
              <CalendarCheck size={20} />
            </div>
          </div>
          <div className="metric-value">{kpis.avgAttendanceRate}%</div>
          <div className="metric-subtext text-emerald-600 font-semibold">Today's aggregate rate</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Critical SAM Alerts</span>
            <div className="metric-icon-box bg-red-100 text-red-600 animate-pulse">
              <AlertOctagon size={20} />
            </div>
          </div>
          <div className="metric-value text-red-600">{kpis.samCount}</div>
          <div className="metric-subtext text-red-600 font-semibold">NRC referrals pending</div>
        </div>
      </div>

      {/* Visual Analytics Row: Multi-Center Attendance & Nutrition Breakdown */}
      <div className="dashboard-main-grid mb-6">
        {/* Attendance by Center Bar Chart */}
        <div className="card-box">
          <div className="card-box-header">
            <div>
              <h3 className="card-box-title">Center Attendance Comparison (आज की उपस्थिति तुलना)</h3>
              <p className="card-box-subtitle">Live daily attendance % reported by each centre</p>
            </div>
          </div>

          <div className="chart-bars-stack">
            {centerBreakdowns.map((center) => (
              <div key={center.id} className="center-bar-row">
                <div className="center-bar-info">
                  <span className="center-bar-name">{center.code} - {center.name.replace('Anganwadi Centre', '')}</span>
                  <span className="center-bar-val">{center.todayAttendanceRate}%</span>
                </div>
                <div className="center-bar-track">
                  <div 
                    className="center-bar-fill" 
                    style={{ 
                      width: `${center.todayAttendanceRate || 5}%`,
                      backgroundColor: center.todayAttendanceRate >= 75 ? '#10b981' : (center.todayAttendanceRate >= 50 ? '#f59e0b' : '#ef4444')
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nutrition Distribution Chart */}
        <div className="card-box">
          <div className="card-box-header">
            <div>
              <h3 className="card-box-title">WHO Malnutrition Profile (पोषण वर्गीकरण)</h3>
              <p className="card-box-subtitle">Child nutritional status across all 4 centres</p>
            </div>
          </div>

          <div className="nutrition-donut-display">
            <div className="nutrition-stats-row">
              <div className="nutrition-stat-pill green">
                <div className="stat-pill-label">Normal (सामान्य)</div>
                <div className="stat-pill-count">{kpis.normalCount} Children</div>
                <div className="stat-pill-pct">{Math.round((kpis.normalCount / (kpis.totalChildren || 1)) * 100)}%</div>
              </div>

              <div className="nutrition-stat-pill yellow">
                <div className="stat-pill-label">MAM (मध्यम कुपोषण)</div>
                <div className="stat-pill-count">{kpis.mamCount} Children</div>
                <div className="stat-pill-pct">{Math.round((kpis.mamCount / (kpis.totalChildren || 1)) * 100)}%</div>
              </div>

              <div className="nutrition-stat-pill red">
                <div className="stat-pill-label">SAM (गंभीर कुपोषण)</div>
                <div className="stat-pill-count">{kpis.samCount} Children</div>
                <div className="stat-pill-pct">{Math.round((kpis.samCount / (kpis.totalChildren || 1)) * 100)}%</div>
              </div>
            </div>

            <div className="who-standard-note">
              <AlertTriangle size={16} className="text-amber-600 flex-shrink-0" />
              <span>
                ICDS POSHAN Protocol: All SAM cases require mandatory home visit within 48 hours and referral to the nearest Nutrition Rehabilitation Centre (NRC).
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Centre Detailed Breakdown Table */}
      <div className="card-box mb-6">
        <div className="card-box-header">
          <div>
            <h3 className="card-box-title">Anganwadi Centres Oversight Table</h3>
            <p className="card-box-subtitle">Daily operational status and compliance monitoring</p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Center & Sector</th>
                <th>Worker In-Charge</th>
                <th>Enrolled</th>
                <th>Today's Attendance</th>
                <th>Meal Status</th>
                <th>SAM Flags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {centerBreakdowns.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="font-semibold text-slate-800">{c.code} – {c.name.replace('Anganwadi Centre', '')}</div>
                    <small className="text-slate-500">{c.sector}</small>
                  </td>
                  <td>
                    <div>{c.workerName}</div>
                    <small className="text-slate-500"><PhoneCall size={12} className="inline-icon" /> {c.workerPhone}</small>
                  </td>
                  <td><strong>{c.enrolledCount}</strong></td>
                  <td>
                    <span className={`status-badge ${c.todayAttendanceRate >= 70 ? 'normal' : 'mam'}`}>
                      {c.todayAttendanceRate}% ({c.todayAttendanceMarked ? 'Marked' : 'Pending'})
                    </span>
                  </td>
                  <td>
                    {c.todayMealServed ? (
                      <span className="status-badge normal">Distributed ✅</span>
                    ) : (
                      <span className="status-badge mam">Pending ⏳</span>
                    )}
                  </td>
                  <td>
                    {c.samCount > 0 ? (
                      <span className="status-badge sam">🚨 {c.samCount} SAM</span>
                    ) : (
                      <span className="status-badge normal">0 Cases</span>
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => setCurrentCenterId(c.id)}
                      className="btn-sm-action"
                      title="Switch to this center"
                    >
                      Inspect Centre
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alerts and CDPO Interventions Hub */}
      <div className="card-box">
        <div className="card-box-header">
          <div>
            <h3 className="card-box-title">Sector Alert & Action Center</h3>
            <p className="card-box-subtitle">Supervisory interventions and NRC medical escalation tickets</p>
          </div>
        </div>

        <div className="alerts-list">
          {recentAlerts.map((al) => (
            <div key={al.id} className={`alert-record-card ${al.severity === 'critical' ? 'critical-border' : ''}`}>
              <div className="alert-record-header">
                <div className="alert-record-title-flex">
                  <span className={`severity-tag ${al.severity}`}>
                    {al.severity === 'critical' ? 'CRITICAL' : 'WARNING'}
                  </span>
                  <span className="alert-center-tag">{al.centerName}</span>
                  <span className="alert-date">{al.date}</span>
                </div>
                <div className="alert-status-badge">{al.status}</div>
              </div>

              <h4 className="alert-record-headline">{al.title}</h4>
              <p className="alert-record-text">{al.message}</p>

              {al.actionTaken && (
                <div className="alert-action-taken-box">
                  <strong>Action Recorded:</strong> {al.actionTaken}
                </div>
              )}

              <div className="alert-record-footer">
                <button
                  type="button"
                  onClick={() => setSelectedAlert(al)}
                  className="btn-sm-action"
                >
                  Take CDPO Action
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Modal */}
      {selectedAlert && (
        <div className="modal-backdrop">
          <div className="modal-dialog">
            <h3 className="modal-title">Supervisor Intervention: {selectedAlert.title}</h3>
            <p className="modal-text">{selectedAlert.message}</p>

            <div className="form-group mt-4">
              <label className="form-label">Supervisory Action / NRC Referral Note</label>
              <textarea
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                placeholder="Enter actions taken (e.g., Referred child to District NRC, dispatched auxiliary nurse, notified parent)..."
                className="form-textarea"
                rows={3}
              />
            </div>

            <div className="modal-actions mt-4">
              <button
                type="button"
                onClick={() => setSelectedAlert(null)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleResolveAlert(selectedAlert.id)}
                className="btn-primary"
              >
                Save Action & Update Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
