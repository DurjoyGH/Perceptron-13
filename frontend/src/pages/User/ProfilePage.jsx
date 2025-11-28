import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Plus,
  Briefcase,
  Phone,
  Globe,
  BookOpen,
  Building2,
  Clock,
  Link as LinkIcon
} from 'lucide-react';
import ProfilePictureModal from '../../components/Profile/ProfilePictureModal';
import ImageViewModal from '../../components/Profile/ImageViewModal';
import AvatarModal from '../../components/Profile/AvatarModal';
import ConfirmModal from '../../components/common/ConfirmModal';

const ProfilePage = () => {
  const { id } = useParams(); // Get user ID from URL params (if viewing another user)
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
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [featuredPhotoPreview, setFeaturedPhotoPreview] = useState(null);
  const [featuredPhotoFile, setFeaturedPhotoFile] = useState(null);
  const [showProfilePicturePreviewModal, setShowProfilePicturePreviewModal] = useState(false);
  const [showProfileImageViewModal, setShowProfileImageViewModal] = useState(false);
  const [showFeaturedImageViewModal, setShowFeaturedImageViewModal] = useState(false);
  const [viewingFeaturedImage, setViewingFeaturedImage] = useState(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showDeletePhotoModal, setShowDeletePhotoModal] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState(null);
  const [deletingPhoto, setDeletingPhoto] = useState(false);
  const [showDeleteProfilePictureModal, setShowDeleteProfilePictureModal] = useState(false);
  const [deletingProfilePicture, setDeletingProfilePicture] = useState(false);
  
  const profilePictureInputRef = useRef(null);
  const featuredPhotoInputRef = useRef(null);

  const [userData, setUserData] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    dialogue: '',
    studentID: '',
    // Faculty-specific fields
    designation: '',
    department: '',
    bio: '',
    researchInterests: [],
    qualifications: [],
    officeRoom: '',
    officeHours: '',
    personalWebsite: '',
    googleScholar: '',
    researchGate: '',
    orcid: ''
  });

  const [tempFormData, setTempFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    dialogue: '',
    studentID: '',
    // Faculty-specific fields
    designation: '',
    department: '',
    bio: '',
    researchInterests: [],
    qualifications: [],
    officeRoom: '',
    officeHours: '',
    personalWebsite: '',
    googleScholar: '',
    researchGate: '',
    orcid: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Determine if viewing own profile or another user's profile
  const isOwnProfile = !id || id === authUser?.studentID;

  useEffect(() => {
    fetchUserProfile();
  }, [id]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      // TODO: If viewing another user's profile (id is set), fetch that user's data
      // For now, we'll always fetch the logged-in user's profile
      const response = await getUserProfile();
      const user = response.data;
      setUserData(user);
      const data = {
        name: user.name || '',
        email: user.email || '',
        contactNumber: user.contactNumber || '',
        dialogue: user.dialogue || '',
        studentID: user.studentID || '',
        // Faculty-specific fields
        designation: user.designation || '',
        department: user.department || '',
        bio: user.bio || '',
        researchInterests: Array.isArray(user.researchInterests) ? user.researchInterests : [],
        qualifications: Array.isArray(user.qualifications) ? user.qualifications : [],
        officeRoom: user.officeRoom || '',
        officeHours: user.officeHours || '',
        personalWebsite: user.personalWebsite || '',
        googleScholar: user.googleScholar || '',
        researchGate: user.researchGate || '',
        orcid: user.orcid || ''
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

  // Helper functions for faculty-specific features
  const handleResearchInterestAdd = () => {
    setTempFormData(prev => ({
      ...prev,
      researchInterests: [...prev.researchInterests, '']
    }));
  };

  const handleResearchInterestChange = (index, value) => {
    setTempFormData(prev => ({
      ...prev,
      researchInterests: prev.researchInterests.map((item, i) => 
        i === index ? value : item
      )
    }));
  };

  const handleResearchInterestRemove = (index) => {
    setTempFormData(prev => ({
      ...prev,
      researchInterests: prev.researchInterests.filter((_, i) => i !== index)
    }));
  };

  const handleQualificationAdd = () => {
    setTempFormData(prev => ({
      ...prev,
      qualifications: [...prev.qualifications, { degree: '', institution: '', year: '', field: '' }]
    }));
  };

  const handleQualificationChange = (index, field, value) => {
    setTempFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleQualificationRemove = (index) => {
    setTempFormData(prev => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index)
    }));
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
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(tempFormData.email)) {
        newErrors.email = 'Invalid email format';
      }
    }

    // Student ID cannot be changed, so no validation needed

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfileForm()) {
      return;
    }

    setUpdating(true);

    try {
      // Don't send studentID in update request - it cannot be changed
      const updateData = {
        name: tempFormData.name,
        email: tempFormData.email,
        contactNumber: tempFormData.contactNumber,
        dialogue: tempFormData.dialogue
      };

      // Add faculty-specific fields if user is faculty
      if (userData?.type === 'faculty') {
        updateData.designation = tempFormData.designation;
        updateData.department = tempFormData.department;
        updateData.bio = tempFormData.bio;
        updateData.researchInterests = tempFormData.researchInterests;
        updateData.qualifications = tempFormData.qualifications;
        updateData.officeRoom = tempFormData.officeRoom;
        updateData.officeHours = tempFormData.officeHours;
        updateData.personalWebsite = tempFormData.personalWebsite;
        updateData.googleScholar = tempFormData.googleScholar;
        updateData.researchGate = tempFormData.researchGate;
        updateData.orcid = tempFormData.orcid;
      }
      
      const response = await updateUserProfile(updateData);
      toast.success('Profile updated successfully!');
      
      // Update both userData and formData with response data
      const updatedData = response.data;
      setUserData(updatedData);
      
      const newFormData = {
        name: updatedData.name || '',
        email: updatedData.email || '',
        contactNumber: updatedData.contactNumber || '',
        dialogue: updatedData.dialogue || '',
        studentID: updatedData.studentID || '',
        // Faculty fields
        designation: updatedData.designation || '',
        department: updatedData.department || '',
        bio: updatedData.bio || '',
        researchInterests: Array.isArray(updatedData.researchInterests) ? updatedData.researchInterests : [],
        qualifications: Array.isArray(updatedData.qualifications) ? updatedData.qualifications : [],
        officeRoom: updatedData.officeRoom || '',
        officeHours: updatedData.officeHours || '',
        personalWebsite: updatedData.personalWebsite || '',
        googleScholar: updatedData.googleScholar || '',
        researchGate: updatedData.researchGate || '',
        orcid: updatedData.orcid || ''
      };
      
      setFormData(newFormData);
      setTempFormData(newFormData);
      updateUser(updatedData);
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

  const handleBackNavigation = () => {
    if (authUser?.role === 'admin') {
      navigate('/admin');
    } else if (isOwnProfile) {
      navigate('/');
    } else {
      navigate('/members');
    }
  };

  // Profile picture handlers
  const handleProfilePictureClick = () => {
    profilePictureInputRef.current?.click();
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      e.target.value = '';
      return;
    }

    setProfilePictureFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicturePreview(reader.result);
      setShowProfilePicturePreviewModal(true);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmProfilePictureUpload = async (adjustments) => {
    if (!profilePictureFile) {
      toast.error('No file selected');
      return;
    }

    setUploadingImage(true);
    try {
      const response = await updateProfilePicture(profilePictureFile);
      setUserData(response.data);
      updateUser(response.data);
      toast.success('Profile picture updated successfully!');
      setProfilePicturePreview(null);
      setProfilePictureFile(null);
      setShowProfilePicturePreviewModal(false);
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile picture';
      toast.error(errorMessage);
    } finally {
      setUploadingImage(false);
      if (profilePictureInputRef.current) {
        profilePictureInputRef.current.value = '';
      }
    }
  };

  const handleCancelProfilePictureUpload = () => {
    setProfilePicturePreview(null);
    setProfilePictureFile(null);
    setShowProfilePicturePreviewModal(false);
    if (profilePictureInputRef.current) {
      profilePictureInputRef.current.value = '';
    }
  };

  const handleDeleteProfilePictureClick = () => {
    setShowDeleteProfilePictureModal(true);
  };

  const confirmDeleteProfilePicture = async () => {
    setDeletingProfilePicture(true);
    try {
      const response = await deleteProfilePicture();
      setUserData(response.data);
      updateUser(response.data);
      toast.success('Profile picture deleted successfully!');
      setShowProfileImageViewModal(false);
      setShowDeleteProfilePictureModal(false);
    } catch (error) {
      console.error('Delete error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete profile picture';
      toast.error(errorMessage);
    } finally {
      setDeletingProfilePicture(false);
    }
  };

  const handleViewProfilePicture = () => {
    if (userData?.profilePicture?.url) {
      setShowAvatarModal(true);
    }
  };

  const handleViewFeaturedImage = (photo) => {
    setViewingFeaturedImage(photo);
    setShowFeaturedImageViewModal(true);
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

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      e.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFeaturedPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
    setFeaturedPhotoFile(file);
  };

  const handleConfirmFeaturedPhotoUpload = async () => {
    if (!featuredPhotoFile) return;

    setUploadingImage(true);
    try {
      const response = await addFeaturedPhoto(featuredPhotoFile, photoCaption);
      setUserData(response.data);
      toast.success('Featured photo added successfully!');
      setShowAddPhotoModal(false);
      setPhotoCaption('');
      setFeaturedPhotoPreview(null);
      setFeaturedPhotoFile(null);
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add featured photo';
      toast.error(errorMessage);
    } finally {
      setUploadingImage(false);
      if (featuredPhotoInputRef.current) {
        featuredPhotoInputRef.current.value = '';
      }
    }
  };

  const handleCancelFeaturedPhotoUpload = () => {
    setFeaturedPhotoPreview(null);
    setFeaturedPhotoFile(null);
    if (featuredPhotoInputRef.current) {
      featuredPhotoInputRef.current.value = '';
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

  const handleDeleteFeaturedPhoto = (photoId) => {
    setPhotoToDelete(photoId);
    setShowDeletePhotoModal(true);
  };

  const confirmDeleteFeaturedPhoto = async () => {
    if (!photoToDelete) return;

    setDeletingPhoto(true);
    try {
      const response = await deleteFeaturedPhoto(photoToDelete);
      setUserData(response.data);
      toast.success('Featured photo deleted successfully!');
      setShowDeletePhotoModal(false);
      setPhotoToDelete(null);
    } catch (error) {
      console.error('Delete error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete photo';
      toast.error(errorMessage);
    } finally {
      setDeletingPhoto(false);
    }
  };

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
      <div className="bg-gradient-to-br from-[#19aaba] via-[#158c99] to-[#116d77] text-white py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
            <button
              onClick={handleBackNavigation}
              className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium">
                {authUser?.role === 'admin' ? 'Back to Dashboard' : isOwnProfile ? 'Back to Home' : 'Back to Members'}
              </span>
            </button>
            {isOwnProfile && (
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg border border-white/20 transition-colors text-sm sm:text-base"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-xs sm:text-sm mb-2">
            <Users className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Industrial Tour 2025</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            {isOwnProfile ? 'My Profile' : 'Member Profile'}
          </h1>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden lg:sticky lg:top-8">
              {/* Avatar Section */}
              <div className="bg-gradient-to-br from-[#19aaba] to-[#158c99] p-6 sm:p-8 text-center relative">
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-3 sm:mb-4">
                  {userData?.profilePicture?.url ? (
                    <div 
                      className="w-full h-full rounded-full overflow-hidden shadow-lg border-4 border-white cursor-pointer group"
                      onClick={handleViewProfilePicture}
                    >
                      <img 
                        src={userData.profilePicture.url} 
                        alt={formData.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-[#19aaba] text-4xl font-bold shadow-lg">
                      {getInitials(formData.name)}
                    </div>
                  )}
                  {isOwnProfile && (
                    <>
                      <button
                        onClick={handleProfilePictureClick}
                        disabled={uploadingImage}
                        className="absolute bottom-0 right-0 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors border-2 border-[#19aaba] disabled:opacity-50"
                        title="Change profile picture"
                      >
                        {uploadingImage ? (
                          <Loader className="w-4 h-4 sm:w-5 sm:h-5 text-[#19aaba] animate-spin" />
                        ) : (
                          <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-[#19aaba]" />
                        )}
                      </button>
                      <input
                        ref={profilePictureInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        className="hidden"
                      />
                    </>
                  )}
                </div>
                {isOwnProfile && userData?.profilePicture?.url && (
                  <button
                    onClick={handleDeleteProfilePictureClick}
                    disabled={uploadingImage || deletingProfilePicture}
                    className="text-white/90 hover:text-white text-xs sm:text-sm underline mb-2 disabled:opacity-50"
                  >
                    Remove photo
                  </button>
                )}
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2 break-words px-2">{formData.name}</h2>
                <p className="text-white/90 font-mono text-base sm:text-lg">{formData.studentID}</p>
              </div>

              {/* Quick Info */}
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5 text-[#19aaba]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Program</p>
                    <p className="text-sm font-medium truncate">B.Sc. in CSE</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-[#19aaba]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Batch</p>
                    <p className="text-sm font-medium truncate">Perceptron-13</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#19aaba]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Institution</p>
                    <p className="text-sm font-medium break-words">Jashore University of Science and Technology</p>
                  </div>
                </div>

                {isOwnProfile && (
                  <div className="pt-3 sm:pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors text-sm"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Change Password</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#19aaba]" />
                  <span>Personal Information</span>
                </h3>
                {isOwnProfile && !isEditing && (
                  <button
                    onClick={handleEditClick}
                    className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-[#19aaba] hover:bg-[#158c99] text-white rounded-lg font-medium transition-colors text-sm w-full sm:w-auto"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                )}
                {isOwnProfile && isEditing && (
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={handleCancelEdit}
                      disabled={updating}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50 text-sm"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={updating}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 text-sm"
                    >
                      {updating ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Save</span>
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
                  {isOwnProfile && isEditing ? (
                    <>
                      <input
                        type="text"
                        name="name"
                        value={tempFormData.name}
                        onChange={handleTempChange}
                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all text-sm sm:text-base`}
                        placeholder="Enter your full name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.name}</p>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-lg break-words text-sm sm:text-base">
                      {formData.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  {isOwnProfile && isEditing ? (
                    <>
                      <input
                        type="text"
                        name="email"
                        value={tempFormData.email}
                        onChange={handleTempChange}
                        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all text-sm sm:text-base`}
                        placeholder="your.email@example.com"
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.email}</p>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-lg break-all text-sm sm:text-base">
                      {formData.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contact Number
                  </label>
                  {isOwnProfile && isEditing ? (
                    <input
                      type="text"
                      name="contactNumber"
                      value={tempFormData.contactNumber}
                      onChange={handleTempChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all text-sm sm:text-base"
                      placeholder="Enter your contact number"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-lg text-sm sm:text-base">
                      {formData.contactNumber || 'Not provided'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Dialogue/Testimonial
                  </label>
                  {isOwnProfile && isEditing ? (
                    <textarea
                      name="dialogue"
                      value={tempFormData.dialogue}
                      onChange={handleTempChange}
                      rows={4}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all text-sm sm:text-base resize-vertical"
                      placeholder="Share your thoughts about the tour..."
                      maxLength={500}
                    />
                  ) : (
                    <p className="text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-lg text-sm sm:text-base min-h-[100px] whitespace-pre-wrap">
                      {formData.dialogue || 'No testimonial shared yet'}
                    </p>
                  )}
                  {isOwnProfile && isEditing && (
                    <p className="mt-1 text-xs text-gray-500">{tempFormData.dialogue.length}/500</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {userData?.type === 'faculty' ? 'Faculty ID' : 'Student ID'}
                  </label>
                  <p className="text-gray-900 font-medium font-mono px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-100 rounded-lg text-sm sm:text-base border border-gray-300">
                    {formData.studentID}
                  </p>
                  {isOwnProfile && isEditing && (
                    <p className="mt-1 text-xs text-gray-500">{userData?.type === 'faculty' ? 'Faculty ID' : 'Student ID'} cannot be changed</p>
                  )}
                </div>

                {/* Faculty-specific fields */}
                {userData?.type === 'faculty' && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Designation
                      </label>
                      {isOwnProfile && isEditing ? (
                        <select
                          name="designation"
                          value={tempFormData.designation}
                          onChange={handleTempChange}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all text-sm sm:text-base"
                        >
                          <option value="">Select Designation</option>
                          <option value="Professor">Professor</option>
                          <option value="Associate Professor">Associate Professor</option>
                          <option value="Assistant Professor">Assistant Professor</option>
                          <option value="Lecturer">Lecturer</option>
                          <option value="Senior Lecturer">Senior Lecturer</option>
                        </select>
                      ) : (
                        <p className="text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-lg text-sm sm:text-base">
                          {formData.designation || 'Not specified'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Department
                      </label>
                      {isOwnProfile && isEditing ? (
                        <input
                          type="text"
                          name="department"
                          value={tempFormData.department}
                          onChange={handleTempChange}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all text-sm sm:text-base"
                          placeholder="e.g., Computer Science & Engineering"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-lg text-sm sm:text-base">
                          {formData.department || 'Not specified'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Bio
                      </label>
                      {isOwnProfile && isEditing ? (
                        <textarea
                          name="bio"
                          value={tempFormData.bio}
                          onChange={handleTempChange}
                          rows={4}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all text-sm sm:text-base resize-y"
                          placeholder="Brief professional biography..."
                        />
                      ) : (
                        <p className="text-gray-900 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-lg text-sm sm:text-base leading-relaxed">
                          {formData.bio || 'Not specified'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Office Room
                      </label>
                      {isOwnProfile && isEditing ? (
                        <input
                          type="text"
                          name="officeRoom"
                          value={tempFormData.officeRoom}
                          onChange={handleTempChange}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all text-sm sm:text-base"
                          placeholder="e.g., Room 301, Building A"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-lg text-sm sm:text-base">
                          {formData.officeRoom || 'Not specified'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Office Hours
                      </label>
                      {isOwnProfile && isEditing ? (
                        <input
                          type="text"
                          name="officeHours"
                          value={tempFormData.officeHours}
                          onChange={handleTempChange}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all text-sm sm:text-base"
                          placeholder="e.g., Mon-Wed 2:00-4:00 PM"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-lg text-sm sm:text-base">
                          {formData.officeHours || 'Not specified'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Personal Website
                      </label>
                      {isOwnProfile && isEditing ? (
                        <input
                          type="url"
                          name="personalWebsite"
                          value={tempFormData.personalWebsite}
                          onChange={handleTempChange}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all text-sm sm:text-base"
                          placeholder="https://yourwebsite.com"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-lg text-sm sm:text-base">
                          {formData.personalWebsite ? (
                            <a href={formData.personalWebsite} target="_blank" rel="noopener noreferrer" className="text-[#19aaba] hover:underline flex items-center gap-1">
                              <Globe className="w-4 h-4" />
                              Visit Website
                            </a>
                          ) : 'Not provided'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Google Scholar
                      </label>
                      {isOwnProfile && isEditing ? (
                        <input
                          type="url"
                          name="googleScholar"
                          value={tempFormData.googleScholar}
                          onChange={handleTempChange}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all text-sm sm:text-base"
                          placeholder="https://scholar.google.com/..."
                        />
                      ) : (
                        <p className="text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-lg text-sm sm:text-base">
                          {formData.googleScholar ? (
                            <a href={formData.googleScholar} target="_blank" rel="noopener noreferrer" className="text-[#19aaba] hover:underline flex items-center gap-1">
                              <GraduationCap className="w-4 h-4" />
                              Google Scholar
                            </a>
                          ) : 'Not provided'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        ResearchGate
                      </label>
                      {isOwnProfile && isEditing ? (
                        <input
                          type="url"
                          name="researchGate"
                          value={tempFormData.researchGate}
                          onChange={handleTempChange}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all text-sm sm:text-base"
                          placeholder="https://www.researchgate.net/profile/..."
                        />
                      ) : (
                        <p className="text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-lg text-sm sm:text-base">
                          {formData.researchGate ? (
                            <a href={formData.researchGate} target="_blank" rel="noopener noreferrer" className="text-[#19aaba] hover:underline flex items-center gap-1">
                              <LinkIcon className="w-4 h-4" />
                              ResearchGate Profile
                            </a>
                          ) : 'Not provided'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        ORCID
                      </label>
                      {isOwnProfile && isEditing ? (
                        <input
                          type="url"
                          name="orcid"
                          value={tempFormData.orcid}
                          onChange={handleTempChange}
                          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all text-sm sm:text-base"
                          placeholder="https://orcid.org/0000-0000-0000-0000"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-lg text-sm sm:text-base">
                          {formData.orcid ? (
                            <a href={formData.orcid} target="_blank" rel="noopener noreferrer" className="text-[#19aaba] hover:underline flex items-center gap-1">
                              <LinkIcon className="w-4 h-4" />
                              ORCID Profile
                            </a>
                          ) : 'Not provided'}
                        </p>
                      )}
                    </div>


                  </>
                )}
              </div>
            </div>

            {/* Faculty Research Interests Section */}
            {userData?.type === 'faculty' && (
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#19aaba]" />
                  <span>Research Interests</span>
                </h3>
                
                {isOwnProfile && isEditing ? (
                  <div className="space-y-3">
                    {tempFormData.researchInterests.map((interest, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={interest}
                          onChange={(e) => handleResearchInterestChange(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all text-sm"
                          placeholder="Enter research interest"
                        />
                        <button
                          type="button"
                          onClick={() => handleResearchInterestRemove(index)}
                          className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleResearchInterestAdd}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-[#19aaba] hover:bg-[#158c99] text-white rounded-lg transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Research Interest
                    </button>
                  </div>
                ) : (
                  <div>
                    {formData.researchInterests.length > 0 ? (
                      <div className="space-y-2">
                        {formData.researchInterests.map((interest, index) => (
                          <div key={index} className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-gray-900 text-sm">{interest}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm italic">No research interests added yet</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Faculty Qualifications Section */}
            {userData?.type === 'faculty' && (
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#19aaba]" />
                  <span>Qualifications</span>
                </h3>
                
                {isOwnProfile && isEditing ? (
                  <div className="space-y-4">
                    {tempFormData.qualifications.map((qual, index) => (
                      <div key={index} className="p-4 border border-gray-300 rounded-lg">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                          <input
                            type="text"
                            value={qual.degree}
                            onChange={(e) => handleQualificationChange(index, 'degree', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all text-sm"
                            placeholder="Degree (e.g., PhD, MSc, BSc)"
                          />
                          <input
                            type="text"
                            value={qual.institution}
                            onChange={(e) => handleQualificationChange(index, 'institution', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all text-sm"
                            placeholder="Institution"
                          />
                          <input
                            type="number"
                            value={qual.year}
                            onChange={(e) => handleQualificationChange(index, 'year', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all text-sm"
                            placeholder="Year"
                            min="1950"
                            max="2030"
                          />
                          <input
                            type="text"
                            value={qual.field}
                            onChange={(e) => handleQualificationChange(index, 'field', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all text-sm"
                            placeholder="Field of Study"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleQualificationRemove(index)}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleQualificationAdd}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-[#19aaba] hover:bg-[#158c99] text-white rounded-lg transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Qualification
                    </button>
                  </div>
                ) : (
                  <div>
                    {formData.qualifications.length > 0 ? (
                      <div className="space-y-3">
                        {formData.qualifications.map((qual, index) => (
                          <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <h4 className="font-semibold text-gray-900">{qual.degree}</h4>
                            <p className="text-gray-700">{qual.institution}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                              {qual.year && <span>Year: {qual.year}</span>}
                              {qual.field && <span>Field: {qual.field}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm italic">No qualifications added yet</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Academic Information - Show for students only */}
            {userData?.type !== 'faculty' && (
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-[#19aaba]" />
                  <span>Academic Information</span>
                </h3>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-gray-100 gap-1 sm:gap-0">
                    <span className="text-gray-600 text-sm">Student ID</span>
                    <span className="font-mono font-semibold text-gray-900 text-sm sm:text-base">{formData.studentID}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-gray-100 gap-1 sm:gap-0">
                    <span className="text-gray-600 text-sm">Department</span>
                    <span className="font-semibold text-gray-900 text-sm sm:text-base sm:text-right">Computer Science & Engineering</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-gray-100 gap-1 sm:gap-0">
                    <span className="text-gray-600 text-sm">Batch Name</span>
                    <span className="font-semibold text-gray-900 text-sm sm:text-base">Perceptron-13</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-3 border-b border-gray-100 gap-1 sm:gap-0">
                    <span className="text-gray-600 text-sm">Session</span>
                    <span className="font-semibold text-gray-900 text-sm sm:text-base">2020-21</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-3 gap-1 sm:gap-0">
                    <span className="text-gray-600 text-sm">University</span>
                    <span className="font-semibold text-gray-900 text-sm sm:text-base sm:text-right">Jashore University of Science and Technology</span>
                  </div>
                </div>
              </div>
            )}

            {/* Featured Photos */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-[#19aaba]" />
                  <span>Featured Photos</span>
                </h3>
                {isOwnProfile && (!userData?.featuredPhotos || userData.featuredPhotos.length < 6) && (
                  <button
                    onClick={handleAddPhotoClick}
                    disabled={uploadingImage}
                    className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-[#19aaba] hover:bg-[#158c99] text-white rounded-lg font-medium transition-colors disabled:opacity-50 text-sm w-full sm:w-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Photo</span>
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
                          className="w-full h-full object-cover cursor-pointer group-hover:scale-110 transition-transform duration-300"
                          onClick={() => handleViewFeaturedImage(photo)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            {photo.caption && (
                              <p className="text-white text-sm font-medium mb-2 line-clamp-2">{photo.caption}</p>
                            )}
                            {isOwnProfile && (
                              <div className="flex gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditCaption(photo);
                                  }}
                                  className="flex-1 inline-flex items-center justify-center gap-1 px-2 sm:px-3 py-1.5 bg-white/90 hover:bg-white text-gray-900 rounded text-xs sm:text-sm font-medium transition-colors"
                                >
                                  <Edit2 className="w-3 h-3" />
                                  <span className="hidden sm:inline">Edit</span>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteFeaturedPhoto(photo._id);
                                  }}
                                  disabled={uploadingImage}
                                  className="flex-1 inline-flex items-center justify-center gap-1 px-2 sm:px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded text-xs sm:text-sm font-medium transition-colors disabled:opacity-50"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span className="hidden sm:inline">Delete</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {isOwnProfile && (
                    <div className="mt-4 text-center">
                      <p className="text-gray-500 text-sm">
                        {userData.featuredPhotos.length} of 6 photos
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No featured photos yet</p>
                  {isOwnProfile && (
                    <button
                      onClick={handleAddPhotoClick}
                      disabled={uploadingImage}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#19aaba] hover:bg-[#158c99] text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                      <Plus className="w-5 h-5" />
                      Add Your First Photo
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal - Only for own profile */}
      {isOwnProfile && showPasswordModal && (
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

      {/* Add Photo Modal - Only for own profile */}
      {isOwnProfile && showAddPhotoModal && (
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
                    handleCancelFeaturedPhotoUpload();
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {featuredPhotoPreview && (
                  <div className="relative">
                    <img
                      src={featuredPhotoPreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                      onClick={handleCancelFeaturedPhotoUpload}
                      disabled={uploadingImage}
                      className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

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
                    disabled={uploadingImage}
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
                  
                  {!featuredPhotoPreview ? (
                    <button
                      onClick={() => featuredPhotoInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all disabled:opacity-50 border-2 border-dashed border-gray-300"
                    >
                      <Upload className="w-5 h-5" />
                      Choose Photo
                    </button>
                  ) : (
                    <button
                      onClick={handleConfirmFeaturedPhotoUpload}
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
                          <Check className="w-5 h-5" />
                          Upload Photo
                        </>
                      )}
                    </button>
                  )}
                  
                  <p className="mt-2 text-xs text-gray-500 text-center">
                    Maximum file size: 5MB • Supported formats: JPG, PNG, GIF
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Caption Modal - Only for own profile */}
      {isOwnProfile && showEditCaptionModal && (
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

      {/* Profile Picture Preview Modal - Telegram Style */}
      {isOwnProfile && (
        <ProfilePictureModal
          isOpen={showProfilePicturePreviewModal}
          onClose={handleCancelProfilePictureUpload}
          imageUrl={profilePicturePreview}
          onUpload={handleConfirmProfilePictureUpload}
          isUploading={uploadingImage}
          title="Adjust Profile Picture"
        />
      )}

      {/* Profile Picture View Modal - WhatsApp Style */}
      {userData?.profilePicture?.url && (
        <ImageViewModal
          isOpen={showProfileImageViewModal}
          onClose={() => setShowProfileImageViewModal(false)}
          imageUrl={userData.profilePicture.url}
          imageName={formData.name}
          onDelete={isOwnProfile ? handleDeleteProfilePictureClick : undefined}
          canDelete={isOwnProfile}
          isDeleting={deletingProfilePicture}
        />
      )}

      {/* Featured Image View Modal - WhatsApp Style */}
      {viewingFeaturedImage && (
        <ImageViewModal
          isOpen={showFeaturedImageViewModal}
          onClose={() => {
            setShowFeaturedImageViewModal(false);
            setViewingFeaturedImage(null);
          }}
          imageUrl={viewingFeaturedImage.url}
          imageName={viewingFeaturedImage.caption || 'Featured Photo'}
          canDelete={false}
        />
      )}

      {/* Avatar Modal */}
      <AvatarModal
        user={userData}
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
      />

      {/* Delete Photo Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeletePhotoModal}
        onClose={() => {
          setShowDeletePhotoModal(false);
          setPhotoToDelete(null);
        }}
        onConfirm={confirmDeleteFeaturedPhoto}
        title="Delete Featured Photo"
        message="Are you sure you want to delete this photo? This action cannot be undone."
        confirmText={deletingPhoto ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        type="danger"
        loading={deletingPhoto}
      />

      {/* Delete Profile Picture Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteProfilePictureModal}
        onClose={() => setShowDeleteProfilePictureModal(false)}
        onConfirm={confirmDeleteProfilePicture}
        title="Delete Profile Picture"
        message="Are you sure you want to delete your profile picture? This action cannot be undone."
        confirmText={deletingProfilePicture ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        type="danger"
        loading={deletingProfilePicture}
      />
    </div>
  );
};

export default ProfilePage;
