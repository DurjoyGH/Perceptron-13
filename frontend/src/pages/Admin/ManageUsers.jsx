import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Shield, 
  Loader,
  Search,
  UserCog
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAllUsers, getUserStats, updateUserRole } from '../../services/adminApi';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

const ManageUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, admins: 0, users: 0, recentUsers: 0 });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersResponse, statsResponse] = await Promise.all([
        getAllUsers(),
        getUserStats()
      ]);
      // Sort users by studentID in ascending order
      const sortedUsers = usersResponse.data.sort((a, b) => {
        return a.studentID.localeCompare(b.studentID, undefined, { numeric: true });
      });
      setUsers(sortedUsers);
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      const response = await updateUserRole(userId, newRole);
      toast.success(response.message);
      fetchData();
    } catch (error) {
      console.error('Failed to update role:', error);
      toast.error(error.response?.data?.message || 'Failed to update user role');
    }
  };

  const filteredUsers = users.filter(usr => 
    usr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usr.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usr.studentID.includes(searchTerm)
  );

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

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 hover:shadow-xl transition-shadow duration-300" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className="p-4 rounded-full" style={{ backgroundColor: `${color}15` }}>
          <Icon size={28} color={color} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4" size={48} color="#19aaba" />
          <p className="text-gray-600">Loading users...</p>
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
            <div className="flex items-center gap-3">
              <UserCog size={40} />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Manage Users</h1>
                <p className="text-cyan-100">View and manage all registered members and their roles.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={Users} title="Total Members" value={stats.total} color="#19aaba" />
          <StatCard icon={Shield} title="Admins" value={stats.admins} color="#f56565" />
          <StatCard icon={Users} title="Users" value={stats.users} color="#48bb78" />
          <StatCard icon={Users} title="Recent (30d)" value={stats.recentUsers} color="#ed8936" />
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-800">All Users</h2>
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent w-full sm:w-64"
                />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="bg-gradient-to-r from-[#19aaba] to-[#158c99] text-white px-4 py-2 rounded-lg text-sm font-semibold">
                {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'} found
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-[#19aaba] to-[#158c99] text-white">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">#</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Student ID</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Role</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                        No users found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((usr, index) => (
                      <tr key={usr._id} className="hover:bg-cyan-50 transition-colors duration-150">
                        <td className="px-4 py-4 text-sm text-gray-600">{index + 1}</td>
                        <td className="px-4 py-4">
                          <Link to={`/member/${usr.studentID}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            {usr.profilePicture?.url ? (
                              <img
                                src={usr.profilePicture.url}
                                alt={usr.name}
                                className="w-10 h-10 rounded-full object-cover flex-shrink-0 ring-2 ring-transparent hover:ring-[#19aaba] transition-all"
                              />
                            ) : (
                              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarGradient(index)} flex items-center justify-center text-white text-sm font-bold flex-shrink-0 hover:scale-105 transition-transform`}>
                                {getInitials(usr.name)}
                              </div>
                            )}
                            <span className="font-medium text-gray-900 hover:text-[#19aaba] transition-colors">{usr.name}</span>
                          </Link>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">{usr.email}</td>
                        <td className="px-4 py-4 text-sm font-mono text-gray-700">{usr.studentID}</td>
                        <td className="px-4 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            usr.role === 'admin' 
                              ? 'bg-red-100 text-red-700 border border-red-200' 
                              : 'bg-green-100 text-green-700 border border-green-200'
                          }`}>
                            {usr.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          {usr._id !== user?._id ? (
                            <button
                              onClick={() => handleUpdateRole(usr._id, usr.role === 'admin' ? 'user' : 'admin')}
                              className="text-sm text-[#19aaba] hover:text-[#158c99] font-semibold hover:underline transition-colors"
                            >
                              {usr.role === 'admin' ? 'Make User' : 'Make Admin'}
                            </button>
                          ) : (
                            <span className="text-sm text-gray-400 italic">You</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No users found matching your search.
                </div>
              ) : (
                filteredUsers.map((usr, index) => (
                  <div key={usr._id} className="p-4 hover:bg-cyan-50 transition-colors">
                    <div className="flex items-start gap-3">
                      {/* Avatar */}
                      <Link to={`/member/${usr.studentID}`} className="flex-shrink-0">
                        {usr.profilePicture?.url ? (
                          <img
                            src={usr.profilePicture.url}
                            alt={usr.name}
                            className="w-12 h-12 rounded-full object-cover ring-2 ring-transparent hover:ring-[#19aaba] transition-all"
                          />
                        ) : (
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarGradient(index)} flex items-center justify-center text-white text-sm font-bold hover:scale-105 transition-transform`}>
                            {getInitials(usr.name)}
                          </div>
                        )}
                      </Link>
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
                              {usr.name}
                            </h3>
                            <p className="text-xs text-gray-600 line-clamp-1 mb-1">
                              {usr.email}
                            </p>
                            <p className="text-xs font-mono font-semibold text-[#19aaba]">
                              {usr.studentID}
                            </p>
                          </div>
                          <span className="text-xs font-medium text-gray-500 flex-shrink-0">
                            #{index + 1}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between gap-3 mt-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            usr.role === 'admin' 
                              ? 'bg-red-100 text-red-700 border border-red-200' 
                              : 'bg-green-100 text-green-700 border border-green-200'
                          }`}>
                            {usr.role.toUpperCase()}
                          </span>
                          
                          {usr._id !== user?._id ? (
                            <button
                              onClick={() => handleUpdateRole(usr._id, usr.role === 'admin' ? 'user' : 'admin')}
                              className="text-xs font-medium text-[#19aaba] hover:text-[#158c99] transition-colors active:scale-95 px-3 py-1.5 border border-[#19aaba] rounded-lg"
                            >
                              {usr.role === 'admin' ? 'Make User' : 'Make Admin'}
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400 italic">You</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
