import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  childrenApi, 
  attendanceApi, 
  mealsApi, 
  alertsApi, 
  activitiesApi 
} from '../services/api';
import { 
  Users, 
  CalendarCheck, 
  Utensils, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  PlusCircle, 
  Sparkles, 
  Baby, 
  ShieldCheck, 
  PhoneCall, 
  MapPin,
  Calendar
} from 'lucide-react';

export default function WorkerDashboard() {
  const { currentCenterId, activeCenter, t, user } = useAuth();
  
  const [children, setChildren] = useState([]);
  const [attendance, setAttendance] = useState(null);
  const [meal, setMeal] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const todayStr = new Date().toISOString().split('T')[0];
  const formattedDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  useEffect(() => {
    loadDashboardData();
  }, [currentCenterId]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [childList, attData, mealData, alertList, actList] = await Promise.all([
        childrenApi.getAll({ centerId: currentCenterId }).catch(() => []),
        attendanceApi.getForDate(currentCenterId, todayStr).catch(() => null),
        mealsApi.getForDate(currentCenterId, todayStr).catch(() => null),
        alertsApi.getAll(currentCenterId).catch(() => []),
        activitiesApi.getAll(currentCenterId).catch(() => [])
      ]);

      setChildren(childList || []);
      setAttendance(attData);
      setMeal(mealData);
      setAlerts(alertList || []);
      setActivities(actList || []);
    } finally {
      setLoading(false);
    }
  };

  const totalChildren = children.length;
  const presentCount = attendance?.presentCount || 0;
  const attendanceRate = totalChildren > 0 ? Math.round((presentCount / totalChildren) * 100) : 0;
  const morningSnackServed = meal?.morningSnack?.served || false;
  const hotMealServed = meal?.hotCookedMeal?.served || false;
  const samChildren = children.filter(c => c.nutritionCategory === 'SAM');

  // Daily Tasks Checklist
  const tasks = [
    {
      id: 'task-att',
      name: 'Child Attendance (दैनिक उपस्थिति)',
      done: !!attendance && !attendance.isDraft,
      link: '/attendance',
      action: 'Mark Attendance'
    },
    {
      id: 'task-snack',
      name: 'Morning Snack Distribution (सुबह का नाश्ता)',
      done: morningSnackServed,
      link: '/meals',
      action: 'Record Snack'
    },
    {
      id: 'task-lunch',
      name: 'Hot Cooked Meal - HCM (गर्म पका भोजन)',
      done: hotMealServed,
      link: '/meals',
      action: 'Record Lunch'
    },
    {
      id: 'task-act',
      name: 'Pre-School Learning Activity (बालवाटिका गतिविधि)',
      done: activities.some(a => a.date === todayStr),
      link: '/activities',
      action: 'Log Activity'
    }
  ];

  const completedTasks = tasks.filter(t => t.done).length;
  const completionPercentage = Math.round((completedTasks / tasks.length) * 100);

  return (
    <div className="page-container">
      {/* Welcome & Center Overview Header */}
      <div className="dashboard-hero-card">
        <div className="hero-content">
          <div className="hero-badge">
            <span className="live-dot"></span>
            <span>Anganwadi Operational Console • {activeCenter?.code || 'AW-102'}</span>
          </div>
          <h1 className="hero-title">
            {t('welcome')}, {user?.name || activeCenter?.workerName || 'Worker'}!
          </h1>
          <p className="hero-subtitle">
            <MapPin size={15} className="inline-icon" /> {activeCenter?.name} • {formattedDate}
          </p>
        </div>

        <div className="hero-actions">
          <Link to="/children" className="btn-secondary-light">
            <PlusCircle size={18} />
            <span>{t('addNewChild')}</span>
          </Link>
          <Link to="/attendance" className="btn-primary-gradient">
            <CalendarCheck size={18} />
            <span>{t('markAttendance')}</span>
          </Link>
        </div>
      </div>

      {/* Critical Malnutrition & Absenteeism Alert Bar */}
      {alerts.length > 0 && (
        <div className="alert-banner-stack">
          {alerts.filter(a => a.status !== 'Resolved').slice(0, 2).map((alert) => (
            <div key={alert.id} className={`alert-callout ${alert.severity === 'critical' ? 'critical' : 'warning'}`}>
              <div className="alert-callout-icon">
                <AlertTriangle size={20} />
              </div>
              <div className="alert-callout-body">
                <div className="alert-callout-title">{alert.title}</div>
                <div className="alert-callout-message">{alert.message}</div>
              </div>
              <div className="alert-callout-action">
                {alert.type === 'malnutrition_sam' ? (
                  <Link to="/growth" className="alert-action-btn red">
                    View Health Card & NRC
                  </Link>
                ) : (
                  <Link to="/attendance" className="alert-action-btn amber">
                    View Absence Details
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Key Metric KPI Cards */}
      <div className="metrics-grid">
        {/* Metric 1: Enrolled Children */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Enrolled Children</span>
            <div className="metric-icon-box bg-blue-100 text-blue-600">
              <Baby size={20} />
            </div>
          </div>
          <div className="metric-value">{totalChildren}</div>
          <div className="metric-subtext">
            <span>{children.filter(c => c.category === '3y-6y').length} Preschool</span> • 
            <span> {children.filter(c => c.category === '6m-3y').length} Toddlers</span>
          </div>
        </div>

        {/* Metric 2: Today's Attendance */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Today's Attendance</span>
            <div className="metric-icon-box bg-emerald-100 text-emerald-600">
              <CalendarCheck size={20} />
            </div>
          </div>
          <div className="metric-value">{presentCount} <span className="metric-unit">/ {totalChildren}</span></div>
          <div className="metric-subtext">
            <strong className="text-emerald-600">{attendanceRate}% Rate</strong> • {attendance?.absentCount || 0} Absent
          </div>
        </div>

        {/* Metric 3: Meals Distributed */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">Supplementary Nutrition</span>
            <div className="metric-icon-box bg-amber-100 text-amber-600">
              <Utensils size={20} />
            </div>
          </div>
          <div className="metric-value">
            {hotMealServed ? 'Served ✅' : (morningSnackServed ? 'Snack Done ⏳' : 'Pending ⏳')}
          </div>
          <div className="metric-subtext">
            <span>{meal?.totalCalories || 0} kcal / {meal?.totalProtein || 0}g protein</span>
          </div>
        </div>

        {/* Metric 4: Severe Malnutrition Alerts */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-title">SAM / MAM Alerts</span>
            <div className={`metric-icon-box ${samChildren.length > 0 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-green-100 text-green-600'}`}>
              <Activity size={20} />
            </div>
          </div>
          <div className="metric-value">
            <span className={samChildren.length > 0 ? 'text-red-600' : 'text-emerald-600'}>
              {samChildren.length} SAM
            </span>
          </div>
          <div className="metric-subtext">
            <span>{children.filter(c => c.nutritionCategory === 'MAM').length} Moderate (MAM)</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Daily Checklist & Quick Action Shortcuts */}
      <div className="dashboard-main-grid">
        {/* Left Column: Today's Operational Checklist */}
        <div className="card-box">
          <div className="card-box-header">
            <div>
              <h3 className="card-box-title">Today's Daily Checklist (दैनिक कार्य सूची)</h3>
              <p className="card-box-subtitle">{completedTasks} of {tasks.length} tasks completed today</p>
            </div>
            <div className="checklist-progress-badge">
              {completionPercentage}% Complete
            </div>
          </div>

          {/* Progress bar */}
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${completionPercentage}%` }}></div>
          </div>

          <div className="checklist-items-stack">
            {tasks.map((task) => (
              <div key={task.id} className={`checklist-item ${task.done ? 'completed' : 'pending'}`}>
                <div className="checklist-icon">
                  {task.done ? (
                    <CheckCircle2 size={22} className="text-emerald-600" />
                  ) : (
                    <Clock size={22} className="text-amber-500" />
                  )}
                </div>
                <div className="checklist-info">
                  <span className={`checklist-name ${task.done ? 'line-through-dim' : ''}`}>
                    {task.name}
                  </span>
                  <span className="checklist-status">
                    {task.done ? 'Completed for today' : 'Pending entry'}
                  </span>
                </div>
                <div>
                  <Link to={task.link} className={`task-btn ${task.done ? 'btn-done' : 'btn-action'}`}>
                    {task.done ? 'View' : task.action}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Quick Action Touch Tiles */}
        <div className="card-box">
          <div className="card-box-header">
            <div>
              <h3 className="card-box-title">Quick Action Hub (त्वरित कार्य)</h3>
              <p className="card-box-subtitle">Touch to access daily entry modules</p>
            </div>
          </div>

          <div className="quick-actions-grid">
            <Link to="/attendance" className="quick-tile green">
              <div className="quick-tile-icon">
                <CalendarCheck size={28} />
              </div>
              <div className="quick-tile-title">{t('markAttendance')}</div>
              <div className="quick-tile-desc">Mark daily present/absent with 1 tap</div>
            </Link>

            <Link to="/meals" className="quick-tile amber">
              <div className="quick-tile-icon">
                <Utensils size={28} />
              </div>
              <div className="quick-tile-title">{t('recordMeal')}</div>
              <div className="quick-tile-desc">Record morning snack & hot cooked meal</div>
            </Link>

            <Link to="/growth" className="quick-tile blue">
              <div className="quick-tile-icon">
                <Activity size={28} />
              </div>
              <div className="quick-tile-title">{t('checkGrowth')}</div>
              <div className="quick-tile-desc">WHO Height & Weight growth check</div>
            </Link>

            <Link to="/activities" className="quick-tile purple">
              <div className="quick-tile-icon">
                <Sparkles size={28} />
              </div>
              <div className="quick-tile-title">{t('logActivity')}</div>
              <div className="quick-tile-desc">Preschool Baal Geet, story & art sessions</div>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Children Roster Preview */}
      <div className="card-box mt-6">
        <div className="card-box-header">
          <div>
            <h3 className="card-box-title">Center Children Registry (पंजीकृत बच्चे)</h3>
            <p className="card-box-subtitle">Showing active beneficiaries in {activeCenter?.name}</p>
          </div>
          <Link to="/children" className="link-with-arrow">
            <span>View All ({totalChildren})</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Child Name</th>
                <th>Age & Gender</th>
                <th>Category</th>
                <th>Mother / Parent</th>
                <th>Nutrition Status (WHO)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {children.slice(0, 5).map((child) => (
                <tr key={child.id}>
                  <td>
                    <div className="child-cell-flex">
                      <div className="child-avatar-circle">
                        {child.gender === 'Female' ? '👧' : '👦'}
                      </div>
                      <div>
                        <div className="child-table-name">{child.name}</div>
                        <div className="child-table-id">Aadhaar: {child.aadhaarNumber}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {Math.floor(child.ageMonths / 12)}y {child.ageMonths % 12}m • {child.gender}
                  </td>
                  <td>
                    <span className="category-pill">{child.category === '3y-6y' ? 'Preschool' : 'Toddler'}</span>
                  </td>
                  <td>
                    <div className="parent-cell">
                      <span>{child.motherName}</span>
                      <small className="text-muted"><PhoneCall size={12} className="inline-icon" /> {child.phone}</small>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${child.nutritionCategory ? child.nutritionCategory.toLowerCase() : 'normal'}`}>
                      {child.nutritionCategory === 'SAM' ? '🚨 SAM (Red)' : (child.nutritionCategory === 'MAM' ? '⚠️ MAM (Yellow)' : '✅ Normal')}
                    </span>
                  </td>
                  <td>
                    <Link to={`/growth?childId=${child.id}`} className="btn-sm-action">
                      Growth Card
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
