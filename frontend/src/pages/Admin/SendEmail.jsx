import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Send, 
  Loader,
  Search,
  CheckSquare,
  Square
} from 'lucide-react';
import { getAllUsers, sendEmailToAll, sendEmailToSelected } from '../../services/adminApi';
import { toast } from 'sonner';

const SendEmail = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [emailForm, setEmailForm] = useState({
    subject: '',
    message: '',
    emailType: 'general'
  });
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers();
      // Sort users by studentID in ascending order
      const sortedUsers = response.data.sort((a, b) => {
        return a.studentID.localeCompare(b.studentID, undefined, { numeric: true });
      });
      setUsers(sortedUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
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
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u._id));
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

  const filteredUsers = users.filter(usr => 
    usr.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usr.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usr.studentID.includes(searchTerm)
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
              <Mail size={40} />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Send Email</h1>
                <p className="text-cyan-100">Send emails to all members or selected recipients.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Email Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Compose Email</h2>
            
            <div className="space-y-6">
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
                  rows="10"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Send Buttons */}
              <div className="space-y-3 pt-4">
                <button
                  onClick={() => handleSendEmail(false)}
                  disabled={sendingEmail || selectedUsers.length === 0}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#19aaba] to-[#158c99] text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-lg"
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
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#ed8936] to-[#dd6b20] text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-lg"
                >
                  {sendingEmail ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail size={20} />
                      Send to All Members ({users.length})
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* User Selection */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Select Recipients</h2>
              <div className="bg-gradient-to-r from-[#19aaba] to-[#158c99] text-white px-4 py-2 rounded-lg text-sm font-semibold">
                {selectedUsers.length} selected
              </div>
            </div>

            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                />
              </div>
            </div>

            {/* Select All */}
            <div className="mb-4 flex items-center justify-between">
              <button
                onClick={handleSelectAll}
                className="flex items-center gap-2 text-[#19aaba] hover:text-[#158c99] font-semibold transition-colors"
              >
                {selectedUsers.length === filteredUsers.length ? (
                  <>
                    <CheckSquare size={20} />
                    Deselect All
                  </>
                ) : (
                  <>
                    <Square size={20} />
                    Select All
                  </>
                )}
              </button>
              <span className="text-sm text-gray-600">
                {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
              </span>
            </div>

            {/* User List */}
            <div className="max-h-[600px] overflow-y-auto border border-gray-200 rounded-lg p-4 space-y-2 bg-gray-50">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No users found matching your search.
                </div>
              ) : (
                filteredUsers.map((usr) => (
                  <label 
                    key={usr._id} 
                    className="flex items-center gap-3 p-3 hover:bg-white rounded-lg cursor-pointer transition-all border border-transparent hover:border-[#19aaba]"
                  >
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
                      <p className="text-xs text-gray-500 font-mono">{usr.studentID}</p>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendEmail;
