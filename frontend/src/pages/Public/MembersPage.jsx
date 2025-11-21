import { useState, useEffect } from 'react';
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
  User,
  Loader2
} from 'lucide-react';
import { getAllMembers } from '../../services/userApi';
import CustomToast from '../../components/ScrollTop/ScrollTop';
import AvatarModal from '../../components/Profile/AvatarModal';

const MembersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await getAllMembers();
      setMembers(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching members:', err);
      setError('Failed to load members');
      CustomToast({
        type: 'error',
        message: 'Failed to load members. Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarClick = (member) => {
    setSelectedMember(member);
    setShowAvatarModal(true);
  };

  // Filter members based on search term and filter type
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.studentID.includes(searchTerm);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#19aaba] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#19aaba] via-[#158c99] to-[#116d77] text-white py-8 sm:py-12 md:py-16">
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/30 mb-3 sm:mb-4">
                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-semibold">Industrial Tour 2025</span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3">
                Tour Members
              </h1>
              
              <p className="text-sm sm:text-base md:text-lg text-gray-100 max-w-2xl">
                Complete list of Perceptron-13 members participating in the 9-day journey
              </p>
            </div>

            <div className="hidden lg:flex items-center gap-3 xl:gap-4">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl px-4 py-3 xl:px-6 xl:py-4 border border-white/20 text-center">
                <div className="text-2xl xl:text-3xl font-bold">{stats.total}</div>
                <div className="text-xs xl:text-sm text-gray-200">Students</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl px-4 py-3 xl:px-6 xl:py-4 border border-white/20 text-center">
                <div className="text-2xl xl:text-3xl font-bold">{stats.faculty}</div>
                <div className="text-xs xl:text-sm text-gray-200">Faculty</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-4 sm:py-6 md:py-8 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center sm:justify-center gap-3 sm:gap-6 md:gap-8">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#19aaba] to-[#158c99] rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-xs sm:text-sm text-gray-600">Total Students</div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.male}</div>
                <div className="text-xs sm:text-sm text-gray-600">Male</div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <UserCheck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.female}</div>
                <div className="text-xs sm:text-sm text-gray-600">Female</div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.faculty}</div>
                <div className="text-xs sm:text-sm text-gray-600">Faculty</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Members List Section */}
      <section className="py-6 sm:py-8 md:py-10 lg:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          {/* Search and Filter Bar */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  placeholder="Search by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:border-[#19aaba] focus:ring-2 focus:ring-[#19aaba]/20 focus:outline-none transition-all"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterType('all')}
                  className={`flex-1 sm:flex-none px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                    filterType === 'all'
                      ? 'bg-[#19aaba] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType('male')}
                  className={`flex-1 sm:flex-none px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                    filterType === 'male'
                      ? 'bg-[#19aaba] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95'
                  }`}
                >
                  Male
                </button>
                <button
                  onClick={() => setFilterType('female')}
                  className={`flex-1 sm:flex-none px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg font-medium text-xs sm:text-sm transition-all ${
                    filterType === 'female'
                      ? 'bg-[#19aaba] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95'
                  }`}
                >
                  Female
                </button>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-3 sm:mt-4">
              <p className="text-xs sm:text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredMembers.length}</span> of{' '}
                <span className="font-semibold text-gray-900">{members.length}</span> members
              </p>
            </div>
          </div>

          {/* Members Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Gender
                    </th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredMembers.map((member, index) => (
                    <tr key={member._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{index + 1}</span>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                        <span className="text-sm font-mono font-semibold text-[#19aaba]">{member.studentID}</span>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleAvatarClick(member)}
                            className="flex-shrink-0 focus:outline-none"
                          >
                            {member.profilePicture?.url ? (
                              <img
                                src={member.profilePicture.url}
                                alt={member.name}
                                className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent hover:ring-[#19aaba] transition-all cursor-pointer"
                              />
                            ) : (
                              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarGradient(index)} flex items-center justify-center text-white text-sm font-bold hover:scale-105 transition-transform cursor-pointer`}>
                                {getInitials(member.name)}
                              </div>
                            )}
                          </button>
                          <span className="text-sm font-medium text-gray-900">{member.name}</span>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          member.gender === 'male' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-pink-100 text-pink-800'
                        }`}>
                          {member.gender === 'male' ? 'Male' : 'Female'}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-right">
                        <Link
                          to={`/member/${member.studentID}`}
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

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-200">
              {filteredMembers.map((member, index) => (
                <div key={member._id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <button 
                      onClick={() => handleAvatarClick(member)}
                      className="flex-shrink-0 focus:outline-none"
                    >
                      {member.profilePicture?.url ? (
                        <img
                          src={member.profilePicture.url}
                          alt={member.name}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-transparent hover:ring-[#19aaba] transition-all cursor-pointer"
                        />
                      ) : (
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarGradient(index)} flex items-center justify-center text-white text-sm font-bold hover:scale-105 transition-transform cursor-pointer`}>
                          {getInitials(member.name)}
                        </div>
                      )}
                    </button>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
                            {member.name}
                          </h3>
                          <p className="text-xs font-mono font-semibold text-[#19aaba]">
                            {member.studentID}
                          </p>
                        </div>
                        <span className="text-xs font-medium text-gray-500 flex-shrink-0">
                          #{index + 1}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between gap-3 mt-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          member.gender === 'male' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-pink-100 text-pink-800'
                        }`}>
                          {member.gender === 'male' ? 'Male' : 'Female'}
                        </span>
                        
                        <Link
                          to={`/member/${member.studentID}`}
                          className="inline-flex items-center gap-1 text-xs font-medium text-[#19aaba] hover:text-[#158c99] transition-colors active:scale-95"
                        >
                          View Profile
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* No Results */}
          {filteredMembers.length === 0 && (
            <div className="text-center py-12 sm:py-16">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 rounded-full mb-3 sm:mb-4">
                <Search className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No members found</h3>
              <p className="text-sm sm:text-base text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* Faculty Section */}
      <section className="py-6 sm:py-8 md:py-10 lg:py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
              Faculty Members
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Esteemed faculty members guiding us throughout this journey
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[1, 2].map((num, index) => (
                    <tr key={num} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">{num}</span>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            F{num}
                          </div>
                          <span className="text-sm font-medium text-gray-900">Faculty Member {num}</span>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">Computer Science & Engineering</span>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Faculty
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-200">
              {[1, 2].map((num, index) => (
                <div key={num} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      F{num}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 mb-1">
                            Faculty Member {num}
                          </h3>
                          <p className="text-xs text-gray-600 line-clamp-1">
                            Computer Science & Engineering
                          </p>
                        </div>
                        <span className="text-xs font-medium text-gray-500 flex-shrink-0">
                          #{num}
                        </span>
                      </div>
                      
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Faculty
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Avatar Modal */}
      <AvatarModal 
        user={selectedMember}
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
      />
    </div>
  );
};

export default MembersPage;
