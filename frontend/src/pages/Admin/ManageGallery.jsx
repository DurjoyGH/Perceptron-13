import React, { useState, useEffect, useRef } from 'react';
import { 
  Image as ImageIcon,
  Upload,
  Edit2,
  Trash2,
  Calendar,
  Loader,
  Search,
  Filter,
  Download,
  Eye,
  X
} from 'lucide-react';
import { 
  getAllSchedules,
  addGalleryImage,
  updateGalleryImage,
  deleteGalleryImage
} from '../../services/tourScheduleApi';
import { toast } from 'sonner';
import ConfirmModal from '../../components/common/ConfirmModal';

const ManageGallery = () => {
  const fileInputRef = useRef(null);
  const [schedules, setSchedules] = useState([]);
  const [allImages, setAllImages] = useState([]);
  const [filteredImages, setFilteredImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedDay, setSelectedDay] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageCaption, setImageCaption] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDay, setFilterDay] = useState('all');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterImages();
  }, [allImages, searchTerm, filterDay]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getAllSchedules();
      const schedulesData = response.data;
      setSchedules(schedulesData);

      // Extract all images from all schedules
      const images = [];
      schedulesData.forEach(schedule => {
        if (schedule.gallery && schedule.gallery.length > 0) {
          schedule.gallery.forEach(image => {
            images.push({
              ...image,
              scheduleDay: schedule.day,
              scheduleTitle: schedule.title,
              scheduleDate: schedule.date
            });
          });
        }
      });
      
      setAllImages(images);
      setFilteredImages(images);
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
      toast.error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  const filterImages = () => {
    let filtered = [...allImages];

    // Filter by day
    if (filterDay !== 'all') {
      filtered = filtered.filter(img => img.scheduleDay === parseInt(filterDay));
    }

    // Filter by search term (caption or day title)
    if (searchTerm) {
      filtered = filtered.filter(img => 
        img.caption?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        img.scheduleTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredImages(filtered);
  };

  const handleUploadImage = async () => {
    if (!selectedDay || !imageFile) {
      toast.error('Please select a day and an image');
      return;
    }

    setUploadingImage(true);
    try {
      const response = await addGalleryImage(selectedDay, imageFile, imageCaption);
      toast.success('Image uploaded successfully');
      setShowUploadModal(false);
      setImageFile(null);
      setImageCaption('');
      setSelectedDay('');
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      fetchData();
    } catch (error) {
      console.error('Failed to upload image:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to upload image';
      toast.error(errorMessage);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      e.target.value = '';
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      e.target.value = '';
      return;
    }

    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCancelImagePreview = () => {
    setImageFile(null);
    setImagePreview(null);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpdateCaption = async (image, newCaption) => {
    try {
      const response = await updateGalleryImage(image.scheduleDay, image._id, newCaption);
      toast.success(response.message);
      fetchData();
    } catch (error) {
      console.error('Failed to update caption:', error);
      toast.error(error.response?.data?.message || 'Failed to update caption');
    }
  };

  const handleDeleteImage = async (image) => {
    setImageToDelete(image);
    setShowConfirmModal(true);
  };

  const confirmDeleteImage = async () => {
    if (!imageToDelete) return;

    try {
      const response = await deleteGalleryImage(imageToDelete.scheduleDay, imageToDelete._id);
      toast.success(response.message);
      fetchData();
    } catch (error) {
      console.error('Failed to delete image:', error);
      toast.error(error.response?.data?.message || 'Failed to delete image');
    } finally {
      setImageToDelete(null);
    }
  };

  const openUploadModal = () => {
    setImageFile(null);
    setImageCaption('');
    setSelectedDay('');
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setShowUploadModal(true);
  };

  const viewImage = (image) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4" size={48} color="#19aaba" />
          <p className="text-gray-600">Loading gallery...</p>
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
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                  <ImageIcon size={40} />
                  Homepage Gallery Management
                </h1>
                <p className="text-cyan-100">Manage photos that will be displayed on the homepage for each tour day</p>
              </div>
              <button
                onClick={openUploadModal}
                className="flex items-center gap-2 bg-white text-[#19aaba] px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
              >
                <Upload size={20} />
                Upload Photo
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-[#19aaba]">
            <p className="text-gray-600 text-sm mb-1">Total Photos</p>
            <p className="text-2xl font-bold text-gray-800">{allImages.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm mb-1">Tour Days</p>
            <p className="text-2xl font-bold text-gray-800">{schedules.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm mb-1">With Captions</p>
            <p className="text-2xl font-bold text-gray-800">
              {allImages.filter(img => img.caption).length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-orange-500">
            <p className="text-gray-600 text-sm mb-1">Recent (7d)</p>
            <p className="text-2xl font-bold text-gray-800">
              {allImages.filter(img => {
                const uploadDate = new Date(img.uploadedAt);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return uploadDate >= weekAgo;
              }).length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Search & Filter Homepage Gallery Photos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search Photos
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by caption or day title..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter by Day */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filter by Day
              </label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  value={filterDay}
                  onChange={(e) => setFilterDay(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent appearance-none"
                >
                  <option value="all">All Days</option>
                  {schedules.map(schedule => (
                    <option key={schedule.day} value={schedule.day}>
                      Day {schedule.day} - {schedule.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600 bg-cyan-50 p-3 rounded-lg border border-cyan-200">
            <span className="font-semibold text-[#19aaba]">Showing {filteredImages.length} of {allImages.length} photos</span> - These photos will appear on the homepage gallery section for each day
          </div>
        </div>

        {/* Gallery Grid */}
        {filteredImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image) => (
              <div key={image._id} className="group bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-200 hover:border-[#19aaba] transition-all hover:shadow-xl">
                {/* Image */}
                <div className="aspect-square relative overflow-hidden bg-gray-100">
                  <img 
                    src={image.url} 
                    alt={image.caption || 'Gallery image'} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  
                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => viewImage(image)}
                      className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      title="View Full Size"
                    >
                      <Eye size={20} />
                    </button>
                    <button
                      onClick={() => {
                        const newCaption = prompt('Enter new caption:', image.caption);
                        if (newCaption !== null) {
                          handleUpdateCaption(image, newCaption);
                        }
                      }}
                      className="p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      title="Edit Caption"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteImage(image)}
                      className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      title="Delete Image"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  {/* Day Badge */}
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-[#19aaba] to-[#158c99] text-white px-3 py-1 rounded-lg text-sm font-bold shadow-lg">
                    Day {image.scheduleDay}
                  </div>

                  {/* Homepage Badge */}
                  <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold shadow-lg">
                    Homepage
                  </div>
                </div>

                {/* Image Info */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                    <Calendar size={16} className="text-[#19aaba]" />
                    {image.scheduleTitle}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{image.scheduleDate}</p>
                  {image.caption && (
                    <p className="text-sm text-gray-700 line-clamp-2 italic">"{image.caption}"</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Uploaded: {new Date(image.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <ImageIcon className="w-20 h-20 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {searchTerm || filterDay !== 'all' ? 'No Photos Found' : 'No Homepage Gallery Photos Yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterDay !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'Start by uploading photos that will appear on the homepage for each tour day'}
            </p>
            {!searchTerm && filterDay === 'all' && (
              <button
                onClick={openUploadModal}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#19aaba] to-[#158c99] text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all font-semibold"
              >
                <Upload size={20} />
                Upload First Photo
              </button>
            )}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-[#19aaba] to-[#158c99] p-4 sm:p-6 text-white">
              <h2 className="text-lg sm:text-2xl font-bold flex items-center gap-2">
                <Upload size={20} className="sm:w-6 sm:h-6" />
                Upload Homepage Gallery Photo
              </h2>
              <p className="text-cyan-100 mt-1 text-xs sm:text-sm">Add a photo that will be displayed on the homepage for a specific tour day</p>
            </div>
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              {/* Image Preview */}
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 sm:h-64 object-cover rounded-lg"
                  />
                  <button
                    onClick={handleCancelImagePreview}
                    disabled={uploadingImage}
                    className="absolute top-2 right-2 p-1.5 sm:p-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors disabled:opacity-50"
                  >
                    <X size={18} className="sm:w-5 sm:h-5" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm">
                    Preview
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Select Tour Day *
                </label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                  disabled={uploadingImage}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent disabled:opacity-50"
                >
                  <option value="">Choose a day...</option>
                  {schedules.map(schedule => (
                    <option key={schedule.day} value={schedule.day}>
                      Day {schedule.day} - {schedule.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Select Image *
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  disabled={uploadingImage}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm border-2 border-dashed border-gray-300 rounded-lg focus:border-[#19aaba] focus:outline-none file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-3 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-cyan-50 file:text-[#19aaba] hover:file:bg-cyan-100 disabled:opacity-50"
                />
                {imageFile && !imagePreview && (
                  <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-cyan-50 rounded-lg border border-cyan-200">
                    <p className="text-xs sm:text-sm text-[#19aaba] font-medium break-all">Selected: {imageFile.name}</p>
                    <p className="text-xs text-cyan-700 mt-1">
                      Size: {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Caption (Optional)
                </label>
                <textarea
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  disabled={uploadingImage}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent resize-none disabled:opacity-50"
                  rows="3"
                  placeholder="Add a caption to describe this photo..."
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-blue-800">
                  <strong>Note:</strong> This photo will appear on the homepage in the gallery section for the selected tour day. Images will be automatically resized to 1200x1200 pixels. Maximum file size: 5MB.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 p-4 sm:p-6 bg-gray-50 rounded-b-xl sm:rounded-b-2xl">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setImagePreview(null);
                  setImageFile(null);
                  setImageCaption('');
                  setSelectedDay('');
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                disabled={uploadingImage}
                className="w-full sm:flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X size={18} className="sm:w-5 sm:h-5" />
                Cancel
              </button>
              <button
                onClick={handleUploadImage}
                disabled={!selectedDay || !imageFile || uploadingImage}
                className="w-full sm:flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-[#19aaba] to-[#158c99] text-white rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploadingImage ? (
                  <>
                    <Loader className="animate-spin" size={18} />
                    <span className="hidden sm:inline">Uploading...</span>
                    <span className="sm:hidden">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload size={18} className="sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Upload Photo</span>
                    <span className="sm:hidden">Upload</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image View Modal */}
      {showImageModal && selectedImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4" onClick={() => setShowImageModal(false)}>
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-[#19aaba] to-[#158c99] p-3 sm:p-4 text-white flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm sm:text-lg truncate">Day {selectedImage.scheduleDay} - {selectedImage.scheduleTitle}</h3>
                  <p className="text-xs sm:text-sm text-cyan-100 truncate">{selectedImage.scheduleDate} • Homepage Gallery Photo</p>
                </div>
                <button
                  onClick={() => setShowImageModal(false)}
                  className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
                >
                  <X size={20} className="sm:w-6 sm:h-6" />
                </button>
              </div>
              <div className="p-3 sm:p-4">
                <img 
                  src={selectedImage.url} 
                  alt={selectedImage.caption || 'Gallery image'} 
                  className="w-full h-auto rounded-lg"
                />
                {selectedImage.caption && (
                  <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                    <p className="text-gray-700 italic text-xs sm:text-sm break-words">"{selectedImage.caption}"</p>
                  </div>
                )}
                <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm text-gray-600">
                  <span>Uploaded: {new Date(selectedImage.uploadedAt).toLocaleString()}</span>
                  <a 
                    href={selectedImage.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#19aaba] hover:text-[#158c99] font-semibold"
                  >
                    <Download size={14} className="sm:w-4 sm:h-4" />
                    Download
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setImageToDelete(null);
        }}
        onConfirm={confirmDeleteImage}
        title="Delete Image"
        message="Are you sure you want to delete this image? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default ManageGallery;
