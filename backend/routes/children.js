const express = require('express');
const router = express.Router();
const store = require('../data/store');

// List children with optional centerId query
router.get('/', (req, res) => {
  try {
    const { centerId, search, category, nutrition } = req.query;
    let list = store.getChildren(centerId);

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c => 
        c.name.toLowerCase().includes(q) || 
        c.motherName.toLowerCase().includes(q) || 
        c.fatherName.toLowerCase().includes(q)
      );
    }

    if (category) {
      list = list.filter(c => c.category === category);
    }

    if (nutrition) {
      list = list.filter(c => c.nutritionCategory === nutrition);
    }

    res.json(list);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching children', error: err.message });
  }
});

// Get single child with growth history
router.get('/:id', (req, res) => {
  try {
    const child = store.getChildById(req.params.id);
    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }
    const growthHistory = store.getGrowthRecords(null, child.id);
    res.json({
      ...child,
      growthHistory
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching child details', error: err.message });
  }
});

// Add new child
router.post('/', (req, res) => {
  try {
    const { name, dob, gender, motherName, fatherName, phone, centerId, category, bloodGroup, aadhaarNumber, address } = req.body;
    
    if (!name || !dob || !gender) {
      return res.status(400).json({ message: 'Name, DOB, and Gender are required' });
    }

    // Calculate age in months
    const birthDate = new Date(dob);
    const now = new Date();
    const ageMonths = Math.max(1, Math.round((now - birthDate) / (1000 * 60 * 60 * 24 * 30.4375)));

    const newChild = store.addChild({
      name,
      dob,
      gender,
      ageMonths,
      motherName: motherName || 'Mother',
      fatherName: fatherName || 'Father',
      phone: phone || '',
      centerId: centerId || 'aw-102',
      category: category || (ageMonths > 36 ? '3y-6y' : '6m-3y'),
      bloodGroup: bloodGroup || 'B+',
      aadhaarNumber: aadhaarNumber || 'Pending',
      address: address || '',
      immunizationStatus: 'Up to Date',
      nutritionCategory: 'Normal'
    });

    res.status(201).json(newChild);
  } catch (err) {
    res.status(500).json({ message: 'Error adding child', error: err.message });
  }
});

// Update child
router.put('/:id', (req, res) => {
  try {
    const updated = store.updateChild(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ message: 'Child not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating child', error: err.message });
  }
});

// Delete child
router.delete('/:id', (req, res) => {
  try {
    const success = store.deleteChild(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'Child not found' });
    }
    res.json({ success: true, message: 'Child record deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting child', error: err.message });
  }
});

module.exports = router;
