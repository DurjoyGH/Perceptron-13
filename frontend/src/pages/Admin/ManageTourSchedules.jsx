import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Clock,
  MapPin,
  List,
  CheckCircle2,
  PlayCircle,
  XCircle,
  AlertCircle,
  Loader,
  Image as ImageIcon,
  Upload
} from 'lucide-react';
import { 
  getAllSchedules, 
  createSchedule, 
  updateSchedule, 
  deleteSchedule,
  addEvent,
  updateEvent,
  deleteEvent,
  getScheduleStats,
  addGalleryImage,
  updateGalleryImage,
  deleteGalleryImage
} from '../../services/tourScheduleApi';
import { toast } from 'sonner';

const ManageTourSchedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageCaption, setImageCaption] = useState('');
  const [scheduleForm, setScheduleForm] = useState({
    day: '',
    date: '',
    dateObj: '',
    title: '',
    location: '',
    status: 'upcoming'
  });
  const [eventForm, setEventForm] = useState({
    time: '',
    title: '',
    description: '',
    type: 'activity',
    status: 'upcoming'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [schedulesResponse, statsResponse] = await Promise.all([
        getAllSchedules(),
        getScheduleStats()
      ]);
      setSchedules(schedulesResponse.data);
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load schedules');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchedule = async () => {
    if (!scheduleForm.day || !scheduleForm.date || !scheduleForm.dateObj || !scheduleForm.title || !scheduleForm.location) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const response = await createSchedule(scheduleForm);
      toast.success(response.message);
      setShowScheduleModal(false);
      resetScheduleForm();
      fetchData();
    } catch (error) {
      console.error('Failed to create schedule:', error);
      toast.error(error.response?.data?.message || 'Failed to create schedule');
    }
  };

  const handleUpdateSchedule = async () => {
    if (!selectedSchedule) return;

    try {
      const response = await updateSchedule(selectedSchedule.day, scheduleForm);
      toast.success(response.message);
      setShowScheduleModal(false);
      setSelectedSchedule(null);
      resetScheduleForm();
      fetchData();
    } catch (error) {
      console.error('Failed to update schedule:', error);
      toast.error(error.response?.data?.message || 'Failed to update schedule');
    }
  };

  const handleDeleteSchedule = async (day) => {
    if (!window.confirm('Are you sure you want to delete this schedule?')) return;

    try {
      const response = await deleteSchedule(day);
      toast.success(response.message);
      fetchData();
    } catch (error) {
      console.error('Failed to delete schedule:', error);
      toast.error(error.response?.data?.message || 'Failed to delete schedule');
    }
  };

  const handleAddEvent = async () => {
    if (!selectedSchedule || !eventForm.time || !eventForm.title) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const response = await addEvent(selectedSchedule.day, eventForm);
      toast.success(response.message);
      setShowEventModal(false);
      resetEventForm();
      fetchData();
    } catch (error) {
      console.error('Failed to add event:', error);
      toast.error(error.response?.data?.message || 'Failed to add event');
    }
  };

  const handleUpdateEvent = async () => {
    if (!selectedSchedule || !selectedEvent) return;

    try {
      const response = await updateEvent(selectedSchedule.day, selectedEvent._id, eventForm);
      toast.success(response.message);
      setShowEventModal(false);
      setSelectedEvent(null);
      resetEventForm();
      fetchData();
    } catch (error) {
      console.error('Failed to update event:', error);
      toast.error(error.response?.data?.message || 'Failed to update event');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!selectedSchedule || !window.confirm('Are you sure you want to delete this event?')) return;

    try {
      const response = await deleteEvent(selectedSchedule.day, eventId);
      toast.success(response.message);
      fetchData();
    } catch (error) {
      console.error('Failed to delete event:', error);
      toast.error(error.response?.data?.message || 'Failed to delete event');
    }
  };

  const handleUploadImage = async () => {
    if (!selectedSchedule || !imageFile) {
      toast.error('Please select an image');
      return;
    }

    setUploadingImage(true);
    try {
      const response = await addGalleryImage(selectedSchedule.day, imageFile, imageCaption);
      toast.success(response.message);
      setShowGalleryModal(false);
      setImageFile(null);
      setImageCaption('');
      fetchData();
    } catch (error) {
      console.error('Failed to upload image:', error);
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUpdateImageCaption = async (imageId, newCaption) => {
    if (!selectedSchedule) return;

    try {
      const response = await updateGalleryImage(selectedSchedule.day, imageId, newCaption);
      toast.success(response.message);
      fetchData();
    } catch (error) {
      console.error('Failed to update caption:', error);
      toast.error(error.response?.data?.message || 'Failed to update caption');
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!selectedSchedule || !window.confirm('Are you sure you want to delete this image?')) return;

    try {
      const response = await deleteGalleryImage(selectedSchedule.day, imageId);
      toast.success(response.message);
      fetchData();
    } catch (error) {
      console.error('Failed to delete image:', error);
      toast.error(error.response?.data?.message || 'Failed to delete image');
    }
  };

  const openGalleryModal = (schedule) => {
    setSelectedSchedule(schedule);
    setImageFile(null);
    setImageCaption('');
    setShowGalleryModal(true);
  };

  const openScheduleModal = (schedule = null) => {
    if (schedule) {
      setSelectedSchedule(schedule);
      setScheduleForm({
        day: schedule.day,
        date: schedule.date,
        dateObj: new Date(schedule.dateObj).toISOString().split('T')[0],
        title: schedule.title,
        location: schedule.location,
        status: schedule.status
      });
    } else {
      setSelectedSchedule(null);
      resetScheduleForm();
    }
    setShowScheduleModal(true);
  };

  const openEventModal = (schedule, event = null) => {
    setSelectedSchedule(schedule);
    if (event) {
      setSelectedEvent(event);
      setEventForm({
        time: event.time,
        title: event.title,
        description: event.description,
        type: event.type,
        status: event.status
      });
    } else {
      setSelectedEvent(null);
      resetEventForm();
    }
    setShowEventModal(true);
  };

  const resetScheduleForm = () => {
    setScheduleForm({
      day: '',
      date: '',
      dateObj: '',
      title: '',
      location: '',
      status: 'upcoming'
    });
  };

  const resetEventForm = () => {
    setEventForm({
      time: '',
      title: '',
      description: '',
      type: 'activity',
      status: 'upcoming'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-700 border-green-300',
      ongoing: 'bg-blue-100 text-blue-700 border-blue-300',
      upcoming: 'bg-gray-100 text-gray-600 border-gray-300',
      cancelled: 'bg-red-100 text-red-700 border-red-300',
      delayed: 'bg-yellow-100 text-yellow-700 border-yellow-300'
    };
    return colors[status] || colors.upcoming;
  };

  const getStatusIcon = (status) => {
    const icons = {
      completed: <CheckCircle2 className="w-4 h-4" />,
      ongoing: <PlayCircle className="w-4 h-4" />,
      upcoming: <Clock className="w-4 h-4" />,
      cancelled: <XCircle className="w-4 h-4" />,
      delayed: <AlertCircle className="w-4 h-4" />
    };
    return icons[status] || icons.upcoming;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4" size={48} color="#19aaba" />
          <p className="text-gray-600">Loading schedules...</p>
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
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Manage Tour Schedules</h1>
                <p className="text-cyan-100">Create, edit, and update tour schedules</p>
              </div>
              <button
                onClick={() => openScheduleModal()}
                className="flex items-center gap-2 bg-white text-[#19aaba] px-4 py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Add Schedule</span>
              </button>
            </div>
          </div>
        </div>

        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-[#19aaba]">
              <p className="text-gray-600 text-sm mb-1">Total Days</p>
              <p className="text-2xl font-bold text-gray-800">{stats.schedules.total}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-green-500">
              <p className="text-gray-600 text-sm mb-1">Completed</p>
              <p className="text-2xl font-bold text-gray-800">{stats.schedules.completed}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-blue-500">
              <p className="text-gray-600 text-sm mb-1">Total Events</p>
              <p className="text-2xl font-bold text-gray-800">{stats.events.total}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-orange-500">
              <p className="text-gray-600 text-sm mb-1">Upcoming</p>
              <p className="text-2xl font-bold text-gray-800">{stats.schedules.upcoming}</p>
            </div>
          </div>
        )}

        {/* Schedules List */}
        <div className="space-y-6">
          {schedules.map((schedule) => (
            <div key={schedule._id} className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-200 hover:shadow-xl transition-shadow duration-300">
              {/* Schedule Header */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 md:p-6 border-b-2 border-gray-200">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-bold text-[#19aaba]">Day {schedule.day}</span>
                      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(schedule.status)}`}>
                        {getStatusIcon(schedule.status)}
                        {schedule.status.toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{schedule.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{schedule.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{schedule.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <List className="w-4 h-4" />
                        <span>{schedule.events.length} events</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openScheduleModal(schedule)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                      title="Edit Schedule"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteSchedule(schedule.day)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      title="Delete Schedule"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Events List */}
              <div className="p-4 md:p-6 border-b-2 border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-gray-800">Events</h4>
                  <button
                    onClick={() => openEventModal(schedule)}
                    className="flex items-center gap-2 text-sm bg-[#19aaba] text-white px-3 py-2 rounded-lg hover:bg-[#158c99] transition-colors"
                  >
                    <Plus size={16} />
                    Add Event
                  </button>
                </div>
                <div className="space-y-3">
                  {schedule.events.map((event) => (
                    <div key={event._id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-[#19aaba] transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-[#19aaba] bg-cyan-100 px-2 py-1 rounded">
                            {event.time}
                          </span>
                          <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold border ${getStatusColor(event.status)}`}>
                            {getStatusIcon(event.status)}
                            {event.status.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                            {event.type}
                          </span>
                        </div>
                        <h5 className="font-semibold text-gray-900 mb-1">{event.title}</h5>
                        {event.description && (
                          <p className="text-sm text-gray-600">{event.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEventModal(schedule, event)}
                          className="p-1.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                          title="Edit Event"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event._id)}
                          className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                          title="Delete Event"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {schedule.events.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No events added yet</p>
                  )}
                </div>
              </div>

              {/* Gallery Section */}
              <div className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-gray-800 flex items-center gap-2">
                    <ImageIcon size={18} />
                    Gallery ({schedule.gallery?.length || 0})
                  </h4>
                  <button
                    onClick={() => openGalleryModal(schedule)}
                    className="flex items-center gap-2 text-sm bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Upload size={16} />
                    Upload Image
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {schedule.gallery?.map((image) => (
                    <div key={image._id} className="group relative bg-gray-50 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-[#19aaba] transition-all">
                      <div className="aspect-square relative overflow-hidden">
                        <img 
                          src={image.url} 
                          alt={image.caption || 'Gallery image'} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              const newCaption = prompt('Enter new caption:', image.caption);
                              if (newCaption !== null) {
                                handleUpdateImageCaption(image._id, newCaption);
                              }
                            }}
                            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            title="Edit Caption"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteImage(image._id)}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            title="Delete Image"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      {image.caption && (
                        <div className="p-2 bg-white">
                          <p className="text-xs text-gray-600 line-clamp-2">{image.caption}</p>
                        </div>
                      )}
                      <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {new Date(image.uploadedAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                  {(!schedule.gallery || schedule.gallery.length === 0) && (
                    <div className="col-span-2 md:col-span-3 lg:col-span-4 text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-500 mb-2">No images uploaded yet</p>
                      <button
                        onClick={() => openGalleryModal(schedule)}
                        className="text-sm text-[#19aaba] hover:underline"
                      >
                        Upload your first image
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {schedules.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Schedules Found</h3>
              <p className="text-gray-600 mb-4">Start by creating a new tour schedule</p>
              <button
                onClick={() => openScheduleModal()}
                className="inline-flex items-center gap-2 bg-[#19aaba] text-white px-6 py-3 rounded-lg hover:bg-[#158c99] transition-colors font-semibold"
              >
                <Plus size={20} />
                Create First Schedule
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-[#19aaba] to-[#158c99] p-6 text-white">
              <h2 className="text-2xl font-bold">
                {selectedSchedule ? 'Edit Schedule' : 'Create New Schedule'}
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Day Number *
                  </label>
                  <input
                    type="number"
                    value={scheduleForm.day}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, day: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                    placeholder="1"
                    disabled={!!selectedSchedule}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={scheduleForm.status}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, status: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date (Display) *
                </label>
                <input
                  type="text"
                  value={scheduleForm.date}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                  placeholder="December 04, 2025"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date (Object) *
                </label>
                <input
                  type="date"
                  value={scheduleForm.dateObj}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, dateObj: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={scheduleForm.title}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                  placeholder="Departure Day"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  value={scheduleForm.location}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, location: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                  placeholder="JUST Campus → Cox's Bazar"
                />
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => {
                  setShowScheduleModal(false);
                  setSelectedSchedule(null);
                  resetScheduleForm();
                }}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                <X size={20} />
                Cancel
              </button>
              <button
                onClick={selectedSchedule ? handleUpdateSchedule : handleCreateSchedule}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#19aaba] to-[#158c99] text-white rounded-lg hover:shadow-lg transition-all font-semibold"
              >
                <Save size={20} />
                {selectedSchedule ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-[#19aaba] to-[#158c99] p-6 text-white">
              <h2 className="text-2xl font-bold">
                {selectedEvent ? 'Edit Event' : 'Add New Event'}
              </h2>
              <p className="text-cyan-100 mt-1">Day {selectedSchedule?.day} - {selectedSchedule?.title}</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Time *
                  </label>
                  <input
                    type="text"
                    value={eventForm.time}
                    onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                    placeholder="07:00 PM"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={eventForm.status}
                    onChange={(e) => setEventForm({ ...eventForm, status: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="delayed">Delayed</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Event Type
                </label>
                <select
                  value={eventForm.type}
                  onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                >
                  <option value="activity">Activity</option>
                  <option value="departure">Departure</option>
                  <option value="arrival">Arrival</option>
                  <option value="meal">Meal</option>
                  <option value="accommodation">Accommodation</option>
                  <option value="sightseeing">Sightseeing</option>
                  <option value="industrial">Industrial</option>
                  <option value="travel">Travel</option>
                  <option value="break">Break</option>
                  <option value="shopping">Shopping</option>
                  <option value="leisure">Leisure</option>
                  <option value="special">Special</option>
                  <option value="completion">Completion</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                  placeholder="Start Journey from Campus"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent resize-none"
                  rows="3"
                  placeholder="Board the bus from JUST campus"
                />
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => {
                  setShowEventModal(false);
                  setSelectedEvent(null);
                  resetEventForm();
                }}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                <X size={20} />
                Cancel
              </button>
              <button
                onClick={selectedEvent ? handleUpdateEvent : handleAddEvent}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#19aaba] to-[#158c99] text-white rounded-lg hover:shadow-lg transition-all font-semibold"
              >
                <Save size={20} />
                {selectedEvent ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Upload Modal */}
      {showGalleryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Upload size={24} />
                Upload Gallery Image
              </h2>
              <p className="text-purple-100 mt-1">Day {selectedSchedule?.day} - {selectedSchedule?.title}</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Image *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
                {imageFile && (
                  <div className="mt-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <p className="text-sm text-purple-700 font-medium">Selected: {imageFile.name}</p>
                    <p className="text-xs text-purple-600 mt-1">
                      Size: {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Caption (Optional)
                </label>
                <textarea
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows="3"
                  placeholder="Add a caption to describe this image..."
                />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Images will be automatically resized to 1200x1200 pixels. Maximum file size: 5MB. Supported formats: JPG, PNG, GIF, WebP.
                </p>
              </div>
            </div>
            <div className="flex gap-4 p-6 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => {
                  setShowGalleryModal(false);
                  setImageFile(null);
                  setImageCaption('');
                }}
                disabled={uploadingImage}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X size={20} />
                Cancel
              </button>
              <button
                onClick={handleUploadImage}
                disabled={!imageFile || uploadingImage}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploadingImage ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    Upload Image
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTourSchedules;
