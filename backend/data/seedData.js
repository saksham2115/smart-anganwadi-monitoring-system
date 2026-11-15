// Realistic Seed Data for Smart Anganwadi Monitoring System
const centers = [
  {
    id: "aw-101",
    name: "Rampur East Anganwadi Centre",
    code: "AW-101",
    sector: "Sector 2, Rampur",
    district: "Rampur",
    state: "Uttar Pradesh",
    workerName: "Smt. Sunita Devi",
    workerPhone: "+91 98765 43210",
    helperName: "Kanti Bai",
    childrenCount: 18,
    status: "Active"
  },
  {
    id: "aw-102",
    name: "Rampur West Anganwadi Centre",
    code: "AW-102",
    sector: "Sector 4, Rampur",
    district: "Rampur",
    state: "Uttar Pradesh",
    workerName: "Smt. Meena Kumari",
    workerPhone: "+91 98765 43211",
    helperName: "Rani Verma",
    childrenCount: 22,
    status: "Active"
  },
  {
    id: "aw-103",
    name: "Shantinagar Anganwadi Centre",
    code: "AW-103",
    sector: "Ward 8, Shantinagar",
    district: "Rampur",
    state: "Uttar Pradesh",
    workerName: "Smt. Geeta Rawat",
    workerPhone: "+91 98765 43212",
    helperName: "Sumitra Devi",
    childrenCount: 16,
    status: "Active"
  },
  {
    id: "aw-104",
    name: "Kalyanpur Gram Anganwadi Centre",
    code: "AW-104",
    sector: "Gram Kalyanpur",
    district: "Rampur",
    state: "Uttar Pradesh",
    workerName: "Smt. Pushpa Yadav",
    workerPhone: "+91 98765 43213",
    helperName: "Radha Kumari",
    childrenCount: 20,
    status: "Active"
  }
];

const users = [
  {
    id: "u-1",
    name: "Smt. Meena Kumari",
    email: "worker@anganwadi.gov.in",
    password: "worker123", // In prod, hashed
    role: "worker",
    centerId: "aw-102",
    centerName: "Rampur West Anganwadi Centre (AW-102)",
    phone: "+91 98765 43211"
  },
  {
    id: "u-2",
    name: "Dr. Ananya Sharma",
    email: "supervisor@anganwadi.gov.in",
    password: "supervisor123",
    role: "supervisor",
    designation: "Child Development Project Officer (CDPO)",
    centerId: "all",
    district: "Rampur",
    phone: "+91 98123 45678"
  }
];

