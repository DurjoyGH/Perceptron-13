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
  Waves
} from 'lucide-react';

const ShipSeatAllocationPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeat, setSelectedSeat] = useState(null);

  // Individual passenger data (31 people total)
  const passengers = [
    { id: 1, name: "Faculty Member 1", role: "faculty", gender: "male" },
    { id: 2, name: "Faculty Member 2", role: "faculty", gender: "male" },
    { id: 3, name: "Faculty Member 3", role: "faculty", gender: "female" },
    { id: 4, name: "Anika", role: "student", gender: "female" },
    { id: 5, name: "Anamika", role: "student", gender: "female" },
    { id: 6, name: "Puspita", role: "student", gender: "female" },
    { id: 7, name: "Munni", role: "student", gender: "female" },
    { id: 8, name: "Sadik", role: "student", gender: "male" },
    { id: 9, name: "Takbir", role: "student", gender: "male" },
    { id: 10, name: "Sibly", role: "student", gender: "male" },
    { id: 11, name: "Noman", role: "student", gender: "male" },
    { id: 12, name: "Tahmid", role: "student", gender: "male" },
    { id: 13, name: "Rafid", role: "student", gender: "male" },
    { id: 14, name: "Makky", role: "student", gender: "male" },
    { id: 15, name: "Durjoy", role: "student", gender: "male" },
    { id: 16, name: "Nehal", role: "student", gender: "male" },
    { id: 17, name: "Fahim", role: "student", gender: "male" },
    { id: 18, name: "Sayed", role: "student", gender: "male" },
    { id: 19, name: "Biswajit", role: "student", gender: "male" },
    { id: 20, name: "Ramjan", role: "student", gender: "male" },
    { id: 21, name: "Abrar", role: "student", gender: "male" },
    { id: 22, name: "Oveshek", role: "student", gender: "male" },
    { id: 23, name: "Tapu", role: "student", gender: "male" },
    { id: 24, name: "Tanvir", role: "student", gender: "male" },
    { id: 25, name: "Samit", role: "student", gender: "male" },
    { id: 26, name: "Limon", role: "student", gender: "male" },
    { id: 27, name: "Joy", role: "student", gender: "male" },
    { id: 28, name: "Risan", role: "student", gender: "male" },
    { id: 29, name: "Rezowan", role: "student", gender: "male" },
    { id: 30, name: "Azaz", role: "student", gender: "male" },
    { id: 31, name: "Arif", role: "student", gender: "male" }
  ];

  // Ship deck layout - Saint Martin Ship (simulating a ferry deck with rows of seats)
  // Layout: Left side (L), Center (C), Right side (R) with aisles
  const shipLayout = {
    sections: [
      {
        name: 'Front Deck',
        rows: [
          { label: '1', seats: ['1L1', '1L2', null, '1C1', '1C2', '1C3', null, '1R1', '1R2'] },
          { label: '2', seats: ['2L1', '2L2', null, '2C1', '2C2', '2C3', null, '2R1', '2R2'] },
          { label: '3', seats: ['3L1', '3L2', null, '3C1', '3C2', '3C3', null, '3R1', '3R2'] }
        ]
      },
      {
        name: 'Middle Deck',
        rows: [
          { label: '4', seats: ['4L1', '4L2', null, '4C1', '4C2', '4C3', null, '4R1', '4R2'] },
          { label: '5', seats: ['5L1', '5L2', null, '5C1', '5C2', '5C3', null, '5R1', '5R2'] }
        ]
      },
      {
        name: 'Back Deck',
        rows: [
          { label: '6', seats: ['6L1', '6L2', null, '6C1', '6C2', '6C3', null, '6R1', '6R2'] },
          { label: '7', seats: ['7L1', '7L2', null, '7C1', '7C2', '7C3', null, '7R1', '7R2'] }
        ]
      }
    ]
  };

  // Seat allocation for different journey segments
  const seatAllocationMap = {
    coxToStMartin: {
      // Front Deck - Faculty and Female Students
      '1L1': 1, '1L2': 2, '1C1': 3, '1C2': 4, '1C3': 5, '1R1': 6, '1R2': 7,
      
      // Row 2-3 - Male Students
      '2L1': 8, '2L2': 9, '2C1': 10, '2C2': 11, '2C3': 12, '2R1': 13, '2R2': 14,
      '3L1': 15, '3L2': 16, '3C1': 17, '3C2': 18, '3C3': 19, '3R1': 20, '3R2': 21,
      
      // Middle Deck - Male Students
      '4L1': 22, '4L2': 23, '4C1': 24, '4C2': 25, '4C3': 26, '4R1': 27, '4R2': 28,
      
      // Back Deck - Remaining
      '5L1': 29, '5L2': 30, '5C1': 31
    },
    stMartinToCox: {
      // Swap some seats for return journey
      '1L1': 2, '1L2': 1, '1C1': 3, '1C2': 5, '1C3': 4, '1R1': 7, '1R2': 6,
      
      '2L1': 9, '2L2': 8, '2C1': 11, '2C2': 10, '2C3': 13, '2R1': 12, '2R2': 14,
      '3L1': 16, '3L2': 15, '3C1': 18, '3C2': 17, '3C3': 20, '3R1': 19, '3R2': 21,
      
      '4L1': 23, '4L2': 22, '4C1': 25, '4C2': 24, '4C3': 27, '4R1': 26, '4R2': 28,
      
      '5L1': 30, '5L2': 29, '5C1': 31
    }
  };

  // Current active segment
  const [activeSegment, setActiveSegment] = useState('coxToStMartin');

  const segments = [
    { key: 'coxToStMartin', label: 'Cox\'s Bazar to Saint Martin\'s', shortLabel: 'COX → ST.MARTIN' },
    { key: 'stMartinToCox', label: 'Saint Martin\'s to Cox\'s Bazar', shortLabel: 'ST.MARTIN → COX' }
  ];

  // Get passenger for a seat in a specific journey segment
  const getPassengerForSeat = (seatNumber, segment) => {
    const passengerId = seatAllocationMap[segment][seatNumber];
    return passengerId ? passengers.find(p => p.id === passengerId) : null;
  };

  // Get passenger's seat for a specific segment
  const getPassengerSeat = (passengerId, segment) => {
    const entry = Object.entries(seatAllocationMap[segment]).find(([_, id]) => id === passengerId);
    return entry ? entry[0] : null;
  };

  // Filter passengers based on search
  const filteredPassengers = passengers.filter(passenger =>
    passenger.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get seat color based on allocation
  const getSeatColor = (seatNumber) => {
    const passenger = getPassengerForSeat(seatNumber, activeSegment);
    if (!passenger) return 'bg-gray-100 border-gray-300 text-gray-400';
    if (passenger.role === 'faculty') return 'bg-purple-500 border-purple-600 text-white';
    if (passenger.gender === 'female') return 'bg-pink-500 border-pink-600 text-white';
    return 'bg-[#19aaba] border-[#158c99] text-white';
  };

  const handleSeatClick = (seatNumber) => {
    const passenger = getPassengerForSeat(seatNumber, activeSegment);
    setSelectedSeat({ seatNumber, passenger });
  };

  // Statistics
  const stats = {
    totalSeats: 49,
    occupiedSeats: 31,
    faculty: passengers.filter(p => p.role === 'faculty').length,
    students: passengers.filter(p => p.role === 'student').length,
    male: passengers.filter(p => p.gender === 'male').length,
    female: passengers.filter(p => p.gender === 'female').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#19aaba] via-[#158c99] to-[#116d77] text-white py-8 md:py-12 lg:py-16">
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center gap-1.5 md:gap-2 bg-white/20 backdrop-blur-sm px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-white/30 mb-3 md:mb-4">
              <Ship className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-xs md:text-sm font-semibold">Ship Ferry - Saint Martin Express</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 px-4">
              Ship Seat Allocation
            </h1>
            
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-100 max-w-2xl mx-auto px-4">
              Saint Martin's Island Journey • December 08-10, 2025
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-3 md:p-4 border border-white/20 text-center">
              <div className="text-2xl md:text-3xl font-bold mb-1">{stats.totalSeats}</div>
              <div className="text-[10px] md:text-xs text-white/80 uppercase font-medium">Total Seats</div>
            </div>
            <div className="bg-green-500/20 backdrop-blur-lg rounded-xl p-3 md:p-4 border border-green-400/30 text-center">
              <div className="text-2xl md:text-3xl font-bold mb-1">{stats.occupiedSeats}</div>
              <div className="text-[10px] md:text-xs text-white/80 uppercase font-medium">Occupied</div>
            </div>
            <div className="bg-purple-500/20 backdrop-blur-lg rounded-xl p-3 md:p-4 border border-purple-400/30 text-center">
              <div className="text-2xl md:text-3xl font-bold mb-1">{stats.faculty}</div>
              <div className="text-[10px] md:text-xs text-white/80 uppercase font-medium">Faculty</div>
            </div>
            <div className="bg-blue-500/20 backdrop-blur-lg rounded-xl p-3 md:p-4 border border-blue-400/30 text-center">
              <div className="text-2xl md:text-3xl font-bold mb-1">{stats.students}</div>
              <div className="text-[10px] md:text-xs text-white/80 uppercase font-medium">Students</div>
            </div>
            <div className="bg-cyan-500/20 backdrop-blur-lg rounded-xl p-3 md:p-4 border border-cyan-400/30 text-center">
              <div className="text-2xl md:text-3xl font-bold mb-1">{stats.male}</div>
              <div className="text-[10px] md:text-xs text-white/80 uppercase font-medium">Male</div>
            </div>
            <div className="bg-pink-500/20 backdrop-blur-lg rounded-xl p-3 md:p-4 border border-pink-400/30 text-center">
              <div className="text-2xl md:text-3xl font-bold mb-1">{stats.female}</div>
              <div className="text-[10px] md:text-xs text-white/80 uppercase font-medium">Female</div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Segments Selector */}
      <section className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 md:gap-3 overflow-x-auto py-3 md:py-4 no-scrollbar">
            {segments.map((segment) => (
              <button
                key={segment.key}
                onClick={() => setActiveSegment(segment.key)}
                className={`flex items-center gap-1.5 md:gap-2 px-4 md:px-6 lg:px-8 py-2 md:py-2.5 lg:py-3 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap transition-all ${
                  activeSegment === segment.key
                    ? 'bg-[#19aaba] text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Anchor className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden lg:inline">{segment.label}</span>
                <span className="lg:hidden">{segment.shortLabel}</span>
                <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 md:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {/* Ship Deck Layout */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-b from-blue-100 to-cyan-50 rounded-2xl md:rounded-3xl shadow-2xl border-2 md:border-4 border-blue-300 p-2 sm:p-4 md:p-6 lg:p-8 overflow-x-auto">
                {/* Ship Front */}
                <div className="mb-4 md:mb-6">
                  <div className="bg-gradient-to-b from-blue-600 to-blue-700 rounded-t-[2rem] md:rounded-t-[3rem] p-2 md:p-3 lg:p-4 text-center border-2 md:border-4 border-blue-800 relative">
                    <Anchor className="absolute left-1/2 -translate-x-1/2 -top-6 md:-top-8 w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 text-blue-600" />
                    <div className="text-white font-bold text-[10px] sm:text-xs md:text-sm flex items-center justify-center gap-1 md:gap-2 mt-2 md:mt-4">
                      <Ship className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" />
                      <span>SHIP BOW (FRONT)</span>
                      <Ship className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-6 gap-3 md:gap-4">
                  <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Ship className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-[#19aaba]" />
                    Deck Layout
                  </h2>
                  <div className="flex items-center gap-2 md:gap-3 text-[10px] sm:text-xs md:text-sm flex-wrap">
                    <div className="flex items-center gap-1 md:gap-2">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-purple-500 rounded"></div>
                      <span className="text-gray-700">Faculty</span>
                    </div>
                    <div className="flex items-center gap-1 md:gap-2">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-[#19aaba] rounded"></div>
                      <span className="text-gray-700">Male</span>
                    </div>
                    <div className="flex items-center gap-1 md:gap-2">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-pink-500 rounded"></div>
                      <span className="text-gray-700">Female</span>
                    </div>
                    <div className="flex items-center gap-1 md:gap-2">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-gray-100 border border-gray-300 rounded"></div>
                      <span className="text-gray-700">Empty</span>
                    </div>
                  </div>
                </div>

                {/* Ship Deck Sections */}
                <div className="space-y-3 sm:space-y-4 md:space-y-6 bg-white/50 backdrop-blur-sm rounded-lg md:rounded-xl lg:rounded-2xl p-2 sm:p-3 md:p-4 lg:p-6 border border-blue-200">
                  {shipLayout.sections.map((section, sectionIdx) => (
                    <div key={sectionIdx} className="space-y-2 sm:space-y-2.5 md:space-y-3">
                      {/* Section Header */}
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-1 sm:py-1.5 md:py-2 px-2 sm:px-3 md:px-4 rounded-md md:rounded-lg shadow-md">
                        <h3 className="text-[10px] sm:text-xs md:text-sm lg:text-base font-bold text-center">{section.name}</h3>
                      </div>

                      {/* Seat Rows */}
                      {section.rows.map((row, rowIdx) => (
                        <div key={rowIdx} className="flex items-center gap-0.5 sm:gap-1 md:gap-2">
                          {/* Row Label */}
                          <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-blue-600 text-white rounded flex items-center justify-center font-bold text-[8px] sm:text-[10px] md:text-xs lg:text-sm flex-shrink-0">
                            {row.label}
                          </div>
                          
                          {/* Seats */}
                          <div className="flex-1 flex items-center justify-center gap-0.5 sm:gap-1 md:gap-1.5 flex-wrap sm:flex-nowrap">
                            {row.seats.map((seat, seatIdx) => (
                              seat === null ? (
                                <div key={seatIdx} className="w-2 sm:w-3 md:w-4 lg:w-6 h-8 sm:h-10 md:h-12 lg:h-14 flex-shrink-0" /> // Aisle
                              ) : (
                                <div key={seatIdx} className="relative">
                                  <button
                                    onClick={() => handleSeatClick(seat)}
                                    className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded border sm:border-2 font-bold transition-all hover:scale-105 active:scale-95 hover:shadow-lg flex flex-col items-center justify-center group relative ${getSeatColor(seat)} ${
                                      selectedSeat?.seatNumber === seat ? 'ring-1 sm:ring-2 ring-yellow-400 scale-105' : ''
                                    }`}
                                  >
                                    <span className="text-[6px] sm:text-[7px] md:text-[8px] lg:text-[9px]">{seat.replace(/^\d/, '')}</span>
                                    {(() => {
                                      const passenger = getPassengerForSeat(seat, activeSegment);
                                      if (passenger) {
                                        return (
                                          <>
                                            <User className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3 mt-0.5" />
                                            <span className="text-[5px] sm:text-[6px] md:text-[7px] lg:text-[8px] font-semibold mt-0.5 truncate w-full px-0.5 text-center leading-tight">
                                              {passenger.name}
                                            </span>
                                          </>
                                        );
                                      }
                                      return null;
                                    })()}

                                    {/* Tooltip - Hidden on mobile, visible on hover for larger screens */}
                                    {(() => {
                                      const passenger = getPassengerForSeat(seat, activeSegment);
                                      if (passenger) {
                                        return (
                                          <div className="hidden md:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1.5 bg-gray-900 text-white text-[10px] rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[100]">
                                            <div className="font-bold mb-0.5">{passenger.name}</div>
                                            <div className="text-[9px] text-gray-300">
                                              Seat: {seat} • {passenger.role === 'faculty' ? 'Faculty' : 'Student'}
                                            </div>
                                            <div className="text-[9px] text-gray-300">
                                              {passenger.gender === 'male' ? 'Male' : 'Female'}
                                            </div>
                                            {/* Arrow */}
                                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[3px] border-r-[3px] border-t-[3px] border-transparent border-t-gray-900"></div>
                                          </div>
                                        );
                                      }
                                      return null;
                                    })()}
                                  </button>
                                </div>
                              )
                            ))}
                          </div>

                          {/* Row Label (Right) */}
                          <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 bg-blue-600 text-white rounded flex items-center justify-center font-bold text-[8px] sm:text-[10px] md:text-xs lg:text-sm flex-shrink-0">
                            {row.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Ship Back */}
                <div className="mt-4 md:mt-6">
                  <div className="bg-gradient-to-t from-blue-600 to-blue-700 rounded-b-[2rem] md:rounded-b-[3rem] p-2 md:p-3 lg:p-4 text-center border-2 md:border-4 border-blue-800">
                    <span className="text-white font-bold text-[10px] sm:text-xs md:text-sm flex items-center justify-center gap-1 md:gap-2">
                      <Waves className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" />
                      SHIP STERN (BACK)
                      <Waves className="w-3 h-3 md:w-4 md:h-4 lg:w-5 lg:h-5" />
                    </span>
                  </div>
                </div>

                {/* Selected Seat Info */}
                {selectedSeat && selectedSeat.passenger && (
                  <div className="mt-4 md:mt-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-xl p-3 md:p-4 lg:p-5 shadow-lg">
                    <div className="flex items-start gap-2 md:gap-3">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                        selectedSeat.passenger.role === 'faculty' 
                          ? 'bg-purple-500' 
                          : selectedSeat.passenger.gender === 'female' 
                          ? 'bg-pink-500' 
                          : 'bg-[#19aaba]'
                      } text-white`}>
                        <User className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 mb-1 text-sm sm:text-base md:text-lg">
                          {selectedSeat.passenger.name}
                        </h3>
                        <div className="flex flex-wrap gap-1.5 md:gap-2 text-[10px] sm:text-xs md:text-sm text-gray-600">
                          <span className={`px-1.5 md:px-2 py-0.5 md:py-1 rounded-full font-medium ${
                            selectedSeat.passenger.role === 'faculty'
                              ? 'bg-purple-100 text-purple-700'
                              : selectedSeat.passenger.gender === 'female'
                              ? 'bg-pink-100 text-pink-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {selectedSeat.passenger.role === 'faculty' ? 'Faculty' : 'Student'}
                          </span>
                          <span className="px-1.5 md:px-2 py-0.5 md:py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
                            Seat: {selectedSeat.seatNumber}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Legend */}
                <div className="mt-4 md:mt-6 bg-white rounded-lg md:rounded-xl shadow-lg border border-gray-200 p-3 md:p-4">
                  <h3 className="font-bold text-gray-900 mb-2 md:mb-3 flex items-center gap-1.5 md:gap-2 text-xs sm:text-sm md:text-base">
                    <Info className="w-3 h-3 md:w-4 md:h-4 text-[#19aaba]" />
                    Deck Information
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 text-[10px] sm:text-xs md:text-sm text-gray-600">
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <span className="font-semibold">L:</span> Left Side
                    </div>
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <span className="font-semibold">C:</span> Center
                    </div>
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <span className="font-semibold">R:</span> Right Side
                    </div>
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <span className="font-semibold">Gap:</span> Aisle
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Passenger List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 md:p-6 lg:sticky lg:top-24">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Users className="w-4 h-4 md:w-5 md:h-5 text-[#19aaba]" />
                    Passengers
                  </h2>
                  <button className="text-[#19aaba] hover:text-[#158c99] transition-colors">
                    <Download className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>

                {/* Search */}
                <div className="mb-3 md:mb-4">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 md:w-4 md:h-4 absolute left-2.5 md:left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search passenger..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 md:pl-10 pr-3 md:pr-4 py-2 text-xs md:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Passenger List */}
                <div className="space-y-2 max-h-[400px] md:max-h-[600px] overflow-y-auto">
                  {filteredPassengers.map((passenger) => {
                    const seat = getPassengerSeat(passenger.id, activeSegment);
                    return (
                      <div
                        key={passenger.id}
                        onClick={() => seat && handleSeatClick(seat)}
                        className={`p-2.5 md:p-3 rounded-lg border-2 transition-all hover:shadow-md cursor-pointer ${
                          passenger.role === 'faculty'
                            ? 'border-purple-200 bg-purple-50 hover:border-purple-300'
                            : passenger.gender === 'female'
                            ? 'border-pink-200 bg-pink-50 hover:border-pink-300'
                            : 'border-blue-200 bg-blue-50 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className={`px-1.5 md:px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold ${
                                passenger.role === 'faculty'
                                  ? 'bg-purple-200 text-purple-700'
                                  : passenger.gender === 'female'
                                  ? 'bg-pink-200 text-pink-700'
                                  : 'bg-blue-200 text-blue-700'
                              }`}>
                                {passenger.role === 'faculty' ? 'FACULTY' : passenger.gender === 'female' ? 'FEMALE' : 'MALE'}
                              </span>
                            </div>
                            <h3 className="font-semibold text-gray-900 text-xs md:text-sm mb-1 truncate">
                              {passenger.name}
                            </h3>
                            <p className="text-[10px] md:text-xs text-gray-600">
                              {seat ? `Seat: ${seat}` : 'Not Assigned'}
                            </p>
                          </div>
                          <CheckCircle2 className={`w-4 h-4 md:w-5 md:h-5 flex-shrink-0 ${
                            passenger.role === 'faculty' ? 'text-purple-500' : passenger.gender === 'female' ? 'text-pink-500' : 'text-[#19aaba]'
                          }`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShipSeatAllocationPage;
