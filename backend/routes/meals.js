const express = require('express');
const router = express.Router();
const store = require('../data/store');

// Get meal for center and date
router.get('/', (req, res) => {
  try {
    const { centerId, date } = req.query;
    const targetDate = date || new Date().toISOString().split('T')[0];
    const targetCenter = centerId || 'aw-102';

    let meal = store.getMeal(targetCenter, targetDate);

    if (!meal) {
      meal = {
        centerId: targetCenter,
        date: targetDate,
        morningSnack: {
          item: "Boiled Egg / Fresh Fruit",
          served: false,
          beneficiariesCount: 0,
          caloriesPerServing: 140,
          proteinGrams: 6.5
        },
        hotCookedMeal: {
          item: "Nutritious Dal Khichdi with Mixed Veggies",
          served: false,
          beneficiariesCount: 0,
          caloriesPerServing: 380,
          proteinGrams: 11.0
        },
        takeHomeRation: {
          item: "Poshan Dalia / Fortified Ready Mix",
          distributed: false,
          recipientsCount: 0
        },
        totalCalories: 520,
        totalProtein: 17.5,
        icdsNormMet: true,
        qualityChecked: false,
        notes: "",
        isDraft: true
      };
    }

    res.json(meal);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching meal record', error: err.message });
  }
});

// Meal distribution history
router.get('/history', (req, res) => {
  try {
    const { centerId, limit } = req.query;
    const history = store.getMealHistory(centerId, parseInt(limit, 10) || 30);
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching meal history', error: err.message });
  }
});

// Save or update meal record
router.post('/', (req, res) => {
  try {
    const { centerId, date, morningSnack, hotCookedMeal, takeHomeRation, qualityChecked, notes } = req.body;

    // Calculate total calories and protein
    let totalCalories = 0;
    let totalProtein = 0;

    if (morningSnack?.served) {
      totalCalories += (morningSnack.caloriesPerServing || 140);
      totalProtein += (morningSnack.proteinGrams || 6.5);
    }

    if (hotCookedMeal?.served) {
      totalCalories += (hotCookedMeal.caloriesPerServing || 380);
      totalProtein += (hotCookedMeal.proteinGrams || 11.0);
    }

    const saved = store.saveMeal({
      centerId: centerId || 'aw-102',
      date: date || new Date().toISOString().split('T')[0],
      morningSnack,
      hotCookedMeal,
      takeHomeRation,
      totalCalories,
      totalProtein,
      qualityChecked: qualityChecked ?? true,
      notes: notes || ''
    });

    res.status(200).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Error saving meal distribution', error: err.message });
  }
});

module.exports = router;
