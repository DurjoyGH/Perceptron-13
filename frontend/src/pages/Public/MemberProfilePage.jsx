import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Award,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Users,
  Camera,
  Loader2
} from 'lucide-react';
import { getMemberByStudentId } from '../../services/userApi';
import AvatarModal from '../../components/Profile/AvatarModal';

const MemberProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  useEffect(() => {
    fetchMemberData();
  }, [id]);

  const fetchMemberData = async () => {
    try {
      setLoading(true);
      
      // Fetch current member
      const memberResponse = await getMemberByStudentId(id);
      setMember(memberResponse.data);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching member:', err);
      setError('Failed to load member profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#19aaba] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading member profile...</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Member Not Found</h2>
          <p className="text-gray-600 mb-6">The member you're looking for doesn't exist.</p>
          <Link
            to="/members"
            className="inline-flex items-center gap-2 bg-[#19aaba] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#158c99] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Members
          </Link>
        </div>
      </div>
    );
  }

  const getInitials = (name) => {
    const words = name.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#19aaba] via-[#158c99] to-[#116d77] text-white py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/members')}
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-4 sm:mb-6 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium">Back to Members</span>
          </button>
          
          <div className="flex items-center gap-2 text-xs sm:text-sm mb-2">
            <Users className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Industrial Tour 2025</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Member Profile</h1>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden lg:sticky lg:top-8">
              {/* Avatar Section */}
              <div className="bg-gradient-to-br from-[#19aaba] to-[#158c99] p-6 sm:p-8 text-center">
                <button
                  onClick={() => setShowAvatarModal(true)}
                  className="mx-auto block focus:outline-none focus:ring-4 focus:ring-white/50 rounded-full transition-transform hover:scale-105 mb-3 sm:mb-4"
                >
                  {member.profilePicture?.url ? (
                    <img
                      src={member.profilePicture.url}
                      alt={member.name}
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover shadow-lg border-4 border-white cursor-pointer"
                    />
                  ) : (
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full flex items-center justify-center text-[#19aaba] text-3xl sm:text-4xl font-bold shadow-lg cursor-pointer">
                      {getInitials(member.name)}
                    </div>
                  )}
                </button>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{member.name}</h2>
                <p className="text-white/90 font-mono text-base sm:text-lg">{member.studentID}</p>
              </div>

              {/* Quick Info */}
              <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-[#19aaba]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Program</p>
                    <p className="text-sm font-medium">B.Sc. in CSE</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#19aaba]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Batch</p>
                    <p className="text-sm font-medium">Perceptron-13</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#19aaba]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Gender</p>
                    <p className="text-sm font-medium capitalize">{member.gender}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#19aaba]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">Institution</p>
                    <p className="text-sm font-medium break-words">Jashore University of Science and Technology</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">

            {/* Academic Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#19aaba]" />
                Academic Information
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between py-2 sm:py-3 border-b border-gray-100 gap-1 sm:gap-0">
                  <span className="text-sm sm:text-base text-gray-600">Student ID</span>
                  <span className="font-mono font-semibold text-sm sm:text-base text-gray-900 sm:text-right">{member.studentID}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-2 sm:py-3 border-b border-gray-100 gap-1 sm:gap-0">
                  <span className="text-sm sm:text-base text-gray-600">Department</span>
                  <span className="font-semibold text-sm sm:text-base text-gray-900 sm:text-right break-words">Computer Science & Engineering</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-2 sm:py-3 border-b border-gray-100 gap-1 sm:gap-0">
                  <span className="text-sm sm:text-base text-gray-600">Batch Name</span>
                  <span className="font-semibold text-sm sm:text-base text-gray-900 sm:text-right">Perceptron-13</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-2 sm:py-3 border-b border-gray-100 gap-1 sm:gap-0">
                  <span className="text-sm sm:text-base text-gray-600">Session</span>
                  <span className="font-semibold text-sm sm:text-base text-gray-900 sm:text-right">2020-21</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between py-2 sm:py-3 gap-1 sm:gap-0">
                  <span className="text-sm sm:text-base text-gray-600">University</span>
                  <span className="font-semibold text-sm sm:text-base text-gray-900 sm:text-right break-words">Jashore University of Science and Technology</span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            {(member.contactNumber || member.email) && (
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-[#19aaba]" />
                  Contact Information
                </h3>
                <div className="space-y-3">
                  {member.email && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm font-medium text-gray-900 break-all">{member.email}</p>
                      </div>
                    </div>
                  )}
                  {member.contactNumber && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="text-sm font-medium text-gray-900">{member.contactNumber}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Testimonial */}
            {member.dialogue && (
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#19aaba]" />
                  Testimonial
                </h3>
                <div className="relative">
                  <div className="text-4xl text-[#19aaba]/20 absolute -top-2 -left-2">"</div>
                  <p className="text-gray-700 italic leading-relaxed pl-4 text-sm sm:text-base">
                    {member.dialogue}
                  </p>
                  <div className="text-4xl text-[#19aaba]/20 absolute -bottom-4 -right-2">"</div>
                </div>
              </div>
            )}

            {/* Tour Highlights */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#19aaba]" />
                Featured Photos
              </h3>
              
              {member.featuredPhotos && member.featuredPhotos.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    {member.featuredPhotos.map((image, index) => (
                      <div 
                        key={index}
                        className="group relative aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                      >
                        <img
                          src={image.url}
                          alt={image.caption || `Featured photo ${index + 1}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        {image.caption && (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
                              <p className="text-white text-xs sm:text-sm font-medium break-words">{image.caption}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 sm:mt-4 text-center">
                    <p className="text-gray-500 text-xs sm:text-sm">
                      {member.featuredPhotos.length} photos from the tour
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <Camera className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                  <p className="text-gray-500 text-sm sm:text-base">No photos available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Modal */}
      <AvatarModal
        user={member}
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
      />
    </div>
  );
};

export default MemberProfilePage;
