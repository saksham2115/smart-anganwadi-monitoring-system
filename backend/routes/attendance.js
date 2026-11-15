const express = require('express');
const router = express.Router();
const store = require('../data/store');

// Get attendance for center and date
router.get('/', (req, res) => {
  try {
    const { centerId, date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];
    const targetCenter = centerId || 'aw-102';

    let att = store.getAttendance(targetCenter, targetDate);

    // If no attendance record exists for this date yet, dynamically generate initial list from children
    if (!att) {
      const children = store.getChildren(targetCenter);
      const records = children.map(c => ({
        childId: c.id,
        childName: c.name,
        status: 'present', // default present
        remarks: ''
      }));

      att = {
        centerId: targetCenter,
        date: targetDate,
        records,
        presentCount: records.length,
        absentCount: 0,
        leaveCount: 0,
        totalCount: records.length,
        attendanceRate: records.length > 0 ? 100 : 0,
        isDraft: true
      };
    }

    res.json(att);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching attendance', error: err.message });
  }
});

// Attendance history for reports
router.get('/history', (req, res) => {
  try {
    const { centerId, limit } = req.query;
    const history = store.getAttendanceHistory(centerId, parseInt(limit, 10) || 30);
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching attendance history', error: err.message });
  }
});

// Save or update attendance
router.post('/', (req, res) => {
  try {
    const { centerId, date, records } = req.body;
    if (!records || !Array.isArray(records)) {
      return res.status(400).json({ message: 'Records array is required' });
    }

    const saved = store.saveAttendance({
      centerId: centerId || 'aw-102',
      date: date || new Date().toISOString().split('T')[0],
      records
    });

    res.status(200).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Error saving attendance', error: err.message });
  }
});

module.exports = router;
