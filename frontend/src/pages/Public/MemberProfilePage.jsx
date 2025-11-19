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
  Camera
} from 'lucide-react';

const MemberProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

  const member = members.find(m => m.id === id);

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

  // Featured images for the member (placeholder images - replace with actual member photos)
  const featuredImages = [
    {
      url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
      caption: "Beach exploration at Cox's Bazar"
    },
    {
      url: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800",
      caption: "Saint Martin's Island adventure"
    },
    {
      url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800",
      caption: "Marine Drive scenic tour"
    },
    {
      url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800",
      caption: "Industrial visit experience"
    },
    {
      url: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800",
      caption: "Beach activities with team"
    },
    {
      url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
      caption: "Barbecue night memories"
    }
  ];

  const currentIndex = members.findIndex(m => m.id === id);
  const previousMember = currentIndex > 0 ? members[currentIndex - 1] : null;
  const nextMember = currentIndex < members.length - 1 ? members[currentIndex + 1] : null;

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
                <div className="w-32 h-32 mx-auto bg-white rounded-full flex items-center justify-center text-[#19aaba] text-4xl font-bold shadow-lg mb-4">
                  {getInitials(member.name)}
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{member.name}</h2>
                <p className="text-white/90 font-mono text-lg">{member.id}</p>
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
                  <span className="font-mono font-semibold text-gray-900">{member.id}</span>
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
                Featured Images
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {featuredImages.map((image, index) => (
                  <div 
                    key={index}
                    className="group relative aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                  >
                    <img
                      src={image.url}
                      alt={image.caption}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <p className="text-white text-sm font-medium">{image.caption}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <p className="text-gray-500 text-sm">
                  {featuredImages.length} photos from the tour
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              {previousMember ? (
                <Link
                  to={`/member/${previousMember.id}`}
                  className="inline-flex items-center gap-2 text-[#19aaba] hover:text-[#158c99] font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </Link>
              ) : (
                <div></div>
              )}
              
              {nextMember ? (
                <Link
                  to={`/member/${nextMember.id}`}
                  className="inline-flex items-center gap-2 text-[#19aaba] hover:text-[#158c99] font-medium transition-colors"
                >
                  <span>Next</span>
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </Link>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberProfilePage;
