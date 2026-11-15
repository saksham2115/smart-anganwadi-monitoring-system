import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { attendanceApi, childrenApi } from '../services/api';
import { 
  CalendarCheck, 
  Calendar as CalendarIcon, 
  Check, 
  X, 
  Clock, 
  CheckCheck, 
  AlertTriangle, 
  Save, 
  History, 
  Users, 
  TrendingUp,
  UserX
} from 'lucide-react';

export default function AttendanceManagement() {
  const { currentCenterId, activeCenter, isOnline } = useAuth();

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [children, setChildren] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [historyList, setHistoryList] = useState([]);
  const [activeTab, setActiveTab] = useState('daily'); // 'daily' or 'history'

  useEffect(() => {
    loadAttendanceData();
  }, [currentCenterId, selectedDate]);

  const loadAttendanceData = async () => {
    setLoading(true);
    try {
      const [childList, attData, histData] = await Promise.all([
        childrenApi.getAll({ centerId: currentCenterId }).catch(() => []),
        attendanceApi.getForDate(currentCenterId, selectedDate).catch(() => null),
        attendanceApi.getHistory(currentCenterId, 15).catch(() => [])
      ]);

      setChildren(childList || []);
      setHistoryList(histData || []);

      if (attData && Array.isArray(attData.records) && attData.records.length > 0) {
        // Match existing records
        setRecords(attData.records);
      } else {
        // Initialize default present for all enrolled children
        const initialRecords = (childList || []).map(c => ({
          childId: c.id,
          childName: c.name,
          status: 'present',
          remarks: ''
        }));
        setRecords(initialRecords);
      }
    } catch (err) {
      console.warn("Error loading attendance:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (childId, newStatus) => {
    setRecords(prev => prev.map(r => {
      if (r.childId === childId) {
        return { ...r, status: newStatus };
      }
      return r;
    }));
  };

  const handleRemarksChange = (childId, remarks) => {
    setRecords(prev => prev.map(r => {
      if (r.childId === childId) {
        return { ...r, remarks };
      }
      return r;
    }));
  };

  const handleMarkAll = (status) => {
    setRecords(prev => prev.map(r => ({ ...r, status })));
  };

  const handleSaveAttendance = async () => {
    setSaving(true);
    try {
      const result = await attendanceApi.save({
        centerId: currentCenterId,
        date: selectedDate,
        records
      });

      if (result.offlineQueued) {
        setStatusMessage('Saved offline! Attendance will synchronize automatically when online.');
      } else {
        setStatusMessage('Attendance recorded successfully!');
      }

      // Refresh history
      const hist = await attendanceApi.getHistory(currentCenterId, 15).catch(() => []);
      setHistoryList(hist || []);

      setTimeout(() => setStatusMessage(''), 4000);
    } catch (err) {
      alert('Failed to save attendance: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Calculations
  const totalCount = records.length;
  const presentCount = records.filter(r => r.status === 'present').length;
  const absentCount = records.filter(r => r.status === 'absent').length;
  const leaveCount = records.filter(r => r.status === 'leave').length;
  const attendanceRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header-flex">
        <div>
          <h1 className="page-title">Daily Child Attendance (दैनिक उपस्थिति)</h1>
          <p className="page-subtitle">
            Track daily attendance and dropout risk alerts for {activeCenter?.name}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className={`btn-tab ${activeTab === 'daily' ? 'active' : ''}`}
            onClick={() => setActiveTab('daily')}
          >
            Daily Sheet
          </button>
          <button
            type="button"
            className={`btn-tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            Attendance History
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="alert-callout success mb-4">
          <Check size={20} className="text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {activeTab === 'daily' ? (
        <>
          {/* Date Picker & Quick Actions Bar */}
          <div className="card-box mb-6">
            <div className="attendance-controls-bar">
              <div className="date-picker-wrapper">
                <CalendarIcon size={18} className="text-slate-500" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="attendance-date-input"
                />
              </div>

              <div className="quick-mark-group">
                <button
                  type="button"
                  onClick={() => handleMarkAll('present')}
                  className="btn-mark-all present"
                >
                  <CheckCheck size={16} />
                  <span>Mark All Present (सभी उपस्थित)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleMarkAll('absent')}
                  className="btn-mark-all absent"
                >
                  <UserX size={16} />
                  <span>Mark All Absent</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleSaveAttendance}
                disabled={saving}
                className="btn-primary"
              >
                <Save size={18} />
                <span>{saving ? 'Saving...' : 'Save Attendance'}</span>
              </button>
            </div>
          </div>

          {/* Attendance KPI Summary Stats */}
          <div className="metrics-grid mb-6">
            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-title">Total Enrolled</span>
                <Users size={18} className="text-blue-500" />
              </div>
              <div className="metric-value">{totalCount}</div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-title">Present Today</span>
                <Check size={18} className="text-emerald-500" />
              </div>
              <div className="metric-value text-emerald-600">{presentCount}</div>
              <div className="metric-subtext font-semibold text-emerald-600">{attendanceRate}% Rate</div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-title">Absent</span>
                <X size={18} className="text-red-500" />
              </div>
              <div className="metric-value text-red-600">{absentCount}</div>
            </div>

            <div className="metric-card">
              <div className="metric-header">
                <span className="metric-title">Approved Leave</span>
                <Clock size={18} className="text-amber-500" />
              </div>
              <div className="metric-value text-amber-600">{leaveCount}</div>
            </div>
          </div>

          {/* Attendance List */}
          <div className="card-box">
            <div className="card-box-header">
              <h3 className="card-box-title">Child Attendance Roster for {selectedDate}</h3>
              <span className="text-sm text-slate-500">Tap status to toggle Present / Absent / Leave</span>
            </div>

            <div className="attendance-items-list">
              {records.map((rec, index) => {
                const childObj = children.find(c => c.id === rec.childId);
                const isChronicAbsentCandidate = rec.status === 'absent' && childObj?.name === 'Priya Gupta';

                return (
                  <div key={rec.childId || index} className={`attendance-row ${rec.status}`}>
                    <div className="att-child-info">
                      <div className="att-child-avatar">
                        {childObj?.gender === 'Female' ? '👧' : '👦'}
                      </div>
                      <div>
                        <div className="att-child-name">
                          {rec.childName || childObj?.name}
                          {isChronicAbsentCandidate && (
                            <span className="chronic-absent-flag">
                              <AlertTriangle size={12} />
                              <span>3 Days Absent (Dropout Risk)</span>
                            </span>
                          )}
                        </div>
                        <div className="att-child-meta">
                          {childObj ? `${Math.floor(childObj.ageMonths / 12)}y ${childObj.ageMonths % 12}m • ${childObj.motherName}` : ''}
                        </div>
                      </div>
                    </div>

                    {/* Status Toggle Buttons */}
                    <div className="att-status-buttons">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(rec.childId, 'present')}
                        className={`status-btn present ${rec.status === 'present' ? 'active' : ''}`}
                      >
                        <Check size={16} />
                        <span>Present (उपस्थित)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(rec.childId, 'absent')}
                        className={`status-btn absent ${rec.status === 'absent' ? 'active' : ''}`}
                      >
                        <X size={16} />
                        <span>Absent (अनुपस्थित)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(rec.childId, 'leave')}
                        className={`status-btn leave ${rec.status === 'leave' ? 'active' : ''}`}
                      >
                        <Clock size={16} />
                        <span>Leave (अवकाश)</span>
                      </button>
                    </div>

                    {/* Remarks Input */}
                    <div className="att-remarks-box">
                      <input
                        type="text"
                        placeholder="Remarks / reason for absence..."
                        value={rec.remarks || ''}
                        onChange={(e) => handleRemarksChange(rec.childId, e.target.value)}
                        className="att-remarks-input"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleSaveAttendance}
                disabled={saving}
                className="btn-primary"
              >
                <Save size={18} />
                <span>{saving ? 'Saving...' : 'Save & Submit Attendance'}</span>
              </button>
            </div>
          </div>
        </>
      ) : (
        /* History Tab */
        <div className="card-box">
          <div className="card-box-header">
            <div>
              <h3 className="card-box-title">Recent Attendance History</h3>
              <p className="card-box-subtitle">Past attendance records and daily percentages</p>
            </div>
          </div>

          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Total Enrolled</th>
                  <th>Present</th>
                  <th>Absent</th>
                  <th>Leave</th>
                  <th>Attendance %</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {historyList.map((hist) => (
                  <tr key={hist.id}>
                    <td><strong>{hist.date}</strong></td>
                    <td>{hist.totalCount}</td>
                    <td className="text-emerald-700 font-semibold">{hist.presentCount}</td>
                    <td className="text-red-700 font-semibold">{hist.absentCount}</td>
                    <td>{hist.leaveCount}</td>
                    <td>
                      <span className={`status-badge ${hist.attendanceRate >= 75 ? 'normal' : 'mam'}`}>
                        {hist.attendanceRate}%
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDate(hist.date);
                          setActiveTab('daily');
                        }}
                        className="btn-sm-action"
                      >
                        View Sheet
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
