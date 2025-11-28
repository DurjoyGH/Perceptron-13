import React, { useState, useEffect } from 'react';
import { 
  GraduationCap,
  Plus,
  Edit,
  Trash2,
  Loader,
  Search,
  X,
  Mail,
  Phone,
  Globe,
  Award,
  MapPin,
  Book,
  User,
  Linkedin
} from 'lucide-react';
import { 
  getAllFacultyAdmin, 
  createFaculty, 
  updateFaculty, 
  deleteFaculty,
  deleteFacultyProfilePicture
} from '../../services/facultyApi';
import { toast } from 'sonner';
import ConfirmModal from '../../components/common/ConfirmModal';

const ManageFaculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [facultyToDelete, setFacultyToDelete] = useState(null);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    department: 'Computer Science & Engineering',
    email: '',
    phone: '',
    bio: '',
    researchInterests: [],
    qualifications: [],
    officeRoom: '',
    officeHours: '',
    website: '',
    googleScholar: '',
    linkedIn: '',
    isActive: true,
    profilePicture: null
  });

  const [newResearchInterest, setNewResearchInterest] = useState('');
  const [newQualification, setNewQualification] = useState({
    degree: '',
    institution: '',
    year: '',
    field: ''
  });

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const response = await getAllFacultyAdmin();
      setFaculty(response.data);
    } catch (error) {
      console.error('Failed to fetch faculty:', error);
      toast.error('Failed to load faculty members');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (member = null) => {
    if (member) {
      setEditingFaculty(member);
      setFormData({
        name: member.name || '',
        designation: member.designation || '',
        department: member.department || 'Computer Science & Engineering',
        email: member.email || '',
        phone: member.phone || '',
        bio: member.bio || '',
        researchInterests: member.researchInterests || [],
        qualifications: member.qualifications || [],
        officeRoom: member.officeRoom || '',
        officeHours: member.officeHours || '',
        website: member.website || '',
        googleScholar: member.googleScholar || '',
        linkedIn: member.linkedIn || '',
        isActive: member.isActive !== undefined ? member.isActive : true,
        profilePicture: null
      });
    } else {
      setEditingFaculty(null);
      setFormData({
        name: '',
        designation: '',
        department: 'Computer Science & Engineering',
        email: '',
        phone: '',
        bio: '',
        researchInterests: [],
        qualifications: [],
        officeRoom: '',
        officeHours: '',
        website: '',
        googleScholar: '',
        linkedIn: '',
        isActive: true,
        profilePicture: null
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingFaculty(null);
    setNewResearchInterest('');
    setNewQualification({ degree: '', institution: '', year: '', field: '' });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAddResearchInterest = () => {
    if (newResearchInterest.trim()) {
      setFormData(prev => ({
        ...prev,
        researchInterests: [...prev.researchInterests, newResearchInterest.trim()]
      }));
      setNewResearchInterest('');
    }
  };

  const handleRemoveResearchInterest = (index) => {
    setFormData(prev => ({
      ...prev,
      researchInterests: prev.researchInterests.filter((_, i) => i !== index)
    }));
  };

  const handleAddQualification = () => {
    if (newQualification.degree.trim() && newQualification.institution.trim()) {
      setFormData(prev => ({
        ...prev,
        qualifications: [...prev.qualifications, { ...newQualification }]
      }));
      setNewQualification({ degree: '', institution: '', year: '', field: '' });
    } else {
      toast.error('Degree and Institution are required');
    }
  };

  const handleRemoveQualification = (index) => {
    setFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.designation || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('designation', formData.designation);
      submitData.append('department', formData.department);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('bio', formData.bio);
      submitData.append('researchInterests', JSON.stringify(formData.researchInterests));
      submitData.append('qualifications', JSON.stringify(formData.qualifications));
      submitData.append('officeRoom', formData.officeRoom);
      submitData.append('officeHours', formData.officeHours);
      submitData.append('website', formData.website);
      submitData.append('googleScholar', formData.googleScholar);
      submitData.append('linkedIn', formData.linkedIn);
      submitData.append('isActive', formData.isActive);

      if (formData.profilePicture) {
        submitData.append('profilePicture', formData.profilePicture);
      }

      if (editingFaculty) {
        await updateFaculty(editingFaculty._id, submitData);
        toast.success('Faculty member updated successfully');
      } else {
        await createFaculty(submitData);
        toast.success('Faculty member created successfully');
      }

      handleCloseModal();
      fetchFaculty();
    } catch (error) {
      console.error('Failed to save faculty:', error);
      toast.error(error.response?.data?.message || 'Failed to save faculty member');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClick = (member) => {
    setFacultyToDelete(member);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!facultyToDelete) return;
    
    setDeleting(true);
    try {
      await deleteFaculty(facultyToDelete._id);
      toast.success('Faculty member deleted successfully');
      setShowDeleteModal(false);
      setFacultyToDelete(null);
      fetchFaculty();
    } catch (error) {
      console.error('Failed to delete faculty:', error);
      toast.error(error.response?.data?.message || 'Failed to delete faculty member');
    } finally {
      setDeleting(false);
    }
  };

  const filteredFaculty = faculty.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name) => {
    const words = name.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4" size={48} color="#19aaba" />
          <p className="text-gray-600">Loading faculty...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-[#19aaba] to-[#158c99] rounded-2xl p-6 md:p-8 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GraduationCap size={40} />
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">Manage Faculty</h1>
                  <p className="text-cyan-100">Add, edit, and manage faculty member profiles.</p>
                </div>
              </div>
              <button
                onClick={() => handleOpenModal()}
                className="bg-white text-[#19aaba] px-4 py-2 rounded-lg font-semibold hover:bg-cyan-50 transition-colors flex items-center gap-2"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Add Faculty</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#19aaba]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Total Faculty</p>
                <p className="text-3xl font-bold text-gray-800">{faculty.length}</p>
              </div>
              <div className="p-4 rounded-full bg-cyan-50">
                <GraduationCap size={28} color="#19aaba" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Active</p>
                <p className="text-3xl font-bold text-gray-800">
                  {faculty.filter(m => m.isActive).length}
                </p>
              </div>
              <div className="p-4 rounded-full bg-green-50">
                <User size={28} color="#10b981" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Inactive</p>
                <p className="text-3xl font-bold text-gray-800">
                  {faculty.filter(m => !m.isActive).length}
                </p>
              </div>
              <div className="p-4 rounded-full bg-orange-50">
                <User size={28} color="#f97316" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or designation..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent w-full"
            />
          </div>
        </div>

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFaculty.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-white rounded-xl shadow-lg">
              <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No faculty members found</p>
            </div>
          ) : (
            filteredFaculty.map((member) => (
              <div key={member._id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all">
                {/* Card Header */}
                <div className="bg-gradient-to-br from-[#19aaba] to-[#158c99] p-6 text-white relative">
                  {!member.isActive && (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                      Inactive
                    </div>
                  )}
                  <div className="flex flex-col items-center">
                    {member.profilePicture?.url ? (
                      <img
                        src={member.profilePicture.url}
                        alt={member.name}
                        className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg mb-3"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white flex items-center justify-center text-2xl font-bold mb-3">
                        {getInitials(member.name)}
                      </div>
                    )}
                    <h3 className="text-lg font-bold text-center mb-1">{member.name}</h3>
                    <p className="text-sm text-cyan-100 text-center">{member.designation}</p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    {member.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4 flex-shrink-0" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-600">
                      <Book className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{member.department}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenModal(member)}
                      className="flex-1 bg-[#19aaba] text-white px-3 py-2 rounded-lg hover:bg-[#158c99] transition-colors flex items-center justify-center gap-2 text-sm font-semibold"
                    >
                      <Edit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(member)}
                      className="flex-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2 text-sm font-semibold"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-[#19aaba] to-[#158c99] p-6 text-white rounded-t-2xl z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {editingFaculty ? 'Edit Faculty Member' : 'Add Faculty Member'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Designation <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputChange}
                      placeholder="e.g., Professor, Assistant Professor"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Department <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Profile Picture</label>
                    <input
                      type="file"
                      name="profilePicture"
                      accept="image/*"
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Office Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Office Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Office Room</label>
                    <input
                      type="text"
                      name="officeRoom"
                      value={formData.officeRoom}
                      onChange={handleInputChange}
                      placeholder="e.g., Room 301, Building A"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Office Hours</label>
                    <input
                      type="text"
                      name="officeHours"
                      value={formData.officeHours}
                      onChange={handleInputChange}
                      placeholder="e.g., Mon-Wed 2-4 PM"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Links</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Website</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      placeholder="https://..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Google Scholar</label>
                    <input
                      type="url"
                      name="googleScholar"
                      value={formData.googleScholar}
                      onChange={handleInputChange}
                      placeholder="https://scholar.google.com/..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">LinkedIn</label>
                    <input
                      type="url"
                      name="linkedIn"
                      value={formData.linkedIn}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Research Interests */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Research Interests</h3>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newResearchInterest}
                    onChange={(e) => setNewResearchInterest(e.target.value)}
                    placeholder="Add research interest"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddResearchInterest())}
                  />
                  <button
                    type="button"
                    onClick={handleAddResearchInterest}
                    className="bg-[#19aaba] text-white px-4 py-2 rounded-lg hover:bg-[#158c99] transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>

                {formData.researchInterests.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.researchInterests.map((interest, idx) => (
                      <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-cyan-50 text-cyan-700 rounded-lg border border-cyan-200">
                        <span className="text-sm">{interest}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveResearchInterest(idx)}
                          className="text-cyan-700 hover:text-cyan-900"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Qualifications */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Qualifications</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Degree</label>
                    <input
                      type="text"
                      value={newQualification.degree}
                      onChange={(e) => setNewQualification({ ...newQualification, degree: e.target.value })}
                      placeholder="e.g., PhD, MSc, BSc"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Institution</label>
                    <input
                      type="text"
                      value={newQualification.institution}
                      onChange={(e) => setNewQualification({ ...newQualification, institution: e.target.value })}
                      placeholder="University name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Field</label>
                    <input
                      type="text"
                      value={newQualification.field}
                      onChange={(e) => setNewQualification({ ...newQualification, field: e.target.value })}
                      placeholder="Field of study"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Year</label>
                    <input
                      type="number"
                      value={newQualification.year}
                      onChange={(e) => setNewQualification({ ...newQualification, year: e.target.value })}
                      placeholder="Year"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button
                      type="button"
                      onClick={handleAddQualification}
                      className="w-full bg-[#19aaba] text-white px-4 py-2 rounded-lg hover:bg-[#158c99] transition-colors flex items-center justify-center gap-2"
                    >
                      <Plus size={20} />
                      Add Qualification
                    </button>
                  </div>
                </div>

                {formData.qualifications.length > 0 && (
                  <div className="space-y-2">
                    {formData.qualifications.map((qual, idx) => (
                      <div key={idx} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{qual.degree}</div>
                          <div className="text-sm text-gray-700">{qual.institution}</div>
                          {qual.field && <div className="text-sm text-gray-600">Field: {qual.field}</div>}
                          {qual.year && <div className="text-sm text-gray-600">Year: {qual.year}</div>}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveQualification(idx)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 border-b pb-2">Status</h3>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-[#19aaba] border-gray-300 rounded focus:ring-[#19aaba]"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Active (Show on public page)
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-[#19aaba] to-[#158c99] text-white px-4 py-3 rounded-lg hover:opacity-90 transition-all font-semibold disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingFaculty ? 'Update Faculty' : 'Add Faculty'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setFacultyToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Faculty Member"
        message={
          facultyToDelete ? (
            <div className="space-y-2">
              <p>Are you sure you want to delete this faculty member?</p>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p className="font-semibold text-gray-900">{facultyToDelete.name}</p>
                <p className="text-sm text-gray-600">{facultyToDelete.designation}</p>
                <p className="text-sm text-gray-600">{facultyToDelete.email}</p>
              </div>
              <p className="text-sm text-red-600 font-medium">
                ⚠️ This action cannot be undone.
              </p>
            </div>
          ) : null
        }
        confirmText={deleting ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        type="danger"
        loading={deleting}
      />
    </div>
  );
};

export default ManageFaculty;
