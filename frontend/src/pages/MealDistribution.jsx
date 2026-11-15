import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { mealsApi } from '../services/api';
import { 
  Utensils, 
  Egg, 
  CheckCircle2, 
  Flame, 
  Beef, 
  Save, 
  Calendar, 
  AlertCircle, 
  Package, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  Info
} from 'lucide-react';

export default function MealDistribution() {
  const { currentCenterId, activeCenter } = useAuth();
  const todayStr = new Date().toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Form State
  const [mealData, setMealData] = useState({
    morningSnack: {
      item: 'Boiled Egg & Roasted Chana',
      served: true,
      beneficiariesCount: 7,
      caloriesPerServing: 140,
      proteinGrams: 7.2
    },
    hotCookedMeal: {
      item: 'Nutritious Moong Dal Khichdi with Spinach & Carrots',
      served: true,
      beneficiariesCount: 7,
      caloriesPerServing: 380,
      proteinGrams: 11.5
    },
    takeHomeRation: {
      item: 'Poshan Dalia / Fortified Energy Mix',
      distributed: true,
      recipientsCount: 4
    },
    qualityChecked: true,
    notes: 'Tasted by worker & helper prior to serving. Nutritious, clean, and warm.'
  });

  useEffect(() => {
    loadMealData();
  }, [currentCenterId, selectedDate]);

  const loadMealData = async () => {
    setLoading(true);
    try {
      const data = await mealsApi.getForDate(currentCenterId, selectedDate);
      if (data) {
        setMealData({
          morningSnack: data.morningSnack || { item: '', served: false, beneficiariesCount: 0, caloriesPerServing: 140, proteinGrams: 6.5 },
          hotCookedMeal: data.hotCookedMeal || { item: '', served: false, beneficiariesCount: 0, caloriesPerServing: 380, proteinGrams: 11.0 },
          takeHomeRation: data.takeHomeRation || { item: '', distributed: false, recipientsCount: 0 },
          qualityChecked: data.qualityChecked ?? true,
          notes: data.notes || ''
        });
      }
    } catch (err) {
      console.warn("Error loading meal data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMeal = async () => {
    setSaving(true);
    try {
      const result = await mealsApi.save({
        centerId: currentCenterId,
        date: selectedDate,
        ...mealData
      });

      if (result.offlineQueued) {
        setStatusMessage('Saved offline! Meal log queued for automatic synchronization.');
      } else {
        setStatusMessage('Meal distribution recorded successfully!');
      }

      setTimeout(() => setStatusMessage(''), 4000);
    } catch (err) {
      alert('Failed to save meal record: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Nutrition Totals
  const totalCalories = (mealData.morningSnack.served ? mealData.morningSnack.caloriesPerServing : 0) +
    (mealData.hotCookedMeal.served ? mealData.hotCookedMeal.caloriesPerServing : 0);

  const totalProtein = Number((
    (mealData.morningSnack.served ? mealData.morningSnack.proteinGrams : 0) +
    (mealData.hotCookedMeal.served ? mealData.hotCookedMeal.proteinGrams : 0)
  ).toFixed(1));

  const ICDS_TARGET_CALORIES = 500;
  const ICDS_TARGET_PROTEIN = 12.0;

  const isNormMet = totalCalories >= ICDS_TARGET_CALORIES && totalProtein >= ICDS_TARGET_PROTEIN;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header-flex">
        <div>
          <h1 className="page-title">Supplementary Nutrition Programme (SNP - आहार वितरण)</h1>
          <p className="page-subtitle">
            Daily meal distribution, calories, protein monitoring, and Take-Home Ration for {activeCenter?.name}
          </p>
        </div>

        <div className="date-picker-wrapper">
          <Calendar size={18} className="text-slate-500" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="attendance-date-input"
          />
        </div>
      </div>

      {statusMessage && (
        <div className="alert-callout success mb-4">
          <CheckCircle2 size={20} className="text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Real-time Nutrition Tracker Card */}
      <div className="card-box mb-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
        <div className="nutrition-meter-grid">
          <div className="nutrition-meter-item">
            <div className="flex items-center gap-2 mb-1">
              <Flame size={20} className="text-amber-500" />
              <span className="font-semibold text-slate-700">Daily Calories Delivered</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {totalCalories} <span className="text-sm font-normal text-slate-500">/ {ICDS_TARGET_CALORIES} kcal Target</span>
            </div>
            <div className="progress-track mt-2">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${Math.min(100, Math.round((totalCalories / ICDS_TARGET_CALORIES) * 100))}%`,
                  backgroundColor: totalCalories >= ICDS_TARGET_CALORIES ? '#10b981' : '#f59e0b'
                }}
              ></div>
            </div>
          </div>

          <div className="nutrition-meter-item">
            <div className="flex items-center gap-2 mb-1">
              <Beef size={20} className="text-blue-500" />
              <span className="font-semibold text-slate-700">Daily Protein Delivered</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">
              {totalProtein}g <span className="text-sm font-normal text-slate-500">/ {ICDS_TARGET_PROTEIN}g Target</span>
            </div>
            <div className="progress-track mt-2">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${Math.min(100, Math.round((totalProtein / ICDS_TARGET_PROTEIN) * 100))}%`,
                  backgroundColor: totalProtein >= ICDS_TARGET_PROTEIN ? '#10b981' : '#3b82f6'
                }}
              ></div>
            </div>
          </div>

          <div className="nutrition-meter-item flex flex-col justify-center">
            <div className={`status-pill large ${isNormMet ? 'online' : 'offline'}`}>
              {isNormMet ? (
                <>
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  <span className="font-bold text-emerald-800">ICDS Poshan Norm Met!</span>
                </>
              ) : (
                <>
                  <AlertCircle size={18} className="text-amber-600" />
                  <span className="font-bold text-amber-800">Below Standard Norm</span>
                </>
              )}
            </div>
            <small className="text-slate-500 mt-1">Preschool Standard: 500 kcal & 12-15g Protein</small>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Module 1: Morning Snack */}
        <div className="card-box">
          <div className="card-box-header">
            <div className="flex items-center gap-2">
              <div className="metric-icon-box bg-amber-100 text-amber-600">
                <Egg size={20} />
              </div>
              <div>
                <h3 className="card-box-title">1. Morning Snack (सुबह का नाश्ता)</h3>
                <p className="card-box-subtitle">Served 9:30 AM - 10:00 AM</p>
              </div>
            </div>

            <label className="toggle-switch-wrapper">
              <input
                type="checkbox"
                checked={mealData.morningSnack.served}
                onChange={(e) => setMealData(prev => ({
                  ...prev,
                  morningSnack: { ...prev.morningSnack, served: e.target.checked }
                }))}
                className="toggle-checkbox"
              />
              <span className="toggle-label font-medium">{mealData.morningSnack.served ? 'Served ✅' : 'Not Served'}</span>
            </label>
          </div>

          <div className="form-group mt-3">
            <label className="form-label">Snack Food Item (खाद्य सामग्री)</label>
            <input
              type="text"
              value={mealData.morningSnack.item}
              onChange={(e) => setMealData(prev => ({
                ...prev,
                morningSnack: { ...prev.morningSnack, item: e.target.value }
              }))}
              placeholder="e.g. Boiled Egg & Roasted Chana / Banana / Milk"
              className="form-input"
            />
          </div>

          <div className="form-grid-2 mt-3">
            <div className="form-group">
              <label className="form-label">Beneficiary Children Served</label>
              <input
                type="number"
                min="0"
                value={mealData.morningSnack.beneficiariesCount}
                onChange={(e) => setMealData(prev => ({
                  ...prev,
                  morningSnack: { ...prev.morningSnack, beneficiariesCount: parseInt(e.target.value, 10) || 0 }
                }))}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Calories (kcal per child)</label>
              <input
                type="number"
                value={mealData.morningSnack.caloriesPerServing}
                onChange={(e) => setMealData(prev => ({
                  ...prev,
                  morningSnack: { ...prev.morningSnack, caloriesPerServing: parseFloat(e.target.value) || 0 }
                }))}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Module 2: Hot Cooked Meal */}
        <div className="card-box">
          <div className="card-box-header">
            <div className="flex items-center gap-2">
              <div className="metric-icon-box bg-emerald-100 text-emerald-600">
                <Utensils size={20} />
              </div>
              <div>
                <h3 className="card-box-title">2. Hot Cooked Meal - HCM (गर्म पका भोजन)</h3>
                <p className="card-box-subtitle">Served 12:30 PM - 1:15 PM</p>
              </div>
            </div>

            <label className="toggle-switch-wrapper">
              <input
                type="checkbox"
                checked={mealData.hotCookedMeal.served}
                onChange={(e) => setMealData(prev => ({
                  ...prev,
                  hotCookedMeal: { ...prev.hotCookedMeal, served: e.target.checked }
                }))}
                className="toggle-checkbox"
              />
              <span className="toggle-label font-medium">{mealData.hotCookedMeal.served ? 'Served ✅' : 'Not Served'}</span>
            </label>
          </div>

          <div className="form-group mt-3">
            <label className="form-label">Menu Item (आज का भोजन)</label>
            <input
              type="text"
              value={mealData.hotCookedMeal.item}
              onChange={(e) => setMealData(prev => ({
                ...prev,
                hotCookedMeal: { ...prev.hotCookedMeal, item: e.target.value }
              }))}
              placeholder="e.g. Nutritious Moong Dal Khichdi with Spinach & Carrots"
              className="form-input"
            />
          </div>

          <div className="form-grid-2 mt-3">
            <div className="form-group">
              <label className="form-label">Children Served</label>
              <input
                type="number"
                min="0"
                value={mealData.hotCookedMeal.beneficiariesCount}
                onChange={(e) => setMealData(prev => ({
                  ...prev,
                  hotCookedMeal: { ...prev.hotCookedMeal, beneficiariesCount: parseInt(e.target.value, 10) || 0 }
                }))}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Calories (kcal per child)</label>
              <input
                type="number"
                value={mealData.hotCookedMeal.caloriesPerServing}
                onChange={(e) => setMealData(prev => ({
                  ...prev,
                  hotCookedMeal: { ...prev.hotCookedMeal, caloriesPerServing: parseFloat(e.target.value) || 0 }
                }))}
                className="form-input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Module 3: Take-Home Ration & Quality Sign-Off */}
      <div className="card-box mb-6">
        <div className="card-box-header">
          <div className="flex items-center gap-2">
            <Package size={20} className="text-purple-600" />
            <div>
              <h3 className="card-box-title">3. Take-Home Ration (THR) & Food Safety Check</h3>
              <p className="card-box-subtitle">For 6m-3y toddlers, pregnant women, and lactating mothers</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
          <div className="form-group">
            <label className="form-label">THR Ration Distributed</label>
            <input
              type="text"
              value={mealData.takeHomeRation.item}
              onChange={(e) => setMealData(prev => ({
                ...prev,
                takeHomeRation: { ...prev.takeHomeRation, item: e.target.value }
              }))}
              placeholder="e.g. Fortified Energy Mix / Poshan Dalia packet"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Packets Distributed Today</label>
            <input
              type="number"
              min="0"
              value={mealData.takeHomeRation.recipientsCount}
              onChange={(e) => setMealData(prev => ({
                ...prev,
                takeHomeRation: { ...prev.takeHomeRation, recipientsCount: parseInt(e.target.value, 10) || 0 }
              }))}
              className="form-input"
            />
          </div>
        </div>

        <div className="safety-check-box mt-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={mealData.qualityChecked}
              onChange={(e) => setMealData(prev => ({ ...prev, qualityChecked: e.target.checked }))}
              className="form-checkbox-large"
            />
            <div>
              <div className="font-semibold text-slate-800">
                <ShieldCheck size={16} className="inline-icon text-emerald-600" /> Taste & Quality Verification Sign-Off
              </div>
              <p className="text-xs text-slate-500">
                I certify that today's hot cooked meal and snack were tasted for temperature, freshness, hygiene, and taste by the Anganwadi Worker and Helper prior to distribution.
              </p>
            </div>
          </label>
        </div>

        <div className="form-group mt-4">
          <label className="form-label">Distribution Notes / Observations</label>
          <textarea
            value={mealData.notes}
            onChange={(e) => setMealData(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Add any notes on children satisfaction, raw ingredients quality, or helper support..."
            rows={2}
            className="form-textarea"
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleSaveMeal}
            disabled={saving}
            className="btn-primary"
          >
            <Save size={18} />
            <span>{saving ? 'Saving...' : 'Save & Submit Meal Record'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
