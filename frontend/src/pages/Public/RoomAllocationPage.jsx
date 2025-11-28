import { useState } from 'react';
import { 
  Home, 
  User, 
  Users,
  CheckCircle2,
  Info,
  Download,
  Search,
  Bed,
  Building2,
  DoorOpen
} from 'lucide-react';

const RoomAllocationPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Room allocation data with bed assignments (2 beds per room, 2 people per bed)
  // Using exact pairs from bus seat allocation
  const rooms = [
    // Faculty rooms - each faculty member gets their own room with 1 bed
    { 
      id: 8, 
      number: 8, 
      beds: [
        { bedNumber: 1, occupants: [{ name: "Dr. A F M Shahab Uddin", role: "faculty", gender: "male" }] }
      ],
      type: 'faculty'
    },
    { 
      id: 9, 
      number: 9, 
      beds: [
        { bedNumber: 1, occupants: [{ name: "Sk. Shalauddin Kabir", role: "faculty", gender: "male" }] }
      ],
      type: 'faculty'
    },
    // Girls room
    { 
      id: 4, 
      number: 4, 
      beds: [
        { bedNumber: 1, occupants: [
          { name: "Anika", role: "student", gender: "female" },
          { name: "Anamika", role: "student", gender: "female" }
        ]},
        { bedNumber: 2, occupants: [
          { name: "Puspita", role: "student", gender: "female" },
          { name: "Munni", role: "student", gender: "female" }
        ]}
      ],
      type: 'female'
    },
    // Male students rooms - using exact pairs from bus allocation
    { 
      id: 1, 
      number: 1, 
      beds: [
        { bedNumber: 1, occupants: [
          { name: "Sadik", role: "student", gender: "male" },
          { name: "Takbir", role: "student", gender: "male" }
        ]},
        { bedNumber: 2, occupants: [
          { name: "Azaz", role: "student", gender: "male" },
          { name: "Arif", role: "student", gender: "male" }
        ]}
      ],
      type: 'male'
    },
    { 
      id: 2, 
      number: 2, 
      beds: [
        { bedNumber: 1, occupants: [
          { name: "Sibly", role: "student", gender: "male" },
          { name: "Noman", role: "student", gender: "male" }
        ]},
        { bedNumber: 2, occupants: [
          { name: "Tahmid", role: "student", gender: "male" },
          { name: "Rafid", role: "student", gender: "male" }
        ]}
      ],
      type: 'male'
    },
    { 
      id: 3, 
      number: 3, 
      beds: [
        { bedNumber: 1, occupants: [
          { name: "Makky", role: "student", gender: "male" },
          { name: "Durjoy", role: "student", gender: "male" }
        ]},
        { bedNumber: 2, occupants: [
          { name: "Nehal", role: "student", gender: "male" },
          { name: "Fahim", role: "student", gender: "male" }
        ]}
      ],
      type: 'male'
    },
    { 
      id: 5, 
      number: 5, 
      beds: [
        { bedNumber: 1, occupants: [
          { name: "Sayed", role: "student", gender: "male" },
          { name: "Biswajit", role: "student", gender: "male" }
        ]},
        { bedNumber: 2, occupants: [
          { name: "Ramjan", role: "student", gender: "male" },
          { name: "Abrar", role: "student", gender: "male" }
        ]}
      ],
      type: 'male'
    },
    { 
      id: 6, 
      number: 6, 
      beds: [
        { bedNumber: 1, occupants: [
          { name: "Oveshek", role: "student", gender: "male" },
          { name: "Tapu", role: "student", gender: "male" }
        ]},
        { bedNumber: 2, occupants: [
          { name: "Tanvir", role: "student", gender: "male" },
          { name: "Samit", role: "student", gender: "male" }
        ]}
      ],
      type: 'male'
    },
    { 
      id: 7, 
      number: 7, 
      beds: [
        { bedNumber: 1, occupants: [
          { name: "Limon", role: "student", gender: "male" },
          { name: "Joy", role: "student", gender: "male" }
        ]},
        { bedNumber: 2, occupants: [
          { name: "Risan", role: "student", gender: "male" },
          { name: "Rezowan", role: "student", gender: "male" }
        ]}
      ],
      type: 'male'
    }
  ];

  // Get all members from rooms
  const allMembers = rooms.flatMap(room => 
    room.beds.flatMap(bed =>
      bed.occupants.map(occupant => ({
        ...occupant,
        roomNumber: room.number,
        bedNumber: bed.bedNumber
      }))
    )
  );

  // Filter members based on search
  const filteredMembers = allMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Statistics
  const stats = {
    totalRooms: rooms.length,
    totalBeds: rooms.reduce((sum, room) => sum + room.beds.length, 0),
    totalMembers: allMembers.length,
    maleMembers: allMembers.filter(m => m.gender === 'male' && m.role === 'student').length,
    femaleMembers: allMembers.filter(m => m.gender === 'female' && m.role === 'student').length,
    faculty: allMembers.filter(m => m.role === 'faculty').length
  };

  const getRoomColor = (room) => {
    if (room.type === 'faculty') return 'from-purple-100 to-purple-200 border-purple-400';
    if (room.type === 'female') return 'from-pink-100 to-pink-200 border-pink-400';
    return 'from-blue-100 to-blue-200 border-blue-400';
  };

  const getRoomDoorColor = (room) => {
    if (room.type === 'faculty') return 'bg-purple-600';
    if (room.type === 'female') return 'bg-pink-600';
    return 'bg-[#19aaba]';
  };

  const getBedColor = (bed) => {
    if (!bed.occupants || bed.occupants.length === 0) return 'bg-gray-100 border-gray-300';
    if (bed.occupants[0].role === 'faculty') return 'bg-purple-50 border-purple-300';
    if (bed.occupants[0].gender === 'female') return 'bg-pink-50 border-pink-300';
    return 'bg-blue-50 border-blue-300';
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
              <Home className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-xs md:text-sm font-semibold">Hotel Accommodation</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 px-4">
              Room Distribution List
            </h1>
            
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-100 max-w-2xl mx-auto px-4">
              Industrial Tour 2025 • December 04-12, 2025
            </p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-3 md:p-4 border border-white/20 text-center">
              <div className="text-2xl md:text-3xl font-bold mb-1">{stats.totalRooms}</div>
              <div className="text-[10px] md:text-xs text-white/80 uppercase font-medium">Rooms</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-3 md:p-4 border border-white/20 text-center">
              <div className="text-2xl md:text-3xl font-bold mb-1">{stats.totalBeds}</div>
              <div className="text-[10px] md:text-xs text-white/80 uppercase font-medium">Beds</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-3 md:p-4 border border-white/20 text-center">
              <div className="text-2xl md:text-3xl font-bold mb-1">{stats.totalMembers}</div>
              <div className="text-[10px] md:text-xs text-white/80 uppercase font-medium">Members</div>
            </div>
            <div className="bg-blue-500/20 backdrop-blur-lg rounded-xl p-3 md:p-4 border border-blue-400/30 text-center">
              <div className="text-2xl md:text-3xl font-bold mb-1">{stats.maleMembers}</div>
              <div className="text-[10px] md:text-xs text-white/80 uppercase font-medium">Male</div>
            </div>
            <div className="bg-pink-500/20 backdrop-blur-lg rounded-xl p-3 md:p-4 border border-pink-400/30 text-center">
              <div className="text-2xl md:text-3xl font-bold mb-1">{stats.femaleMembers}</div>
              <div className="text-[10px] md:text-xs text-white/80 uppercase font-medium">Female</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6 md:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {/* Building Structure */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-2xl border-2 border-gray-300 p-4 md:p-6 lg:p-8">
                <div className="flex items-center gap-2 mb-6 md:mb-8">
                  <Building2 className="w-6 h-6 md:w-8 md:h-8 text-[#19aaba]" />
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">Hotel Building</h2>
                </div>

                {/* Building Top */}
                <div className="mb-4">
                  <div className="bg-gradient-to-b from-red-600 to-red-700 rounded-t-3xl p-2 md:p-3 text-center border-4 border-red-800">
                    <div className="text-white font-bold text-xs md:text-sm flex items-center justify-center gap-2">
                      <Home className="w-4 h-4" />
                      <span>HOTEL ROOF</span>
                    </div>
                  </div>
                </div>

                {/* Rooms Grid - Building Layout */}
                <div className="bg-gradient-to-b from-amber-50 to-amber-100 rounded-xl p-3 md:p-4 lg:p-6 border-4 border-amber-800/30 space-y-4 md:space-y-6">
                  {/* Faculty Rooms Row */}
                  <div>
                    <h3 className="text-xs md:text-sm font-bold text-purple-700 mb-2 md:mb-3 uppercase tracking-wide flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Faculty Rooms (Single Occupancy)
                    </h3>
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      {rooms.filter(r => r.type === 'faculty').map((room) => (
                        <div
                          key={room.id}
                          onClick={() => setSelectedRoom(room)}
                          className={`relative bg-gradient-to-br ${getRoomColor(room)} border-3 rounded-xl p-3 md:p-4 cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02] ${
                            selectedRoom?.id === room.id ? 'ring-4 ring-yellow-400 scale-[1.02]' : ''
                          }`}
                        >
                          {/* Room Header */}
                          <div className="flex items-center justify-between mb-3">
                            <div className={`${getRoomDoorColor(room)} text-white px-3 py-1.5 rounded-lg font-bold text-sm md:text-base shadow-lg flex items-center gap-1.5`}>
                              <DoorOpen className="w-3 h-3 md:w-4 md:h-4" />
                              <span>Room {room.number}</span>
                            </div>
                          </div>

                          {/* Single Bed */}
                          {room.beds.map((bed) => (
                            <div key={bed.bedNumber} className={`${getBedColor(bed)} border-2 rounded-lg p-2 md:p-3`}>
                              <div className="flex items-center gap-1.5 mb-2">
                                <Bed className="w-3 h-3 md:w-4 md:h-4 text-gray-600" />
                                <span className="text-[10px] md:text-xs font-bold text-gray-700">Single Bed</span>
                              </div>
                              <div className="space-y-1">
                                {bed.occupants.map((occupant, idx) => (
                                  <div key={idx} className="flex items-center gap-1.5 text-[10px] md:text-xs">
                                    <User className="w-2.5 h-2.5 md:w-3 md:h-3 text-gray-500" />
                                    <span className="text-gray-800 font-medium truncate">{occupant.name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Girls Room Row */}
                  <div>
                    <h3 className="text-xs md:text-sm font-bold text-pink-700 mb-2 md:mb-3 uppercase tracking-wide flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Girls Room
                    </h3>
                    <div className="grid grid-cols-1 gap-3 md:gap-4">
                      {rooms.filter(r => r.type === 'female').map((room) => (
                        <div
                          key={room.id}
                          onClick={() => setSelectedRoom(room)}
                          className={`relative bg-gradient-to-br ${getRoomColor(room)} border-3 rounded-xl p-3 md:p-4 cursor-pointer transition-all hover:shadow-xl hover:scale-[1.02] ${
                            selectedRoom?.id === room.id ? 'ring-4 ring-yellow-400 scale-[1.02]' : ''
                          }`}
                        >
                          {/* Room Header */}
                          <div className="flex items-center justify-between mb-3">
                            <div className={`${getRoomDoorColor(room)} text-white px-3 py-1.5 rounded-lg font-bold text-sm md:text-base shadow-lg flex items-center gap-1.5`}>
                              <DoorOpen className="w-3 h-3 md:w-4 md:h-4" />
                              <span>Room {room.number}</span>
                            </div>
                          </div>

                          {/* Beds */}
                          <div className="grid grid-cols-2 gap-2 md:gap-3">
                            {room.beds.map((bed) => (
                              <div key={bed.bedNumber} className={`${getBedColor(bed)} border-2 rounded-lg p-2 md:p-3`}>
                                <div className="flex items-center gap-1.5 mb-2">
                                  <Bed className="w-3 h-3 md:w-4 md:h-4 text-gray-600" />
                                  <span className="text-[10px] md:text-xs font-bold text-gray-700">Bed {bed.bedNumber}</span>
                                </div>
                                <div className="space-y-1">
                                  {bed.occupants.map((occupant, idx) => (
                                    <div key={idx} className="flex items-center gap-1.5 text-[10px] md:text-xs">
                                      <User className="w-2.5 h-2.5 md:w-3 md:h-3 text-gray-500" />
                                      <span className="text-gray-800 font-medium truncate">{occupant.name}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Male Students Rooms Row */}
                  <div>
                    <h3 className="text-xs md:text-sm font-bold text-blue-700 mb-2 md:mb-3 uppercase tracking-wide flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Male Students Rooms
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                      {rooms.filter(r => r.type === 'male').map((room) => (
                        <div
                          key={room.id}
                          onClick={() => setSelectedRoom(room)}
                          className={`relative bg-gradient-to-br ${getRoomColor(room)} border-3 rounded-xl p-3 md:p-4 cursor-pointer transition-all hover:shadow-xl hover:scale-105 ${
                            selectedRoom?.id === room.id ? 'ring-4 ring-yellow-400 scale-105' : ''
                          }`}
                        >
                          {/* Room Header */}
                          <div className="flex items-center justify-between mb-3">
                            <div className={`${getRoomDoorColor(room)} text-white px-2.5 py-1 rounded-lg font-bold text-xs md:text-sm shadow-lg flex items-center gap-1.5`}>
                              <DoorOpen className="w-3 h-3" />
                              <span>Room {room.number}</span>
                            </div>
                          </div>

                          {/* Beds - Side by Side */}
                          <div className="grid grid-cols-2 gap-2 md:gap-3">
                            {room.beds.map((bed) => (
                              <div key={bed.bedNumber} className={`${getBedColor(bed)} border-2 rounded-lg p-2`}>
                                <div className="flex items-center gap-1.5 mb-1.5">
                                  <Bed className="w-3 h-3 text-gray-600" />
                                  <span className="text-[10px] font-bold text-gray-700">Bed {bed.bedNumber}</span>
                                </div>
                                <div className="space-y-1">
                                  {bed.occupants.map((occupant, idx) => (
                                    <div key={idx} className="flex items-center gap-1.5 text-[10px]">
                                      <User className="w-2.5 h-2.5 text-gray-500" />
                                      <span className="text-gray-800 font-medium truncate">{occupant.name}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Building Base */}
                <div className="mt-4">
                  <div className="bg-gradient-to-t from-gray-700 to-gray-600 rounded-b-3xl p-3 md:p-4 text-center border-4 border-gray-800">
                    <span className="text-white font-bold text-xs md:text-sm">🏨 HOTEL ENTRANCE</span>
                  </div>
                </div>

                {/* Selected Room Details */}
                {selectedRoom && (
                  <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-4 md:p-5 shadow-lg">
                    <div className="flex items-start gap-3">
                      <div className={`${getRoomDoorColor(selectedRoom)} text-white w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                        <span className="text-xl md:text-2xl font-bold">{selectedRoom.number}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 mb-2 text-base md:text-lg flex items-center gap-2">
                          <Home className="w-4 h-4 md:w-5 md:h-5" />
                          Room {selectedRoom.number} Details
                        </h3>
                        <p className="text-xs md:text-sm text-gray-600 mb-3">
                          <span className="font-semibold">Type:</span> {selectedRoom.type === 'faculty' ? 'Faculty Room' : selectedRoom.type === 'female' ? 'Girls Room' : 'Male Students Room'}
                        </p>
                        <div className="space-y-3">
                          {selectedRoom.beds.map((bed) => (
                            <div key={bed.bedNumber} className={`${getBedColor(bed)} border-2 rounded-lg p-3`}>
                              <div className="flex items-center gap-2 mb-2">
                                <Bed className="w-4 h-4 text-gray-600" />
                                <span className="text-sm font-bold text-gray-800">Bed {bed.bedNumber}</span>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {bed.occupants.map((occupant, idx) => (
                                  <div key={idx} className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
                                    <User className="w-3 h-3 md:w-4 md:h-4 text-gray-500" />
                                    <span className="text-xs md:text-sm text-gray-800 font-medium truncate">{occupant.name}</span>
                                    {occupant.role === 'faculty' && (
                                      <span className="ml-auto px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-[10px] font-bold">FAC</span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Legend */}
                <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-200 p-4">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm md:text-base">
                    <Info className="w-4 h-4 text-[#19aaba]" />
                    Room Color Guide
                  </h3>
                  <div className="flex flex-wrap gap-3 md:gap-4 text-xs md:text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-blue-400 rounded"></div>
                      <span className="text-gray-600">Male Students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-gradient-to-br from-pink-100 to-pink-200 border-2 border-pink-400 rounded"></div>
                      <span className="text-gray-600">Female Students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-gradient-to-br from-purple-100 to-purple-200 border-2 border-purple-400 rounded"></div>
                      <span className="text-gray-600">Faculty</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Members List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 md:p-6 lg:sticky lg:top-24">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Users className="w-4 h-4 md:w-5 md:h-5 text-[#19aaba]" />
                    Members
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
                      placeholder="Search member..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 md:pl-10 pr-3 md:pr-4 py-2 text-xs md:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Member List */}
                <div className="space-y-2 max-h-[400px] md:max-h-[600px] overflow-y-auto">
                  {filteredMembers.map((member, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedRoom(rooms.find(r => r.number === member.roomNumber))}
                      className={`p-2.5 md:p-3 rounded-lg border-2 transition-all hover:shadow-md cursor-pointer ${
                        member.role === 'faculty'
                          ? 'border-purple-200 bg-purple-50 hover:border-purple-300'
                          : member.gender === 'female'
                          ? 'border-pink-200 bg-pink-50 hover:border-pink-300'
                          : 'border-blue-200 bg-blue-50 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`px-1.5 md:px-2 py-0.5 rounded-full text-[10px] md:text-xs font-bold ${
                              member.role === 'faculty'
                                ? 'bg-purple-200 text-purple-700'
                                : member.gender === 'female'
                                ? 'bg-pink-200 text-pink-700'
                                : 'bg-blue-200 text-blue-700'
                            }`}>
                              {member.role === 'faculty' ? 'FACULTY' : member.gender === 'female' ? 'FEMALE' : 'MALE'}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900 text-xs md:text-sm mb-1 truncate">
                            {member.name}
                          </h3>
                          <p className="text-[10px] md:text-xs text-gray-600">
                            Room {member.roomNumber}
                          </p>
                        </div>
                        <CheckCircle2 className={`w-4 h-4 md:w-5 md:h-5 flex-shrink-0 ${
                          member.role === 'faculty' ? 'text-purple-500' : member.gender === 'female' ? 'text-pink-500' : 'text-[#19aaba]'
                        }`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RoomAllocationPage;
