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
  AlertCircle
} from 'lucide-react';

const TourSchedulePage = () => {
  const [expandedDay, setExpandedDay] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all'); // all, completed, ongoing, upcoming, cancelled

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const tourSchedule = [
    {
      day: 1,
      date: "December 04, 2025",
      dateObj: new Date("2025-12-04"),
      title: "Departure Day",
      location: "JUST Campus → Cox's Bazar",
      status: "upcoming", // upcoming, ongoing, completed, cancelled
      events: [
        { 
          time: "07:00 PM", 
          title: "Start Journey from Campus", 
          icon: <Bus />, 
          type: "departure", 
          description: "Board the bus from JUST campus",
          status: "upcoming" // upcoming, ongoing, completed, cancelled, delayed
        },
        { 
          time: "08:00 PM", 
          title: "Washroom Break", 
          icon: <Clock />, 
          type: "break", 
          description: "Short rest stop",
          status: "upcoming"
        },
        { 
          time: "11:00 PM", 
          title: "Overnight Journey", 
          icon: <Moon />, 
          type: "travel", 
          description: "Continue journey to Cox's Bazar",
          status: "upcoming"
        }
      ]
    },
    {
      day: 2,
      date: "December 05, 2025",
      dateObj: new Date("2025-12-05"),
      title: "Arrival at Cox's Bazar",
      location: "Cox's Bazar",
      status: "upcoming",
      events: [
        { time: "08:00 AM", title: "Breakfast", icon: <Utensils />, type: "meal", description: "Breakfast at local restaurant", status: "upcoming" },
        { time: "10:00 AM", title: "Arrival at Cox's Bazar", icon: <MapPin />, type: "arrival", description: "Reach Cox's Bazar", status: "upcoming" },
        { time: "12:00 PM", title: "Hotel Check-in", icon: <Hotel />, type: "accommodation", description: "Check into hotel and freshen up", status: "upcoming" },
        { time: "01:00 PM", title: "Lunch", icon: <Utensils />, type: "meal", description: "Lunch at hotel", status: "upcoming" },
        { time: "03:00 PM", title: "Laboni Beach Visit", icon: <Camera />, type: "sightseeing", description: "Explore Laboni Beach", status: "upcoming" },
        { time: "05:00 PM", title: "Sugandha Beach", icon: <Camera />, type: "sightseeing", description: "Visit Sugandha Beach", status: "upcoming" },
        { time: "06:30 PM", title: "Kolatoli Beach", icon: <Camera />, type: "sightseeing", description: "Evening at Kolatoli Beach", status: "upcoming" },
        { time: "08:00 PM", title: "Dinner", icon: <Utensils />, type: "meal", description: "Dinner at hotel", status: "upcoming" },
        { time: "10:00 PM", title: "Overnight Stay", icon: <Hotel />, type: "accommodation", description: "Rest at hotel", status: "upcoming" }
      ]
    },
    {
      day: 3,
      date: "December 06, 2025",
      dateObj: new Date("2025-12-06"),
      title: "Marine Drive Adventure",
      location: "Marine Drive & Beaches",
      status: "upcoming",
      events: [
        { time: "05:30 AM", title: "Marine Drive Tour Starts", icon: <Sunrise />, type: "activity", description: "Early morning Marine Drive journey", status: "upcoming" },
        { time: "08:30 AM", title: "Breakfast at Shah Porir Dwip", icon: <Utensils />, type: "meal", description: "Breakfast by the beach", status: "upcoming" },
        { time: "09:00 AM", title: "Explore Shah Porir Dwip", icon: <Camera />, type: "sightseeing", description: "Visit Shah Porir Dwip", status: "upcoming" },
        { time: "11:00 AM", title: "Continue Journey", icon: <Bus />, type: "travel", description: "Head towards Himchori", status: "upcoming" },
        { time: "01:00 PM", title: "Lunch at Himchori", icon: <Utensils />, type: "meal", description: "Lunch break", status: "upcoming" },
        { time: "01:30 PM", title: "Himchori Exploration", icon: <Camera />, type: "sightseeing", description: "Explore Himchori waterfalls and area", status: "upcoming" },
        { time: "04:00 PM", title: "Inani Beach Visit", icon: <Camera />, type: "sightseeing", description: "Visit beautiful Inani Beach", status: "upcoming" },
        { time: "06:00 PM", title: "Return to Hotel", icon: <Hotel />, type: "travel", description: "Journey back to hotel", status: "upcoming" },
        { time: "09:00 PM", title: "Dinner", icon: <Utensils />, type: "meal", description: "Dinner at hotel", status: "upcoming" },
        { time: "11:00 PM", title: "Overnight Stay", icon: <Hotel />, type: "accommodation", description: "Rest at hotel", status: "upcoming" }
      ]
    },
    {
      day: 4,
      date: "December 07, 2025",
      dateObj: new Date("2025-12-07"),
      title: "Industrial Visit Day",
      location: "Submarine Cable Station & Dorianagar",
      status: "upcoming",
      events: [
        { time: "08:00 AM", title: "Breakfast", icon: <Utensils />, type: "meal", description: "Breakfast at hotel", status: "upcoming" },
        { time: "10:30 AM", title: "Submarine Cable Station Visit", icon: <Building2 />, type: "industrial", description: "Industrial visit to Submarine Cable Station", status: "upcoming" },
        { time: "01:00 PM", title: "Lunch", icon: <Utensils />, type: "meal", description: "Lunch break", status: "upcoming" },
        { time: "02:30 PM", title: "Visit Dorianagar", icon: <Camera />, type: "sightseeing", description: "Explore Dorianagar area", status: "upcoming" },
        { time: "06:00 PM", title: "Return to Hotel", icon: <Hotel />, type: "travel", description: "Return journey", status: "upcoming" },
        { time: "09:00 PM", title: "Dinner", icon: <Utensils />, type: "meal", description: "Dinner at hotel", status: "upcoming" },
        { time: "11:00 PM", title: "Overnight Stay", icon: <Hotel />, type: "accommodation", description: "Rest at hotel", status: "upcoming" }
      ]
    },
    {
      day: 5,
      date: "December 08, 2025",
      dateObj: new Date("2025-12-08"),
      title: "Saint Martin's Island Trip",
      location: "Saint Martin's Island",
      status: "upcoming",
      events: [
        { time: "06:00 AM", title: "Early Morning Departure", icon: <Sunrise />, type: "departure", description: "Depart for Saint Martin's Island", status: "upcoming" },
        { time: "08:00 AM", title: "Breakfast on Ship", icon: <Utensils />, type: "meal", description: "Breakfast during ship journey", status: "upcoming" },
        { time: "11:00 AM", title: "Arrive at Saint Martin's", icon: <MapPin />, type: "arrival", description: "Reach Saint Martin's Island", status: "upcoming" },
        { time: "12:00 PM", title: "Hotel Check-in", icon: <Hotel />, type: "accommodation", description: "Check into island hotel", status: "upcoming" },
        { time: "01:00 PM", title: "Lunch", icon: <Utensils />, type: "meal", description: "Lunch at hotel", status: "upcoming" },
        { time: "03:00 PM", title: "Island Exploration", icon: <Camera />, type: "sightseeing", description: "Full afternoon island exploration", status: "upcoming" },
        { time: "06:00 PM", title: "Beach Evening", icon: <Sunset />, type: "sightseeing", description: "Enjoy sunset at the beach", status: "upcoming" },
        { time: "08:00 PM", title: "Dinner", icon: <Utensils />, type: "meal", description: "Dinner at hotel", status: "upcoming" },
        { time: "10:00 PM", title: "Overnight Stay", icon: <Hotel />, type: "accommodation", description: "Rest at Saint Martin's hotel", status: "upcoming" }
      ]
    },
    {
      day: 6,
      date: "December 09, 2025",
      dateObj: new Date("2025-12-09"),
      title: "Chera Dwip & Barbecue Night",
      location: "Chera Dwip, Saint Martin's",
      status: "upcoming",
      events: [
        { time: "08:00 AM", title: "Breakfast", icon: <Utensils />, type: "meal", description: "Breakfast at hotel", status: "upcoming" },
        { time: "09:00 AM", title: "Visit Chera Dwip", icon: <Navigation />, type: "sightseeing", description: "Boat trip to Chera Dwip", status: "upcoming" },
        { time: "12:00 PM", title: "Beach Activities", icon: <Camera />, type: "activity", description: "Swimming and beach activities", status: "upcoming" },
        { time: "01:00 PM", title: "Lunch", icon: <Utensils />, type: "meal", description: "Lunch on the island", status: "upcoming" },
        { time: "03:00 PM", title: "Free Time", icon: <Camera />, type: "leisure", description: "Free time for exploration", status: "upcoming" },
        { time: "07:00 PM", title: "Barbecue Night", icon: <Utensils />, type: "special", description: "Special barbecue dinner night", status: "upcoming" },
        { time: "10:00 PM", title: "Overnight Stay", icon: <Hotel />, type: "accommodation", description: "Rest at hotel", status: "upcoming" }
      ]
    },
    {
      day: 7,
      date: "December 10, 2025",
      dateObj: new Date("2025-12-10"),
      title: "Return to Cox's Bazar",
      location: "Saint Martin's → Cox's Bazar",
      status: "upcoming",
      events: [
        { time: "08:00 AM", title: "Breakfast", icon: <Utensils />, type: "meal", description: "Breakfast at hotel", status: "upcoming" },
        { time: "09:00 AM", title: "Free Time", icon: <Camera />, type: "leisure", description: "Morning free time", status: "upcoming" },
        { time: "12:00 PM", title: "Lunch", icon: <Utensils />, type: "meal", description: "Lunch before departure", status: "upcoming" },
        { time: "02:00 PM", title: "Return Ship Journey", icon: <Navigation />, type: "travel", description: "Ship journey back to Cox's Bazar", status: "upcoming" },
        { time: "05:00 PM", title: "Arrive Cox's Bazar", icon: <MapPin />, type: "arrival", description: "Reach Cox's Bazar", status: "upcoming" },
        { time: "06:00 PM", title: "Hotel Check-in", icon: <Hotel />, type: "accommodation", description: "Check into hotel", status: "upcoming" },
        { time: "08:00 PM", title: "Dinner", icon: <Utensils />, type: "meal", description: "Dinner at hotel", status: "upcoming" },
        { time: "10:00 PM", title: "Overnight Stay", icon: <Hotel />, type: "accommodation", description: "Rest at hotel", status: "upcoming" }
      ]
    },
    {
      day: 8,
      date: "December 11, 2025",
      dateObj: new Date("2025-12-11"),
      title: "Shopping & Departure",
      location: "Cox's Bazar → JUST Campus",
      status: "upcoming",
      events: [
        { time: "08:00 AM", title: "Breakfast", icon: <Utensils />, type: "meal", description: "Breakfast at hotel", status: "upcoming" },
        { time: "10:00 AM", title: "Hotel Checkout", icon: <Hotel />, type: "accommodation", description: "Checkout and store luggage", status: "upcoming" },
        { time: "10:30 AM", title: "Shopping Time", icon: <Camera />, type: "shopping", description: "Free time for shopping", status: "upcoming" },
        { time: "02:00 PM", title: "Lunch", icon: <Utensils />, type: "meal", description: "Lunch break", status: "upcoming" },
        { time: "03:00 PM", title: "Continue Shopping", icon: <Camera />, type: "shopping", description: "More shopping time", status: "upcoming" },
        { time: "06:00 PM", title: "Start Return Journey", icon: <Bus />, type: "departure", description: "Board bus for return", status: "upcoming" },
        { time: "08:00 PM", title: "Dinner at Chittagong", icon: <Utensils />, type: "meal", description: "Dinner stop (Possible: Mejban)", status: "upcoming" },
        { time: "10:00 PM", title: "Overnight Journey", icon: <Moon />, type: "travel", description: "Continue journey to JUST", status: "upcoming" }
      ]
    },
    {
      day: 9,
      date: "December 12, 2025",
      dateObj: new Date("2025-12-12"),
      title: "Arrival at Campus",
      location: "JUST Campus",
      status: "upcoming",
      events: [
        { time: "08:00 AM", title: "Arrive at Campus", icon: <MapPin />, type: "arrival", description: "Safely arrive at JUST campus", status: "upcoming" },
        { time: "08:30 AM", title: "Tour Completion", icon: <CheckCircle />, type: "completion", description: "End of Industrial Tour 2025", status: "upcoming" }
      ]
    }
  ];

  // Get status badge configuration
  const getStatusConfig = (status) => {
    const configs = {
      completed: {
        icon: <CheckCircle2 className="w-4 h-4" />,
        label: 'Completed',
        bgColor: 'bg-green-100',
        textColor: 'text-green-700',
        borderColor: 'border-green-300',
        dotColor: 'bg-green-500'
      },
      ongoing: {
        icon: <PlayCircle className="w-4 h-4" />,
        label: 'Ongoing',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-300',
        dotColor: 'bg-blue-500'
      },
      upcoming: {
        icon: <Clock3 className="w-4 h-4" />,
        label: 'Upcoming',
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-600',
        borderColor: 'border-gray-300',
        dotColor: 'bg-gray-400'
      },
      cancelled: {
        icon: <XCircle className="w-4 h-4" />,
        label: 'Cancelled',
        bgColor: 'bg-red-100',
        textColor: 'text-red-700',
        borderColor: 'border-red-300',
        dotColor: 'bg-red-500'
      },
      delayed: {
        icon: <AlertCircle className="w-4 h-4" />,
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

  // Count statistics
  const stats = {
    total: tourSchedule.length,
    completed: tourSchedule.filter(d => d.status === 'completed').length,
    ongoing: tourSchedule.filter(d => d.status === 'ongoing').length,
    upcoming: tourSchedule.filter(d => d.status === 'upcoming').length,
    cancelled: tourSchedule.filter(d => d.status === 'cancelled').length
  };

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
                                    <div className="w-3 h-3 sm:w-4 sm:h-4">
                                      {statusConfig.icon}
                                    </div>
                                    <span className="text-[10px] sm:text-xs font-bold uppercase">{statusConfig.label}</span>
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
                                              <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6">{event.icon}</div>
                                            )}
                                          </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 mb-1.5 sm:mb-2 flex-wrap">
                                            <span className={`text-[10px] sm:text-xs md:text-sm font-bold ${eventStatusConfig.textColor} ${eventStatusConfig.bgColor} px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 rounded-full whitespace-nowrap`}>
                                              {event.time}
                                            </span>
                                            <div className={`flex items-center gap-1 sm:gap-1.5 ${eventStatusConfig.bgColor} ${eventStatusConfig.textColor} px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase border ${eventStatusConfig.borderColor}`}>
                                              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4">
                                                {eventStatusConfig.icon}
                                              </div>
                                              <span className="hidden min-[400px]:inline">{eventStatusConfig.label}</span>
                                            </div>
                                            {event.status === 'ongoing' && (
                                              <span className="px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 bg-blue-500 text-white text-[10px] sm:text-xs font-bold rounded-full animate-pulse shadow-lg">
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
