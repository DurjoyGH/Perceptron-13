import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Send, 
  Loader,
  Search,
  CheckSquare,
  Square,
  Users,
  Shield,
  Plus,
  Settings,
  Trash2,
  Star,
  Eye,
  EyeOff,
  Edit,
  X
} from 'lucide-react';
import { 
  getAllUsers, 
  sendEmailToAll, 
  sendEmailToSelected,
  getSenderEmails,
  addSenderEmail,
  updateSenderEmail,
  setDefaultSenderEmail,
  removeDefaultSenderEmail,
  deleteSenderEmail
} from '../../services/adminApi';
import { toast } from 'sonner';
import ConfirmModal from '../../components/common/ConfirmModal';

const SendEmail = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [emailForm, setEmailForm] = useState({
    subject: '',
    message: ''
  });
  const [sendingEmail, setSendingEmail] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  // Sender email states
  const [senderEmails, setSenderEmails] = useState([]);
  const [selectedSenderEmail, setSelectedSenderEmail] = useState('');
  const [showAddSenderModal, setShowAddSenderModal] = useState(false);
  const [showManageSenderModal, setShowManageSenderModal] = useState(false);
  const [showEditSenderModal, setShowEditSenderModal] = useState(false);
  const [editingSender, setEditingSender] = useState(null);
  const [senderForm, setSenderForm] = useState({
    displayName: '',
    email: '',
    password: '',
    smtpHost: 'smtp.gmail.com',
    smtpPort: 465,
    isDefault: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [addingSenderEmail, setAddingSenderEmail] = useState(false);
  const [updatingSenderEmail, setUpdatingSenderEmail] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchSenderEmails();
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

  const fetchSenderEmails = async () => {
    try {
      const response = await getSenderEmails();
      setSenderEmails(response.data);
      // Auto-select default sender email
      const defaultEmail = response.data.find(email => email.isDefault);
      if (defaultEmail) {
        setSelectedSenderEmail(defaultEmail._id);
      }
    } catch (error) {
      console.error('Failed to fetch sender emails:', error);
      toast.error('Failed to load sender emails');
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

  const handleSelectAllUsers = () => {
    const userIds = filteredUsers.filter(u => u.role === 'user').map(u => u._id);
    setSelectedUsers(userIds);
  };

  const handleSelectAllAdmins = () => {
    const adminIds = filteredUsers.filter(u => u.role === 'admin').map(u => u._id);
    setSelectedUsers(adminIds);
  };

  const handleSendEmailClick = () => {
    if (!emailForm.subject || !emailForm.message) {
      toast.error('Subject and message are required');
      return;
    }

    if (selectedUsers.length === 0) {
      toast.error('Please select at least one user');
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmSendEmail = async () => {
    setSendingEmail(true);
    try {
      const response = await sendEmailToSelected({ 
        ...emailForm, 
        userIds: selectedUsers,
        senderEmailId: selectedSenderEmail
      });
      toast.success(response.message);
      setEmailForm({ subject: '', message: '' });
      setSelectedUsers([]);
      setShowConfirmModal(false);
    } catch (error) {
      console.error('Failed to send email:', error);
      toast.error(error.response?.data?.message || 'Failed to send email');
    } finally {
      setSendingEmail(false);
    }
  };

  const handleAddSenderEmail = async () => {
    if (!senderForm.displayName || !senderForm.email || !senderForm.password) {
      toast.error('Display name, email, and password are required');
      return;
    }

    setAddingSenderEmail(true);
    try {
      const response = await addSenderEmail(senderForm);
      toast.success(response.message);
      setSenderForm({
        displayName: '',
        email: '',
        password: '',
        smtpHost: 'smtp.gmail.com',
        smtpPort: 465,
        isDefault: false
      });
      setShowAddSenderModal(false);
      fetchSenderEmails();
    } catch (error) {
      console.error('Failed to add sender email:', error);
      toast.error(error.response?.data?.message || 'Failed to add sender email');
    } finally {
      setAddingSenderEmail(false);
    }
  };

  const handleEditSender = (sender) => {
    setEditingSender(sender);
    setSenderForm({
      displayName: sender.displayName,
      email: sender.email,
      password: '', // Don't populate password for security
      smtpHost: sender.smtpHost,
      smtpPort: sender.smtpPort,
      isDefault: sender.isDefault
    });
    setShowManageSenderModal(false);
    setShowEditSenderModal(true);
  };

  const handleUpdateSenderEmail = async () => {
    if (!senderForm.displayName || !senderForm.email) {
      toast.error('Display name and email are required');
      return;
    }

    setUpdatingSenderEmail(true);
    try {
      // Only send password if it was changed
      const updateData = {
        displayName: senderForm.displayName,
        email: senderForm.email,
        smtpHost: senderForm.smtpHost,
        smtpPort: senderForm.smtpPort
      };
      
      if (senderForm.password) {
        updateData.password = senderForm.password;
      }

      const response = await updateSenderEmail(editingSender._id, updateData);
      toast.success(response.message);
      setSenderForm({
        displayName: '',
        email: '',
        password: '',
        smtpHost: 'smtp.gmail.com',
        smtpPort: 465,
        isDefault: false
      });
      setShowEditSenderModal(false);
      setEditingSender(null);
      fetchSenderEmails();
    } catch (error) {
      console.error('Failed to update sender email:', error);
      toast.error(error.response?.data?.message || 'Failed to update sender email');
    } finally {
      setUpdatingSenderEmail(false);
    }
  };

  const handleSetDefaultSender = async (senderEmailId) => {
    try {
      const response = await setDefaultSenderEmail(senderEmailId);
      toast.success(response.message);
      fetchSenderEmails();
    } catch (error) {
      console.error('Failed to set default sender:', error);
      toast.error(error.response?.data?.message || 'Failed to set default sender');
    }
  };

  const handleRemoveDefaultSender = async (senderEmailId) => {
    try {
      const response = await removeDefaultSenderEmail(senderEmailId);
      toast.success(response.message);
      fetchSenderEmails();
    } catch (error) {
      console.error('Failed to remove default status:', error);
      toast.error(error.response?.data?.message || 'Failed to remove default status');
    }
  };

  const handleDeleteSender = async (senderEmailId) => {
    if (!window.confirm('Are you sure you want to delete this sender email?')) {
      return;
    }

    try {
      const response = await deleteSenderEmail(senderEmailId);
      toast.success(response.message);
      if (selectedSenderEmail === senderEmailId) {
        setSelectedSenderEmail('');
      }
      fetchSenderEmails();
    } catch (error) {
      console.error('Failed to delete sender email:', error);
      toast.error(error.response?.data?.message || 'Failed to delete sender email');
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
      <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div className="bg-gradient-to-r from-[#19aaba] to-[#158c99] rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-white shadow-xl">
            <div className="flex items-center gap-2 sm:gap-3">
              <Mail className="w-8 h-8 sm:w-10 sm:h-10" />
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2">Send Email</h1>
                <p className="text-xs sm:text-sm text-cyan-100">Send emails to all members or selected recipients.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Email Form */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-5 md:p-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-5 md:mb-6 text-gray-800">Compose Email</h2>
            
            <div className="space-y-4 sm:space-y-5 md:space-y-6">
              {/* Sender Email Selection */}
              <div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-1">
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700">
                    Sender Email
                  </label>
                  <button
                    onClick={() => setShowManageSenderModal(true)}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors w-fit"
                  >
                    <Settings size={14} />
                    <span className="hidden sm:inline">Manage</span>
                  </button>
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedSenderEmail}
                    onChange={(e) => setSelectedSenderEmail(e.target.value)}
                    className="flex-1 px-3 py-2 sm:px-4 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all"
                  >
                    <option value="">Select sender email</option>
                    {senderEmails
                      .filter(se => se.isActive)
                      .map(se => (
                        <option key={se._id} value={se._id}>
                          {se.displayName} ({se.email}) {se.isDefault ? '★' : ''}
                        </option>
                      ))
                    }
                  </select>
                  <button
                    onClick={() => setShowAddSenderModal(true)}
                    className="flex items-center gap-1 px-3 py-2 sm:px-4 sm:py-3 bg-[#19aaba] hover:bg-[#158c99] text-white rounded-lg font-semibold transition-colors"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
                {senderEmails.length === 0 && (
                  <p className="text-xs sm:text-sm text-orange-600 mt-1">
                    No sender emails configured. Please add one to send emails.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                  placeholder="Enter email subject"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={emailForm.message}
                  onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                  placeholder="Enter your message here..."
                  rows="8"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Send Button */}
              <div className="pt-2 sm:pt-4">
                <button
                  onClick={handleSendEmailClick}
                  disabled={sendingEmail || selectedUsers.length === 0 || !selectedSenderEmail}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-[#19aaba] to-[#158c99] text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-base sm:text-lg"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Send to Selected ({selectedUsers.length})</span>
                  <span className="sm:hidden">Send ({selectedUsers.length})</span>
                </button>
              </div>
            </div>
          </div>

          {/* User Selection */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-5 md:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Select Recipients</h2>
              <div className="bg-gradient-to-r from-[#19aaba] to-[#158c99] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold w-fit">
                {selectedUsers.length} selected
              </div>
            </div>

            {/* Search */}
            <div className="mb-3 sm:mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search users..."
                  className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                />
              </div>
            </div>

            {/* Selection Options */}
            <div className="mb-3 sm:mb-4 space-y-2 sm:space-y-3">
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1.5 sm:gap-2">
                <button
                  onClick={handleSelectAll}
                  className="flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-[#19aaba] hover:bg-[#158c99] text-white rounded-lg font-semibold transition-colors"
                >
                  <CheckSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Select All</span>
                  <span className="sm:hidden">All</span>
                </button>
                <button
                  onClick={handleSelectAllUsers}
                  className="flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
                >
                  <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Select All Users</span>
                  <span className="sm:hidden">Users</span>
                </button>
                <button
                  onClick={handleSelectAllAdmins}
                  className="flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
                >
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Select All Admins</span>
                  <span className="sm:hidden">Admins</span>
                </button>
                <button
                  onClick={() => setSelectedUsers([])}
                  className="flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                >
                  <Square className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Deselect All</span>
                  <span className="sm:hidden">Clear</span>
                </button>
              </div>
              <div className="text-xs sm:text-sm text-gray-600">
                {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found • {selectedUsers.length} selected
              </div>
            </div>

            {/* User List */}
            <div className="max-h-[400px] sm:max-h-[500px] md:max-h-[600px] overflow-y-auto border border-gray-200 rounded-lg p-2 sm:p-3 md:p-4 space-y-1.5 sm:space-y-2 bg-gray-50">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-6 sm:py-8 text-sm sm:text-base text-gray-500">
                  No users found matching your search.
                </div>
              ) : (
                filteredUsers.map((usr) => (
                  <label 
                    key={usr._id} 
                    className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 hover:bg-white rounded-lg cursor-pointer transition-all border border-transparent hover:border-[#19aaba]"
                  >
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(usr._id)}
                      onChange={() => handleSelectUser(usr._id)}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-[#19aaba] rounded focus:ring-[#19aaba] cursor-pointer flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <p className="font-semibold text-sm sm:text-base text-gray-800 truncate">{usr.name}</p>
                        {usr.role === 'admin' && (
                          <span className="px-1.5 sm:px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full border border-red-200 flex-shrink-0">
                            ADMIN
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">{usr.email}</p>
                      <p className="text-xs text-gray-500 font-mono">{usr.studentID}</p>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSendEmail}
        title="Send Email Confirmation"
        message={
          <div className="space-y-3">
            <p className="text-gray-700">You are about to send an email to <span className="font-bold text-[#19aaba]">{selectedUsers.length}</span> recipient{selectedUsers.length !== 1 ? 's' : ''}:</p>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
              <div className="space-y-2">
                {users
                  .filter(u => selectedUsers.includes(u._id))
                  .map(u => (
                    <div key={u._id} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-[#19aaba]"></div>
                      <span className="font-medium text-gray-900">{u.name}</span>
                      {u.role === 'admin' && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full border border-red-200">
                          ADMIN
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-sm font-semibold text-blue-900 mb-1">Subject:</p>
              <p className="text-sm text-blue-800">{emailForm.subject}</p>
            </div>
            <p className="text-sm text-orange-600 font-medium">
              ⚠️ This action cannot be undone. The email will be sent immediately.
            </p>
          </div>
        }
        confirmText={sendingEmail ? "Sending..." : "Send Email"}
        cancelText="Cancel"
        type="warning"
        loading={sendingEmail}
      />

      {/* Add Sender Email Modal */}
      {showAddSenderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-5 md:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-5 md:mb-6">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Add New Sender Email</h3>
                <button
                  onClick={() => setShowAddSenderModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl sm:text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    Display Name *
                  </label>
                  <input
                    type="text"
                    value={senderForm.displayName}
                    onChange={(e) => setSenderForm({ ...senderForm, displayName: e.target.value })}
                    placeholder="e.g., Perceptron-13 Team"
                    className="w-full px-3 py-2 sm:px-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={senderForm.email}
                    onChange={(e) => setSenderForm({ ...senderForm, email: e.target.value })}
                    placeholder="example@gmail.com"
                    className="w-full px-3 py-2 sm:px-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    App Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={senderForm.password}
                      onChange={(e) => setSenderForm({ ...senderForm, password: e.target.value })}
                      placeholder="Enter app password"
                      className="w-full px-3 py-2 pr-10 sm:px-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    For Gmail, generate an app password from your Google Account settings
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                      SMTP Host
                    </label>
                    <input
                      type="text"
                      value={senderForm.smtpHost}
                      onChange={(e) => setSenderForm({ ...senderForm, smtpHost: e.target.value })}
                      placeholder="smtp.gmail.com"
                      className="w-full px-3 py-2 sm:px-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                      SMTP Port
                    </label>
                    <input
                      type="number"
                      value={senderForm.smtpPort}
                      onChange={(e) => setSenderForm({ ...senderForm, smtpPort: parseInt(e.target.value) })}
                      placeholder="465"
                      className="w-full px-3 py-2 sm:px-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={senderForm.isDefault}
                    onChange={(e) => setSenderForm({ ...senderForm, isDefault: e.target.checked })}
                    className="w-4 h-4 text-[#19aaba] rounded focus:ring-[#19aaba]"
                  />
                  <label htmlFor="isDefault" className="text-xs sm:text-sm font-semibold text-gray-700">
                    Set as default sender email
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-5 md:mt-6">
                <button
                  onClick={() => setShowAddSenderModal(false)}
                  className="w-full sm:flex-1 px-4 py-2.5 sm:py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSenderEmail}
                  disabled={addingSenderEmail}
                  className="w-full sm:flex-1 px-4 py-2.5 sm:py-3 bg-[#19aaba] hover:bg-[#158c99] text-white rounded-lg font-semibold transition-colors disabled:opacity-50 text-sm sm:text-base"
                >
                  {addingSenderEmail ? 'Adding...' : 'Add Sender Email'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Sender Email Modal */}
      {showEditSenderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-5 md:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-5 md:mb-6">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Edit Sender Email</h3>
                <button
                  onClick={() => {
                    setShowEditSenderModal(false);
                    setEditingSender(null);
                    setSenderForm({
                      displayName: '',
                      email: '',
                      password: '',
                      smtpHost: 'smtp.gmail.com',
                      smtpPort: 465,
                      isDefault: false
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600 text-xl sm:text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    Display Name *
                  </label>
                  <input
                    type="text"
                    value={senderForm.displayName}
                    onChange={(e) => setSenderForm({ ...senderForm, displayName: e.target.value })}
                    placeholder="e.g., Perceptron-13 Team"
                    className="w-full px-3 py-2 sm:px-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={senderForm.email}
                    onChange={(e) => setSenderForm({ ...senderForm, email: e.target.value })}
                    placeholder="example@gmail.com"
                    className="w-full px-3 py-2 sm:px-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    App Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={senderForm.password}
                      onChange={(e) => setSenderForm({ ...senderForm, password: e.target.value })}
                      placeholder="Leave empty to keep current password"
                      className="w-full px-3 py-2 pr-10 sm:px-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty to keep the current password unchanged
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                      SMTP Host
                    </label>
                    <input
                      type="text"
                      value={senderForm.smtpHost}
                      onChange={(e) => setSenderForm({ ...senderForm, smtpHost: e.target.value })}
                      placeholder="smtp.gmail.com"
                      className="w-full px-3 py-2 sm:px-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                      SMTP Port
                    </label>
                    <input
                      type="number"
                      value={senderForm.smtpPort}
                      onChange={(e) => setSenderForm({ ...senderForm, smtpPort: parseInt(e.target.value) })}
                      placeholder="465"
                      className="w-full px-3 py-2 sm:px-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#19aaba] focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-5 md:mt-6">
                <button
                  onClick={() => {
                    setShowEditSenderModal(false);
                    setEditingSender(null);
                    setSenderForm({
                      displayName: '',
                      email: '',
                      password: '',
                      smtpHost: 'smtp.gmail.com',
                      smtpPort: 465,
                      isDefault: false
                    });
                  }}
                  className="w-full sm:flex-1 px-4 py-2.5 sm:py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateSenderEmail}
                  disabled={updatingSenderEmail}
                  className="w-full sm:flex-1 px-4 py-2.5 sm:py-3 bg-[#19aaba] hover:bg-[#158c99] text-white rounded-lg font-semibold transition-colors disabled:opacity-50 text-sm sm:text-base"
                >
                  {updatingSenderEmail ? 'Updating...' : 'Update Sender Email'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manage Sender Emails Modal */}
      {showManageSenderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-5 md:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-5 md:mb-6">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Manage Sender Emails</h3>
                <button
                  onClick={() => setShowManageSenderModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl sm:text-2xl"
                >
                  ✕
                </button>
              </div>

              {senderEmails.length === 0 ? (
                <div className="text-center py-6 sm:py-8">
                  <Mail className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-gray-400" />
                  <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">No sender emails configured yet</p>
                  <button
                    onClick={() => {
                      setShowManageSenderModal(false);
                      setShowAddSenderModal(true);
                    }}
                    className="px-4 sm:px-6 py-2 bg-[#19aaba] hover:bg-[#158c99] text-white rounded-lg font-semibold transition-colors text-sm sm:text-base"
                  >
                    Add Your First Sender Email
                  </button>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3">
                  {senderEmails.map(sender => (
                    <div
                      key={sender._id}
                      className={`p-3 sm:p-4 border-2 rounded-lg transition-all ${
                        sender.isDefault 
                          ? 'border-yellow-400 bg-yellow-50' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2 flex-wrap">
                            <h4 className="font-bold text-sm sm:text-base text-gray-800 truncate">{sender.displayName}</h4>
                            {sender.isDefault && (
                              <span className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full border border-yellow-200 flex-shrink-0">
                                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="currentColor" />
                                <span className="hidden sm:inline">Default</span>
                              </span>
                            )}
                            {!sender.isActive && (
                              <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full border border-red-200 flex-shrink-0">
                                Inactive
                              </span>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 mb-1 truncate">{sender.email}</p>
                          <p className="text-xs text-gray-500">
                            SMTP: {sender.smtpHost}:{sender.smtpPort}
                          </p>
                        </div>

                        <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleEditSender(sender)}
                            className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                          {sender.isDefault ? (
                            <button
                              onClick={() => handleRemoveDefaultSender(sender._id)}
                              className="p-1.5 sm:p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors"
                              title="Remove default"
                            >
                              <X className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                          ) : sender.isActive && (
                            <button
                              onClick={() => handleSetDefaultSender(sender._id)}
                              className="p-1.5 sm:p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors"
                              title="Set as default"
                            >
                              <Star className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteSender(sender._id)}
                            className="p-1.5 sm:p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-5 md:mt-6">
                <button
                  onClick={() => setShowManageSenderModal(false)}
                  className="w-full sm:flex-1 px-4 py-2.5 sm:py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-colors text-sm sm:text-base"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowManageSenderModal(false);
                    setShowAddSenderModal(true);
                  }}
                  className="w-full sm:flex-1 px-4 py-2.5 sm:py-3 bg-[#19aaba] hover:bg-[#158c99] text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Add New Sender Email</span>
                  <span className="sm:hidden">Add New</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SendEmail;
