import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  getUserProfile, 
  updateUserProfile, 
  updateProfilePicture, 
  deleteProfilePicture,
  addFeaturedPhoto,
  updateFeaturedPhoto,
  deleteFeaturedPhoto 
} from '../../services/userApi';
import { toast } from 'sonner';
import { 
  User, 
  Mail, 
  IdCard, 
  Lock, 
  Save, 
  Loader, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  Award,
  GraduationCap,
  MapPin,
  Calendar,
  Users,
  Camera,
  Edit2,
  X,
  Check,
  LogOut,
  Upload,
  Trash2,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const { user: authUser, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
  const [showEditCaptionModal, setShowEditCaptionModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [newCaption, setNewCaption] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');
  
  const profilePictureInputRef = useRef(null);
  const featuredPhotoInputRef = useRef(null);

  const [userData, setUserData] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentID: ''
  });

  const [tempFormData, setTempFormData] = useState({
    name: '',
    email: '',
    studentID: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await getUserProfile();
      const user = response.data;
      setUserData(user);
      const data = {
        name: user.name || '',
        email: user.email || '',
        studentID: user.studentID || ''
      };
      setFormData(data);
      setTempFormData(data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const words = name.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setTempFormData({ ...formData });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setTempFormData({ ...formData });
    setErrors({});
  };

  const handleTempChange = (e) => {
    const { name, value } = e.target;
    setTempFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateProfileForm = () => {
    const newErrors = {};

    if (!tempFormData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!tempFormData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^\d{7}\.cse@student\.just\.edu\.bd$/;
      if (!emailRegex.test(tempFormData.email)) {
        newErrors.email = 'Invalid email format';
      }
    }

    if (!tempFormData.studentID.trim()) {
      newErrors.studentID = 'Student ID is required';
    } else if (!/^\d{6}$/.test(tempFormData.studentID)) {
      newErrors.studentID = 'Must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfileForm()) {
      return;
    }

    setUpdating(true);

    try {
      const response = await updateUserProfile(tempFormData);
      toast.success('Profile updated successfully!');
      setFormData({
        name: response.data.name,
        email: response.data.email,
        studentID: response.data.studentID
      });
      updateUser(response.data);
      setIsEditing(false);
      setErrors({});
    } catch (error) {
      console.error('Update error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Must be at least 6 characters';
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordSubmit = async () => {
    if (!validatePasswordForm()) {
      return;
    }

    setUpdating(true);

    try {
      await updateUserProfile({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordModal(false);
      setErrors({});
    } catch (error) {
      console.error('Password update error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update password';
      toast.error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Profile picture handlers
  const handleProfilePictureClick = () => {
    profilePictureInputRef.current?.click();
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);
    try {
      const response = await updateProfilePicture(file);
      setUserData(response.data);
      updateUser(response.data);
      toast.success('Profile picture updated successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile picture';
      toast.error(errorMessage);
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleDeleteProfilePicture = async () => {
    if (!window.confirm('Are you sure you want to delete your profile picture?')) {
      return;
    }

    setUploadingImage(true);
    try {
      const response = await deleteProfilePicture();
      setUserData(response.data);
      updateUser(response.data);
      toast.success('Profile picture deleted successfully!');
    } catch (error) {
      console.error('Delete error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete profile picture';
      toast.error(errorMessage);
    } finally {
      setUploadingImage(false);
    }
  };

  // Featured photos handlers
  const handleAddPhotoClick = () => {
    if (userData?.featuredPhotos?.length >= 6) {
      toast.error('Maximum 6 featured photos allowed');
      return;
    }
    setShowAddPhotoModal(true);
  };

  const handleFeaturedPhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploadingImage(true);
    try {
      const response = await addFeaturedPhoto(file, photoCaption);
      setUserData(response.data);
      toast.success('Featured photo added successfully!');
      setShowAddPhotoModal(false);
      setPhotoCaption('');
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add featured photo';
      toast.error(errorMessage);
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleEditCaption = (photo) => {
    setSelectedPhoto(photo);
    setNewCaption(photo.caption || '');
    setShowEditCaptionModal(true);
  };

  const handleUpdateCaption = async () => {
    if (!selectedPhoto) return;

    setUpdating(true);
    try {
      const response = await updateFeaturedPhoto(selectedPhoto._id, newCaption);
      setUserData(response.data);
      toast.success('Caption updated successfully!');
      setShowEditCaptionModal(false);
      setSelectedPhoto(null);
      setNewCaption('');
    } catch (error) {
      console.error('Update error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update caption';
      toast.error(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteFeaturedPhoto = async (photoId) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) {
      return;
    }

    setUploadingImage(true);
    try {
      const response = await deleteFeaturedPhoto(photoId);
      setUserData(response.data);
      toast.success('Featured photo deleted successfully!');
    } catch (error) {
      console.error('Delete error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete photo';
      toast.error(errorMessage);
    } finally {
      setUploadingImage(false);
    }
  };

  // Featured images for the user
  const featuredImages = [
    {
      url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
      caption: "Beach exploration at Cox's Bazar"
    },
    {
      url: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800",
      caption: "Saint Martin's Island adventure"
    },
    {
      url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800",
      caption: "Marine Drive scenic tour"
    },
    {
      url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800",
      caption: "Industrial visit experience"
    },
    {
      url: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800",
      caption: "Beach activities with team"
    },
    {
      url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
      caption: "Barbecue night memories"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-12 h-12 text-[#19aaba] animate-spin" />
          <p className="text-gray-600 text-lg">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#19aaba] via-[#158c99] to-[#116d77] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg border border-white/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
          
          <div className="flex items-center gap-2 text-sm mb-2">
            <Users className="w-4 h-4" />
            <span>Industrial Tour 2025</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">My Profile</h1>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden sticky top-8">
              {/* Avatar Section */}
              <div className="bg-gradient-to-br from-[#19aaba] to-[#158c99] p-8 text-center relative">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  {userData?.profilePicture?.url ? (
                    <img 
                      src={userData.profilePicture.url} 
                      alt={formData.name}
                      className="w-full h-full rounded-full object-cover shadow-lg border-4 border-white"
                    />
                  ) : (
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-[#19aaba] text-4xl font-bold shadow-lg">
                      {getInitials(formData.name)}
                    </div>
                  )}
                  <button
                    onClick={handleProfilePictureClick}
                    disabled={uploadingImage}
                    className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors border-2 border-[#19aaba] disabled:opacity-50"
                  >
                    {uploadingImage ? (
                      <Loader className="w-5 h-5 text-[#19aaba] animate-spin" />
                    ) : (
                      <Camera className="w-5 h-5 text-[#19aaba]" />
                    )}
                  </button>
                  <input
                    ref={profilePictureInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                </div>
                {userData?.profilePicture?.url && (
                  <button
                    onClick={handleDeleteProfilePicture}
                    disabled={uploadingImage}
                    className="text-white/90 hover:text-white text-sm underline mb-2 disabled:opacity-50"
                  >
                    Remove photo
                  </button>
                )}
                <h2 className="text-2xl font-bold text-white mb-2">{formData.name}</h2>
                <p className="text-white/90 font-mono text-lg">{formData.studentID}</p>
              </div>

              {/* Quick Info */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5 text-[#19aaba]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Program</p>
                    <p className="text-sm font-medium">B.Sc. in CSE</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-[#19aaba]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Batch</p>
                    <p className="text-sm font-medium">Perceptron-13</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#19aaba]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Institution</p>
                    <p className="text-sm font-medium">Jashore University of Science and Technology</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                  >
                    <Lock className="w-4 h-4" />
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#19aaba]" />
                  Personal Information
                </h3>
                {!isEditing ? (
                  <button
                    onClick={handleEditClick}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#19aaba] hover:bg-[#158c99] text-white rounded-lg font-medium transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancelEdit}
                      disabled={updating}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={updating}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      {updating ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Save
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        name="name"
                        value={tempFormData.name}
                        onChange={handleTempChange}
                        className={`w-full px-4 py-3 border ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all`}
                        placeholder="Enter your full name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-900 font-medium px-4 py-3 bg-gray-50 rounded-lg">
                      {formData.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        name="email"
                        value={tempFormData.email}
                        onChange={handleTempChange}
                        className={`w-full px-4 py-3 border ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all`}
                        placeholder="2001xxx.cse@student.just.edu.bd"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-900 font-medium px-4 py-3 bg-gray-50 rounded-lg">
                      {formData.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Student ID
                  </label>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        name="studentID"
                        value={tempFormData.studentID}
                        onChange={handleTempChange}
                        className={`w-full px-4 py-3 border ${
                          errors.studentID ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all`}
                        placeholder="200120"
                      />
                      {errors.studentID && (
                        <p className="mt-1 text-sm text-red-600">{errors.studentID}</p>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-900 font-medium font-mono px-4 py-3 bg-gray-50 rounded-lg">
                      {formData.studentID}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#19aaba]" />
                Academic Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Student ID</span>
                  <span className="font-mono font-semibold text-gray-900">{formData.studentID}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Department</span>
                  <span className="font-semibold text-gray-900">Computer Science & Engineering</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Batch Name</span>
                  <span className="font-semibold text-gray-900">Perceptron-13</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Session</span>
                  <span className="font-semibold text-gray-900">2020-21</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-gray-600">University</span>
                  <span className="font-semibold text-gray-900">Jashore University of Science and Technology</span>
                </div>
              </div>
            </div>

            {/* Tour Highlights */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-[#19aaba]" />
                  Featured Photos
                </h3>
                {(!userData?.featuredPhotos || userData.featuredPhotos.length < 6) && (
                  <button
                    onClick={handleAddPhotoClick}
                    disabled={uploadingImage}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#19aaba] hover:bg-[#158c99] text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    Add Photo
                  </button>
                )}
              </div>
              
              {userData?.featuredPhotos && userData.featuredPhotos.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {userData.featuredPhotos.map((photo) => (
                      <div 
                        key={photo._id}
                        className="group relative aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                      >
                        <img
                          src={photo.url}
                          alt={photo.caption || 'Featured photo'}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            {photo.caption && (
                              <p className="text-white text-sm font-medium mb-2">{photo.caption}</p>
                            )}
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditCaption(photo)}
                                className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-white/90 hover:bg-white text-gray-900 rounded text-sm font-medium transition-colors"
                              >
                                <Edit2 className="w-3 h-3" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteFeaturedPhoto(photo._id)}
                                disabled={uploadingImage}
                                className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded text-sm font-medium transition-colors disabled:opacity-50"
                              >
                                <Trash2 className="w-3 h-3" />
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-gray-500 text-sm">
                      {userData.featuredPhotos.length} of 6 photos
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No featured photos yet</p>
                  <button
                    onClick={handleAddPhotoClick}
                    disabled={uploadingImage}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#19aaba] hover:bg-[#158c99] text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    <Plus className="w-5 h-5" />
                    Add Your First Photo
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Lock className="w-6 h-6 text-[#19aaba]" />
                  Change Password
                </h3>
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                    setErrors({});
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className={`w-full px-4 py-3 pr-12 border ${
                        errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all`}
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.currentPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className={`w-full px-4 py-3 pr-12 border ${
                        errors.newPassword ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all`}
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={`w-full px-4 py-3 border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all`}
                    placeholder="Confirm new password"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                    setErrors({});
                  }}
                  disabled={updating}
                  className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordSubmit}
                  disabled={updating}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#19aaba] to-[#158c99] hover:from-[#158c99] hover:to-[#116d77] text-white rounded-lg font-medium transition-all disabled:opacity-50"
                >
                  {updating ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Update Password
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Photo Modal */}
      {showAddPhotoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Upload className="w-6 h-6 text-[#19aaba]" />
                  Add Featured Photo
                </h3>
                <button
                  onClick={() => {
                    setShowAddPhotoModal(false);
                    setPhotoCaption('');
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Caption (Optional)
                  </label>
                  <input
                    type="text"
                    value={photoCaption}
                    onChange={(e) => setPhotoCaption(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all"
                    placeholder="Enter photo caption"
                    maxLength={100}
                  />
                  <p className="mt-1 text-xs text-gray-500">{photoCaption.length}/100</p>
                </div>

                <div>
                  <input
                    ref={featuredPhotoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFeaturedPhotoChange}
                    className="hidden"
                  />
                  <button
                    onClick={() => featuredPhotoInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#19aaba] to-[#158c99] hover:from-[#158c99] hover:to-[#116d77] text-white rounded-lg font-medium transition-all disabled:opacity-50"
                  >
                    {uploadingImage ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        Choose Photo
                      </>
                    )}
                  </button>
                  <p className="mt-2 text-xs text-gray-500 text-center">
                    Maximum file size: 5MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Caption Modal */}
      {showEditCaptionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Edit2 className="w-6 h-6 text-[#19aaba]" />
                  Edit Caption
                </h3>
                <button
                  onClick={() => {
                    setShowEditCaptionModal(false);
                    setSelectedPhoto(null);
                    setNewCaption('');
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {selectedPhoto && (
                <div className="mb-4">
                  <img
                    src={selectedPhoto.url}
                    alt="Selected photo"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Caption
                  </label>
                  <input
                    type="text"
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all"
                    placeholder="Enter photo caption"
                    maxLength={100}
                  />
                  <p className="mt-1 text-xs text-gray-500">{newCaption.length}/100</p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setShowEditCaptionModal(false);
                    setSelectedPhoto(null);
                    setNewCaption('');
                  }}
                  disabled={updating}
                  className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateCaption}
                  disabled={updating}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#19aaba] to-[#158c99] hover:from-[#158c99] hover:to-[#116d77] text-white rounded-lg font-medium transition-all disabled:opacity-50"
                >
                  {updating ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Save Caption
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
