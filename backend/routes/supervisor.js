const express = require('express');
const router = express.Router();
const store = require('../data/store');

// High-level Supervisor Dashboard API
router.get('/dashboard', (req, res) => {
  try {
    const data = store.getSupervisorDashboard();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Error loading supervisor dashboard', error: err.message });
  }
});

// Monthly Progress Report (MPR) generator
router.get('/reports/mpr', (req, res) => {
  try {
    const { centerId, month } = req.query;
    const centers = store.getCenters();
    const targetCenters = (!centerId || centerId === 'all') 
      ? centers 
      : centers.filter(c => c.id === centerId);

    const report = targetCenters.map(c => {
      const children = store.getChildren(c.id);
      const sam = children.filter(ch => ch.nutritionCategory === 'SAM').length;
      const mam = children.filter(ch => ch.nutritionCategory === 'MAM').length;
      const normal = children.filter(ch => ch.nutritionCategory === 'Normal').length;

      return {
        centerCode: c.code,
        centerName: c.name,
        sector: c.sector,
        workerName: c.workerName,
        totalEnrolled: children.length,
        preschoolEnrolled: children.filter(ch => ch.category === '3y-6y').length,
        toddlersEnrolled: children.filter(ch => ch.category === '6m-3y').length,
        normalCount: normal,
        mamCount: mam,
        samCount: sam,
        averageAttendance: '81%',
        mealsDeliveredDays: 24,
        workingDaysInMonth: 25,
        status: 'Submitted'
      };
    });

    res.json({
      month: month || 'October 2026',
      generatedDate: new Date().toISOString(),
      district: 'Rampur',
      centersReport: report
    });
  } catch (err) {
    res.status(500).json({ message: 'Error generating MPR report', error: err.message });
  }
});

module.exports = router;
