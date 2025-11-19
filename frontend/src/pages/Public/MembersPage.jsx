import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Search, 
  GraduationCap, 
  MapPin, 
  Calendar,
  UserCheck,
  Award,
  ArrowRight,
  User
} from 'lucide-react';

const MembersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const members = [
    { id: "200102", name: "MD. RAFID AHMMED", type: "student", gender: "male" },
    { id: "200104", name: "NAZMUS SAKIB SIBLY", type: "student", gender: "male" },
    { id: "200105", name: "ABRAR HOSSAIN", type: "student", gender: "male" },
    { id: "200107", name: "ABDULLA AL NOMAN", type: "student", gender: "male" },
    { id: "200110", name: "TAPU GHOSH", type: "student", gender: "male" },
    { id: "200111", name: "TAHMID MUNTASER KAIF", type: "student", gender: "male" },
    { id: "200114", name: "RAMJAN ALI KHA", type: "student", gender: "male" },
    { id: "200117", name: "A. K. M. S. LIMON", type: "student", gender: "male" },
    { id: "200118", name: "MOHAMMAD AZAZUL ISLAM", type: "student", gender: "male" },
    { id: "200120", name: "TARIN PROSAD GHOSH", type: "student", gender: "male" },
    { id: "200121", name: "MD. MUSHFIQUR RAHMAN", type: "student", gender: "male" },
    { id: "200122", name: "FAHIM AHMED", type: "student", gender: "male" },
    { id: "200124", name: "S. AHMAD MUSA REZOWAN", type: "student", gender: "male" },
    { id: "200126", name: "JOY KUMAR ACHARJEE", type: "student", gender: "male" },
    { id: "200132", name: "MD. SADIK MAHMUD RAIHAN", type: "student", gender: "male" },
    { id: "200133", name: "IBNUS NAHIYAN SAMIT", type: "student", gender: "male" },
    { id: "200135", name: "ANIKA TABASSUM", type: "student", gender: "female" },
    { id: "200137", name: "RISAN MAHFUZ", type: "student", gender: "male" },
    { id: "200140", name: "MD. ARAFATUZZAMAN", type: "student", gender: "male" },
    { id: "200142", name: "TANVIR MAHTAB TAFHIM", type: "student", gender: "male" },
    { id: "200145", name: "PUSPITA SARKER", type: "student", gender: "female" },
    { id: "200146", name: "BISWAJIT DEB", type: "student", gender: "male" },
    { id: "200149", name: "ARIFUL ISLAM", type: "student", gender: "male" },
    { id: "200150", name: "MUNNI KHANOM", type: "student", gender: "female" },
    { id: "200151", name: "MD. ABU SAYED", type: "student", gender: "male" },
    { id: "200152", name: "SAJID HASAN TAKBIR", type: "student", gender: "male" },
    { id: "200153", name: "ANAMIKA MARMA", type: "student", gender: "female" },
    { id: "200154", name: "OVESHEK KUNDU TOTON", type: "student", gender: "male" }
  ];

  // Filter members based on search term and filter type
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.id.includes(searchTerm);
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'male' && member.gender === 'male') ||
                         (filterType === 'female' && member.gender === 'female');
    return matchesSearch && matchesFilter;
  });

  // Statistics
  const stats = {
    total: members.length,
    male: members.filter(m => m.gender === 'male').length,
    female: members.filter(m => m.gender === 'female').length,
    faculty: 2
  };

  // Get initials from name
  const getInitials = (name) => {
    const words = name.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Get avatar gradient based on index
  const getAvatarGradient = (index) => {
    const gradients = [
      'from-[#19aaba] to-[#158c99]',
      'from-blue-500 to-blue-600',
      'from-purple-500 to-purple-600',
      'from-pink-500 to-pink-600',
      'from-green-500 to-green-600',
      'from-indigo-500 to-indigo-600',
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#19aaba] via-[#158c99] to-[#116d77] text-white py-16">
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 mb-4">
                <Users className="w-4 h-4" />
                <span className="text-sm font-semibold">Industrial Tour 2025</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-3">
                Tour Members
              </h1>
              
              <p className="text-lg text-gray-100 max-w-2xl">
                Complete list of Perceptron-13 members participating in the 9-day journey
              </p>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl px-6 py-4 border border-white/20 text-center">
                <div className="text-3xl font-bold">{stats.total}</div>
                <div className="text-sm text-gray-200">Students</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl px-6 py-4 border border-white/20 text-center">
                <div className="text-3xl font-bold">{stats.faculty}</div>
                <div className="text-sm text-gray-200">Faculty</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-8 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#19aaba] to-[#158c99] rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Students</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.male}</div>
                <div className="text-sm text-gray-600">Male</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.female}</div>
                <div className="text-sm text-gray-600">Female</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.faculty}</div>
                <div className="text-sm text-gray-600">Faculty</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Members List Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search and Filter Bar */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:border-[#19aaba] focus:ring-2 focus:ring-[#19aaba]/20 focus:outline-none transition-all"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-5 py-3 rounded-lg font-medium text-sm transition-all ${
                    filterType === 'all'
                      ? 'bg-[#19aaba] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType('male')}
                  className={`px-5 py-3 rounded-lg font-medium text-sm transition-all ${
                    filterType === 'male'
                      ? 'bg-[#19aaba] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Male
                </button>
                <button
                  onClick={() => setFilterType('female')}
                  className={`px-5 py-3 rounded-lg font-medium text-sm transition-all ${
                    filterType === 'female'
                      ? 'bg-[#19aaba] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Female
                </button>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredMembers.length}</span> of{' '}
                <span className="font-semibold text-gray-900">{members.length}</span> members
              </p>
            </div>
          </div>

          {/* Members Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredMembers.map((member, index) => (
                    <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{index + 1}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono font-semibold text-[#19aaba]">{member.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarGradient(index)} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                            {getInitials(member.name)}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{member.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          member.gender === 'male' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-pink-100 text-pink-800'
                        }`}>
                          {member.gender === 'male' ? 'Male' : 'Female'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Link
                          to={`/member/${member.id}`}
                          className="inline-flex items-center gap-1 text-sm font-medium text-[#19aaba] hover:text-[#158c99] transition-colors"
                        >
                          View Profile
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* No Results */}
          {filteredMembers.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No members found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* Faculty Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Faculty Members
            </h2>
            <p className="text-gray-600">
              Esteemed faculty members guiding us throughout this journey
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[1, 2].map((num, index) => (
                    <tr key={num} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{num}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            F{num}
                          </div>
                          <span className="text-sm font-medium text-gray-900">Faculty Member {num}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">Computer Science & Engineering</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Faculty
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MembersPage;
