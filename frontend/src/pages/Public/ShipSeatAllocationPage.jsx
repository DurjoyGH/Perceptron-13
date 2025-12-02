import { useState } from 'react';
import { 
  Ship, 
  User, 
  MapPin, 
  ArrowRight,
  Users,
  CheckCircle2,
  Info,
  Download,
  Search,
  Anchor,
  Clock,
  Calendar
} from 'lucide-react';

const ShipSeatAllocationPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [activeRoute, setActiveRoute] = useState('coxToStMartin');

  // Cox's Bazar to Saint Martin passengers
  const coxToStMartinPassengers = [
    // Faculty (SD87, SD88, SD89)
    { id: 1, seat: 'SD87', name: "Dr. A F M Shahab Uddin", role: "faculty", gender: "male" },
    { id: 2, seat: 'SD88', name: "Dr. A F M Shahab Uddin", role: "faculty", gender: "male" },
    { id: 3, seat: 'SD89', name: "Sk. Shalauddin Kabir", role: "faculty", gender: "male" },
    
    // Male Students (SD90, SD91, SD92)
    { id: 4, seat: 'SD90', name: "Sadik", role: "student", gender: "male" },
    { id: 5, seat: 'SD91', name: "Azaz", role: "student", gender: "male" },
    { id: 6, seat: 'SD92', name: "Ramjan", role: "student", gender: "male" },
    
    // SD100
    { id: 7, seat: 'SD100', name: "Takbir", role: "student", gender: "male" },
    
    // Male Students (SD105, SD106, SD109, SD108, SD109 → SD105, SD106, SD107, SD108, SD109)
    { id: 8, seat: 'SD105', name: "Nehal", role: "student", gender: "male" },
    { id: 9, seat: 'SD106', name: "Makky", role: "student", gender: "male" },
    { id: 10, seat: 'SD107', name: "Durjoy", role: "student", gender: "male" },
    { id: 11, seat: 'SD108', name: "Fahim", role: "student", gender: "male" },
    { id: 12, seat: 'SD109', name: "Arif", role: "student", gender: "male" },
    
    // Male Students (SD22-SD26 → SD22, SD23, SD24, SD25, SD26)
    { id: 13, seat: 'SD22', name: "Limon", role: "student", gender: "male" },
    { id: 14, seat: 'SD23', name: "Risan", role: "student", gender: "male" },
    { id: 15, seat: 'SD24', name: "Joy", role: "student", gender: "male" },
    { id: 16, seat: 'SD25', name: "Tafhim", role: "student", gender: "male" },
    { id: 17, seat: 'SD26', name: "Rezwan", role: "student", gender: "male" },
    
    // Male Students (SD29-SD33 → SD29, SD30, SD31, SD32, SD33)
    { id: 18, seat: 'SD29', name: "Sayed", role: "student", gender: "male" },
    { id: 19, seat: 'SD30', name: "Biswajit", role: "student", gender: "male" },
    { id: 20, seat: 'SD31', name: "Topu", role: "student", gender: "male" },
    { id: 21, seat: 'SD32', name: "Samit", role: "student", gender: "male" },
    { id: 22, seat: 'SD33', name: "Ovesekh", role: "student", gender: "male" },
    
    // Male Students (SD122-SD126 → SD122, SD123, SD124, SD125, SD126)
    { id: 23, seat: 'SD122', name: "Rafid", role: "student", gender: "male" },
    { id: 24, seat: 'SD123', name: "Tahmid", role: "student", gender: "male" },
    { id: 25, seat: 'SD124', name: "Sibly", role: "student", gender: "male" },
    { id: 26, seat: 'SD125', name: "Noman", role: "student", gender: "male" },
    { id: 27, seat: 'SD126', name: "Abrar", role: "student", gender: "male" },
    
    // Female Students (SD96, SD93, SD98, SD99)
    { id: 28, seat: 'SD96', name: "Anamika", role: "student", gender: "female" },
    { id: 29, seat: 'SD97', name: "Anika", role: "student", gender: "female" },
    { id: 30, seat: 'SD98', name: "Puspita", role: "student", gender: "female" },
    { id: 31, seat: 'SD99', name: "Munni", role: "student", gender: "female" }
  ];

  // Saint Martin to Cox's Bazar passengers (return journey)
  const stMartinToCoxPassengers = [
    // Faculty (SD87, SD88, SD89)
    { id: 1, seat: 'SD87', name: "Dr. A F M Shahab Uddin", role: "faculty", gender: "male" },
    { id: 2, seat: 'SD88', name: "Dr. A F M Shahab Uddin", role: "faculty", gender: "male" },
    { id: 3, seat: 'SD89', name: "Sk. Shalauddin Kabir", role: "faculty", gender: "male" },
    
    // Male Students (SD90, SD91, SD100)
    { id: 4, seat: 'SD90', name: "Azaz", role: "student", gender: "male" },
    { id: 5, seat: 'SD91', name: "Noman", role: "student", gender: "male" },
    { id: 6, seat: 'SD100', name: "Makky", role: "student", gender: "male" },
    
    // Female Students (SD96, SD97, SD98, SD99)
    { id: 7, seat: 'SD96', name: "Anamika", role: "student", gender: "female" },
    { id: 8, seat: 'SD97', name: "Anika", role: "student", gender: "female" },
    { id: 9, seat: 'SD98', name: "Munni", role: "student", gender: "female" },
    { id: 10, seat: 'SD99', name: "Puspita", role: "student", gender: "female" },
    
    // Male Students (SD105, SD106, SD107, SD108, SD109)
    { id: 11, seat: 'SD105', name: "Nehal", role: "student", gender: "male" },
    { id: 12, seat: 'SD106', name: "Durjoy", role: "student", gender: "male" },
    { id: 13, seat: 'SD107', name: "Fahim", role: "student", gender: "male" },
    { id: 14, seat: 'SD108', name: "Arif", role: "student", gender: "male" },
    { id: 15, seat: 'SD109', name: "Takbir", role: "student", gender: "male" },
    
    // Male Students (SD114, SD115, SD116, SD117, SD118)
    { id: 16, seat: 'SD114', name: "Rafid", role: "student", gender: "male" },
    { id: 17, seat: 'SD115', name: "Tahmid", role: "student", gender: "male" },
    { id: 18, seat: 'SD116', name: "Sibly", role: "student", gender: "male" },
    { id: 19, seat: 'SD117', name: "Sadik", role: "student", gender: "male" },
    { id: 20, seat: 'SD118', name: "Abrar", role: "student", gender: "male" },
    
    // SD122
    { id: 21, seat: 'SD122', name: "Ramjan", role: "student", gender: "male" },
    
    // Male Students (SD34, SD35, SD36, SD37, SD38)
    { id: 22, seat: 'SD34', name: "Limon", role: "student", gender: "male" },
    { id: 23, seat: 'SD35', name: "Risan", role: "student", gender: "male" },
    { id: 24, seat: 'SD36', name: "Joy", role: "student", gender: "male" },
    { id: 25, seat: 'SD37', name: "Tafhim", role: "student", gender: "male" },
    { id: 26, seat: 'SD38', name: "Rezwan", role: "student", gender: "male" },
    
    // Male Students (SD55, SD56, SD57, SD58, SD60)
    { id: 27, seat: 'SD55', name: "Sayed", role: "student", gender: "male" },
    { id: 28, seat: 'SD56', name: "Biswajit", role: "student", gender: "male" },
    { id: 29, seat: 'SD57', name: "Topu", role: "student", gender: "male" },
    { id: 30, seat: 'SD58', name: "Samit", role: "student", gender: "male" },
    { id: 31, seat: 'SD60', name: "Ovesekh", role: "student", gender: "male" }
  ];

  const passengers = activeRoute === 'stMartinToCox' ? stMartinToCoxPassengers : coxToStMartinPassengers;

  const filteredPassengers = passengers.filter(passenger =>
    passenger.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    passenger.seat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSeatGroupColor = (passenger) => {
    if (!passenger) return { bg: 'bg-gray-300', border: 'border-gray-400', light: 'bg-gray-100', text: 'text-gray-700' };
    const colorMap = {
      purple: { bg: 'bg-purple-500', border: 'border-purple-600', light: 'bg-purple-100', text: 'text-purple-700' },
      pink: { bg: 'bg-pink-500', border: 'border-pink-600', light: 'bg-pink-100', text: 'text-pink-700' },
      blue: { bg: 'bg-[#19aaba]', border: 'border-[#158c99]', light: 'bg-teal-100', text: 'text-teal-700' }
    };
    if (passenger.role === 'faculty') return colorMap.purple;
    if (passenger.gender === 'female') return colorMap.pink;
    return colorMap.blue;
  };

  const stats = {
    totalPassengers: passengers.length,
    faculty: passengers.filter(p => p.role === 'faculty').length,
    students: passengers.filter(p => p.role === 'student').length,
    male: passengers.filter(p => p.gender === 'male').length,
    female: passengers.filter(p => p.gender === 'female').length
  };

  // Helper function to get seat number
  const getSeatNum = (seat) => parseInt(seat.replace('SD', ''));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#19aaba] via-[#158c99] to-[#116d77] text-white py-16 md:py-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
          <svg className="absolute bottom-0 w-full h-24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="rgba(255,255,255,0.1)" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 mb-6 shadow-lg">
              <Ship className="w-6 h-6 animate-bounce" />
              <span className="font-bold text-lg">Baroawlia Ferry</span>
              <Anchor className="w-5 h-5" />
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-4 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-100">
                Ship Seat Plan
              </span>
            </h1>
            
            <p className="text-xl text-gray-100 mb-8 font-medium">Saint Martin Island Tour • December 2025</p>

            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 max-w-4xl mx-auto mt-8">
              {[
                { label: 'Total', value: stats.totalPassengers, color: 'from-white/20 to-white/10' },
                { label: 'Faculty', value: stats.faculty, color: 'from-purple-400/30 to-purple-600/30' },
                { label: 'Students', value: stats.students, color: 'from-blue-400/30 to-blue-600/30' },
                // { label: 'Male', value: stats.male, color: 'from-blue-400/20 to-blue-600/20' },
                // { label: 'Female', value: stats.female, color: 'from-pink-400/30 to-pink-600/30' }
              ].map((stat, idx) => (
                <div key={idx} className={`bg-gradient-to-br ${stat.color} backdrop-blur-lg rounded-2xl p-4 md:p-6 border border-white/20 hover:scale-105 transition-transform min-w-[140px] md:min-w-[160px]`}>
                  <div className="text-sm md:text-base opacity-90 mb-1">{stat.label}</div>
                  <div className="text-3xl md:text-4xl font-bold">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Route Selector */}
      <section className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => setActiveRoute('coxToStMartin')}
              className={`group relative flex items-center gap-3 px-6 md:px-8 py-4 rounded-2xl font-bold transition-all duration-300 ${
                activeRoute === 'coxToStMartin'
                  ? 'bg-gradient-to-r from-[#19aaba] to-[#158c99] text-white shadow-xl shadow-[#19aaba]/50 scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <MapPin className="w-5 h-5" />
              <span className="text-base md:text-lg">Cox's Bazar → Saint Martin</span>
            </button>

            <button
              onClick={() => setActiveRoute('stMartinToCox')}
              className={`group relative flex items-center gap-3 px-6 md:px-8 py-4 rounded-2xl font-bold transition-all duration-300 ${
                activeRoute === 'stMartinToCox'
                  ? 'bg-gradient-to-r from-[#19aaba] to-[#158c99] text-white shadow-xl shadow-[#19aaba]/50 scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <MapPin className="w-5 h-5" />
              <span className="text-base md:text-lg">Saint Martin → Cox's Bazar</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-4 md:gap-8">
            <div className="lg:col-span-3">
              {/* Ship Deck Layout */}
              <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl p-4 md:p-6 lg:p-8 border-2 border-gray-200">
                {/* Legend */}
                <div className="flex items-center justify-between mb-4 md:mb-6 flex-wrap gap-2 md:gap-4">
                  <h2 className="text-lg md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Ship className="w-5 h-5 md:w-6 md:h-6 text-[#19aaba]" />
                    <span className="hidden sm:inline">Sundeck Layout</span>
                    <span className="sm:hidden">Deck</span>
                  </h2>
                  <div className="flex items-center gap-2 md:gap-4 text-[10px] md:text-xs flex-wrap">
                    <div className="flex items-center gap-1 md:gap-2">
                      <div className="w-3 h-3 md:w-4 md:h-4 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-600">Faculty</span>
                    </div>
                    <div className="flex items-center gap-1 md:gap-2">
                      <div className="w-3 h-3 md:w-4 md:h-4 bg-pink-500 rounded-full"></div>
                      <span className="text-gray-600">Female</span>
                    </div>
                    <div className="flex items-center gap-1 md:gap-2">
                      <div className="w-3 h-3 md:w-4 md:h-4 bg-[#19aaba] rounded-full"></div>
                      <span className="text-gray-600">Male</span>
                    </div>
                  </div>
                </div>

                {/* Ship Visualization */}
                <div className="relative bg-gradient-to-b from-blue-50 to-cyan-50 rounded-2xl md:rounded-3xl p-4 md:p-8 border-2 border-[#19aaba]/20">
                  {/* Ship Front Indicator */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="bg-gradient-to-r from-[#19aaba] to-[#158c99] text-white px-3 md:px-6 py-1 md:py-2 rounded-full text-[10px] md:text-sm font-bold shadow-lg border-2 border-white flex items-center gap-1 md:gap-2">
                      <ArrowRight className="w-3 h-3 md:w-4 md:h-4 rotate-[-90deg]" />
                      FRONT
                    </div>
                  </div>

                  {/* Deck Sections */}
                  <div className="space-y-4 md:space-y-8">
                    {/* Faculty Section (SD87-89) */}
                    {passengers.filter(p => p.role === 'faculty').length > 0 && (
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-6 border-2 border-purple-200">
                        <div className="flex items-center gap-2 mb-3 md:mb-4">
                          <div className="w-2 h-2 md:w-3 md:h-3 bg-purple-500 rounded-full"></div>
                          <h3 className="text-base md:text-lg font-bold text-gray-800">Faculty Area</h3>
                          <span className="text-xs md:text-sm text-gray-500 ml-auto">SD87-89</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 md:gap-3">
                          {passengers.filter(p => p.role === 'faculty').sort((a, b) => a.seat.localeCompare(b.seat)).map(passenger => (
                            <button
                              key={passenger.id}
                              onClick={() => setSelectedSeat(passenger)}
                              className="group relative bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl md:rounded-2xl p-2 md:p-4 transition-all hover:scale-105 hover:shadow-xl"
                            >
                              <div className="flex flex-col items-center justify-center gap-1 md:gap-2 text-white h-full">
                                <div className="w-8 h-8 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all">
                                  <User className="w-4 h-4 md:w-6 md:h-6" />
                                </div>
                                <div className="text-xs md:text-sm font-bold">{passenger.seat}</div>
                                <div className="text-[10px] md:text-xs line-clamp-1 w-full text-center">{passenger.name}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Mixed Section (SD90-100) - Female + Male */}
                    {passengers.filter(p => getSeatNum(p.seat) >= 90 && getSeatNum(p.seat) <= 100).length > 0 && (
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-6 border-2 border-pink-200">
                        <div className="flex items-center gap-2 mb-3 md:mb-4">
                          <div className="w-2 h-2 md:w-3 md:h-3 bg-pink-500 rounded-full"></div>
                          <h3 className="text-base md:text-lg font-bold text-gray-800">Mixed Area</h3>
                          <span className="text-xs md:text-sm text-gray-500 ml-auto">SD90-100</span>
                        </div>
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
                          {passengers.filter(p => getSeatNum(p.seat) >= 90 && getSeatNum(p.seat) <= 100)
                            .sort((a, b) => getSeatNum(a.seat) - getSeatNum(b.seat))
                            .map(passenger => (
                              <button
                                key={passenger.id}
                                onClick={() => setSelectedSeat(passenger)}
                                className={`group relative bg-gradient-to-br ${passenger.gender === 'female' ? 'from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700' : 'from-[#19aaba] to-[#158c99] hover:from-[#158c99] hover:to-[#116d77]'} rounded-xl md:rounded-2xl p-2 md:p-3 transition-all hover:scale-105 hover:shadow-xl`}
                              >
                                <div className="flex flex-col items-center justify-center gap-1 md:gap-2 text-white h-full">
                                  <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all">
                                    <User className="w-4 h-4 md:w-5 md:h-5" />
                                  </div>
                                  <div className="text-[10px] md:text-xs font-bold whitespace-nowrap">{passenger.seat}</div>
                                  <div className="text-xs md:text-sm line-clamp-2 w-full text-center break-words">{passenger.name}</div>
                                </div>
                              </button>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Male Students Section (SD105-109) */}
                    {passengers.filter(p => getSeatNum(p.seat) >= 105 && getSeatNum(p.seat) <= 109).length > 0 && (
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-6 border-2 border-[#19aaba]/30">
                        <div className="flex items-center gap-2 mb-3 md:mb-4">
                          <div className="w-2 h-2 md:w-3 md:h-3 bg-[#19aaba] rounded-full"></div>
                          <h3 className="text-base md:text-lg font-bold text-gray-800">Male Students</h3>
                          <span className="text-xs md:text-sm text-gray-500 ml-auto">SD105-109</span>
                        </div>
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-3">
                          {passengers.filter(p => getSeatNum(p.seat) >= 105 && getSeatNum(p.seat) <= 109)
                            .sort((a, b) => getSeatNum(a.seat) - getSeatNum(b.seat))
                            .map(passenger => (
                              <button
                                key={passenger.id}
                                onClick={() => setSelectedSeat(passenger)}
                                className="group relative bg-gradient-to-br from-[#19aaba] to-[#158c99] hover:from-[#158c99] hover:to-[#116d77] rounded-xl md:rounded-2xl p-2 md:p-3 transition-all hover:scale-105 hover:shadow-xl"
                              >
                                <div className="flex flex-col items-center justify-center gap-1 md:gap-2 text-white h-full">
                                  <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all">
                                    <User className="w-4 h-4 md:w-5 md:h-5" />
                                  </div>
                                  <div className="text-[10px] md:text-xs font-bold whitespace-nowrap">{passenger.seat}</div>
                                  <div className="text-xs md:text-sm line-clamp-2 w-full text-center break-words">{passenger.name}</div>
                                </div>
                              </button>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Male Students Section (SD122-126) */}
                    {passengers.filter(p => getSeatNum(p.seat) >= 122 && getSeatNum(p.seat) <= 126).length > 0 && (
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-6 border-2 border-[#19aaba]/30">
                        <div className="flex items-center gap-2 mb-3 md:mb-4">
                          <div className="w-2 h-2 md:w-3 md:h-3 bg-[#19aaba] rounded-full"></div>
                          <h3 className="text-base md:text-lg font-bold text-gray-800">Male Students</h3>
                          <span className="text-xs md:text-sm text-gray-500 ml-auto">SD122-126</span>
                        </div>
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-3">
                          {passengers.filter(p => getSeatNum(p.seat) >= 122 && getSeatNum(p.seat) <= 126)
                            .sort((a, b) => getSeatNum(a.seat) - getSeatNum(b.seat))
                            .map(passenger => (
                              <button
                                key={passenger.id}
                                onClick={() => setSelectedSeat(passenger)}
                                className="group relative bg-gradient-to-br from-[#19aaba] to-[#158c99] hover:from-[#158c99] hover:to-[#116d77] rounded-xl md:rounded-2xl p-2 md:p-3 transition-all hover:scale-105 hover:shadow-xl"
                              >
                                <div className="flex flex-col items-center justify-center gap-1 md:gap-2 text-white h-full">
                                  <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all">
                                    <User className="w-4 h-4 md:w-5 md:h-5" />
                                  </div>
                                  <div className="text-[10px] md:text-xs font-bold whitespace-nowrap">{passenger.seat}</div>
                                  <div className="text-xs md:text-sm line-clamp-2 w-full text-center break-words">{passenger.name}</div>
                                </div>
                              </button>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Male Students Section (SD22-26) */}
                    {passengers.filter(p => getSeatNum(p.seat) >= 22 && getSeatNum(p.seat) <= 26).length > 0 && (
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-6 border-2 border-[#19aaba]/30">
                        <div className="flex items-center gap-2 mb-3 md:mb-4">
                          <div className="w-2 h-2 md:w-3 md:h-3 bg-[#19aaba] rounded-full"></div>
                          <h3 className="text-base md:text-lg font-bold text-gray-800">Male Students</h3>
                          <span className="text-xs md:text-sm text-gray-500 ml-auto">SD22-26</span>
                        </div>
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-3">
                          {passengers.filter(p => getSeatNum(p.seat) >= 22 && getSeatNum(p.seat) <= 26)
                            .sort((a, b) => getSeatNum(a.seat) - getSeatNum(b.seat))
                            .map(passenger => (
                              <button
                                key={passenger.id}
                                onClick={() => setSelectedSeat(passenger)}
                                className="group relative bg-gradient-to-br from-[#19aaba] to-[#158c99] hover:from-[#158c99] hover:to-[#116d77] rounded-xl md:rounded-2xl p-2 md:p-3 transition-all hover:scale-105 hover:shadow-xl"
                              >
                                <div className="flex flex-col items-center justify-center gap-1 md:gap-2 text-white h-full">
                                  <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all">
                                    <User className="w-4 h-4 md:w-5 md:h-5" />
                                  </div>
                                  <div className="text-[10px] md:text-xs font-bold whitespace-nowrap">{passenger.seat}</div>
                                  <div className="text-xs md:text-sm line-clamp-2 w-full text-center break-words">{passenger.name}</div>
                                </div>
                              </button>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Male Students Section (SD29-33) */}
                    {passengers.filter(p => getSeatNum(p.seat) >= 29 && getSeatNum(p.seat) <= 33).length > 0 && (
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-6 border-2 border-[#19aaba]/30">
                        <div className="flex items-center gap-2 mb-3 md:mb-4">
                          <div className="w-2 h-2 md:w-3 md:h-3 bg-[#19aaba] rounded-full"></div>
                          <h3 className="text-base md:text-lg font-bold text-gray-800">Male Students</h3>
                          <span className="text-xs md:text-sm text-gray-500 ml-auto">SD29-33</span>
                        </div>
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-3">
                          {passengers.filter(p => getSeatNum(p.seat) >= 29 && getSeatNum(p.seat) <= 33)
                            .sort((a, b) => getSeatNum(a.seat) - getSeatNum(b.seat))
                            .map(passenger => (
                              <button
                                key={passenger.id}
                                onClick={() => setSelectedSeat(passenger)}
                                className="group relative bg-gradient-to-br from-[#19aaba] to-[#158c99] hover:from-[#158c99] hover:to-[#116d77] rounded-xl md:rounded-2xl p-2 md:p-3 transition-all hover:scale-105 hover:shadow-xl"
                              >
                                <div className="flex flex-col items-center justify-center gap-1 md:gap-2 text-white h-full">
                                  <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all">
                                    <User className="w-4 h-4 md:w-5 md:h-5" />
                                  </div>
                                  <div className="text-[10px] md:text-xs font-bold whitespace-nowrap">{passenger.seat}</div>
                                  <div className="text-xs md:text-sm line-clamp-2 w-full text-center break-words">{passenger.name}</div>
                                </div>
                              </button>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Male Students Section (SD34-38) */}
                    {passengers.filter(p => getSeatNum(p.seat) >= 34 && getSeatNum(p.seat) <= 38).length > 0 && (
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-6 border-2 border-[#19aaba]/30">
                        <div className="flex items-center gap-2 mb-3 md:mb-4">
                          <div className="w-2 h-2 md:w-3 md:h-3 bg-[#19aaba] rounded-full"></div>
                          <h3 className="text-base md:text-lg font-bold text-gray-800">Male Students</h3>
                          <span className="text-xs md:text-sm text-gray-500 ml-auto">SD34-38</span>
                        </div>
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-3">
                          {passengers.filter(p => getSeatNum(p.seat) >= 34 && getSeatNum(p.seat) <= 38)
                            .sort((a, b) => getSeatNum(a.seat) - getSeatNum(b.seat))
                            .map(passenger => (
                              <button
                                key={passenger.id}
                                onClick={() => setSelectedSeat(passenger)}
                                className="group relative bg-gradient-to-br from-[#19aaba] to-[#158c99] hover:from-[#158c99] hover:to-[#116d77] rounded-xl md:rounded-2xl p-2 md:p-3 transition-all hover:scale-105 hover:shadow-xl"
                              >
                                <div className="flex flex-col items-center justify-center gap-1 md:gap-2 text-white h-full">
                                  <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all">
                                    <User className="w-4 h-4 md:w-5 md:h-5" />
                                  </div>
                                  <div className="text-[10px] md:text-xs font-bold whitespace-nowrap">{passenger.seat}</div>
                                  <div className="text-xs md:text-sm line-clamp-2 w-full text-center break-words">{passenger.name}</div>
                                </div>
                              </button>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Male Students Section (SD55-60) */}
                    {passengers.filter(p => getSeatNum(p.seat) >= 55 && getSeatNum(p.seat) <= 60).length > 0 && (
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-6 border-2 border-[#19aaba]/30">
                        <div className="flex items-center gap-2 mb-3 md:mb-4">
                          <div className="w-2 h-2 md:w-3 md:h-3 bg-[#19aaba] rounded-full"></div>
                          <h3 className="text-base md:text-lg font-bold text-gray-800">Male Students</h3>
                          <span className="text-xs md:text-sm text-gray-500 ml-auto">SD55-60</span>
                        </div>
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-3">
                          {passengers.filter(p => getSeatNum(p.seat) >= 55 && getSeatNum(p.seat) <= 60)
                            .sort((a, b) => getSeatNum(a.seat) - getSeatNum(b.seat))
                            .map(passenger => (
                              <button
                                key={passenger.id}
                                onClick={() => setSelectedSeat(passenger)}
                                className="group relative bg-gradient-to-br from-[#19aaba] to-[#158c99] hover:from-[#158c99] hover:to-[#116d77] rounded-xl md:rounded-2xl p-2 md:p-3 transition-all hover:scale-105 hover:shadow-xl"
                              >
                                <div className="flex flex-col items-center justify-center gap-1 md:gap-2 text-white h-full">
                                  <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all">
                                    <User className="w-4 h-4 md:w-5 md:h-5" />
                                  </div>
                                  <div className="text-[10px] md:text-xs font-bold whitespace-nowrap">{passenger.seat}</div>
                                  <div className="text-xs md:text-sm line-clamp-2 w-full text-center break-words">{passenger.name}</div>
                                </div>
                              </button>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Male Students Section (SD114-118) */}
                    {passengers.filter(p => getSeatNum(p.seat) >= 114 && getSeatNum(p.seat) <= 118).length > 0 && (
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-6 border-2 border-[#19aaba]/30">
                        <div className="flex items-center gap-2 mb-3 md:mb-4">
                          <div className="w-2 h-2 md:w-3 md:h-3 bg-[#19aaba] rounded-full"></div>
                          <h3 className="text-base md:text-lg font-bold text-gray-800">Male Students</h3>
                          <span className="text-xs md:text-sm text-gray-500 ml-auto">SD114-118</span>
                        </div>
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-3">
                          {passengers.filter(p => getSeatNum(p.seat) >= 114 && getSeatNum(p.seat) <= 118)
                            .sort((a, b) => getSeatNum(a.seat) - getSeatNum(b.seat))
                            .map(passenger => (
                              <button
                                key={passenger.id}
                                onClick={() => setSelectedSeat(passenger)}
                                className="group relative bg-gradient-to-br from-[#19aaba] to-[#158c99] hover:from-[#158c99] hover:to-[#116d77] rounded-xl md:rounded-2xl p-2 md:p-3 transition-all hover:scale-105 hover:shadow-xl"
                              >
                                <div className="flex flex-col items-center justify-center gap-1 md:gap-2 text-white h-full">
                                  <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all">
                                    <User className="w-4 h-4 md:w-5 md:h-5" />
                                  </div>
                                  <div className="text-[10px] md:text-xs font-bold whitespace-nowrap">{passenger.seat}</div>
                                  <div className="text-xs md:text-sm line-clamp-2 w-full text-center break-words">{passenger.name}</div>
                                </div>
                              </button>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Ship Back Indicator */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 z-10">
                    <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-3 md:px-6 py-1 md:py-2 rounded-full text-[10px] md:text-sm font-bold shadow-lg border-2 border-white flex items-center gap-1 md:gap-2">
                      <ArrowRight className="w-3 h-3 md:w-4 md:h-4 rotate-90" />
                      BACK
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 md:top-28 bg-white rounded-2xl md:rounded-3xl shadow-2xl p-4 md:p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <h2 className="text-lg md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Users className="w-5 h-5 md:w-6 md:h-6 text-[#19aaba]" />
                    <span className="hidden sm:inline">Directory</span>
                    <span className="sm:hidden">List</span>
                  </h2>
                  <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                    <Download className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                  </button>
                </div>

                <div className="relative mb-4 md:mb-6">
                  <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search passenger..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 md:pl-11 pr-3 md:pr-4 py-2 md:py-3 text-sm md:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                  />
                </div>

                <div className="space-y-2 max-h-[400px] md:max-h-[600px] overflow-y-auto custom-scrollbar">
                  {filteredPassengers.map(passenger => {
                    const colors = getSeatGroupColor(passenger);
                    return (
                      <button
                        key={passenger.id}
                        onClick={() => setSelectedSeat(passenger)}
                        className={`w-full text-left p-3 md:p-4 rounded-xl transition-all border-2 ${
                          selectedSeat?.id === passenger.id ? 'border-[#19aaba] shadow-lg scale-[1.02]' : 'border-transparent'
                        } hover:bg-gray-50 group`}
                      >
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className={`w-8 h-8 md:w-10 md:h-10 ${colors.bg} rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                            <User className="w-4 h-4 md:w-5 md:h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 text-sm md:text-base truncate">{passenger.name}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs md:text-sm font-bold px-2 py-0.5 rounded-full ${colors.light} ${colors.text}`}>
                                {passenger.seat}
                              </span>
                              {passenger.role === 'faculty' && (
                                <span className="text-xs">👨‍🏫</span>
                              )}
                            </div>
                          </div>
                          <CheckCircle2 className={`w-4 h-4 md:w-5 md:h-5 ${selectedSeat?.id === passenger.id ? 'text-[#19aaba]' : 'text-gray-300'} flex-shrink-0`} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {selectedSeat && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedSeat(null)}
        >
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className={`relative h-40 bg-gradient-to-br ${
              selectedSeat.role === 'faculty' ? 'from-purple-500 to-indigo-600' :
              selectedSeat.gender === 'female' ? 'from-pink-500 to-rose-600' :
              'from-[#19aaba] to-[#158c99]'
            }`}>
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute top-6 right-6">
                <button onClick={() => setSelectedSeat(null)} className="p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                <div className="w-28 h-28 bg-white rounded-full p-2 shadow-2xl">
                  <div className={`w-full h-full rounded-full bg-gradient-to-br ${
                    selectedSeat.role === 'faculty' ? 'from-purple-500 to-indigo-600' :
                    selectedSeat.gender === 'female' ? 'from-pink-500 to-rose-600' :
                    'from-[#19aaba] to-[#158c99]'
                  } flex items-center justify-center`}>
                    <User className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-20 p-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">{selectedSeat.name}</h2>
              
              <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
                <span className={`px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg ${
                  selectedSeat.role === 'faculty' ? 'bg-gradient-to-r from-purple-500 to-indigo-600' :
                  selectedSeat.gender === 'female' ? 'bg-gradient-to-r from-pink-500 to-rose-600' :
                  'bg-gradient-to-r from-[#19aaba] to-[#158c99]'
                }`}>
                  {selectedSeat.seat}
                </span>
                {selectedSeat.role === 'faculty' && (
                  <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">FACULTY</span>
                )}
                {selectedSeat.gender === 'female' ? (
                  <span className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-bold">FEMALE</span>
                ) : selectedSeat.role !== 'faculty' && (
                  <span className="px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-bold">MALE</span>
                )}
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 space-y-3 mb-6">
                <div className="flex items-center gap-3 text-left">
                  <Ship className="w-5 h-5 text-[#19aaba]" />
                  <span className="text-gray-700 font-medium">
                    {activeRoute === 'stMartinToCox' ? 'Saint Martin → Cox\'s Bazar' : 'Cox\'s Bazar → Saint Martin'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <Clock className="w-5 h-5 text-[#19aaba]" />
                  <span className="text-gray-700 font-medium">
                    {activeRoute === 'stMartinToCox' ? 'Departure: 2:46 PM' : 'Departure: 6:46 AM'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-left">
                  <Calendar className="w-5 h-5 text-[#19aaba]" />
                  <span className="text-gray-700 font-medium">
                    {activeRoute === 'stMartinToCox' ? 'Dec 10, 2025' : 'Dec 08, 2025'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedSeat(null)}
                className="w-full bg-gradient-to-r from-[#19aaba] to-[#158c99] text-white py-4 rounded-2xl font-bold hover:from-[#158c99] hover:to-[#116d77] transition-all shadow-lg hover:shadow-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShipSeatAllocationPage;
