const express = require('express');
const router = express.Router();
const store = require('../data/store');

// Get growth records
router.get('/', (req, res) => {
  try {
    const { centerId, childId } = req.query;
    const records = store.getGrowthRecords(centerId, childId);
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching growth records', error: err.message });
  }
});

// Add new growth measurement
router.post('/', (req, res) => {
  try {
    const { childId, centerId, date, weightKg, heightCm, ageMonths, gender, childName, notes } = req.body;

    if (!childId || !weightKg || !heightCm) {
      return res.status(400).json({ message: 'childId, weightKg, and heightCm are required' });
    }

    let child = store.getChildById(childId);

    const saved = store.addGrowthRecord({
      childId,
      centerId: centerId || (child ? child.centerId : 'aw-102'),
      childName: childName || (child ? child.name : 'Child'),
      date: date || new Date().toISOString().split('T')[0],
      weightKg: parseFloat(weightKg),
      heightCm: parseFloat(heightCm),
      ageMonths: ageMonths || (child ? child.ageMonths : 24),
      gender: gender || (child ? child.gender : 'Male'),
      notes: notes || ''
    });

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Error adding growth record', error: err.message });
  }
});

module.exports = router;
