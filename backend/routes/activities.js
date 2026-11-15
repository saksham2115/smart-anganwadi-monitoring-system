const express = require('express');
const router = express.Router();
const store = require('../data/store');

// Get activities
router.get('/', (req, res) => {
  try {
    const { centerId } = req.query;
    const activities = store.getActivities(centerId);
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching activities', error: err.message });
  }
});

// Add new activity
router.post('/', (req, res) => {
  try {
    const { centerId, date, title, category, durationMinutes, childrenPresent, description, learningOutcome, photoEmoji, conductedBy } = req.body;

    if (!title || !category) {
      return res.status(400).json({ message: 'Title and category are required' });
    }

    const saved = store.addActivity({
      centerId: centerId || 'aw-102',
      date: date || new Date().toISOString().split('T')[0],
      title,
      category,
      durationMinutes: durationMinutes || 30,
      childrenPresent: childrenPresent || 0,
      description: description || '',
      learningOutcome: learningOutcome || '',
      photoEmoji: photoEmoji || '🎨',
      conductedBy: conductedBy || 'Anganwadi Worker'
    });

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Error recording activity', error: err.message });
  }
});

module.exports = router;
