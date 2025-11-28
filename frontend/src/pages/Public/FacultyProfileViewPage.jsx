import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  getFacultyById,
  getFacultyProfile, 
  updateFacultyProfile, 
  updateFacultyProfilePicture, 
  deleteOwnFacultyProfilePicture,
  addFacultyFeaturedPhoto,
  updateFacultyFeaturedPhoto,
  deleteFacultyFeaturedPhoto
} from '../../services/facultyApi';
import { updateUserProfile } from '../../services/userApi';
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
  Briefcase,
  Phone,
  Globe,
  BookOpen,
  Building2,
  Clock,
  LogOut,
  Camera,
  Edit2,
  X,
  Check,
  Plus,
  Trash2,
  Link as LinkIcon,
  Linkedin
} from 'lucide-react';
import ProfilePictureModal from '../../components/Profile/ProfilePictureModal';
import AvatarModal from '../../components/Profile/AvatarModal';
import ConfirmModal from '../../components/common/ConfirmModal';
import ImageViewModal from '../../components/Profile/ImageViewModal';

const FacultyProfileViewPage = () => {
  const { user: authUser, logout, updateUser } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [showProfilePicturePreviewModal, setShowProfilePicturePreviewModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showDeleteProfilePictureModal, setShowDeleteProfilePictureModal] = useState(false);
  const [deletingProfilePicture, setDeletingProfilePicture] = useState(false);
  
  // Featured photos state
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
  const [featuredPhotoPreview, setFeaturedPhotoPreview] = useState(null);
  const [featuredPhotoFile, setFeaturedPhotoFile] = useState(null);
  const [photoCaption, setPhotoCaption] = useState('');
  const [showEditCaptionModal, setShowEditCaptionModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [newCaption, setNewCaption] = useState('');
  const [showDeletePhotoModal, setShowDeletePhotoModal] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState(null);
  const [deletingPhoto, setDeletingPhoto] = useState(false);
  const [showFeaturedImageViewModal, setShowFeaturedImageViewModal] = useState(false);
  const [viewingFeaturedImage, setViewingFeaturedImage] = useState(null);
  
  const profilePictureInputRef = useRef(null);
  const featuredPhotoInputRef = useRef(null);

  const [facultyData, setFacultyData] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    designation: '',
    department: '',
    phone: '',
    bio: '',
    researchInterests: [],
    qualifications: [],
    officeRoom: '',
    officeHours: '',
    website: '',
    googleScholar: '',
    linkedIn: ''
  });

  const [tempFormData, setTempFormData] = useState({
    name: '',
    email: '',
    designation: '',
    department: '',
    phone: '',
    bio: '',
    researchInterests: [],
    qualifications: [],
    officeRoom: '',
    officeHours: '',
    website: '',
    googleScholar: '',
    linkedIn: ''
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
    fetchFacultyData();
  }, [id, authUser]);

  const fetchFacultyData = async () => {
    try {
      setLoading(true);
      
      // If no ID param, user is viewing their own profile (from /user/profile route)
      if (!id) {
        if (authUser?.type !== 'faculty') {
          toast.error('Access denied');
          navigate('/');
          return;
        }
        
        // Fetch own faculty profile
        try {
          const response = await getFacultyProfile();
          const faculty = response.data;
          setIsOwner(true);
          setFacultyData(faculty);
          
          const data = {
            name: faculty.name || '',
            email: faculty.email || '',
            designation: faculty.designation || '',
            department: faculty.department || '',
            phone: faculty.phone || '',
            bio: faculty.bio || '',
            researchInterests: faculty.researchInterests || [],
            qualifications: faculty.qualifications || [],
            officeRoom: faculty.officeRoom || '',
            officeHours: faculty.officeHours || '',
            website: faculty.website || '',
            googleScholar: faculty.googleScholar || '',
            linkedIn: faculty.linkedIn || ''
          };
          
          setFormData(data);
          setTempFormData(data);
        } catch (profileError) {
          // If faculty profile doesn't exist yet, show a message
          if (profileError.response?.status === 404) {
            toast.error('Your faculty profile has not been created yet. Please contact an administrator.');
            navigate('/');
          } else {
            throw profileError;
          }
          return;
        }
      } else {
        // Fetch public profile data by ID
        const response = await getFacultyById(id);
        const faculty = response.data;
        
        // Check if viewing own profile by comparing emails
        const viewingOwnProfile = authUser?.type === 'faculty' && authUser?.email === faculty.email;
        setIsOwner(viewingOwnProfile);
        
        setFacultyData(faculty);
      
        const data = {
          name: faculty.name || '',
          email: faculty.email || '',
          designation: faculty.designation || '',
          department: faculty.department || '',
          phone: faculty.phone || '',
          bio: faculty.bio || '',
          researchInterests: faculty.researchInterests || [],
          qualifications: faculty.qualifications || [],
          officeRoom: faculty.officeRoom || '',
          officeHours: faculty.officeHours || '',
          website: faculty.website || '',
          googleScholar: faculty.googleScholar || '',
          linkedIn: faculty.linkedIn || ''
        };
        
        setFormData(data);
        setTempFormData(data);
      }
    } catch (error) {
      console.error('Failed to fetch faculty profile:', error);
      toast.error('Failed to load profile data');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'F';
    const words = name.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleEditClick = () => {
    if (!isOwner) {
      toast.error('You can only edit your own profile');
      return;
    }
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

  const handleResearchInterestAdd = () => {
    setTempFormData(prev => ({
      ...prev,
      researchInterests: [...prev.researchInterests, '']
    }));
  };

  const handleResearchInterestChange = (index, value) => {
    setTempFormData(prev => ({
      ...prev,
      researchInterests: prev.researchInterests.map((item, i) => i === index ? value : item)
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

  const validateProfileForm = () => {
    const newErrors = {};
    
    if (!tempFormData.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!tempFormData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(tempFormData.email)) {
        newErrors.email = 'Invalid email format';
      }
    }
    
    if (!tempFormData.designation?.trim()) {
      newErrors.designation = 'Designation is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!isOwner) {
      toast.error('You can only edit your own profile');
      return;
    }

    if (!validateProfileForm()) {
      return;
    }

    setUpdating(true);

    try {
      const response = await updateFacultyProfile(tempFormData);
      toast.success('Profile updated successfully!');
      setFacultyData(response.data);
      setFormData({
        name: response.data.name || '',
        email: response.data.email || '',
        designation: response.data.designation || '',
        department: response.data.department || '',
        phone: response.data.phone || '',
        bio: response.data.bio || '',
        researchInterests: response.data.researchInterests || [],
        qualifications: response.data.qualifications || [],
        officeRoom: response.data.officeRoom || '',
        officeHours: response.data.officeHours || '',
        website: response.data.website || '',
        googleScholar: response.data.googleScholar || '',
        linkedIn: response.data.linkedIn || ''
      });
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
    navigate(-1);
  };

  const handleProfilePictureClick = () => {
    if (!isOwner) return;
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
      const response = await updateFacultyProfilePicture(profilePictureFile);
      setFacultyData(response.data);
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
      const response = await deleteOwnFacultyProfilePicture();
      setFacultyData(response.data);
      toast.success('Profile picture deleted successfully!');
      setShowAvatarModal(false);
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
    if (facultyData?.profilePicture?.url) {
      setShowAvatarModal(true);
    }
  };

  // Featured photos handlers
  const handleAddPhotoClick = () => {
    if (facultyData?.featuredPhotos?.length >= 6) {
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
      const response = await addFacultyFeaturedPhoto(featuredPhotoFile, photoCaption);
      setFacultyData(response.data);
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
      const response = await updateFacultyFeaturedPhoto(selectedPhoto._id, newCaption);
      setFacultyData(response.data);
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
      const response = await deleteFacultyFeaturedPhoto(photoToDelete);
      setFacultyData(response.data);
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

  const handleViewFeaturedImage = (photo) => {
    setViewingFeaturedImage(photo);
    setShowFeaturedImageViewModal(true);
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
              <span className="font-medium">Back</span>
            </button>
            {isOwner && authUser && (
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
            <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Faculty Member</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            {isOwner ? 'My Faculty Profile' : 'Faculty Profile'}
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
                  {facultyData?.profilePicture?.url ? (
                    <div 
                      className="w-full h-full rounded-full overflow-hidden shadow-lg border-4 border-white cursor-pointer group"
                      onClick={handleViewProfilePicture}
                    >
                      <img 
                        src={facultyData.profilePicture.url} 
                        alt={facultyData.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-[#19aaba] text-4xl font-bold shadow-lg">
                      {getInitials(facultyData?.name)}
                    </div>
                  )}
                  {isOwner && (
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
                {isOwner && facultyData?.profilePicture?.url && (
                  <button
                    onClick={handleDeleteProfilePictureClick}
                    disabled={uploadingImage || deletingProfilePicture}
                    className="text-white/90 hover:text-white text-xs sm:text-sm underline mb-2 disabled:opacity-50"
                  >
                    Remove photo
                  </button>
                )}
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2 break-words px-2">{facultyData?.name}</h2>
                <p className="text-white/90 text-base sm:text-lg">{facultyData?.designation}</p>
              </div>

              {/* Quick Info */}
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[#19aaba]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium truncate">{facultyData?.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-[#19aaba]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Department</p>
                    <p className="text-sm font-medium break-words">{facultyData?.department}</p>
                  </div>
                </div>

                {facultyData?.officeRoom && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-[#19aaba]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">Office</p>
                      <p className="text-sm font-medium">{facultyData.officeRoom}</p>
                    </div>
                  </div>
                )}

                {facultyData?.phone && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-[#19aaba]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm font-medium">{facultyData.phone}</p>
                    </div>
                  </div>
                )}

                {isOwner && (
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
            {/* Bio Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-[#19aaba]" />
                  <span>Professional Information</span>
                </h3>
                {isOwner && !isEditing && (
                  <button
                    onClick={handleEditClick}
                    className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-[#19aaba] hover:bg-[#158c99] text-white rounded-lg font-medium transition-colors text-sm w-full sm:w-auto"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                )}
                {isOwner && isEditing && (
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
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    {isOwner && isEditing ? (
                      <>
                        <input
                          type="text"
                          name="name"
                          value={tempFormData.name}
                          onChange={handleTempChange}
                          className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border ${
                            errors.name ? 'border-red-500' : 'border-gray-300'
                          } rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all text-sm sm:text-base`}
                          placeholder="Enter full name"
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    {isOwner && isEditing ? (
                      <>
                        <input
                          type="email"
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Designation</label>
                    {isOwner && isEditing ? (
                      <>
                        <select
                          name="designation"
                          value={tempFormData.designation}
                          onChange={handleTempChange}
                          className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border ${
                            errors.designation ? 'border-red-500' : 'border-gray-300'
                          } rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all text-sm sm:text-base`}
                        >
                          <option value="">Select Designation</option>
                          <option value="Professor">Professor</option>
                          <option value="Associate Professor">Associate Professor</option>
                          <option value="Assistant Professor">Assistant Professor</option>
                          <option value="Lecturer">Lecturer</option>
                          <option value="Senior Lecturer">Senior Lecturer</option>
                          <option value="Adjunct Professor">Adjunct Professor</option>
                          <option value="Visiting Professor">Visiting Professor</option>
                        </select>
                        {errors.designation && (
                          <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.designation}</p>
                        )}
                      </>
                    ) : (
                      <p className="text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-lg text-sm sm:text-base">
                        {formData.designation}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                    {isOwner && isEditing ? (
                      <input
                        type="text"
                        name="department"
                        value={tempFormData.department}
                        onChange={handleTempChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all text-sm sm:text-base"
                        placeholder="e.g., Computer Science & Engineering"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-lg break-words text-sm sm:text-base">
                        {formData.department}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    {isOwner && isEditing ? (
                      <input
                        type="text"
                        name="phone"
                        value={tempFormData.phone}
                        onChange={handleTempChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all text-sm sm:text-base"
                        placeholder="Enter phone number"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-lg text-sm sm:text-base">
                        {formData.phone || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Office Room</label>
                    {isOwner && isEditing ? (
                      <input
                        type="text"
                        name="officeRoom"
                        value={tempFormData.officeRoom}
                        onChange={handleTempChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all text-sm sm:text-base"
                        placeholder="e.g., AB-301"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-lg text-sm sm:text-base">
                        {formData.officeRoom || 'Not provided'}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Office Hours</label>
                  {isOwner && isEditing ? (
                    <input
                      type="text"
                      name="officeHours"
                      value={tempFormData.officeHours}
                      onChange={handleTempChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all text-sm sm:text-base"
                      placeholder="e.g., Sunday-Thursday, 10:00 AM - 12:00 PM"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-lg text-sm sm:text-base">
                      {formData.officeHours || 'Not provided'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                  {isOwner && isEditing ? (
                    <>
                      <textarea
                        name="bio"
                        value={tempFormData.bio}
                        onChange={handleTempChange}
                        rows={4}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all text-sm sm:text-base resize-vertical"
                        placeholder="Share your professional background..."
                        maxLength={1000}
                      />
                      <p className="mt-1 text-xs text-gray-500">{tempFormData.bio.length}/1000</p>
                    </>
                  ) : (
                    <p className="text-gray-900 font-medium px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-lg text-sm sm:text-base min-h-[100px] whitespace-pre-wrap">
                      {formData.bio || 'No bio provided yet'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Research Interests */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#19aaba]" />
                <span>Research Interests</span>
              </h3>
              
              {isOwner && isEditing ? (
                <div className="space-y-3">
                  {tempFormData.researchInterests.map((interest, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={interest}
                        onChange={(e) => handleResearchInterestChange(index, e.target.value)}
                        className="flex-1 px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all text-sm sm:text-base"
                        placeholder="Enter research interest"
                      />
                      <button
                        onClick={() => handleResearchInterestRemove(index)}
                        className="px-3 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={handleResearchInterestAdd}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Interest
                  </button>
                </div>
              ) : (
                formData.researchInterests.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {formData.researchInterests.map((interest, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-[#19aaba]/10 text-[#19aaba] rounded-full text-sm font-medium"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No research interests added yet</p>
                )
              )}
            </div>

            {/* Qualifications */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#19aaba]" />
                <span>Academic Qualifications</span>
              </h3>
              
              {isOwner && isEditing ? (
                <div className="space-y-4">
                  {tempFormData.qualifications.map((qual, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                      <div className="grid md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={qual.degree}
                          onChange={(e) => handleQualificationChange(index, 'degree', e.target.value)}
                          className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all text-sm"
                          placeholder="Degree (e.g., PhD)"
                        />
                        <input
                          type="text"
                          value={qual.field}
                          onChange={(e) => handleQualificationChange(index, 'field', e.target.value)}
                          className="px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all text-sm"
                          placeholder="Field of study"
                        />
                      </div>
                      <input
                        type="text"
                        value={qual.institution}
                        onChange={(e) => handleQualificationChange(index, 'institution', e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all text-sm"
                        placeholder="Institution"
                      />
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={qual.year}
                          onChange={(e) => handleQualificationChange(index, 'year', e.target.value)}
                          className="flex-1 px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all text-sm"
                          placeholder="Year"
                        />
                        <button
                          onClick={() => handleQualificationRemove(index)}
                          className="px-3 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={handleQualificationAdd}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors text-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Add Qualification
                  </button>
                </div>
              ) : (
                formData.qualifications.length > 0 ? (
                  <div className="space-y-3">
                    {formData.qualifications.map((qual, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-[#19aaba]/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <Award className="w-5 h-5 text-[#19aaba]" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 text-base">
                              {qual.degree}{qual.field && ` in ${qual.field}`}
                            </h4>
                            <p className="text-gray-700 text-sm mt-1">{qual.institution}</p>
                            {qual.year && <p className="text-gray-500 text-sm mt-1">{qual.year}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No qualifications added yet</p>
                )
              )}
            </div>

            {/* Links */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-[#19aaba]" />
                <span>Professional Links</span>
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Globe className="w-4 h-4 inline mr-1" />
                    Personal Website
                  </label>
                  {isOwner && isEditing ? (
                    <input
                      type="url"
                      name="website"
                      value={tempFormData.website}
                      onChange={handleTempChange}
                      className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all text-sm"
                      placeholder="https://your-website.com"
                    />
                  ) : (
                    formData.website ? (
                      <a
                        href={formData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#19aaba] hover:underline text-sm break-all"
                      >
                        {formData.website}
                      </a>
                    ) : (
                      <p className="text-gray-500 text-sm">Not provided</p>
                    )
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Google Scholar Profile
                  </label>
                  {isOwner && isEditing ? (
                    <input
                      type="url"
                      name="googleScholar"
                      value={tempFormData.googleScholar}
                      onChange={handleTempChange}
                      className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all text-sm"
                      placeholder="https://scholar.google.com/..."
                    />
                  ) : (
                    formData.googleScholar ? (
                      <a
                        href={formData.googleScholar}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#19aaba] hover:underline text-sm break-all"
                      >
                        {formData.googleScholar}
                      </a>
                    ) : (
                      <p className="text-gray-500 text-sm">Not provided</p>
                    )
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    LinkedIn Profile
                  </label>
                  {isOwner && isEditing ? (
                    <input
                      type="url"
                      name="linkedIn"
                      value={tempFormData.linkedIn}
                      onChange={handleTempChange}
                      className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all text-sm"
                      placeholder="https://linkedin.com/in/..."
                    />
                  ) : (
                    formData.linkedIn ? (
                      <a
                        href={formData.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#19aaba] hover:underline text-sm break-all"
                      >
                        {formData.linkedIn}
                      </a>
                    ) : (
                      <p className="text-gray-500 text-sm">Not provided</p>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Featured Photos */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-[#19aaba]" />
                  <span>Featured Photos</span>
                </h3>
                {isOwner && (!facultyData?.featuredPhotos || facultyData.featuredPhotos.length < 6) && (
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
              
              {facultyData?.featuredPhotos && facultyData.featuredPhotos.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {facultyData.featuredPhotos.map((photo) => (
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
                            {isOwner && (
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
                  {isOwner && (
                    <div className="mt-4 text-center">
                      <p className="text-gray-500 text-sm">
                        {facultyData.featuredPhotos.length} of 6 photos
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No featured photos yet</p>
                  {isOwner && (
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

      {/* Change Password Modal */}
      {isOwner && showPasswordModal && (
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

      {/* Profile Picture Preview Modal */}
      {isOwner && (
        <ProfilePictureModal
          isOpen={showProfilePicturePreviewModal}
          onClose={handleCancelProfilePictureUpload}
          imageUrl={profilePicturePreview}
          onUpload={handleConfirmProfilePictureUpload}
          isUploading={uploadingImage}
          title="Adjust Profile Picture"
        />
      )}

      {/* Avatar Modal */}
      <AvatarModal
        user={facultyData}
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
      />

      {/* Delete Profile Picture Confirmation Modal */}
      {isOwner && (
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
      )}

      {/* Add Featured Photo Modal */}
      {isOwner && showAddPhotoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Camera className="w-6 h-6 text-[#19aaba]" />
                  Add Featured Photo
                </h3>
                <button
                  onClick={() => {
                    setShowAddPhotoModal(false);
                    setPhotoCaption('');
                    handleCancelFeaturedPhotoUpload();
                  }}
                  disabled={uploadingImage}
                  className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {featuredPhotoPreview ? (
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
                ) : (
                  <div 
                    onClick={() => featuredPhotoInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-[#19aaba] transition-colors"
                  >
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Click to select a photo</p>
                    <p className="text-sm text-gray-500">Max size: 5MB</p>
                  </div>
                )}

                <input
                  ref={featuredPhotoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFeaturedPhotoChange}
                  className="hidden"
                />

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Caption (Optional)
                  </label>
                  <textarea
                    value={photoCaption}
                    onChange={(e) => setPhotoCaption(e.target.value)}
                    rows={3}
                    maxLength={200}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all resize-none"
                    placeholder="Add a caption for this photo..."
                  />
                  <p className="mt-1 text-xs text-gray-500">{photoCaption.length}/200</p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => {
                    setShowAddPhotoModal(false);
                    setPhotoCaption('');
                    handleCancelFeaturedPhotoUpload();
                  }}
                  disabled={uploadingImage}
                  className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmFeaturedPhotoUpload}
                  disabled={uploadingImage || !featuredPhotoFile}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#19aaba] to-[#158c99] hover:from-[#158c99] hover:to-[#116d77] text-white rounded-lg font-medium transition-all disabled:opacity-50"
                >
                  {uploadingImage ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      Add Photo
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Caption Modal */}
      {isOwner && showEditCaptionModal && (
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
                  disabled={updating}
                  className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Caption
                </label>
                <textarea
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  rows={3}
                  maxLength={200}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all resize-none"
                  placeholder="Add a caption for this photo..."
                />
                <p className="mt-1 text-xs text-gray-500">{newCaption.length}/200</p>
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
                      Updating...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Update
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Photo Confirmation Modal */}
      {isOwner && (
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
      )}

      {/* Featured Image View Modal */}
      <ImageViewModal
        isOpen={showFeaturedImageViewModal}
        onClose={() => {
          setShowFeaturedImageViewModal(false);
          setViewingFeaturedImage(null);
        }}
        imageUrl={viewingFeaturedImage?.url}
        caption={viewingFeaturedImage?.caption}
      />
    </div>
  );
};

export default FacultyProfileViewPage;
