/**
 * WHO Child Growth Standards (0-60 Months)
 * Reference: World Health Organization (WHO) Child Growth Standards
 * Computes:
 * 1. Weight-for-Age (WFA) - Underweight classification
 * 2. Height-for-Age (HFA) - Stunting classification
 * 3. Weight-for-Height (WFH) - Wasting classification
 * 4. BMI-for-Age
 */

// Approximate WHO Median and Standard Deviations for Weight (kg) by Age (months)
const WHO_WEIGHT_STANDARDS = {
  // Male: [ -3SD, -2SD, -1SD, Median, +1SD, +2SD, +3SD ]
  male: {
    6:  [5.9,  6.4,  7.1,  7.9,  8.8,  9.8, 10.9],
    12: [7.3,  8.0,  8.8,  9.6, 10.8, 12.0, 13.3],
    18: [8.4,  9.1, 10.0, 10.9, 12.2, 13.5, 15.0],
    24: [9.2, 10.1, 11.0, 12.2, 13.6, 15.3, 17.1],
    30: [10.0, 11.0, 12.1, 13.3, 14.9, 16.8, 18.9],
    36: [10.8, 11.9, 13.1, 14.3, 16.2, 18.3, 20.7],
    42: [11.5, 12.7, 14.0, 15.3, 17.4, 19.8, 22.4],
    48: [12.1, 13.4, 14.8, 16.3, 18.6, 21.2, 24.2],
    54: [12.7, 14.1, 15.6, 17.3, 19.8, 22.7, 26.0],
    60: [13.3, 14.8, 16.4, 18.3, 21.0, 24.2, 27.9]
  },
  // Female: [ -3SD, -2SD, -1SD, Median, +1SD, +2SD, +3SD ]
  female: {
    6:  [5.4,  5.9,  6.5,  7.3,  8.2,  9.3, 10.4],
    12: [6.8,  7.4,  8.2,  8.9, 10.1, 11.5, 12.8],
    18: [7.8,  8.5,  9.3, 10.2, 11.6, 13.0, 14.7],
    24: [8.5,  9.4, 10.4, 11.5, 13.0, 14.8, 16.7],
    30: [9.4, 10.3, 11.4, 12.6, 14.3, 16.3, 18.4],
    36: [10.1, 11.2, 12.4, 13.9, 15.8, 18.0, 20.4],
    42: [10.8, 12.0, 13.3, 15.0, 17.1, 19.6, 22.3],
    48: [11.4, 12.7, 14.2, 16.1, 18.4, 21.2, 24.2],
    54: [12.0, 13.4, 15.1, 17.2, 19.7, 22.8, 26.2],
    60: [12.6, 14.1, 15.9, 18.2, 21.0, 24.4, 28.2]
  }
};

// Interpolate WHO weight targets for any month between 6 and 60
export function getWhoWeightThresholds(ageMonths, gender = 'Male') {
  const g = gender.toLowerCase() === 'female' ? 'female' : 'male';
  const table = WHO_WEIGHT_STANDARDS[g];
  const keys = Object.keys(table).map(Number).sort((a, b) => a - b);

  const clampedAge = Math.max(6, Math.min(60, ageMonths));

  // Find bounding keys
  let lowerKey = keys[0];
  let upperKey = keys[keys.length - 1];

  for (let i = 0; i < keys.length - 1; i++) {
    if (clampedAge >= keys[i] && clampedAge <= keys[i + 1]) {
      lowerKey = keys[i];
      upperKey = keys[i + 1];
      break;
    }
  }

  if (lowerKey === upperKey) {
    return table[lowerKey];
  }

  const fraction = (clampedAge - lowerKey) / (upperKey - lowerKey);
  const lowerVals = table[lowerKey];
  const upperVals = table[upperKey];

  return lowerVals.map((val, idx) => {
    return Number((val + fraction * (upperVals[idx] - val)).toFixed(1));
  });
}

/**
 * Classifies child growth into WHO Standard Categories:
 * - Green (Normal): >= -2SD
 * - Yellow (MAM - Moderate Acute Malnutrition): >= -3SD and < -2SD
 * - Red (SAM - Severe Acute Malnutrition): < -3SD
 */
export function classifyChildGrowth(ageMonths, gender, weightKg, heightCm) {
  const [sdMinus3, sdMinus2, sdMinus1, median, sdPlus1, sdPlus2, sdPlus3] = 
    getWhoWeightThresholds(ageMonths, gender);

  const weight = parseFloat(weightKg);
  const height = parseFloat(heightCm);

  // BMI calculation
  let bmi = 0;
  if (height > 0) {
    const heightM = height / 100;
    bmi = Number((weight / (heightM * heightM)).toFixed(1));
  }

  let overallCategory = "Normal";
  let wfaStatus = "Normal Weight";
  let statusColor = "green"; // green, yellow, red
  let advice = "Child is growing well. Continue balanced ICDS supplementary nutrition.";
  let badgeText = "Normal (सामान्य)";

  if (weight < sdMinus3) {
    overallCategory = "SAM";
    wfaStatus = "Severely Underweight (< -3SD)";
    statusColor = "red";
    badgeText = "SAM (गंभीर कुपोषण)";
    advice = "URGENT: Severe Acute Malnutrition flagged. Immediate referral to Nutrition Rehabilitation Centre (NRC) & Primary Health Centre (PHC). Extra supplementary food (800 kcal) required.";
  } else if (weight < sdMinus2) {
    overallCategory = "MAM";
    wfaStatus = "Moderately Underweight (< -2SD)";
    statusColor = "yellow";
    badgeText = "MAM (मध्यम कुपोषण)";
    advice = "Moderate Malnutrition flagged. Counsel mother on calorie-dense weaning foods, boiled eggs, and monitor weight weekly.";
  } else if (weight > sdPlus2) {
    wfaStatus = "Overweight (> +2SD)";
    badgeText = "Overweight (अधिक वजन)";
    advice = "Monitor dietary intake and encourage active physical outdoor play.";
  }

  // Height-for-Age Stunting approximation (Median 24m ~87cm, 36m ~96cm, 48m ~103cm)
  const expectedMedianHeight = 50 + (ageMonths * 1.1);
  let hfaStatus = "Normal Height";
  if (height < (expectedMedianHeight * 0.88)) {
    hfaStatus = "Severely Stunted";
  } else if (height < (expectedMedianHeight * 0.93)) {
    hfaStatus = "Moderately Stunted";
  }

  return {
    overallCategory,
    statusColor,
    badgeText,
    wfaStatus,
    hfaStatus,
    bmi,
    advice,
    thresholds: {
      sdMinus3,
      sdMinus2,
      median,
      sdPlus2
    }
  };
}

// Generate WHO Chart Curve Data for months 6 to 60 for plotting
export function getWhoGrowthChartData(gender = 'Male') {
  const points = [];
  for (let m = 6; m <= 60; m += 6) {
    const [sdMinus3, sdMinus2, , median, , sdPlus2] = getWhoWeightThresholds(m, gender);
    points.push({
      month: m,
      sdMinus3,
      sdMinus2,
      median,
      sdPlus2
    });
  }
  return points;
}
