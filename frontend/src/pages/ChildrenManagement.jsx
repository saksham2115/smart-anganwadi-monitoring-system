import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { childrenApi } from '../services/api';
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  Baby, 
  Calendar, 
  Phone, 
  MapPin, 
  Activity, 
  CheckCircle, 
  X, 
  FileText,
  Heart,
  ShieldCheck,
  Trash2
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ChildrenManagement() {
  const { currentCenterId, activeCenter, t } = useAuth();
  
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedNutrition, setSelectedNutrition] = useState('ALL');
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedChildForProfile, setSelectedChildForProfile] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  // New Child Form State
  const [formData, setFormData] = useState({
    name: '',
    gender: 'Male',
    dob: '2023-06-15',
    motherName: '',
    fatherName: '',
    phone: '',
    category: '3y-6y',
    bloodGroup: 'B+',
    aadhaarNumber: '',
    address: ''
  });

  useEffect(() => {
    loadChildren();
  }, [currentCenterId]);

  const loadChildren = async () => {
    setLoading(true);
    try {
      const data = await childrenApi.getAll({ centerId: currentCenterId });
      setChildren(data || []);
    } catch (err) {
      console.warn("Error loading children:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddChild = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.dob) {
      alert('Child name and date of birth are required');
      return;
    }

    try {
      await childrenApi.create({
        ...formData,
        centerId: currentCenterId
      });
      setStatusMessage('Child registered successfully!');
      setIsAddModalOpen(false);
      setFormData({
        name: '',
        gender: 'Male',
        dob: '2023-06-15',
        motherName: '',
        fatherName: '',
        phone: '',
        category: '3y-6y',
        bloodGroup: 'B+',
        aadhaarNumber: '',
        address: ''
      });
      loadChildren();
      setTimeout(() => setStatusMessage(''), 3500);
    } catch (err) {
      alert('Failed to add child: ' + err.message);
    }
  };

  const handleDeleteChild = async (childId) => {
    if (window.confirm('Are you sure you want to delete this child record?')) {
      try {
        await childrenApi.delete(childId);
        setStatusMessage('Child record deleted.');
        if (selectedChildForProfile?.id === childId) {
          setSelectedChildForProfile(null);
        }
        loadChildren();
        setTimeout(() => setStatusMessage(''), 3500);
      } catch (err) {
        alert('Failed to delete child');
      }
    }
  };

  // Filter children
  const filteredChildren = children.filter(child => {
    const matchesSearch = 
      child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      child.motherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      child.fatherName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || child.category === selectedCategory;
    const matchesNutrition = selectedNutrition === 'ALL' || child.nutritionCategory === selectedNutrition;

    return matchesSearch && matchesCategory && matchesNutrition;
  });

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header-flex">
        <div>
          <h1 className="page-title">Children Registry (बच्चे रजिस्टर)</h1>
          <p className="page-subtitle">
            Manage beneficiary profiles, immunization, and growth monitoring in {activeCenter?.name}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary"
        >
          <Plus size={18} />
          <span>Register New Child (नया बच्चा जोड़ें)</span>
        </button>
      </div>

      {statusMessage && (
        <div className="alert-callout success mb-4">
          <CheckCircle size={20} className="text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="card-box mb-6">
        <div className="search-filter-row">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search by child name, mother, or father..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-pill-group">
            <button
              type="button"
              className={`filter-pill ${selectedCategory === 'ALL' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('ALL')}
            >
              All ({children.length})
            </button>
            <button
              type="button"
              className={`filter-pill ${selectedCategory === '3y-6y' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('3y-6y')}
            >
              Preschool (3-6 yrs)
            </button>
            <button
              type="button"
              className={`filter-pill ${selectedCategory === '6m-3y' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('6m-3y')}
            >
              Toddlers (6m-3 yrs)
            </button>
            <button
              type="button"
              className={`filter-pill alert-pill ${selectedNutrition === 'SAM' ? 'active' : ''}`}
              onClick={() => setSelectedNutrition(selectedNutrition === 'SAM' ? 'ALL' : 'SAM')}
            >
              🚨 SAM Alert ({children.filter(c => c.nutritionCategory === 'SAM').length})
            </button>
          </div>
        </div>
      </div>

      {/* Children Grid View */}
      <div className="children-grid">
        {filteredChildren.map((child) => (
          <div key={child.id} className="child-card">
            <div className="child-card-header">
              <div className="child-card-avatar">
                {child.gender === 'Female' ? '👧' : '👦'}
              </div>
              <div className="child-card-main-info">
                <h3 className="child-card-name">{child.name}</h3>
                <div className="child-card-meta">
                  <span>{Math.floor(child.ageMonths / 12)}y {child.ageMonths % 12}m</span> • 
                  <span> {child.gender}</span> • 
                  <span className="blood-tag">{child.bloodGroup}</span>
                </div>
              </div>
              <span className={`status-badge-corner ${child.nutritionCategory ? child.nutritionCategory.toLowerCase() : 'normal'}`}>
                {child.nutritionCategory || 'Normal'}
              </span>
            </div>

            <div className="child-card-body">
              <div className="child-info-row">
                <span className="info-label">Parents:</span>
                <span className="info-value">{child.motherName} & {child.fatherName}</span>
              </div>
              <div className="child-info-row">
                <span className="info-label">Phone:</span>
                <span className="info-value"><Phone size={12} className="inline-icon" /> {child.phone}</span>
              </div>
              <div className="child-info-row">
                <span className="info-label">Category:</span>
                <span className="info-value category-badge">
                  {child.category === '3y-6y' ? 'Preschool (3-6y)' : 'Toddler (6m-3y)'}
                </span>
              </div>
              <div className="child-info-row">
                <span className="info-label">Immunization:</span>
                <span className="info-value text-emerald-700 font-medium">
                  <ShieldCheck size={13} className="inline-icon" /> {child.immunizationStatus || 'Complete'}
                </span>
              </div>
            </div>

            <div className="child-card-footer">
              <button
                type="button"
                onClick={() => setSelectedChildForProfile(child)}
                className="btn-card-secondary"
              >
                View Full Profile
              </button>
              <Link
                to={`/growth?childId=${child.id}`}
                className="btn-card-primary"
              >
                Growth Chart
              </Link>
            </div>
          </div>
        ))}

        {filteredChildren.length === 0 && (
          <div className="empty-state-box col-span-full">
            <Baby size={48} className="text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-700">No children found</h3>
            <p className="text-slate-500">Try adjusting your search criteria or register a new child.</p>
          </div>
        )}
      </div>

      {/* Add Child Modal */}
      {isAddModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3 className="modal-title">Register New Beneficiary Child (नया बच्चा पंजीकृत करें)</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="modal-close-btn"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddChild} className="modal-form">
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Child Full Name (बच्चे का पूरा नाम) *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Aarav Sharma"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Gender (लिंग) *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="Male">Male (बालक)</option>
                    <option value="Female">Female (बालिका)</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Date of Birth (जन्म तिथि) *</label>
                  <input
                    type="date"
                    name="dob"
                    required
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Age Category (श्रेणी)</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="3y-6y">Preschool / बालवाटिका (3 - 6 Years)</option>
                    <option value="6m-3y">Toddlers / शिशु (6 Months - 3 Years)</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Mother's Name (माता का नाम) *</label>
                  <input
                    type="text"
                    name="motherName"
                    required
                    value={formData.motherName}
                    onChange={handleInputChange}
                    placeholder="e.g. Sunita Sharma"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Father's Name (पिता का नाम)</label>
                  <input
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleInputChange}
                    placeholder="e.g. Ramesh Sharma"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Mobile Number (मोबाइल नं.)</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 00000"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Blood Group (रक्त समूह)</label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="O+">O+</option>
                    <option value="AB+">AB+</option>
                    <option value="A-">A-</option>
                    <option value="B-">B-</option>
                    <option value="O-">O-</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Child Aadhaar / Ration Card ID (आधार / पहचान संख्या)</label>
                <input
                  type="text"
                  name="aadhaarNumber"
                  value={formData.aadhaarNumber}
                  onChange={handleInputChange}
                  placeholder="XXXX-XXXX-1234"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Address (पता)</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Gali / House No., Sector..."
                  className="form-input"
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Save Child Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Child Full Profile Modal */}
      {selectedChildForProfile && (
        <div className="modal-backdrop">
          <div className="modal-dialog max-w-xl">
            <div className="modal-header">
              <h3 className="modal-title">Child Health Profile Card (बाल स्वास्थ्य पत्रक)</h3>
              <button
                type="button"
                onClick={() => setSelectedChildForProfile(null)}
                className="modal-close-btn"
              >
                <X size={20} />
              </button>
            </div>

            <div className="profile-detail-card">
              <div className="profile-header-banner">
                <div className="profile-avatar-big">
                  {selectedChildForProfile.gender === 'Female' ? '👧' : '👦'}
                </div>
                <div className="profile-info-heading">
                  <h2 className="text-xl font-bold">{selectedChildForProfile.name}</h2>
                  <p className="text-sm text-slate-600">
                    Aadhaar ID: {selectedChildForProfile.aadhaarNumber} • Blood Group: {selectedChildForProfile.bloodGroup}
                  </p>
                  <span className={`status-badge-inline ${selectedChildForProfile.nutritionCategory?.toLowerCase()}`}>
                    {selectedChildForProfile.nutritionCategory === 'SAM' ? '🚨 SAM Severe Acute Malnutrition' : (selectedChildForProfile.nutritionCategory === 'MAM' ? '⚠️ MAM Moderate Malnutrition' : '✅ Normal Healthy Growth')}
                  </span>
                </div>
              </div>

              <div className="profile-detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Age</span>
                  <span className="detail-val">{Math.floor(selectedChildForProfile.ageMonths / 12)} yrs {selectedChildForProfile.ageMonths % 12} mos ({selectedChildForProfile.ageMonths}m)</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Date of Birth</span>
                  <span className="detail-val">{selectedChildForProfile.dob}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Mother's Name</span>
                  <span className="detail-val">{selectedChildForProfile.motherName}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Father's Name</span>
                  <span className="detail-val">{selectedChildForProfile.fatherName}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Contact Phone</span>
                  <span className="detail-val">{selectedChildForProfile.phone}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Immunization</span>
                  <span className="detail-val text-emerald-600 font-semibold">{selectedChildForProfile.immunizationStatus || 'Complete'}</span>
                </div>
                <div className="detail-item col-span-2">
                  <span className="detail-label">Residential Address</span>
                  <span className="detail-val">{selectedChildForProfile.address || 'Local Centre Ward'}</span>
                </div>
              </div>

              <div className="modal-actions mt-6">
                <button
                  type="button"
                  onClick={() => handleDeleteChild(selectedChildForProfile.id)}
                  className="btn-danger-outline"
                >
                  <Trash2 size={16} />
                  <span>Delete Record</span>
                </button>
                <Link
                  to={`/growth?childId=${selectedChildForProfile.id}`}
                  className="btn-primary"
                  onClick={() => setSelectedChildForProfile(null)}
                >
                  Open WHO Growth Card
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
