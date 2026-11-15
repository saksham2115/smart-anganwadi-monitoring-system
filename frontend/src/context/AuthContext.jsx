import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, centersApi, getOfflineQueue, syncPendingQueue } from '../services/api';

const AuthContext = createContext();

// Bilingual dictionary (English & Hindi)
const translations = {
  en: {
    appTitle: "Smart Anganwadi",
    appSubtitle: "Child Development & Centre Monitoring Platform",
    navDashboard: "Dashboard",
    navChildren: "Children Registry",
    navAttendance: "Attendance",
    navMeals: "Meal Distribution",
    navGrowth: "Growth & Nutrition",
    navActivities: "Daily Activities",
    navSupervisor: "Supervisor Hub",
    navReports: "Monthly Reports",
    online: "Online",
    offline: "Offline",
    syncNow: "Sync Now",
    syncing: "Syncing...",
    syncedSuccess: "All offline records synchronized!",
    welcome: "Welcome",
    center: "Centre",
    worker: "Anganwadi Worker",
    supervisor: "Supervisor (CDPO)",
    today: "Today",
    logout: "Logout",
    switchRole: "Switch Role",
    preschool: "Preschool (3-6 yrs)",
    toddler: "Toddlers (6m-3 yrs)",
    normal: "Normal",
    mam: "MAM (Moderate)",
    sam: "SAM (Severe Alert)",
    markAttendance: "Mark Attendance",
    recordMeal: "Record Meals",
    checkGrowth: "Record Growth",
    logActivity: "Log Activity",
    addNewChild: "Add Child",
    quickActions: "Quick Actions",
    todayOverview: "Today's Center Overview"
  },
  hi: {
    appTitle: "स्मार्ट आंगनवाड़ी",
    appSubtitle: "बाल विकास एवं केंद्र निगरानी प्रणाली",
    navDashboard: "डैशबोर्ड",
    navChildren: "बच्चे (रजिस्टर)",
    navAttendance: "दैनिक उपस्थिति",
    navMeals: "आहार वितरण (पोषण)",
    navGrowth: "वृद्धि व पोषण जांच",
    navActivities: "दैनिक गतिविधियाँ",
    navSupervisor: "पर्यवेक्षक केंद्र",
    navReports: "मासिक रिपोर्ट (MPR)",
    online: "ऑनलाइन",
    offline: "ऑफ़लाइन",
    syncNow: "अभी सिंक करें",
    syncing: "सिंक हो रहा है...",
    syncedSuccess: "सभी ऑफ़लाइन रिकॉर्ड सिंक हो गए!",
    welcome: "स्वागत है",
    center: "आंगनवाड़ी केंद्र",
    worker: "आंगनवाड़ी कार्यकर्ता",
    supervisor: "पर्यवेक्षक (सी.डी.पी.ओ.)",
    today: "आज",
    logout: "लॉगआउट",
    switchRole: "भूमिका बदलें",
    preschool: "पूर्व-प्राथमिक (3-6 वर्ष)",
    toddler: "शिशु (6 माह - 3 वर्ष)",
    normal: "सामान्य",
    mam: "मध्यम कुपोषण (MAM)",
    sam: "गंभीर कुपोषण (SAM)",
    markAttendance: "उपस्थिति दर्ज करें",
    recordMeal: "आहार दर्ज करें",
    checkGrowth: "वजन व ऊंचाई मापें",
    logActivity: "गतिविधि जोड़ें",
    addNewChild: "नया बच्चा जोड़ें",
    quickActions: "त्वरित कार्य",
    todayOverview: "आज की केंद्र समीक्षा"
  }
};

