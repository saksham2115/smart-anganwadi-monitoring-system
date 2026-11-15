const fs = require('fs');
const path = require('path');
const seedData = require('./seedData');

const STORE_FILE = process.env.VERCEL ? path.join('/tmp', 'store.json') : path.join(__dirname, 'store.json');

class DataStore {
  constructor() {
    this.data = {
      centers: [...seedData.centers],
      users: [...seedData.users],
      children: [...seedData.children],
      attendances: [...seedData.attendances],
      meals: [...seedData.meals],
      growthRecords: [...seedData.growthRecords],
      activities: [...seedData.activities],
      alerts: [...seedData.alerts]
    };
    this.loadFromFile();
  }

  loadFromFile() {
    try {
      if (fs.existsSync(STORE_FILE)) {
        const fileContent = fs.readFileSync(STORE_FILE, 'utf-8');
        if (fileContent && fileContent.trim()) {
          const parsed = JSON.parse(fileContent);
          this.data = { ...this.data, ...parsed };
        }
      }
    } catch (err) {
      console.warn("Could not load store.json, using seed defaults:", err.message);
    }
  }

  saveToFile() {
    try {
      fs.writeFileSync(STORE_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.warn("Could not persist to store.json:", err.message);
    }
  }

  // Children
  getChildren(centerId) {
    if (!centerId || centerId === 'all') return this.data.children;
    return this.data.children.filter(c => c.centerId === centerId);
  }

  getChildById(id) {
    return this.data.children.find(c => c.id === id);
  }

  addChild(child) {
    const newChild = {
      id: child.id || `c-${Date.now()}`,
      registeredDate: child.registeredDate || new Date().toISOString().split('T')[0],
      nutritionCategory: child.nutritionCategory || 'Normal',
      photo: child.photo || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
      ...child
    };
    this.data.children.unshift(newChild);
    this.saveToFile();
    return newChild;
  }

  updateChild(id, updates) {
    const index = this.data.children.findIndex(c => c.id === id);
    if (index === -1) return null;
    this.data.children[index] = { ...this.data.children[index], ...updates };
    this.saveToFile();
    return this.data.children[index];
  }

  deleteChild(id) {
    const index = this.data.children.findIndex(c => c.id === id);
    if (index === -1) return false;
    this.data.children.splice(index, 1);
    this.saveToFile();
    return true;
  }

  // Centers
  getCenters() {
    return this.data.centers;
  }

  getCenterById(id) {
    return this.data.centers.find(c => c.id === id);
  }

  // Attendance
  getAttendance(centerId, date) {
    return this.data.attendances.find(a => 
      (!centerId || centerId === 'all' || a.centerId === centerId) && 
      (!date || a.date === date)
    );
  }

  getAttendanceHistory(centerId, limit = 30) {
    let list = this.data.attendances;
    if (centerId && centerId !== 'all') {
      list = list.filter(a => a.centerId === centerId);
    }
    return list.slice(0, limit);
  }

  saveAttendance(attendancePayload) {
    const today = attendancePayload.date || new Date().toISOString().split('T')[0];
    const centerId = attendancePayload.centerId || 'aw-102';
    
    // Calculate stats
    const records = attendancePayload.records || [];
    const presentCount = records.filter(r => r.status === 'present').length;
    const absentCount = records.filter(r => r.status === 'absent').length;
    const leaveCount = records.filter(r => r.status === 'leave').length;
    const totalCount = records.length;
    const attendanceRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

    const existingIdx = this.data.attendances.findIndex(a => a.centerId === centerId && a.date === today);
    const entry = {
      id: existingIdx !== -1 ? this.data.attendances[existingIdx].id : `att-${Date.now()}`,
      centerId,
      date: today,
      records,
      presentCount,
      absentCount,
      leaveCount,
      totalCount,
      attendanceRate
    };

    if (existingIdx !== -1) {
      this.data.attendances[existingIdx] = entry;
    } else {
      this.data.attendances.unshift(entry);
    }

    // Check for chronic absenteeism (3 consecutive absences)
    records.forEach(rec => {
      if (rec.status === 'absent') {
        const pastRecords = this.data.attendances
          .filter(a => a.centerId === centerId && a.date !== today)
          .slice(0, 2);
        
        const wasAbsentBefore = pastRecords.every(att => {
          const r = att.records.find(item => item.childId === rec.childId);
          return r && r.status === 'absent';
        });

        if (wasAbsentBefore && pastRecords.length >= 2) {
          // Check if alert already exists
          const existingAlert = this.data.alerts.find(
            al => al.childId === rec.childId && al.type === 'chronic_absenteeism' && al.status === 'Pending'
          );
          if (!existingAlert) {
            this.addAlert({
              type: 'chronic_absenteeism',
              severity: 'warning',
              centerId,
              centerName: this.getCenterById(centerId)?.name || centerId,
              childId: rec.childId,
              childName: rec.childName,
              title: `Chronic Absenteeism Flag (3+ days)`,
              message: `${rec.childName} has missed 3 consecutive attendance sessions. Home follow-up recommended.`,
              status: 'Pending'
            });
          }
        }
      }
    });

    this.saveToFile();
    return entry;
  }

  // Meals
  getMeal(centerId, date) {
    return this.data.meals.find(m => 
      (!centerId || centerId === 'all' || m.centerId === centerId) && 
      (!date || m.date === date)
    );
  }

  getMealHistory(centerId, limit = 30) {
    let list = this.data.meals;
    if (centerId && centerId !== 'all') {
      list = list.filter(m => m.centerId === centerId);
    }
    return list.slice(0, limit);
  }

  saveMeal(mealPayload) {
    const today = mealPayload.date || new Date().toISOString().split('T')[0];
    const centerId = mealPayload.centerId || 'aw-102';

    const existingIdx = this.data.meals.findIndex(m => m.centerId === centerId && m.date === today);
    const entry = {
      id: existingIdx !== -1 ? this.data.meals[existingIdx].id : `m-${Date.now()}`,
      centerId,
      date: today,
      morningSnack: mealPayload.morningSnack || { served: false, item: '', beneficiariesCount: 0, caloriesPerServing: 0, proteinGrams: 0 },
      hotCookedMeal: mealPayload.hotCookedMeal || { served: false, item: '', beneficiariesCount: 0, caloriesPerServing: 0, proteinGrams: 0 },
      takeHomeRation: mealPayload.takeHomeRation || { distributed: false, item: '', recipientsCount: 0 },
      totalCalories: mealPayload.totalCalories || 0,
      totalProtein: mealPayload.totalProtein || 0,
      icdsNormMet: (mealPayload.totalCalories || 0) >= 450,
      qualityChecked: mealPayload.qualityChecked ?? true,
      notes: mealPayload.notes || ''
    };

    if (existingIdx !== -1) {
      this.data.meals[existingIdx] = entry;
    } else {
      this.data.meals.unshift(entry);
    }
    this.saveToFile();
    return entry;
  }

  // Growth Records
  getGrowthRecords(centerId, childId) {
    let list = this.data.growthRecords;
    if (centerId && centerId !== 'all') {
      list = list.filter(g => g.centerId === centerId);
    }
    if (childId) {
      list = list.filter(g => g.childId === childId);
    }
    return list;
  }

  addGrowthRecord(record) {
    const weight = parseFloat(record.weightKg);
    const height = parseFloat(record.heightCm);
    const ageMonths = parseInt(record.ageMonths, 10);
    const gender = record.gender || 'Male';

    // Calculate BMI
    let bmi = 0;
    if (height > 0) {
      const heightM = height / 100;
      bmi = parseFloat((weight / (heightM * heightM)).toFixed(1));
    }

    // WHO Simplified Growth Classification based on age & weight
    // Median 24m: ~12.2kg (M), 11.5kg (F). -2SD: ~10.2kg, -3SD: ~9.0kg
    // Median 36m: ~14.3kg (M), 13.9kg (F). -2SD: ~12.0kg, -3SD: ~10.8kg
    // Median 48m: ~16.3kg (M), 16.0kg (F). -2SD: ~13.6kg, -3SD: ~12.0kg
    let expectedMedianWeight = 8.5 + (ageMonths * 0.18);
    let sd2Limit = expectedMedianWeight * 0.82;
    let sd3Limit = expectedMedianWeight * 0.72;

    let overallCategory = "Normal";
    let wfaStatus = "Normal";

    if (weight < sd3Limit) {
      overallCategory = "SAM"; // Severely Acute Malnourished
      wfaStatus = "Severely Underweight";
    } else if (weight < sd2Limit) {
      overallCategory = "MAM"; // Moderately Acute Malnourished
      wfaStatus = "Moderately Underweight";
    }

    const newRecord = {
      id: `gr-${Date.now()}`,
      date: record.date || new Date().toISOString().split('T')[0],
      bmi,
      wfaStatus,
      hfaStatus: record.hfaStatus || "Normal",
      wfhStatus: overallCategory,
      overallCategory,
      ...record,
      weightKg: weight,
      heightCm: height
    };

    this.data.growthRecords.unshift(newRecord);

    // Update child record category
    if (record.childId) {
      this.updateChild(record.childId, { nutritionCategory: overallCategory });
    }

    // Trigger alert if SAM
    if (overallCategory === 'SAM') {
      this.addAlert({
        type: 'malnutrition_sam',
        severity: 'critical',
        centerId: record.centerId || 'aw-102',
        centerName: this.getCenterById(record.centerId)?.name || 'Anganwadi Center',
        childId: record.childId,
        childName: record.childName,
        title: `CRITICAL: Severe Malnutrition (SAM) Recorded`,
        message: `${record.childName} (${record.ageMonths}m) recorded weight ${weight}kg and height ${height}cm, placing them in the WHO Red Zone (SAM). Immediate medical referral & supplementary nutrition required.`,
        status: 'Action Required'
      });
    }

    this.saveToFile();
    return newRecord;
  }

  // Activities
  getActivities(centerId) {
    if (!centerId || centerId === 'all') return this.data.activities;
    return this.data.activities.filter(a => a.centerId === centerId);
  }

  addActivity(activity) {
    const newActivity = {
      id: `act-${Date.now()}`,
      date: activity.date || new Date().toISOString().split('T')[0],
      childrenPresent: parseInt(activity.childrenPresent, 10) || 0,
      durationMinutes: parseInt(activity.durationMinutes, 10) || 30,
      ...activity
    };
    this.data.activities.unshift(newActivity);
    this.saveToFile();
    return newActivity;
  }

  // Alerts
  getAlerts(centerId) {
    if (!centerId || centerId === 'all') return this.data.alerts;
    return this.data.alerts.filter(a => a.centerId === centerId);
  }

  addAlert(alert) {
    const newAlert = {
      id: `alt-${Date.now()}`,
      date: alert.date || new Date().toISOString().split('T')[0],
      status: alert.status || 'Action Required',
      actionTaken: alert.actionTaken || '',
      ...alert
    };
    this.data.alerts.unshift(newAlert);
    this.saveToFile();
    return newAlert;
  }

  updateAlert(id, updates) {
    const index = this.data.alerts.findIndex(a => a.id === id);
    if (index === -1) return null;
    this.data.alerts[index] = { ...this.data.alerts[index], ...updates };
    this.saveToFile();
    return this.data.alerts[index];
  }

  // Supervisor Aggregates
  getSupervisorDashboard() {
    const totalCenters = this.data.centers.length;
    const totalChildren = this.data.children.length;
    
    // Today's attendance across all centers
    const todayStr = new Date().toISOString().split('T')[0];
    const todayAtts = this.data.attendances.filter(a => a.date === todayStr);
    const totalPresent = todayAtts.reduce((sum, a) => sum + (a.presentCount || 0), 0);
    const totalEnrolledInMarked = todayAtts.reduce((sum, a) => sum + (a.totalCount || 0), 0);
    const avgAttendanceRate = totalEnrolledInMarked > 0 ? Math.round((totalPresent / totalEnrolledInMarked) * 100) : 78;

    // Nutrition distribution
    const samCount = this.data.children.filter(c => c.nutritionCategory === 'SAM').length;
    const mamCount = this.data.children.filter(c => c.nutritionCategory === 'MAM').length;
    const normalCount = this.data.children.filter(c => c.nutritionCategory === 'Normal').length;

    // Centers with missing meals today
    const centersWithMealsToday = new Set(this.data.meals.filter(m => m.date === todayStr).map(m => m.centerId));
    const centersMissingMeals = this.data.centers.filter(c => !centersWithMealsToday.has(c.id));

    // Center stats breakdown
    const centerBreakdowns = this.data.centers.map(c => {
      const cChildren = this.data.children.filter(ch => ch.centerId === c.id);
      const cAtt = this.data.attendances.find(a => a.centerId === c.id && a.date === todayStr);
      const cMeal = this.data.meals.find(m => m.centerId === c.id && m.date === todayStr);
      const cSam = cChildren.filter(ch => ch.nutritionCategory === 'SAM').length;
      const cMam = cChildren.filter(ch => ch.nutritionCategory === 'MAM').length;

      return {
        ...c,
        enrolledCount: cChildren.length,
        todayAttendanceRate: cAtt ? cAtt.attendanceRate : 0,
        todayAttendanceMarked: !!cAtt,
        todayMealServed: !!cMeal && (cMeal.hotCookedMeal?.served || cMeal.morningSnack?.served),
        samCount: cSam,
        mamCount: cMam
      };
    });

    return {
      kpi: {
        totalCenters,
        totalChildren,
        avgAttendanceRate,
        samCount,
        mamCount,
        normalCount,
        pendingReportsCount: centersMissingMeals.length,
        activeAlertsCount: this.data.alerts.filter(a => a.status !== 'Resolved').length
      },
      centerBreakdowns,
      recentAlerts: this.data.alerts.slice(0, 10),
      recentActivities: this.data.activities.slice(0, 6)
    };
  }
}

const store = new DataStore();
module.exports = store;
