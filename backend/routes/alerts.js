const express = require('express');
const router = express.Router();
const store = require('../data/store');

// Get all alerts (optionally filter by centerId)
router.get('/', (req, res) => {
  try {
    const { centerId } = req.query;
    const alerts = store.getAlerts(centerId);
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching alerts', error: err.message });
  }
});

// Update alert status (action taken, acknowledge)
router.put('/:id', (req, res) => {
  try {
    const { status, actionTaken } = req.body;
    const updated = store.updateAlert(req.params.id, {
      status: status || 'Resolved',
      actionTaken: actionTaken || 'Marked as reviewed by supervisor.'
    });

    if (!updated) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating alert', error: err.message });
  }
});

module.exports = router;
