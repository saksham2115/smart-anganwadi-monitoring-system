import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import WorkerDashboard from './pages/WorkerDashboard';
import SupervisorDashboard from './pages/SupervisorDashboard';
import ChildrenManagement from './pages/ChildrenManagement';
import AttendanceManagement from './pages/AttendanceManagement';
import MealDistribution from './pages/MealDistribution';
import GrowthMonitoring from './pages/GrowthMonitoring';
import ActivityManagement from './pages/ActivityManagement';
import ReportsPage from './pages/ReportsPage';
import Login from './pages/Login';

// Main App Layout
function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isSupervisor } = useAuth();

  // If user is not logged in, redirect to login
  if (!user) {
    return <Login />;
  }

  return (
    <div className="app-root-layout">
      <Navbar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
      <div className="app-body-container">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="app-main-content">
          <Routes>
            <Route path="/" element={isSupervisor ? <SupervisorDashboard /> : <WorkerDashboard />} />
            <Route path="/supervisor" element={<SupervisorDashboard />} />
            <Route path="/children" element={<ChildrenManagement />} />
            <Route path="/attendance" element={<AttendanceManagement />} />
            <Route path="/meals" element={<MealDistribution />} />
            <Route path="/growth" element={<GrowthMonitoring />} />
            <Route path="/activities" element={<ActivityManagement />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </Router>
  );
}