export const AuthProvider = ({ children }) => {
  // Initial demo user (Anganwadi Worker default)
  const defaultWorkerUser = {
    id: "u-1",
    name: "Smt. Meena Kumari",
    email: "worker@anganwadi.gov.in",
    role: "worker",
    centerId: "aw-102",
    centerName: "Rampur West (AW-102)",
    phone: "+91 98765 43211",
    designation: "Anganwadi Worker (AWW)"
  };

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('anganwadi_user');
      return saved ? JSON.parse(saved) : defaultWorkerUser;
    } catch (e) {
      return defaultWorkerUser;
    }
  });

  const [centers, setCenters] = useState([
    { id: "aw-101", code: "AW-101", name: "Rampur East Anganwadi Centre", workerName: "Smt. Sunita Devi" },
    { id: "aw-102", code: "AW-102", name: "Rampur West Anganwadi Centre", workerName: "Smt. Meena Kumari" },
    { id: "aw-103", code: "AW-103", name: "Shantinagar Anganwadi Centre", workerName: "Smt. Geeta Rawat" },
    { id: "aw-104", code: "AW-104", name: "Kalyanpur Gram Anganwadi Centre", workerName: "Smt. Pushpa Yadav" }
  ]);

  const [currentCenterId, setCurrentCenterId] = useState(() => {
    return user?.centerId && user?.centerId !== 'all' ? user.centerId : 'aw-102';
  });

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('anganwadi_lang') || 'en';
  });

  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [offlineQueueCount, setOfflineQueueCount] = useState(() => getOfflineQueue().length);
  const [isSyncing, setIsSyncing] = useState(false);

  // Monitor online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const handleQueueChange = (e) => setOfflineQueueCount(e.detail?.count || 0);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('anganwadi_sync_queue_updated', handleQueueChange);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('anganwadi_sync_queue_updated', handleQueueChange);
    };
  }, []);

  // Fetch centers from backend on start
  useEffect(() => {
    centersApi.getAll().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setCenters(data);
      }
    }).catch(() => {
      // Keep seeded fallback
    });
  }, []);

  // Sync user changes to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('anganwadi_user', JSON.stringify(user));
      if (user.role === 'worker' && user.centerId) {
        setCurrentCenterId(user.centerId);
      }
    } else {
      localStorage.removeItem('anganwadi_user');
      localStorage.removeItem('anganwadi_token');
    }
  }, [user]);

  // Language toggle
  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'hi' : 'en';
    setLanguage(nextLang);
    localStorage.setItem('anganwadi_lang', nextLang);
  };

  // Translation helper
  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  // Fast 1-click switch between Worker and Supervisor roles
  const switchRole = () => {
    if (user?.role === 'worker') {
      const supervisorUser = {
        id: "u-2",
        name: "Dr. Ananya Sharma",
        email: "supervisor@anganwadi.gov.in",
        role: "supervisor",
        centerId: "all",
        centerName: "All Centres (Rampur District)",
        phone: "+91 98123 45678",
        designation: "Child Development Project Officer (CDPO)"
      };
      setUser(supervisorUser);
    } else {
      setUser(defaultWorkerUser);
      setCurrentCenterId('aw-102');
    }
  };

  const loginAsRole = async (targetRole) => {
    try {
      const res = await authApi.login({ role: targetRole });
      if (res && res.user) {
        setUser(res.user);
        if (res.token) localStorage.setItem('anganwadi_token', res.token);
        if (res.user.centerId && res.user.centerId !== 'all') {
          setCurrentCenterId(res.user.centerId);
        }
      }
    } catch (err) {
      // Fallback in case of network issue
      if (targetRole === 'supervisor') {
        setUser({
          id: "u-2",
          name: "Dr. Ananya Sharma",
          email: "supervisor@anganwadi.gov.in",
          role: "supervisor",
          centerId: "all",
          centerName: "All Centres (Rampur District)",
          phone: "+91 98123 45678",
          designation: "Child Development Project Officer (CDPO)"
        });
      } else {
        setUser(defaultWorkerUser);
        setCurrentCenterId('aw-102');
      }
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('anganwadi_user');
    localStorage.removeItem('anganwadi_token');
  };

  const triggerSync = async () => {
    setIsSyncing(true);
    try {
      const result = await syncPendingQueue();
      setOfflineQueueCount(result.remainingCount || 0);
      return result;
    } finally {
      setIsSyncing(false);
    }
  };

  const activeCenter = centers.find(c => c.id === currentCenterId) || centers[0];

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      role: user?.role || 'worker',
      isSupervisor: user?.role === 'supervisor',
      centers,
      currentCenterId,
      setCurrentCenterId,
      activeCenter,
      language,
      toggleLanguage,
      t,
      switchRole,
      loginAsRole,
      logout,
      isOnline,
      offlineQueueCount,
      isSyncing,
      triggerSync
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