const children = [
  {
    id: "c-1",
    centerId: "aw-102",
    name: "Aarav Sharma",
    gender: "Male",
    dob: "2023-04-15", // ~3.5 years old
    ageMonths: 42,
    motherName: "Sunita Sharma",
    fatherName: "Ramesh Sharma",
    phone: "+91 98234 11223",
    category: "3y-6y", // preschool
    bloodGroup: "B+",
    aadhaarNumber: "XXXX-XXXX-4589",
    address: "House 42, Gali 3, Rampur West",
    registeredDate: "2024-01-10",
    immunizationStatus: "Complete",
    nutritionCategory: "Normal", // Normal, MAM, SAM
    photo: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "c-2",
    centerId: "aw-102",
    name: "Ananya Patel",
    gender: "Female",
    dob: "2024-01-20", // ~2.8 years old
    ageMonths: 33,
    motherName: "Pooja Patel",
    fatherName: "Kishore Patel",
    phone: "+91 98345 22334",
    category: "6m-3y",
    bloodGroup: "O+",
    aadhaarNumber: "XXXX-XXXX-8921",
    address: "Plot 12, Rampur West",
    registeredDate: "2024-03-05",
    immunizationStatus: "Up to Date",
    nutritionCategory: "Normal",
    photo: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "c-3",
    centerId: "aw-102",
    name: "Rohan Verma",
    gender: "Male",
    dob: "2024-06-10", // ~2.4 years old
    ageMonths: 28,
    motherName: "Reena Verma",
    fatherName: "Deepak Verma",
    phone: "+91 98456 33445",
    category: "6m-3y",
    bloodGroup: "A+",
    aadhaarNumber: "XXXX-XXXX-1142",
    address: "Near Water Tank, Rampur West",
    registeredDate: "2024-08-12",
    immunizationStatus: "Pending Vitamin A",
    nutritionCategory: "MAM", // Moderate Acute Malnutrition
    photo: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "c-4",
    centerId: "aw-102",
    name: "Priya Gupta",
    gender: "Female",
    dob: "2023-08-05", // ~3.2 years
    ageMonths: 38,
    motherName: "Neetu Gupta",
    fatherName: "Manoj Gupta",
    phone: "+91 98567 44556",
    category: "3y-6y",
    bloodGroup: "AB+",
    aadhaarNumber: "XXXX-XXXX-7734",
    address: "Main Market, Rampur West",
    registeredDate: "2024-02-15",
    immunizationStatus: "Complete",
    nutritionCategory: "Normal",
    photo: "https://images.unsplash.com/photo-1595454223600-91fb55972c5c?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "c-5",
    centerId: "aw-102",
    name: "Kabir Khan",
    gender: "Male",
    dob: "2024-09-14", // ~2.1 years
    ageMonths: 25,
    motherName: "Salma Begum",
    fatherName: "Imran Khan",
    phone: "+91 98678 55667",
    category: "6m-3y",
    bloodGroup: "B-",
    aadhaarNumber: "XXXX-XXXX-6619",
    address: "Lane 5, Rampur West",
    registeredDate: "2024-11-01",
    immunizationStatus: "Delayed Booster",
    nutritionCategory: "SAM", // Severe Acute Malnutrition - Alert!
    photo: "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "c-6",
    centerId: "aw-102",
    name: "Diya Yadav",
    gender: "Female",
    dob: "2023-02-18", // ~3.7 years
    ageMonths: 44,
    motherName: "Sarita Yadav",
    fatherName: "Vijay Yadav",
    phone: "+91 98789 66778",
    category: "3y-6y",
    bloodGroup: "O-",
    aadhaarNumber: "XXXX-XXXX-9902",
    address: "Near Primary School, Rampur West",
    registeredDate: "2023-09-10",
    immunizationStatus: "Complete",
    nutritionCategory: "Normal",
    photo: "https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "c-7",
    centerId: "aw-102",
    name: "Manav Joshi",
    gender: "Male",
    dob: "2023-11-22", // ~2.9 years
    ageMonths: 35,
    motherName: "Kavita Joshi",
    fatherName: "Naveen Joshi",
    phone: "+91 98890 77889",
    category: "6m-3y",
    bloodGroup: "A-",
    aadhaarNumber: "XXXX-XXXX-3345",
    address: "Sector 4 Block B, Rampur West",
    registeredDate: "2024-04-18",
    immunizationStatus: "Complete",
    nutritionCategory: "Normal",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "c-8",
    centerId: "aw-102",
    name: "Ishaani Mehra",
    gender: "Female",
    dob: "2024-03-30", // ~2.6 years
    ageMonths: 31,
    motherName: "Shalini Mehra",
    fatherName: "Sanjay Mehra",
    phone: "+91 98901 88990",
    category: "6m-3y",
    bloodGroup: "B+",
    aadhaarNumber: "XXXX-XXXX-4421",
    address: "Railway Colony, Rampur West",
    registeredDate: "2024-06-20",
    immunizationStatus: "Up to Date",
    nutritionCategory: "Normal",
    photo: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=150&auto=format&fit=crop&q=80"
  },
  // AW-101 children
  {
    id: "c-9",
    centerId: "aw-101",
    name: "Arjun Singh",
    gender: "Male",
    dob: "2023-05-12",
    ageMonths: 41,
    motherName: "Suman Singh",
    fatherName: "Vikram Singh",
    phone: "+91 98111 22334",
    category: "3y-6y",
    bloodGroup: "O+",
    aadhaarNumber: "XXXX-XXXX-6512",
    address: "Sector 2 Rampur East",
    registeredDate: "2024-01-05",
    immunizationStatus: "Complete",
    nutritionCategory: "Normal",
    photo: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "c-10",
    centerId: "aw-101",
    name: "Tanya Kashyap",
    gender: "Female",
    dob: "2024-04-18",
    ageMonths: 30,
    motherName: "Rekha Kashyap",
    fatherName: "Om Prakash",
    phone: "+91 98222 33445",
    category: "6m-3y",
    bloodGroup: "A+",
    aadhaarNumber: "XXXX-XXXX-8823",
    address: "Old Gali Rampur East",
    registeredDate: "2024-07-15",
    immunizationStatus: "Complete",
    nutritionCategory: "MAM",
    photo: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=150&auto=format&fit=crop&q=80"
  },
  // AW-103 children
  {
    id: "c-11",
    centerId: "aw-103",
    name: "Rishi Mishra",
    gender: "Male",
    dob: "2024-08-01",
    ageMonths: 26,
    motherName: "Poonam Mishra",
    fatherName: "Harish Mishra",
    phone: "+91 98333 44556",
    category: "6m-3y",
    bloodGroup: "B+",
    aadhaarNumber: "XXXX-XXXX-1982",
    address: "Ward 8 Shantinagar",
    registeredDate: "2024-10-10",
    immunizationStatus: "Complete",
    nutritionCategory: "SAM", // SAM alert in AW-103
    photo: "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=150&auto=format&fit=crop&q=80"
  }
];

