import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plane, 
  Building2, 
  Users, 
  MapPin, 
  CheckCircle2, 
  Calendar, 
  Briefcase, 
  GraduationCap,
  ArrowRight,
  Factory,
  Clock,
  Globe,
  Bus,
  Hotel,
  Camera,
  Target,
  Timer,
  X,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon
} from 'lucide-react';

const HomePage = () => {
  // Countdown Timer State
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Gallery Modal State
  const [selectedDay, setSelectedDay] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const tourStartDate = new Date('2025-12-04T19:00:00'); // December 4, 2025, 7:00 PM
      const now = new Date();
      const difference = tourStartDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle gallery modal
  const openGallery = (dayIndex) => {
    setSelectedDay(dayIndex);
    setCurrentImageIndex(0);
  };

  const closeGallery = () => {
    setSelectedDay(null);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    if (selectedDay !== null && tourSchedule[selectedDay].images) {
      setCurrentImageIndex((prev) => 
        (prev + 1) % tourSchedule[selectedDay].images.length
      );
    }
  };

  const previousImage = () => {
    if (selectedDay !== null && tourSchedule[selectedDay].images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? tourSchedule[selectedDay].images.length - 1 : prev - 1
      );
    }
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') closeGallery();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const features = [
    {
      icon: <Building2 className="w-8 h-8" />,
      title: "Industry Visits",
      description: "Visit leading tech companies and IT firms to explore real-world software development and innovations."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Networking",
      description: "Connect with industry professionals, alumni, and fellow students to build valuable relationships."
    },
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: "Career Insights",
      description: "Gain firsthand knowledge about career opportunities, work culture, and industry trends."
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "Learning Experience",
      description: "Practical exposure to cutting-edge technologies and enterprise-level project implementations."
    }
  ];

  const stats = [
    { number: "31", label: "Total Participants", icon: <Users className="w-6 h-6" /> },
    { number: "9", label: "Days Journey", icon: <Calendar className="w-6 h-6" /> },
    { number: "24", label: "Male Students", icon: <Users className="w-6 h-6" /> },
    { number: "4", label: "Female Students", icon: <Users className="w-6 h-6" /> },
    { number: "3", label: "Faculty Members", icon: <GraduationCap className="w-6 h-6" /> },
    { number: "1", label: "Industrial Visit", icon: <Building2 className="w-6 h-6" /> }
  ];

  const highlights = [
    { text: "Visit to Submarine Cable Station (Industrial Visit)", icon: <CheckCircle2 className="w-5 h-5" /> },
    { text: "Accommodation in comfortable hotels", icon: <CheckCircle2 className="w-5 h-5" /> },
    { text: "Explore Cox's Bazar beaches & Marine Drive", icon: <CheckCircle2 className="w-5 h-5" /> },
    { text: "Full-day Saint Martin's Island experience", icon: <CheckCircle2 className="w-5 h-5" /> },
    { text: "Visit Chera Dwip & Beach exploration", icon: <CheckCircle2 className="w-5 h-5" /> },
    { text: "Barbecue night & team building activities", icon: <CheckCircle2 className="w-5 h-5" /> }
  ];
  const tourSchedule = [
    {
      day: "Day 1",
      date: "Dec 04",
      location: "Departure",
      activities: ["07:00 PM: Start journey from campus", "Travel by bus to Cox's Bazar", "Overnight on bus"],
      icon: <Bus className="w-5 h-5" />,
      images: [
        { url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800", caption: "Starting our journey" },
        { url: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800", caption: "Team gathering at campus" },
        { url: "https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=800", caption: "Boarding the bus" }
      ]
    },
    {
      day: "Day 2",
      date: "Dec 05",
      location: "Cox's Bazar",
      activities: ["Arrival & hotel check-in", "Visit Laboni, Sugandha & Kolatoli Beach", "Overnight at hotel"],
      icon: <MapPin className="w-5 h-5" />,
      images: [
        { url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800", caption: "Cox's Bazar Beach" },
        { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800", caption: "Beautiful sunset at beach" },
        { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800", caption: "Team at the beach" }
      ]
    },
    {
      day: "Day 3",
      date: "Dec 06",
      location: "Marine Drive",
      activities: ["05:30 AM: Marine Drive tour", "Explore Shah Porir Dwip", "Visit Himchori & Inani Beach"],
      icon: <Camera className="w-5 h-5" />,
      images: [
        { url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800", caption: "Marine Drive scenic view" },
        { url: "https://images.unsplash.com/photo-1504870712357-65ea720d6078?w=800", caption: "Himchori waterfall" },
        { url: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800", caption: "Inani Beach" }
      ]
    },
    {
      day: "Day 4",
      date: "Dec 07",
      location: "Industrial Visit",
      activities: ["10:30 AM: Submarine Cable Station", "Visit Dorianagar", "Overnight at hotel"],
      icon: <Factory className="w-5 h-5" />,
      images: [
        { url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800", caption: "Submarine Cable Station" },
        { url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800", caption: "Technical infrastructure" },
        { url: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800", caption: "Learning session" }
      ]
    },
    {
      day: "Day 5",
      date: "Dec 08",
      location: "Saint Martin's",
      activities: ["Depart by ship to Saint Martin's", "Full-day island exploration", "Overnight on island"],
      icon: <Plane className="w-5 h-5" />,
      images: [
        { url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800", caption: "Ship journey to island" },
        { url: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800", caption: "Saint Martin's Island" },
        { url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800", caption: "Crystal clear waters" }
      ]
    },
    {
      day: "Day 6",
      date: "Dec 09",
      location: "Chera Dwip",
      activities: ["Visit Chera Dwip", "Beach activities", "Barbecue dinner night"],
      icon: <Target className="w-5 h-5" />,
      images: [
        { url: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800", caption: "Chera Dwip exploration" },
        { url: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800", caption: "Beach activities" },
        { url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800", caption: "Barbecue night" }
      ]
    },
    {
      day: "Day 7",
      date: "Dec 10",
      location: "Return Trip",
      activities: ["Free time for exploration", "Return to Cox's Bazar by ship", "Overnight at hotel"],
      icon: <Hotel className="w-5 h-5" />,
      images: [
        { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800", caption: "Last moments at island" },
        { url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800", caption: "Ship ride back" },
        { url: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800", caption: "Hotel comfort" }
      ]
    },
    {
      day: "Day 8",
      date: "Dec 11",
      location: "Shopping Day",
      activities: ["Hotel checkout", "Shopping & free time", "06:00 PM: Start return journey"],
      icon: <Clock className="w-5 h-5" />,
      images: [
        { url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800", caption: "Shopping time" },
        { url: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800", caption: "Local markets" },
        { url: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800", caption: "Souvenir shopping" }
      ]
    },
    {
      day: "Day 9",
      date: "Dec 12",
      location: "Campus Arrival",
      activities: ["Arrive safely at campus", "End of tour", "Memories for lifetime"],
      icon: <CheckCircle2 className="w-5 h-5" />,
      images: [
        { url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800", caption: "Back to campus" },
        { url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800", caption: "Team reunion" },
        { url: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800", caption: "Memories forever" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Gallery Modal */}
      {selectedDay !== null && (
        <div 
          className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4"
          onClick={closeGallery}
        >
          <button
            onClick={closeGallery}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>

          <div 
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Display */}
            <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
              <img
                src={tourSchedule[selectedDay].images[currentImageIndex].url}
                alt={tourSchedule[selectedDay].images[currentImageIndex].caption}
                className="w-full h-full object-contain"
              />
              
              {/* Navigation Arrows */}
              {tourSchedule[selectedDay].images.length > 1 && (
                <>
                  <button
                    onClick={previousImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all"
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all"
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
                {currentImageIndex + 1} / {tourSchedule[selectedDay].images.length}
              </div>
            </div>

            {/* Image Info */}
            <div className="mt-4 text-center">
              <h3 className="text-white text-2xl font-bold mb-2">
                {tourSchedule[selectedDay].day} - {tourSchedule[selectedDay].location}
              </h3>
              <p className="text-gray-300 text-lg">
                {tourSchedule[selectedDay].images[currentImageIndex].caption}
              </p>
            </div>

            {/* Thumbnail Strip */}
            {tourSchedule[selectedDay].images.length > 1 && (
              <div className="mt-6 flex gap-3 justify-center overflow-x-auto pb-2">
                {tourSchedule[selectedDay].images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      currentImageIndex === index 
                        ? 'border-[#19aaba] scale-110' 
                        : 'border-transparent hover:border-gray-500'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.caption}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#19aaba] via-[#158c99] to-[#116d77] text-white h-[100vh]">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid md:grid-cols-2 gap-4 items-center">
            {/* Left Content */}
            <div className="text-center md:text-left space-y-6">
              <div className="inline-block">
                <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold border border-white/30">
                  Perceptron-13 | CSE, JUST
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Industrial Tour
                <span className="block bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                  2025
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-100 max-w-2xl">
                Join Perceptron-13 batch of Computer Science and Engineering, 
                Jashore University of Science and Technology on an exciting 9-day journey to 
                Cox's Bazar, Saint Martin's Island, and industrial visits.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  to="/members"
                  className="group bg-white text-[#19aaba] px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  View Members
                  <Users className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right Content - Countdown Timer */}
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#19aaba] to-[#22c5d7] rounded-3xl blur-3xl opacity-30 animate-pulse"></div>
                <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl space-y-6">
                  {/* Countdown Timer */}
                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Timer className="w-6 h-6" />
                      <h3 className="text-xl font-bold">Tour Starts In</h3>
                    </div>
                    <p className="text-sm text-white/80">December 04, 2025 - 7:00 PM</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 flex flex-col items-center justify-center">
                      <div className="text-4xl font-bold mb-1">{String(timeLeft.days).padStart(2, '0')}</div>
                      <p className="text-xs uppercase font-semibold text-white/80">Days</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 flex flex-col items-center justify-center">
                      <div className="text-4xl font-bold mb-1">{String(timeLeft.hours).padStart(2, '0')}</div>
                      <p className="text-xs uppercase font-semibold text-white/80">Hours</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 flex flex-col items-center justify-center">
                      <div className="text-4xl font-bold mb-1">{String(timeLeft.minutes).padStart(2, '0')}</div>
                      <p className="text-xs uppercase font-semibold text-white/80">Minutes</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 flex flex-col items-center justify-center">
                      <div className="text-4xl font-bold mb-1 animate-pulse">{String(timeLeft.seconds).padStart(2, '0')}</div>
                      <p className="text-xs uppercase font-semibold text-white/80">Seconds</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 170" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V320H0V120Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tour <span className="bg-gradient-to-r from-[#19aaba] to-[#158c99] bg-clip-text text-transparent">Statistics</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center border border-gray-100"
              >
                <div className="flex justify-center mb-3">
                  <div className="bg-gradient-to-br from-[#19aaba] to-[#158c99] text-white p-3 rounded-xl">
                    {stat.icon}
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</h3>
                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Tour Objectives Section */}
      {/* <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Tour <span className="bg-gradient-to-r from-[#19aaba] to-[#158c99] bg-clip-text text-transparent">Objectives</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Bridge the gap between academic knowledge and industry practice through hands-on experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-[#19aaba]"
              >
                <div className="bg-gradient-to-br from-[#19aaba] to-[#158c99] text-white p-4 rounded-xl w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Tour Schedule Section */}
      <section className="py-20 bg-gradient-to-br from-[#19aaba]/10 via-[#19aaba]/5 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Tour <span className="bg-gradient-to-r from-[#19aaba] to-[#158c99] bg-clip-text text-transparent">Schedule</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A well-planned 9-day itinerary covering Cox's Bazar, Marine Drive, Saint Martin's Island, and industrial visit to Submarine Cable Station.
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="bg-gradient-to-br from-[#19aaba] to-[#158c99] rounded-2xl p-6 mb-12 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3 text-white">
                <div className="bg-white/20 p-3 rounded-lg">
                  <Timer className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-white/80 font-medium">Tour Starts In</p>
                  <p className="text-lg font-bold">December 04, 2025 - 7:00 PM</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 min-w-[70px] text-center">
                  <div className="text-2xl font-bold text-white">{String(timeLeft.days).padStart(2, '0')}</div>
                  <div className="text-xs text-white/80 uppercase font-semibold">Days</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 min-w-[70px] text-center">
                  <div className="text-2xl font-bold text-white">{String(timeLeft.hours).padStart(2, '0')}</div>
                  <div className="text-xs text-white/80 uppercase font-semibold">Hours</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 min-w-[70px] text-center">
                  <div className="text-2xl font-bold text-white">{String(timeLeft.minutes).padStart(2, '0')}</div>
                  <div className="text-xs text-white/80 uppercase font-semibold">Mins</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 min-w-[70px] text-center">
                  <div className="text-2xl font-bold text-white animate-pulse">{String(timeLeft.seconds).padStart(2, '0')}</div>
                  <div className="text-xs text-white/80 uppercase font-semibold">Secs</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tourSchedule.map((schedule, index) => (
              <div 
                key={index}
                onClick={() => openGallery(index)}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-[#19aaba] cursor-pointer group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-gradient-to-br from-[#19aaba] to-[#158c99] text-white p-3 rounded-xl">
                    {schedule.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{schedule.day}</h3>
                    <p className="text-xs text-gray-500 font-medium">{schedule.date}</p>
                    <p className="text-sm text-[#19aaba] font-semibold">{schedule.location}</p>
                  </div>
                </div>
                <ul className="space-y-2 mb-4">
                  {schedule.activities.map((activity, actIndex) => (
                    <li key={actIndex} className="flex items-start gap-2 text-gray-700 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
                {/* View Gallery Button */}
                <div className="flex items-center justify-center gap-2 text-[#19aaba] font-semibold text-sm pt-3 border-t border-gray-100 group-hover:gap-3 transition-all">
                  <ImageIcon className="w-4 h-4" />
                  <span>View Gallery ({schedule.images.length} photos)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                About <span className="bg-gradient-to-r from-[#19aaba] to-[#158c99] bg-clip-text text-transparent">Perceptron-13</span>
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                We are the 13th batch of Computer Science and Engineering at Jashore University of Science and Technology (JUST). 
                Known as <strong>Perceptron-13</strong>, we represent innovation, unity, and excellence in technology.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                This 9-day industrial tour to Cox's Bazar and Saint Martin's Island is designed to provide our students 
                with invaluable experiences combining industry visits with natural beauty exploration. We'll visit the 
                Submarine Cable Station and explore the world's longest sea beach, creating memories that last forever.
              </p>
              <div className="flex items-center gap-4">
                <GraduationCap className="w-12 h-12 text-[#19aaba]" />
                <div>
                  <p className="font-bold text-gray-900">Perceptron-13</p>
                  <p className="text-gray-600">CSE, JUST | Session 20-21</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {highlights.map((highlight, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
                >
                  <div className="text-green-500 flex-shrink-0">
                    {highlight.icon}
                  </div>
                  <p className="text-gray-700 font-medium">{highlight.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#19aaba] via-[#158c99] to-[#116d77] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Join the Journey?
          </h2>
          <p className="text-lg md:text-xl text-gray-100 mb-10 max-w-2xl mx-auto">
            Don't miss this opportunity to explore Cox's Bazar, Saint Martin's Island, visit the Submarine Cable Station, 
            and create unforgettable memories with your batch mates on this 9-day adventure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/schedule"
              className="group bg-white text-[#19aaba] px-10 py-4 rounded-full font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              View Schedule
              <Plane className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Contact Info */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-gray-200 mb-4">For more information, contact:</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                <p className="font-semibold">Email: perceptron13@cse.just.ac.bd</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
                <p className="font-semibold">Phone: +880 1XXX-XXXXXX</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
