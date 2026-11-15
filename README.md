# Smart Anganwadi Monitoring System
### Digital Child Development & Centre Monitoring Platform (PWA)
*Built for Integrated Child Development Services (ICDS) & POSHAN Abhiyaan*

---

## 1. Project Introduction
The **Smart Anganwadi Monitoring System** is a mobile-first Progressive Web App (PWA) designed to replace the burdensome manual paper registers maintained by Anganwadi workers across rural and urban centres in India. 

Anganwadi centres serve as the frontline delivery points for early childhood care, nutrition, immunization, and preschool education. Traditionally, workers maintain over 11 bulky physical registers (attendance, supplementary nutrition, growth registers, stock registers), leading to administrative overload, delayed malnutrition reporting, and data discrepancies.

This digital platform empowers:
1. **Anganwadi Workers (AWW)**: Easily mark attendance with 1-tap, record morning snacks and hot cooked meals, log child weight and height, track preschool activities, and work **100% offline** in remote areas without internet access.
2. **Supervisors / CDPOs (Child Development Project Officers)**: Monitor multiple centres simultaneously through an aggregated analytics dashboard, receive immediate alerts for Severe Acute Malnutrition (SAM) and chronic absenteeism, and generate official Monthly Progress Reports (MPR).

---

## 2. Key Objectives & Unique Highlights
- **Progressive Web App (PWA) with Offline-First Sync**: Works on smartphones, tablets, and desktops. In remote villages with poor or zero connectivity, data is stored locally in an offline queue and synchronizes automatically with the server when network is restored.
- **WHO Child Growth Standards**: Automatically classifies children according to World Health Organization age- and sex-specific growth standards into **Normal (Green)**, **Moderate Acute Malnutrition (MAM - Yellow)**, and **Severe Acute Malnutrition (SAM - Red Alert)**.
- **Interactive WHO Growth Curve**: Plots child weight-for-age progression against WHO percentiles (-3SD, -2SD, Median, +2SD).
- **Automated Smart Alerts**:
  - Immediate SAM alert triggering Nutrition Rehabilitation Centre (NRC) medical referral.
  - Dropout risk alert if a child is absent for 3+ consecutive days.
  - Missed meal entry reminders.
- **Bilingual Interface**: Seamless 1-tap toggle between English and Hindi (हिन्दी) with large touch targets and intuitive iconography.
- **1-Click Role Switcher**: Instant switching between Anganwadi Worker and CDPO Supervisor modes.

---

## 3. Technology Stack
| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19, JavaScript (ES6+) | Component-driven user interface |
| **PWA & Offline** | Service Worker, Web App Manifest, Cache API, LocalStorage Sync Queue | Offline data capture & automatic sync |
| **Routing** | React Router Dom v7 | Client-side page navigation |
| **Styling** | Custom Green & White Theme (CSS3 variables, Flexbox/Grid) | High-contrast, mobile-first touch UI |
| **Icons** | Lucide React | Modern, intuitive icons |
| **Visualizations** | Custom Responsive SVG WHO Growth Curve & KPI Bar Charts | Lightweight, zero-dependency data visualization |
| **Backend** | Node.js, Express.js | REST API, authentication, data persistence |
| **Database** | MongoDB (Mongoose) + Resilient Zero-Config JSON Store | Hybrid fallback ensuring instant local operation |

---

## 4. Main Modules

### 📋 1. Attendance Management
- Daily child attendance with 1-tap toggle: **Present (Green)**, **Absent (Red)**, or **Leave (Amber)**.
- **"Mark All Present"** time-saver button for busy workers.
- Remarks input for absence reasons (e.g., fever, family function).
- Automatic flag for 3 consecutive absences to prevent preschool dropouts.
- Daily attendance percentage & historical logs.

### 🍲 2. Supplementary Nutrition Programme (SNP) & Meal Distribution
- Tracking **Morning Snack** (Boiled egg, roasted chana, banana, milk).
- Tracking **Hot Cooked Meal (HCM)** (Moong dal khichdi, vegetable pulao).
- Tracking **Take-Home Ration (THR)** for toddlers (6m-3y) and lactating mothers.
- **Live Nutrition Meter**: Calculates daily calories (kcal) and protein (g) against the Government ICDS norm (500 kcal, 12-15g protein).
- Taste & quality verification sign-off by AWW and Helper before distribution.

### 📏 3. WHO Child Growth Monitoring
- Monthly weight (kg) and height (cm) assessment.
- Real-time calculations:
  - **Weight-for-Age (WFA)**: Underweight assessment.
  - **Height-for-Age (HFA)**: Stunting assessment.
  - **Body Mass Index (BMI)**.
- Interactive WHO growth curve chart plotting historical trajectory against standard bands.
- Red Zone (SAM) triggers immediate NRC referral note.

### 🎨 4. Pre-School Education & Daily Activities
- Log daily sessions: Baal Geet & Rhymes, Storytelling, Drawing/Art, Motor Play, and Hygiene habits.
- Record duration, participating children count, and learning outcomes.
- Mandatory **Center Operational & Hygiene Checklist**: Safe drinking water verified, first-aid kit ready, handwashing with soap conducted, toilet sanitized.

### 📊 5. Supervisor / CDPO Dashboard
- Multi-centre sector oversight across Rampur East (AW-101), Rampur West (AW-102), Shantinagar (AW-103), and Kalyanpur (AW-104).
- Key District KPIs: Total children, average attendance %, total meals served, active SAM cases.
- Center-to-center comparison table and compliance tracking.
- Malnutrition resolution hub: CDPO can review cases and log actions taken.

### 📄 6. Monthly Progress Reports (MPR)
- Official format of the Department of Women & Child Development.
- Sector summary with enrolled counts, nutritional breakdown, and SNP delivery days.
- **1-Click Export to CSV** and **Printable Report** with signature verification blocks.

---

## 5. How to Run the Project Locally

### Prerequisites
- Node.js (v18 or higher) and npm installed.

### Step 1: Start the Backend Server
```bash
cd backend
npm install
npm start
```
The backend server runs on `http://localhost:5000`.
*(Note: It operates in resilient zero-config mode with pre-seeded realistic data out of the box; if MongoDB is installed, it connects via `MONGODB_URI`).*

### Step 2: Start the Frontend Application
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 6. Demo Accounts (1-Click Login Available)
You can click the 1-click quick login buttons on the login screen or use these credentials:

| Role | Email | Password | Assigned Centre |
| :--- | :--- | :--- | :--- |
| **Anganwadi Worker (AWW)** | `worker@anganwadi.gov.in` | `worker123` | AW-102 Rampur West |
| **Supervisor / CDPO** | `supervisor@anganwadi.gov.in` | `supervisor123` | All District Centres |

*You can also switch roles at any time using the role toggle chip in the top navigation bar.*