// Helper to get today's date formatted as YYYY-MM-DD
const today = new Date().toISOString().split("T")[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

const attendances = [
  {
    id: "att-1",
    centerId: "aw-102",
    date: today,
    records: [
      { childId: "c-1", childName: "Aarav Sharma", status: "present", remarks: "" },
      { childId: "c-2", childName: "Ananya Patel", status: "present", remarks: "" },
      { childId: "c-3", childName: "Rohan Verma", status: "present", remarks: "Late arrival" },
      { childId: "c-4", childName: "Priya Gupta", status: "absent", remarks: "Mild cold" },
      { childId: "c-5", childName: "Kabir Khan", status: "present", remarks: "" },
      { childId: "c-6", childName: "Diya Yadav", status: "present", remarks: "" },
      { childId: "c-7", childName: "Manav Joshi", status: "present", remarks: "" },
      { childId: "c-8", childName: "Ishaani Mehra", status: "leave", remarks: "Family wedding" }
    ],
    presentCount: 6,
    absentCount: 1,
    leaveCount: 1,
    totalCount: 8,
    attendanceRate: 75
  },
  {
    id: "att-2",
    centerId: "aw-102",
    date: yesterday,
    records: [
      { childId: "c-1", childName: "Aarav Sharma", status: "present", remarks: "" },
      { childId: "c-2", childName: "Ananya Patel", status: "present", remarks: "" },
      { childId: "c-3", childName: "Rohan Verma", status: "present", remarks: "" },
      { childId: "c-4", childName: "Priya Gupta", status: "absent", remarks: "Fever" },
      { childId: "c-5", childName: "Kabir Khan", status: "present", remarks: "" },
      { childId: "c-6", childName: "Diya Yadav", status: "present", remarks: "" },
      { childId: "c-7", childName: "Manav Joshi", status: "present", remarks: "" },
      { childId: "c-8", childName: "Ishaani Mehra", status: "leave", remarks: "Family wedding" }
    ],
    presentCount: 6,
    absentCount: 1,
    leaveCount: 1,
    totalCount: 8,
    attendanceRate: 75
  }
];

const meals = [
  {
    id: "m-1",
    centerId: "aw-102",
    date: today,
    morningSnack: {
      item: "Boiled Egg & Roasted Chana",
      served: true,
      beneficiariesCount: 7,
      caloriesPerServing: 140,
      proteinGrams: 7.2
    },
    hotCookedMeal: {
      item: "Nutritious Moong Dal Khichdi with Spinach & Carrots",
      served: true,
      beneficiariesCount: 6,
      caloriesPerServing: 380,
      proteinGrams: 11.5
    },
    takeHomeRation: {
      item: "Poshan Dalia / Fortified Ready-to-Cook Mix",
      distributed: true,
      recipientsCount: 4
    },
    totalCalories: 520,
    totalProtein: 18.7,
    icdsNormMet: true,
    qualityChecked: true,
    notes: "Food tasted by AWW and Helper before distribution. Good temperature and taste."
  },
  {
    id: "m-2",
    centerId: "aw-102",
    date: yesterday,
    morningSnack: {
      item: "Ripe Banana & Milk",
      served: true,
      beneficiariesCount: 7,
      caloriesPerServing: 130,
      proteinGrams: 4.5
    },
    hotCookedMeal: {
      item: "Vegetable Pulao with Soya Chunks & Dal",
      served: true,
      beneficiariesCount: 7,
      caloriesPerServing: 400,
      proteinGrams: 13.0
    },
    takeHomeRation: {
      item: "Fortified Energy Mix Packet",
      distributed: false,
      recipientsCount: 0
    },
    totalCalories: 530,
    totalProtein: 17.5,
    icdsNormMet: true,
    qualityChecked: true,
    notes: "Fresh local vegetables used. All children enjoyed."
  }
];

const growthRecords = [
  {
    id: "gr-1",
    childId: "c-1",
    centerId: "aw-102",
    childName: "Aarav Sharma",
    date: "2026-10-15",
    ageMonths: 42,
    gender: "Male",
    weightKg: 14.8,
    heightCm: 99.5,
    bmi: 14.9,
    wfaStatus: "Normal", // Weight-for-Age
    hfaStatus: "Normal", // Height-for-Age (Stunting)
    wfhStatus: "Normal", // Weight-for-Height (Wasting)
    overallCategory: "Normal",
    notes: "Healthy growth progression in line with WHO standard median."
  },
  {
    id: "gr-2",
    childId: "c-1",
    centerId: "aw-102",
    childName: "Aarav Sharma",
    date: "2026-07-12",
    ageMonths: 39,
    gender: "Male",
    weightKg: 14.1,
    heightCm: 97.2,
    bmi: 14.9,
    wfaStatus: "Normal",
    hfaStatus: "Normal",
    wfhStatus: "Normal",
    overallCategory: "Normal",
    notes: "Steady growth."
  },
  {
    id: "gr-3",
    childId: "c-3",
    centerId: "aw-102",
    childName: "Rohan Verma",
    date: "2026-10-20",
    ageMonths: 28,
    gender: "Male",
    weightKg: 10.2, // Low for 28m male (WHO median is ~12.9kg, -2SD is ~11.0kg)
    heightCm: 87.0,
    bmi: 13.5,
    wfaStatus: "Moderately Underweight",
    hfaStatus: "Normal",
    wfhStatus: "MAM",
    overallCategory: "MAM",
    notes: "Requires supplementary nutrition and counseling for mother on calorie-dense foods."
  },
  {
    id: "gr-4",
    childId: "c-5",
    centerId: "aw-102",
    childName: "Kabir Khan",
    date: "2026-10-18",
    ageMonths: 25,
    gender: "Male",
    weightKg: 8.6, // Very low (WHO -3SD is ~9.6kg) -> SAM
    heightCm: 81.5,
    bmi: 12.9,
    wfaStatus: "Severely Underweight",
    hfaStatus: "Severely Stunted",
    wfhStatus: "SAM",
    overallCategory: "SAM", // Severe Acute Malnutrition Alert!
    notes: "Urgent: Referred to Primary Health Centre & Nutrition Rehabilitation Centre (NRC)."
  },
  {
    id: "gr-5",
    childId: "c-2",
    centerId: "aw-102",
    childName: "Ananya Patel",
    date: "2026-10-10",
    ageMonths: 33,
    gender: "Female",
    weightKg: 13.2,
    heightCm: 93.0,
    bmi: 15.3,
    wfaStatus: "Normal",
    hfaStatus: "Normal",
    wfhStatus: "Normal",
    overallCategory: "Normal",
    notes: "Good progress."
  }
];

const activities = [
  {
    id: "act-1",
    centerId: "aw-102",
    date: today,
    title: "Baal Geet & Storytelling: 'Chanda Mama'",
    category: "Storytelling & Rhymes",
    icon: "Music",
    durationMinutes: 45,
    childrenPresent: 7,
    description: "Children recited poems with hand gestures and listened to an interactive moral story about sharing.",
    learningOutcome: "Vocabulary development, rhythm, social bonding, attentiveness.",
    photoEmoji: "🎵📖",
    conductedBy: "Smt. Meena Kumari"
  },
  {
    id: "act-2",
    centerId: "aw-102",
    date: today,
    title: "Vegetable Identification & Color Sorting",
    category: "Pre-School Cognitive Play",
    icon: "Palette",
    durationMinutes: 30,
    childrenPresent: 7,
    description: "Children grouped wooden vegetable cutouts by color (Red tomato, Green peas, Orange carrot).",
    learningOutcome: "Color recognition, fine motor coordination, nutritional awareness.",
    photoEmoji: "🥕🎨",
    conductedBy: "Smt. Meena Kumari"
  },
  {
    id: "act-3",
    centerId: "aw-102",
    date: yesterday,
    title: "Outdoor Ball Toss & Balance Walk",
    category: "Gross Motor Skills & Physical Play",
    icon: "Activity",
    durationMinutes: 40,
    childrenPresent: 6,
    description: "Children practiced walking along chalk lines on the veranda and catching a soft sponge ball.",
    learningOutcome: "Body balance, hand-eye coordination, group turn-taking.",
    photoEmoji: "⚽🏃",
    conductedBy: "Smt. Meena Kumari"
  }
];

const alerts = [
  {
    id: "alt-1",
    type: "malnutrition_sam",
    severity: "critical", // critical, warning, info
    centerId: "aw-102",
    centerName: "Rampur West (AW-102)",
    childId: "c-5",
    childName: "Kabir Khan",
    title: "Severe Acute Malnutrition (SAM) Flagged",
    message: "Child Kabir Khan (25m) recorded weight 8.6kg (< -3SD WHO standard). NRC referral recommended.",
    date: today,
    status: "Action Required",
    actionTaken: "Mother notified; ANM nurse scheduled for home visit."
  },
  {
    id: "alt-2",
    type: "chronic_absenteeism",
    severity: "warning",
    centerId: "aw-102",
    centerName: "Rampur West (AW-102)",
    childId: "c-4",
    childName: "Priya Gupta",
    title: "Consecutive Absence Flag (3 Days)",
    message: "Priya Gupta has been marked absent for 3 consecutive working sessions. Home contact advised.",
    date: today,
    status: "Pending",
    actionTaken: ""
  },
  {
    id: "alt-3",
    type: "malnutrition_sam",
    severity: "critical",
    centerId: "aw-103",
    centerName: "Shantinagar (AW-103)",
    childId: "c-11",
    childName: "Rishi Mishra",
    title: "Critical Malnutrition Case in Shantinagar",
    message: "Rishi Mishra (26m) categorized as Severely Underweight. Verification needed by Supervisor.",
    date: yesterday,
    status: "Under Review",
    actionTaken: "Supervisor assigned field inspection on Thursday."
  },
  {
    id: "alt-4",
    type: "missing_record",
    severity: "warning",
    centerId: "aw-104",
    centerName: "Kalyanpur Gram (AW-104)",
    childId: null,
    childName: null,
    title: "Pending Monthly Growth Measurements",
    message: "8 children in Kalyanpur Gram have not had their monthly height/weight updated for October.",
    date: yesterday,
    status: "Reminder Sent",
    actionTaken: "SMS reminder broadcasted to Worker Pushpa Yadav."
  }
];

module.exports = {
  centers,
  users,
  children,
  attendances,
  meals,
  growthRecords,
  activities,
  alerts
};
