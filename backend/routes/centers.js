const express = require('express');
const router = express.Router();
const store = require('../data/store');

// List all Anganwadi centres
router.get('/', (req, res) => {
  try {
    const centers = store.getCenters();
    res.json(centers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching centers', error: err.message });
  }
});

// Single center
router.get('/:id', (req, res) => {
  try {
    const center = store.getCenterById(req.params.id);
    if (!center) {
      return res.status(404).json({ message: 'Center not found' });
    }
    const children = store.getChildren(center.id);
    res.json({ ...center, childrenCount: children.length });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching center details', error: err.message });
  }
});

module.exports = router;
