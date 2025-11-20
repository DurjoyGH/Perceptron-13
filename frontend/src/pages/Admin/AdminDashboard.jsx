import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Mail, 
  Shield, 
  TrendingUp, 
  Send, 
  CheckCircle, 
  XCircle,
  Loader,
  Calendar
} from 'lucide-react';
import { getAllUsers, getUserStats, sendEmailToAll, sendEmailToSelected, updateUserRole } from '../../services/adminApi';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, admins: 0, users: 0, recentUsers: 0 });
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [emailForm, setEmailForm] = useState({
    subject: '',
    message: '',
    emailType: 'general'
  });
  const [sendingEmail, setSendingEmail] = useState(false);

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
      setUsers(usersResponse.data);
      setStats(statsResponse.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(u => u._id));
    }
  };

  const handleSendEmail = async (toAll = false) => {
    if (!emailForm.subject || !emailForm.message) {
      toast.error('Subject and message are required');
      return;
    }

    if (!toAll && selectedUsers.length === 0) {
      toast.error('Please select at least one user');
      return;
    }

    setSendingEmail(true);
    try {
      let response;
      if (toAll) {
        response = await sendEmailToAll(emailForm);
      } else {
        response = await sendEmailToSelected({ ...emailForm, userIds: selectedUsers });
      }

      toast.success(response.message);
      setEmailForm({ subject: '', message: '', emailType: 'general' });
      setSelectedUsers([]);
    } catch (error) {
      console.error('Failed to send email:', error);
      toast.error(error.response?.data?.message || 'Failed to send email');
    } finally {
      setSendingEmail(false);
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
          <p className="text-gray-600">Loading dashboard...</p>
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
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-cyan-100">Welcome back, {user?.name}!</p>
              </div>
              <button
                onClick={() => navigate('/admin/schedules')}
                className="flex items-center gap-2 bg-white text-[#19aaba] px-4 py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
              >
                <Calendar size={20} />
                <span>Manage Schedules</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={Users} title="Total Members" value={stats.total} color="#19aaba" />
          <StatCard icon={Shield} title="Admins" value={stats.admins} color="#f56565" />
          <StatCard icon={Users} title="Users" value={stats.users} color="#48bb78" />
          <StatCard icon={TrendingUp} title="Recent (30d)" value={stats.recentUsers} color="#ed8936" />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden">
          <div className="flex border-b overflow-x-auto">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-4 font-semibold whitespace-nowrap transition-all duration-200 ${
                activeTab === 'users'
                  ? 'border-b-3 border-[#19aaba] text-[#19aaba] bg-gradient-to-b from-cyan-50 to-transparent'
                  : 'text-gray-600 hover:text-[#19aaba] hover:bg-gray-50'
              }`}
            >
              Manage Users
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`px-6 py-4 font-semibold whitespace-nowrap transition-all duration-200 ${
                activeTab === 'email'
                  ? 'border-b-3 border-[#19aaba] text-[#19aaba] bg-gradient-to-b from-cyan-50 to-transparent'
                  : 'text-gray-600 hover:text-[#19aaba] hover:bg-gray-50'
              }`}
            >
              Send Email
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">All Users</h2>
                  <div className="bg-gradient-to-r from-[#19aaba] to-[#158c99] text-white px-4 py-2 rounded-lg text-sm font-semibold">
                    {users.length} total users
                  </div>
                </div>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-[#19aaba] to-[#158c99] text-white">
                      <tr>
                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Student ID</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Role</th>
                        <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {users.map((usr) => (
                        <tr key={usr._id} className="hover:bg-cyan-50 transition-colors duration-150">
                          <td className="px-4 py-4 font-medium text-gray-900">{usr.name}</td>
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
                            {usr._id !== user?.id && (
                              <button
                                onClick={() => handleUpdateRole(usr._id, usr.role === 'admin' ? 'user' : 'admin')}
                                className="text-sm text-[#19aaba] hover:text-[#158c99] font-semibold hover:underline transition-colors"
                              >
                                {usr.role === 'admin' ? 'Make User' : 'Make Admin'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'email' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Send Email to Members</h2>
                
                {/* Email Form */}
                <div className="space-y-6 mb-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Type
                    </label>
                    <select
                      value={emailForm.emailType}
                      onChange={(e) => setEmailForm({ ...emailForm, emailType: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all"
                    >
                      <option value="general">📧 General</option>
                      <option value="announcement">📢 Announcement</option>
                      <option value="reminder">⏰ Reminder</option>
                      <option value="urgent">🚨 Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={emailForm.subject}
                      onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                      placeholder="Enter email subject"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      value={emailForm.message}
                      onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                      placeholder="Enter your message here..."
                      rows="8"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all resize-none"
                    />
                  </div>
                </div>

                {/* User Selection */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <label className="block text-sm font-semibold text-gray-700">
                      Select Recipients ({selectedUsers.length} selected)
                    </label>
                    <button
                      onClick={handleSelectAll}
                      className="text-sm text-[#19aaba] hover:text-[#158c99] font-semibold hover:underline transition-colors"
                    >
                      {selectedUsers.length === users.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-lg p-4 space-y-2 bg-gray-50">
                    {users.map((usr) => (
                      <label key={usr._id} className="flex items-center gap-3 p-3 hover:bg-white rounded-lg cursor-pointer transition-all border border-transparent hover:border-[#19aaba]">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(usr._id)}
                          onChange={() => handleSelectUser(usr._id)}
                          className="w-5 h-5 text-[#19aaba] rounded focus:ring-[#19aaba] cursor-pointer"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-800">{usr.name}</p>
                            {usr.role === 'admin' && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full border border-red-200">
                                ADMIN
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{usr.email}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Send Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => handleSendEmail(false)}
                    disabled={sendingEmail || selectedUsers.length === 0}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#19aaba] to-[#158c99] text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-lg"
                  >
                    {sendingEmail ? (
                      <>
                        <Loader className="animate-spin" size={20} />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Send to Selected ({selectedUsers.length})
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleSendEmail(true)}
                    disabled={sendingEmail}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#ed8936] to-[#dd6b20] text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-lg"
                  >
                    {sendingEmail ? (
                      <>
                        <Loader className="animate-spin" size={20} />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail size={20} />
                        Send to All Members
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
