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

const MemberProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <div className="bg-gradient-to-br from-[#19aaba] via-[#158c99] to-[#116d77] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/members')}
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Members</span>
          </button>
          
          <div className="flex items-center gap-2 text-sm mb-2">
            <Users className="w-4 h-4" />
            <span>Industrial Tour 2025</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">Member Profile</h1>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden sticky top-8">
              {/* Avatar Section */}
              <div className="bg-gradient-to-br from-[#19aaba] to-[#158c99] p-8 text-center">
                {member.profilePicture?.url ? (
                  <img
                    src={member.profilePicture.url}
                    alt={member.name}
                    className="w-32 h-32 mx-auto rounded-full object-cover shadow-lg mb-4 border-4 border-white"
                  />
                ) : (
                  <div className="w-32 h-32 mx-auto bg-white rounded-full flex items-center justify-center text-[#19aaba] text-4xl font-bold shadow-lg mb-4">
                    {getInitials(member.name)}
                  </div>
                )}
                <h2 className="text-2xl font-bold text-white mb-2">{member.name}</h2>
                <p className="text-white/90 font-mono text-lg">{member.studentID}</p>
              </div>

              {/* Quick Info */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-5 h-5 text-[#19aaba]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Program</p>
                    <p className="text-sm font-medium">B.Sc. in CSE</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-[#19aaba]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Batch</p>
                    <p className="text-sm font-medium">Perceptron-13</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-[#19aaba]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Gender</p>
                    <p className="text-sm font-medium capitalize">{member.gender}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#19aaba]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Institution</p>
                    <p className="text-sm font-medium">Jashore University of Science and Technology</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">

            {/* Academic Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#19aaba]" />
                Academic Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Student ID</span>
                  <span className="font-mono font-semibold text-gray-900">{member.studentID}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Department</span>
                  <span className="font-semibold text-gray-900">Computer Science & Engineering</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Batch Name</span>
                  <span className="font-semibold text-gray-900">Perceptron-13</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Session</span>
                  <span className="font-semibold text-gray-900">2020-21</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-gray-600">University</span>
                  <span className="font-semibold text-gray-900">Jashore University of Science and Technology</span>
                </div>
              </div>
            </div>

            {/* Tour Highlights */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#19aaba]" />
                Featured Photos
              </h3>
              
              {member.featuredPhotos && member.featuredPhotos.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                            <div className="absolute bottom-0 left-0 right-0 p-3">
                              <p className="text-white text-sm font-medium">{image.caption}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-gray-500 text-sm">
                      {member.featuredPhotos.length} photos from the tour
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-base">No photos available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberProfilePage;
