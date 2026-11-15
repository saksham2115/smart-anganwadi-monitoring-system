import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supervisorApi } from '../services/api';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  Calendar, 
  Building2, 
  CheckCircle, 
  ArrowLeft,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ReportsPage() {
  const { currentCenterId, centers } = useAuth();
  const [selectedCenter, setSelectedCenter] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('October 2026');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMpr();
  }, [selectedCenter, selectedMonth]);

  const loadMpr = async () => {
    setLoading(true);
    try {
      const data = await supervisorApi.getMprReport(selectedCenter, selectedMonth);
      setReportData(data);
    } catch (err) {
      console.warn("Error loading MPR:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    if (!reportData || !reportData.centersReport) return;

    const headers = [
      "Center Code",
      "Center Name",
      "Sector",
      "Worker Name",
      "Total Enrolled",
      "Toddlers (6m-3y)",
      "Preschool (3-6y)",
      "Normal Growth",
      "MAM Cases",
      "SAM Cases",
      "Avg Attendance",
      "Meals Served Days",
      "Working Days",
      "Status"
    ];

    const rows = reportData.centersReport.map(r => [
      r.centerCode,
      `"${r.centerName}"`,
      `"${r.sector}"`,
      `"${r.workerName}"`,
      r.totalEnrolled,
      r.toddlersEnrolled,
      r.preschoolEnrolled,
      r.normalCount,
      r.mamCount,
      r.samCount,
      r.averageAttendance,
      r.mealsDeliveredDays,
      r.workingDaysInMonth,
      r.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + 
      [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Anganwadi_MPR_${selectedMonth.replace(' ', '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const rows = reportData?.centersReport || [];

  return (
    <div className="page-container print-area">
      {/* Header */}
      <div className="page-header-flex">
        <div>
          <h1 className="page-title">Monthly Progress Report (मासिक प्रगति रिपोर्ट - MPR)</h1>
          <p className="page-subtitle">
            Integrated Child Development Services (ICDS) • District Rampur Submission
          </p>
        </div>

        <div className="flex gap-3 no-print">
          <button
            type="button"
            onClick={handlePrint}
            className="btn-secondary"
          >
            <Printer size={16} />
            <span>Print Report</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="btn-primary"
          >
            <Download size={16} />
            <span>Export to CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="card-box mb-6 no-print">
        <div className="search-filter-row">
          <div className="form-group flex-1">
            <label className="form-label">Select Anganwadi Centre</label>
            <select
              value={selectedCenter}
              onChange={(e) => setSelectedCenter(e.target.value)}
              className="form-select"
            >
              <option value="all">All Centres (District Aggregation)</option>
              {centers.map(c => (
                <option key={c.id} value={c.id}>{c.code} – {c.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group flex-1">
            <label className="form-label">Reporting Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="form-select"
            >
              <option value="November 2026">November 2026</option>
              <option value="October 2026">October 2026</option>
              <option value="September 2026">September 2026</option>
              <option value="August 2026">August 2026</option>
            </select>
          </div>
        </div>
      </div>

      {/* MPR Printable Document Card */}
      <div className="card-box">
        {/* Official Letterhead Header */}
        <div className="mpr-letterhead">
          <div className="mpr-gov-title">GOVERNMENT OF UTTAR PRADESH</div>
          <div className="mpr-dept-title">DEPARTMENT OF WOMEN & CHILD DEVELOPMENT</div>
          <div className="mpr-sub-title">MONTHLY PROGRESS REPORT (MPR) – POSHAN ABHIYAAN</div>
          <div className="mpr-meta-line">
            <span><strong>District:</strong> Rampur</span> • 
            <span><strong>Sector:</strong> Rampur Urban/Rural</span> • 
            <span><strong>Period:</strong> {selectedMonth}</span>
          </div>
        </div>

        <div className="table-responsive mt-6">
          <table className="custom-table mpr-table">
            <thead>
              <tr>
                <th rowSpan="2">Centre Code & Name</th>
                <th rowSpan="2">Worker In-Charge</th>
                <th colSpan="3" className="text-center bg-slate-100">Children Enrolled</th>
                <th colSpan="3" className="text-center bg-emerald-50">Nutritional Status</th>
                <th rowSpan="2">Avg Attendance</th>
                <th rowSpan="2">SNP Days</th>
                <th rowSpan="2">Status</th>
              </tr>
              <tr>
                <th>Total</th>
                <th>6m-3y</th>
                <th>3y-6y</th>
                <th>Normal</th>
                <th>MAM</th>
                <th>SAM</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td>
                    <strong>{r.centerCode}</strong><br />
                    <span className="text-xs text-slate-600">{r.centerName}</span>
                  </td>
                  <td>{r.workerName}</td>
                  <td className="font-bold">{r.totalEnrolled}</td>
                  <td>{r.toddlersEnrolled}</td>
                  <td>{r.preschoolEnrolled}</td>
                  <td className="text-emerald-700 font-semibold">{r.normalCount}</td>
                  <td className="text-amber-700 font-semibold">{r.mamCount}</td>
                  <td className="text-red-700 font-semibold">{r.samCount > 0 ? `🚨 ${r.samCount}` : '0'}</td>
                  <td>{r.averageAttendance}</td>
                  <td>{r.mealsDeliveredDays} / {r.workingDaysInMonth}</td>
                  <td>
                    <span className="status-badge normal">
                      <CheckCircle size={12} className="inline-icon" /> {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold">
                <td colSpan="2">Sector Total / Aggregate</td>
                <td>{rows.reduce((s, r) => s + r.totalEnrolled, 0)}</td>
                <td>{rows.reduce((s, r) => s + r.toddlersEnrolled, 0)}</td>
                <td>{rows.reduce((s, r) => s + r.preschoolEnrolled, 0)}</td>
                <td className="text-emerald-700">{rows.reduce((s, r) => s + r.normalCount, 0)}</td>
                <td className="text-amber-700">{rows.reduce((s, r) => s + r.mamCount, 0)}</td>
                <td className="text-red-700">{rows.reduce((s, r) => s + r.samCount, 0)}</td>
                <td>81%</td>
                <td>24 Days</td>
                <td>Verified</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Verification Signatures footer */}
        <div className="mpr-sign-row mt-12">
          <div className="sign-block">
            <div className="sign-line"></div>
            <div>Prepared by: Anganwadi Worker (AWW)</div>
          </div>
          <div className="sign-block">
            <div className="sign-line"></div>
            <div>Verified by: Mukhya Sevika / Supervisor</div>
          </div>
          <div className="sign-block">
            <div className="sign-line"></div>
            <div>Counter-signed: Child Development Project Officer (CDPO)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
