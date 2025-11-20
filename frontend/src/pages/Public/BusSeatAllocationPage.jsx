import { useState } from 'react';
import { 
  Bus, 
  User, 
  MapPin, 
  ArrowRight,
  Users,
  Circle,
  CheckCircle2,
  XCircle,
  Info,
  Download,
  Search
} from 'lucide-react';

const BusSeatAllocationPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeat, setSelectedSeat] = useState(null);

  // Individual passenger data (separated from pairs)
  const passengers = [
    { id: 1, name: "Faculty Member 1", role: "faculty", pair: 2, gender: "male" },
    { id: 2, name: "Faculty Member 2", role: "faculty", pair: 1, gender: "male" },
    { id: 3, name: "Anika", role: "student", pair: 4, gender: "female" },
    { id: 4, name: "Anamika", role: "student", pair: 3, gender: "female" },
    { id: 5, name: "Puspita", role: "student", pair: 6, gender: "female" },
    { id: 6, name: "Munni", role: "student", pair: 5, gender: "female" },
    { id: 7, name: "Sadik", role: "student", pair: 8, gender: "male" },
    { id: 8, name: "Takbir", role: "student", pair: 7, gender: "male" },
    { id: 9, name: "Sibly", role: "student", pair: 10, gender: "male" },
    { id: 10, name: "Noman", role: "student", pair: 9, gender: "male" },
    { id: 11, name: "Tahmid", role: "student", pair: 12, gender: "male" },
    { id: 12, name: "Rafid", role: "student", pair: 11, gender: "male" },
    { id: 13, name: "Makky", role: "student", pair: 14, gender: "male" },
    { id: 14, name: "Durjoy", role: "student", pair: 13, gender: "male" },
    { id: 15, name: "Nehal", role: "student", pair: 16, gender: "male" },
    { id: 16, name: "Fahim", role: "student", pair: 15, gender: "male" },
    { id: 17, name: "Sayed", role: "student", pair: 18, gender: "male" },
    { id: 18, name: "Biswajit", role: "student", pair: 17, gender: "male" },
    { id: 19, name: "Ramjan", role: "student", pair: 20, gender: "male" },
    { id: 20, name: "Abrar", role: "student", pair: 19, gender: "male" },
    { id: 21, name: "Oveshek", role: "student", pair: 22, gender: "male" },
    { id: 22, name: "Tapu", role: "student", pair: 21, gender: "male" },
    { id: 23, name: "Tanvir", role: "student", pair: 24, gender: "male" },
    { id: 24, name: "Samit", role: "student", pair: 23, gender: "male" },
    { id: 25, name: "Limon", role: "student", pair: 26, gender: "male" },
    { id: 26, name: "Joy", role: "student", pair: 25, gender: "male" },
    { id: 27, name: "Risan", role: "student", pair: 28, gender: "male" },
    { id: 28, name: "Rezowan", role: "student", pair: 27, gender: "male" },
    { id: 29, name: "Azaz", role: "student", pair: 30, gender: "male" },
    { id: 30, name: "Arif", role: "student", pair: 29, gender: "male" }
  ];

  // Seat allocation mapping - passengers swap seats with their pair in alternating segments
  const seatAllocationMap = {
    jasToCum: {
      C1: 2, C2: 1, C3: 1, C4: 1, B1: 3, B2: 4, B3: 5, B4: 6, 
      A1: 7, A2: 8, A3: 9, A4: 10, D1: 11, D2: 12,
      H3: 13, H4: 14, D3: 15, D4: 16, E1: 17, E2: 18,
      E3: 19, E4: 20, F1: 21, F2: 22, F3: 23, F4: 24,
      G1: 25, G2: 26, G3: 27, G4: 28, H1: 29, H2: 30
    },
    cumToCox: {
      C1: 2, C2: 1, C3: 1, C4: 1,  B1: 4, B2: 3, B3: 6, B4: 5,
      A1: 8, A2: 7, A3: 10, A4: 9, D1: 12, D2: 11,
      H3: 14, H4: 13, D3: 16, D4: 15, E1: 18, E2: 17,
      E3: 20, E4: 19, F1: 22, F2: 21, F3: 24, F4: 23,
      G1: 26, G2: 25, G3: 28, G4: 27, H1: 30, H2: 29
    },
    coxToCum: {
      C1: 2, C2: 1, C3: 1, C4: 1, B1: 3, B2: 4, B3: 5, B4: 6,
      A1: 7, A2: 8, A3: 9, A4: 10, D1: 11, D2: 12,
      H3: 13, H4: 14, D3: 15, D4: 16, E1: 17, E2: 18,
      E3: 19, E4: 20, F1: 21, F2: 22, F3: 23, F4: 24,
      G1: 25, G2: 26, G3: 27, G4: 28, H1: 29, H2: 30
    },
    cumToJas: {
      C1: 2, C2: 1, C3: 1, C4: 1, B1: 4, B2: 3, B3: 6, B4: 5,
      A1: 8, A2: 7, A3: 10, A4: 9, D1: 12, D2: 11,
      H3: 14, H4: 13, D3: 16, D4: 15, E1: 18, E2: 17,
      E3: 20, E4: 19, F1: 22, F2: 21, F3: 24, F4: 23,
      G1: 26, G2: 25, G3: 28, G4: 27, H1: 30, H2: 29
    }
  };

  // Bus layout configuration (36 seats)
  const busLayout = {
    rows: [
      { label: 'A', seats: ['A1', 'A2', null, 'A3', 'A4'] },
      { label: 'B', seats: ['B1', 'B2', null, 'B3', 'B4'] },
      { label: 'C', seats: ['C1', 'C2', null, 'C3', 'C4'] },
      { label: 'D', seats: ['D1', 'D2', null, 'D3', 'D4'] },
      { label: 'E', seats: ['E1', 'E2', null, 'E3', 'E4'] },
      { label: 'F', seats: ['F1', 'F2', null, 'F3', 'F4'] },
      { label: 'G', seats: ['G1', 'G2', null, 'G3', 'G4'] },
      { label: 'H', seats: ['H1', 'H2', null, 'H3', 'H4'] },
      { label: 'I', seats: ['I1', 'I2', 'I3', 'I4', 'I5'] } // Last row with 5 seats
    ]
  };

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

  // Get passenger's partner info
  const getPartnerInfo = (passenger, segment) => {
    if (!passenger) return null;
    const partner = passengers.find(p => p.id === passenger.pair);
    const partnerSeat = getPassengerSeat(partner?.id, segment);
    return { partner, partnerSeat };
  };

  // Current active segment (can be changed via UI)
  const [activeSegment, setActiveSegment] = useState('jasToCum');

  const segments = [
    { key: 'jasToCum', label: 'Jashore to Cumilla', shortLabel: 'JAS → CUM' },
    { key: 'cumToCox', label: 'Cumilla to Cox\'s Bazar', shortLabel: 'CUM → COX' },
    { key: 'coxToCum', label: 'Cox\'s Bazar to Cumilla', shortLabel: 'COX → CUM' },
    { key: 'cumToJas', label: 'Cumilla to Jashore', shortLabel: 'CUM → JAS' }
  ];

  // Filter allocations based on search
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#19aaba] via-[#158c99] to-[#116d77] text-white py-8 md:py-12 lg:py-16">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 md:mb-8">
            <div className="inline-flex items-center gap-1.5 md:gap-2 bg-white/20 backdrop-blur-sm px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-white/30 mb-3 md:mb-4">
              <Bus className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-xs md:text-sm font-semibold">Saudia Bus - 36 Seats</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 px-4">
              Bus Seat Allocation
            </h1>
            
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-100 max-w-2xl mx-auto px-4">
              Industrial Tour 2025 • December 04-12, 2025
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-3 md:p-4 border border-white/20 text-center">
              <div className="text-2xl md:text-3xl font-bold mb-1">36</div>
              <div className="text-[10px] md:text-xs text-white/80 uppercase font-medium">Total Seats</div>
            </div>
            <div className="bg-purple-500/20 backdrop-blur-lg rounded-xl p-3 md:p-4 border border-purple-400/30 text-center">
              <div className="text-2xl md:text-3xl font-bold mb-1">2</div>
              <div className="text-[10px] md:text-xs text-white/80 uppercase font-medium">Faculty</div>
            </div>
            <div className="bg-blue-500/20 backdrop-blur-lg rounded-xl p-3 md:p-4 border border-blue-400/30 text-center">
              <div className="text-2xl md:text-3xl font-bold mb-1">28</div>
              <div className="text-[10px] md:text-xs text-white/80 uppercase font-medium">Students</div>
            </div>
            <div className="bg-green-500/20 backdrop-blur-lg rounded-xl p-3 md:p-4 border border-green-400/30 text-center">
              <div className="text-2xl md:text-3xl font-bold mb-1">4</div>
              <div className="text-[10px] md:text-xs text-white/80 uppercase font-medium">Segments</div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Segments Selector */}
      <section className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1.5 md:gap-2 overflow-x-auto py-3 md:py-4 no-scrollbar">
            {segments.map((segment) => (
              <button
                key={segment.key}
                onClick={() => setActiveSegment(segment.key)}
                className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 lg:px-6 py-2 md:py-2.5 lg:py-3 rounded-lg text-xs md:text-sm font-medium whitespace-nowrap transition-all ${
                  activeSegment === segment.key
                    ? 'bg-[#19aaba] text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <MapPin className="w-3 h-3 md:w-4 md:h-4" />
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
            {/* Bus Seat Layout */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-2 sm:p-4 md:p-6 lg:p-8 overflow-x-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-6 gap-3 md:gap-4">
                  <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Bus className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-[#19aaba]" />
                    Seat Layout
                  </h2>
                  <div className="flex items-center gap-2 md:gap-3 text-[10px] sm:text-xs md:text-sm flex-wrap">
                    <div className="flex items-center gap-1 md:gap-2">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-purple-500 rounded"></div>
                      <span className="text-gray-600">Faculty</span>
                    </div>
                    <div className="flex items-center gap-1 md:gap-2">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-[#19aaba] rounded"></div>
                      <span className="text-gray-600">Male</span>
                    </div>
                    <div className="flex items-center gap-1 md:gap-2">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-pink-500 rounded"></div>
                      <span className="text-gray-600">Female</span>
                    </div>
                    <div className="flex items-center gap-1 md:gap-2">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-gray-100 border border-gray-300 rounded"></div>
                      <span className="text-gray-600">Empty</span>
                    </div>
                  </div>
                </div>

                {/* Bus Front */}
                <div className="mb-3 md:mb-4 lg:mb-6">
                  <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-t-xl md:rounded-t-2xl lg:rounded-t-3xl p-2 md:p-3 lg:p-4 text-center">
                    <span className="text-white font-bold text-[10px] sm:text-xs md:text-sm">🚌 DRIVER</span>
                  </div>
                </div>

                {/* Seat Grid */}
                <div className="space-y-2 sm:space-y-2.5 md:space-y-3 bg-gradient-to-b from-gray-50 to-white p-2 sm:p-3 md:p-4 lg:p-6 rounded-xl md:rounded-2xl border border-gray-200 md:border-2">
                  {busLayout.rows.map((row, rowIndex) => (
                    <div key={row.label} className="flex items-center justify-center gap-0.5 sm:gap-1 md:gap-2 lg:gap-3">
                      {/* Row Label */}
                      <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 bg-gray-200 rounded flex items-center justify-center font-bold text-gray-700 flex-shrink-0 text-[8px] sm:text-[10px] md:text-xs lg:text-base">
                        {row.label}
                      </div>

                      {/* Seats */}
                      <div className="flex gap-0.5 sm:gap-1 md:gap-1.5 lg:gap-2 flex-wrap sm:flex-nowrap">
                        {row.seats.map((seat, seatIndex) => {
                          if (seat === null) {
                            // Aisle
                            return (
                              <div key={seatIndex} className="w-2 sm:w-3 md:w-4 lg:w-6 flex items-center justify-center text-gray-400 text-[8px] sm:text-[10px] md:text-xs font-medium">
                                {rowIndex === 0 && <span className="hidden sm:inline">AISLE</span>}
                              </div>
                            );
                          }

                          const passenger = getPassengerForSeat(seat, activeSegment);
                          const seatColor = getSeatColor(seat);
                          const partnerInfo = getPartnerInfo(passenger, activeSegment);

                          return (
                            <div key={seat} className="relative">
                              <button
                                onClick={() => handleSeatClick(seat)}
                                className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded border sm:border-2 ${seatColor} font-bold transition-all hover:scale-105 active:scale-95 hover:shadow-lg flex flex-col items-center justify-center group relative ${
                                  selectedSeat?.seatNumber === seat ? 'ring-1 sm:ring-2 lg:ring-4 ring-yellow-400 scale-105' : ''
                                }`}
                              >
                                <span className="text-[6px] sm:text-[7px] md:text-[8px] lg:text-[9px] xl:text-[10px]">{seat}</span>
                                {passenger && (
                                  <>
                                    <User className="w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 lg:w-3 lg:h-3 mt-0.5" />
                                    <span className="text-[5px] sm:text-[6px] md:text-[7px] lg:text-[8px] font-semibold mt-0.5 truncate w-full px-0.5 text-center leading-tight">
                                      {passenger.name}
                                    </span>
                                  </>
                                )}
                              
                                {/* Tooltip - Hidden on mobile, visible on larger screens */}
                                {passenger && (
                                  <div className="hidden md:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1.5 bg-gray-900 text-white text-[10px] rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[100]">
                                    <div className="font-bold mb-0.5">{passenger.name}</div>
                                    <div className="text-[9px] text-gray-300">
                                      Seat: {seat} • {passenger.role === 'faculty' ? 'Faculty' : 'Student'}
                                    </div>
                                    {partnerInfo.partner && (
                                      <div className="text-[9px] text-gray-300 mt-0.5">
                                        Partner: {partnerInfo.partner.name} ({partnerInfo.partnerSeat})
                                      </div>
                                    )}
                                    {/* Arrow */}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[3px] border-r-[3px] border-t-[3px] border-transparent border-t-gray-900"></div>
                                  </div>
                                )}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bus Back */}
                <div className="mt-3 md:mt-4 lg:mt-6">
                  <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-b-xl md:rounded-b-2xl lg:rounded-b-3xl p-2 md:p-3 lg:p-4 text-center">
                    <span className="text-white font-bold text-[10px] sm:text-xs md:text-sm">EXIT 🚪</span>
                  </div>
                </div>

                {/* Selected Seat Info */}
                {selectedSeat && (
                  <div className="mt-3 md:mt-4 lg:mt-6 bg-blue-50 border-2 border-blue-200 rounded-xl p-3 md:p-4">
                    <div className="flex items-start gap-2 md:gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-blue-500">
                        <Info className="w-4 h-4 md:w-5 md:h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 mb-1 text-sm md:text-base">Seat {selectedSeat.seatNumber}</h3>
                        {selectedSeat.passenger ? (
                          <>
                            <p className="text-gray-700 mb-2 text-xs md:text-sm">
                              <span className="font-semibold">Passenger:</span> {selectedSeat.passenger.name}
                            </p>
                            <p className="text-xs md:text-sm text-gray-600 mb-2">
                              <span className="font-semibold">Role:</span>{' '}
                              <span className={`px-1.5 md:px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold ${
                                selectedSeat.passenger.role === 'faculty' 
                                  ? 'bg-purple-100 text-purple-700'
                                  : selectedSeat.passenger.gender === 'female'
                                  ? 'bg-pink-100 text-pink-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}>
                                {selectedSeat.passenger.role === 'faculty' ? 'FACULTY' : selectedSeat.passenger.gender === 'female' ? 'FEMALE' : 'MALE'}
                              </span>
                            </p>
                            {(() => {
                              const partnerInfo = getPartnerInfo(selectedSeat.passenger, activeSegment);
                              return partnerInfo.partner && (
                                <div className="mt-2 md:mt-3 p-2 md:p-3 bg-white rounded-lg border border-blue-200">
                                  <p className="text-[10px] md:text-xs font-semibold text-gray-700 mb-1">Traveling Partner:</p>
                                  <p className="text-xs md:text-sm text-gray-900 font-medium truncate">
                                    {partnerInfo.partner.name}
                                  </p>
                                  <p className="text-[10px] md:text-xs text-gray-600 mt-1">
                                    Seat: {partnerInfo.partnerSeat}
                                  </p>
                                </div>
                              );
                            })()}
                          </>
                        ) : (
                          <p className="text-gray-600 text-xs md:text-sm">This seat is currently empty for this journey segment.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Allocation List */}
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
                    const partnerInfo = getPartnerInfo(passenger, activeSegment);
                    
                    return (
                      <div
                        key={passenger.id}
                        className={`p-2.5 md:p-3 rounded-lg border-2 transition-all hover:shadow-md cursor-pointer ${
                          passenger.role === 'faculty'
                            ? 'border-purple-200 bg-purple-50 hover:border-purple-300'
                            : passenger.gender === 'female'
                            ? 'border-pink-200 bg-pink-50 hover:border-pink-300'
                            : 'border-[#19aaba]/20 bg-blue-50 hover:border-[#19aaba]/40'
                        }`}
                        onClick={() => handleSeatClick(seat)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-[10px] md:text-xs font-bold text-gray-500">#{passenger.id}</span>
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
                            <p className="text-[10px] md:text-xs text-gray-600 font-mono">
                              Seat: {seat}
                            </p>
                            {partnerInfo.partner && (
                              <p className="text-[10px] md:text-xs text-gray-500 mt-1 truncate">
                                With: {partnerInfo.partner.name} ({partnerInfo.partnerSeat})
                              </p>
                            )}
                          </div>
                          <CheckCircle2 className={`w-4 h-4 md:w-5 md:h-5 flex-shrink-0 ${
                            passenger.role === 'faculty' ? 'text-purple-500' : passenger.gender === 'female' ? 'text-pink-500' : 'text-[#19aaba]'
                          }`} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Journey Note */}
                <div className="mt-4 md:mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-3 md:p-4">
                  <div className="flex items-start gap-2">
                    <Info className="w-3 h-3 md:w-4 md:h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-[10px] md:text-xs text-gray-700 leading-relaxed">
                      <p className="font-semibold mb-1">Journey Segments:</p>
                      <p>• <strong>JAS → CUM:</strong> Jashore to Cumilla</p>
                      <p>• <strong>CUM → COX:</strong> Cumilla to Cox's Bazar</p>
                      <p>• <strong>COX → CUM:</strong> Cox's Bazar to Cumilla</p>
                      <p>• <strong>CUM → JAS:</strong> Cumilla to Jashore</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default BusSeatAllocationPage;
