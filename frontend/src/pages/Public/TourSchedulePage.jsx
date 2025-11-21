import { useState, useEffect } from 'react';
import { 
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  Circle,
  Navigation,
  Bus,
  Hotel,
  Utensils,
  Camera,
  Building2,
  Sunrise,
  Sunset,
  Moon,
  ChevronDown,
  ChevronUp,
  Clock3,
  CheckCircle2,
  PlayCircle,
  XCircle,
  AlertCircle,
  Loader
} from 'lucide-react';
import { getAllSchedules, getScheduleStats } from '../../services/tourScheduleApi';
import { toast } from 'sonner';

const TourSchedulePage = () => {
  const [expandedDay, setExpandedDay] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // all, completed, ongoing, upcoming, cancelled
  const [tourSchedule, setTourSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    ongoing: 0,
    upcoming: 0,
    cancelled: 0
  });

  // Fetch schedules from API
  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const [schedulesResponse, statsResponse] = await Promise.all([
        getAllSchedules(),
        getScheduleStats()
      ]);
      
      // Transform the data to match the component's expected format
      const transformedSchedules = schedulesResponse.data.map(schedule => ({
        ...schedule,
        dateObj: new Date(schedule.dateObj)
      }));
      
      setTourSchedule(transformedSchedules);
      
      if (statsResponse.data) {
        setStats({
          total: statsResponse.data.schedules.total,
          completed: statsResponse.data.schedules.completed,
          ongoing: statsResponse.data.schedules.ongoing,
          upcoming: statsResponse.data.schedules.upcoming,
          cancelled: statsResponse.data.schedules.cancelled
        });
      }
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
      toast.error('Failed to load tour schedules');
    } finally {
      setLoading(false);
    }
  };

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Helper function to get icon for event type
  const getEventIcon = (type) => {
    const icons = {
      departure: <Bus />,
      arrival: <MapPin />,
      meal: <Utensils />,
      accommodation: <Hotel />,
      sightseeing: <Camera />,
      activity: <Camera />,
      industrial: <Building2 />,
      travel: <Bus />,
      break: <Clock />,
      shopping: <Camera />,
      leisure: <Camera />,
      special: <Utensils />,
      completion: <CheckCircle />
    };
    return icons[type] || <Clock />;
  };

  // Get status badge configuration
  const getStatusConfig = (status) => {
    const configs = {
      completed: {
        icon: <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />,
        label: 'Completed',
        bgColor: 'bg-green-100',
        textColor: 'text-green-700',
        borderColor: 'border-green-300',
        dotColor: 'bg-green-500'
      },
      ongoing: {
        icon: <PlayCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />,
        label: 'Ongoing',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-300',
        dotColor: 'bg-blue-500'
      },
      upcoming: {
        icon: <Clock3 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />,
        label: 'Upcoming',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-600',
        borderColor: 'border-gray-300',
        dotColor: 'bg-gray-400'
      },
      cancelled: {
        icon: <XCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />,
        label: 'Cancelled',
        bgColor: 'bg-red-100',
        textColor: 'text-red-700',
        borderColor: 'border-red-300',
        dotColor: 'bg-red-500'
      },
      delayed: {
        icon: <AlertCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5" />,
        label: 'Delayed',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-700',
        borderColor: 'border-yellow-300',
        dotColor: 'bg-yellow-500'
      }
    };
    return configs[status] || configs.upcoming;
  };

  // Function to check if event is completed
  const isEventCompleted = (dateObj, eventTime) => {
    const eventDateTime = new Date(dateObj);
    const [time, period] = eventTime.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    
    let hour24 = hours;
    if (period === 'PM' && hours !== 12) hour24 += 12;
    if (period === 'AM' && hours === 12) hour24 = 0;
    
    eventDateTime.setHours(hour24, minutes || 0, 0, 0);
    
    return currentDateTime > eventDateTime;
  };

  // Function to check if event is currently running
  const isEventRunning = (dateObj, eventTime, nextEventTime) => {
    const eventDateTime = new Date(dateObj);
    const [time, period] = eventTime.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    
    let hour24 = hours;
    if (period === 'PM' && hours !== 12) hour24 += 12;
    if (period === 'AM' && hours === 12) hour24 = 0;
    
    eventDateTime.setHours(hour24, minutes || 0, 0, 0);
    
    if (nextEventTime) {
      const nextEventDateTime = new Date(dateObj);
      const [nextTime, nextPeriod] = nextEventTime.split(' ');
      const [nextHours, nextMinutes] = nextTime.split(':').map(Number);
      
      let nextHour24 = nextHours;
      if (nextPeriod === 'PM' && nextHours !== 12) nextHour24 += 12;
      if (nextPeriod === 'AM' && nextHours === 12) nextHour24 = 0;
      
      nextEventDateTime.setHours(nextHour24, nextMinutes || 0, 0, 0);
      
      return currentDateTime >= eventDateTime && currentDateTime < nextEventDateTime;
    }
    
    return false;
  };

  // Get icon color based on type
  const getTypeColor = (type) => {
    const colors = {
      departure: 'text-blue-600',
      arrival: 'text-green-600',
      meal: 'text-orange-600',
      accommodation: 'text-purple-600',
      sightseeing: 'text-cyan-600',
      activity: 'text-pink-600',
      industrial: 'text-indigo-600',
      travel: 'text-gray-600',
      break: 'text-yellow-600',
      shopping: 'text-rose-600',
      leisure: 'text-teal-600',
      special: 'text-red-600',
      completion: 'text-green-700'
    };
    return colors[type] || 'text-gray-600';
  };

  const toggleDay = (day) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  // Filter schedule based on selected filter
  const filteredSchedule = filterStatus === 'all' 
    ? tourSchedule 
    : tourSchedule.filter(day => day.status === filterStatus);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4" size={48} color="#19aaba" />
          <p className="text-gray-600">Loading tour schedules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#19aaba] via-[#158c99] to-[#116d77] text-white py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/30 mb-3 sm:mb-4">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-semibold">Industrial Tour 2025</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 sm:mb-3 md:mb-4 px-2">
              Tour Schedule
            </h1>
            
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-100 max-w-2xl mx-auto px-4">
              Track every moment of our 9-day journey
              <span className="hidden sm:inline"> • </span>
              <span className="block sm:inline mt-1 sm:mt-0">December 04-12, 2025</span>
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3 md:gap-4 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 border border-white/20 text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-0.5 sm:mb-1">{stats.total}</div>
              <div className="text-[10px] sm:text-xs text-white/80 uppercase font-medium">Total Days</div>
            </div>
            <div className="bg-green-500/20 backdrop-blur-lg rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 border border-green-400/30 text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-0.5 sm:mb-1">{stats.completed}</div>
              <div className="text-[10px] sm:text-xs text-white/80 uppercase font-medium">Completed</div>
            </div>
            <div className="bg-blue-500/20 backdrop-blur-lg rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 border border-blue-400/30 text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-0.5 sm:mb-1">{stats.ongoing}</div>
              <div className="text-[10px] sm:text-xs text-white/80 uppercase font-medium">Ongoing</div>
            </div>
            <div className="bg-gray-500/20 backdrop-blur-lg rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 border border-gray-400/30 text-center col-span-3 sm:col-span-1">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-0.5 sm:mb-1">{stats.upcoming}</div>
              <div className="text-[10px] sm:text-xs text-white/80 uppercase font-medium">Upcoming</div>
            </div>
            <div className="bg-red-500/20 backdrop-blur-lg rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 border border-red-400/30 text-center hidden sm:block">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold mb-0.5 sm:mb-1">{stats.cancelled}</div>
              <div className="text-[10px] sm:text-xs text-white/80 uppercase font-medium">Cancelled</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-2 sm:py-3 md:py-4 no-scrollbar scrollbar-hide">
            {[
              { value: 'all', label: 'All Days', icon: <Calendar className="w-3 h-3 sm:w-4 sm:h-4" /> },
              { value: 'completed', label: 'Completed', icon: <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4" /> },
              { value: 'ongoing', label: 'Ongoing', icon: <PlayCircle className="w-3 h-3 sm:w-4 sm:h-4" /> },
              { value: 'upcoming', label: 'Upcoming', icon: <Clock3 className="w-3 h-3 sm:w-4 sm:h-4" /> },
              { value: 'cancelled', label: 'Cancelled', icon: <XCircle className="w-3 h-3 sm:w-4 sm:h-4" /> }
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterStatus(filter.value)}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg font-medium whitespace-nowrap transition-all text-xs sm:text-sm flex-shrink-0 ${
                  filterStatus === filter.value
                    ? 'bg-[#19aaba] text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-95'
                }`}
              >
                {filter.icon}
                <span className="hidden min-[400px]:inline">{filter.label}</span>
                <span className="min-[400px]:hidden">{filter.label.split(' ')[0]}</span>
                {filter.value === 'all' && (
                  <span className="ml-0.5 sm:ml-1 px-1.5 sm:px-2 py-0.5 bg-white/20 rounded-full text-[10px] sm:text-xs">
                    {stats.total}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          {filteredSchedule.length === 0 ? (
            <div className="text-center py-12 sm:py-16 md:py-20">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">No Events Found</h3>
              <p className="text-sm sm:text-base text-gray-600">No events match the selected filter.</p>
            </div>
          ) : (
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-4 sm:left-6 md:left-8 top-0 bottom-0 w-0.5 sm:w-1 bg-gradient-to-b from-[#19aaba] via-[#158c99] to-[#116d77] rounded-full"></div>

              {/* Days */}
              <div className="space-y-6 sm:space-y-8">
                {filteredSchedule.map((daySchedule, dayIndex) => {
                  const statusConfig = getStatusConfig(daySchedule.status);

                  return (
                    <div 
                      key={daySchedule.day} 
                      className="relative"
                      onMouseEnter={() => setHoveredEvent(`day-${daySchedule.day}`)}
                      onMouseLeave={() => setHoveredEvent(null)}
                    >
                      {/* Day Marker */}
                      <div className="absolute left-2 sm:left-3 md:left-4 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 -translate-x-1/2 z-10">
                        <div className={`w-full h-full ${statusConfig.dotColor} rounded-full flex items-center justify-center border-2 sm:border-3 md:border-4 border-white shadow-lg ${
                          daySchedule.status === 'ongoing' ? 'animate-pulse' : ''
                        } transition-transform hover:scale-125`}>
                          <div className="w-3 h-3 sm:w-4 sm:h-4">
                            {statusConfig.icon}
                          </div>
                        </div>
                      </div>

                      {/* Day Card */}
                      <div className="ml-10 sm:ml-14 md:ml-16 lg:ml-20">
                        <div 
                          className={`bg-white rounded-xl sm:rounded-2xl border-2 ${statusConfig.borderColor} overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 active:scale-[0.98] sm:hover:-translate-y-1`}
                          onClick={() => toggleDay(daySchedule.day)}
                        >
                          {/* Day Header */}
                          <div className={`p-3 sm:p-4 md:p-5 lg:p-6 ${statusConfig.bgColor}`}>
                            <div className="flex items-start sm:items-center justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 flex-wrap">
                                  <span className={`text-xl sm:text-2xl md:text-3xl font-bold ${statusConfig.textColor}`}>
                                    Day {daySchedule.day}
                                  </span>
                                  <div className={`flex items-center gap-1 sm:gap-1.5 ${statusConfig.bgColor} ${statusConfig.textColor} px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 rounded-full border ${statusConfig.borderColor}`}>
                                    {statusConfig.icon}
                                    <span className="text-[10px] sm:text-xs font-bold uppercase whitespace-nowrap">{statusConfig.label}</span>
                                  </div>
                                </div>
                                <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2">
                                  {daySchedule.title}
                                </h3>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-gray-600">
                                  <div className="flex items-center gap-1.5 sm:gap-2">
                                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                    <span className="text-xs sm:text-sm font-medium truncate">{daySchedule.date}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5 sm:gap-2">
                                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                    <span className="text-xs sm:text-sm font-medium line-clamp-1">{daySchedule.location}</span>
                                  </div>
                                </div>
                                <div className="mt-2 sm:mt-3 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
                                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                  <span>{daySchedule.events.length} events planned</span>
                                </div>
                              </div>
                              <div className="ml-2 sm:ml-4 flex-shrink-0">
                                <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full ${statusConfig.bgColor} flex items-center justify-center transition-transform ${
                                  expandedDay === daySchedule.day ? 'rotate-180' : ''
                                }`}>
                                  <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${statusConfig.textColor}`} />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Events List */}
                          {expandedDay === daySchedule.day && (
                            <div className="p-3 sm:p-4 md:p-5 lg:p-6 bg-gradient-to-br from-gray-50 to-white">
                              <div className="space-y-2 sm:space-y-3">
                                {daySchedule.events.map((event, eventIndex) => {
                                  const eventStatusConfig = getStatusConfig(event.status);

                                  return (
                                    <div 
                                      key={eventIndex} 
                                      className={`relative group`}
                                      onMouseEnter={() => setHoveredEvent(`event-${daySchedule.day}-${eventIndex}`)}
                                      onMouseLeave={() => setHoveredEvent(null)}
                                    >
                                      {eventIndex !== daySchedule.events.length - 1 && (
                                        <div className={`absolute left-4 sm:left-5 md:left-6 top-12 sm:top-14 md:top-16 bottom-0 w-0.5 ${eventStatusConfig.borderColor}`}></div>
                                      )}
                                      
                                      <div className={`flex gap-2 sm:gap-3 md:gap-4 p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border-2 ${eventStatusConfig.borderColor} ${eventStatusConfig.bgColor} transition-all duration-300 hover:shadow-lg active:scale-[0.98] sm:hover:scale-[1.02]`}>
                                        <div className="flex-shrink-0">
                                          <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl ${
                                            event.status === 'completed' 
                                              ? 'bg-green-500' 
                                              : event.status === 'ongoing' 
                                                ? 'bg-blue-500' 
                                                : event.status === 'cancelled'
                                                  ? 'bg-red-500'
                                                  : event.status === 'delayed'
                                                    ? 'bg-yellow-500'
                                                    : 'bg-gray-300'
                                          } flex items-center justify-center text-white shadow-lg ${
                                            event.status === 'ongoing' ? 'animate-pulse' : ''
                                          } transition-transform group-hover:scale-110`}>
                                            {event.status === 'completed' ? (
                                              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                                            ) : event.status === 'ongoing' ? (
                                              <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                                            ) : event.status === 'cancelled' ? (
                                              <XCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                                            ) : event.status === 'delayed' ? (
                                              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                                            ) : (
                                              <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6">{getEventIcon(event.type)}</div>
                                            )}
                                          </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 mb-1.5 sm:mb-2 flex-wrap">
                                            <span className={`text-[10px] sm:text-xs md:text-sm font-bold ${eventStatusConfig.textColor} ${eventStatusConfig.bgColor} px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 rounded-full whitespace-nowrap`}>
                                              {event.time}
                                            </span>
                                            <div className={`flex items-center gap-1 sm:gap-1.5 ${eventStatusConfig.bgColor} ${eventStatusConfig.textColor} px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase border ${eventStatusConfig.borderColor}`}>
                                              {eventStatusConfig.icon}
                                              <span className="hidden min-[400px]:inline whitespace-nowrap">{eventStatusConfig.label}</span>
                                            </div>
                                            {event.status === 'ongoing' && (
                                              <span className="px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 bg-blue-500 text-white text-[10px] sm:text-xs font-bold rounded-full animate-pulse shadow-lg whitespace-nowrap">
                                                LIVE
                                              </span>
                                            )}
                                          </div>
                                          <h4 className="font-bold text-gray-900 mb-0.5 sm:mb-1 text-sm sm:text-base md:text-lg group-hover:text-[#19aaba] transition-colors line-clamp-2">
                                            {event.title}
                                          </h4>
                                          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2 sm:line-clamp-none">{event.description}</p>
                                          
                                          {/* Event Type Badge */}
                                          <div className="mt-1.5 sm:mt-2">
                                            <span className={`inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 rounded-full ${getTypeColor(event.type)} bg-opacity-10`}>
                                              <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-current"></span>
                                              <span className="hidden min-[400px]:inline">{event.type.charAt(0).toUpperCase() + event.type.slice(1)}</span>
                                              <span className="min-[400px]:hidden">{event.type.charAt(0).toUpperCase()}</span>
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default TourSchedulePage;
