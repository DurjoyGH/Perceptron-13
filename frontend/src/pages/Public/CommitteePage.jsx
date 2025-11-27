import { useState } from 'react';
import { 
  Mail, 
  Phone, 
  User, 
  Users,
  Briefcase,
  MessageSquare
} from 'lucide-react';

// Import member photos
import abdullahAlNoman from '../../assets/noman.jpg';
import mohammadAzazulIslam from '../../assets/azaz.jpg';
import durjoyGhosh from '../../assets/durjoy.jpg';
import mdSadikMahmudRaihan from '../../assets/sadik.jpg';
import mdArafatuzzaman from '../../assets/makky.jpg';
import sajidHasanTakbir from '../../assets/takbir.jpg';

const CommitteePage = () => {
  const [selectedMember, setSelectedMember] = useState(null);

  // Member photos mapping
  const memberPhotos = {
    "200107": abdullahAlNoman,
    "200118": mohammadAzazulIslam,
    "200120": durjoyGhosh,
    "200132": mdSadikMahmudRaihan,
    "200140": mdArafatuzzaman,
    "200152": sajidHasanTakbir
  };

  // Committee members data - using actual student members
  const committeeMembers = [
    {
      id: "200107",
      name: "ABDULLAH AL NOMAN",
      phone: "+880 1712-345107",
      email: "200107.cse@student.just.edu.bd",
      department: "Computer Science & Engineering",
      type: "student",
      gender: "male"
    },
    {
      id: "200118",
      name: "MOHAMMAD AZAZUL ISLAM",
      phone: "+880 1712-345118",
      email: "200118.cse@student.just.edu.bd",
      department: "Computer Science & Engineering",
      type: "student",
      gender: "male"
    },
    {
      id: "200120",
      name: "DURJOY GHOSH",
      phone: "+880 1712-345120",
      email: "200120.cse@student.just.edu.bd",
      department: "Computer Science & Engineering",
      type: "student",
      gender: "male"
    },
    {
      id: "200132",
      name: "MD. SADIK MAHMUD RAIHAN",
      phone: "+880 1712-345132",
      email: "200132.cse@student.just.edu.bd",
      department: "Computer Science & Engineering",
      type: "student",
      gender: "male"
    },
    {
      id: "200140",
      name: "MD. ARAFATUZZAMAN",
      phone: "+880 1712-345140",
      email: "200140.cse@student.just.edu.bd",
      department: "Computer Science & Engineering",
      type: "student",
      gender: "male"
    },
    {
      id: "200152",
      name: "SAJID HASAN TAKBIR",
      phone: "+880 1712-345152",
      email: "200152.cse@student.just.edu.bd",
      department: "Computer Science & Engineering",
      type: "student",
      gender: "male"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#19aaba] via-[#158c99] to-[#116d77] text-white py-12 md:py-16 lg:py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30 mb-4">
            <Users className="w-4 h-4" />
            <span className="text-sm font-semibold">Contact Us</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 px-4">
            Committee Members
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-100 max-w-3xl mx-auto px-4">
            Meet our dedicated committee members who are working tirelessly to make this industrial tour a memorable experience for everyone.
          </p>
        </div>
      </section>

      {/* Committee Members Grid */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            {committeeMembers.map((member) => (
              <div
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className={`group relative bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] max-w-sm flex flex-col ${
                  selectedMember?.id === member.id ? 'ring-4 ring-[#19aaba] -translate-y-2 shadow-2xl' : ''
                }`}
              >
                {/* Header with consistent gradient */}
                <div className="h-32 md:h-36 bg-gradient-to-br from-[#19aaba] via-[#158c99] to-[#116d77] relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

                  {/* Decorative circles */}
                  <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full"></div>
                  <div className="absolute -left-8 top-8 w-24 h-24 bg-white/5 rounded-full"></div>
                </div>

                {/* Profile Image */}
                <div className="relative -mt-16 px-6 mb-4">
                  <div className="w-28 h-28 md:w-32 md:h-32 mx-auto bg-white rounded-full border-4 border-white shadow-xl overflow-hidden ring-4 ring-gray-100">
                    <img 
                      src={memberPhotos[member.id]} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center hidden">
                      <User className="w-12 h-12 md:w-16 md:h-16 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 pb-6 text-center flex flex-col flex-grow">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
                    {member.name}
                  </h3>

                  {/* Contact Info */}
                  <div className="space-y-3 mb-5 flex-grow">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors group/phone">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover/phone:bg-[#19aaba] transition-colors">
                        <Phone className="w-4 h-4 text-gray-600 group-hover/phone:text-white" />
                      </div>
                      <span className="font-medium">{member.phone}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors group/email">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover/email:bg-[#19aaba] transition-colors">
                        <Mail className="w-4 h-4 text-gray-600 group-hover/email:text-white" />
                      </div>
                      <span className="truncate font-medium">{member.email}</span>
                    </div>
                  </div>

                  {/* Contact Button */}
                  <a
                    href={`mailto:${member.email}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#19aaba] to-[#158c99] text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 w-full justify-center"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Send Message
                  </a>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 border-2 border-[#19aaba] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-gray-100 to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get In Touch
            </h2>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Have any questions or concerns? Feel free to reach out to any of our committee members. We're here to help!
            </p>
          </div>

          <div className="flex justify-center">
            {/* Tour Contact */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-shadow max-w-md w-full">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-[#19aaba]/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Mail className="w-8 h-8 text-[#19aaba]" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">Contact Us</h3>
              <p className="text-gray-600 text-center mb-6">
                For general inquiries, technical support, and all tour-related questions
              </p>
              <a
                href="mailto:tour@perceptron13.fun"
                className="block text-center text-[#19aaba] hover:text-[#158c99] font-bold text-lg mb-4 transition-colors"
              >
                tour@perceptron13.fun
              </a>
              <a
                href="mailto:tour@perceptron13.fun"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#19aaba] to-[#158c99] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <MessageSquare className="w-5 h-5" />
                Send Email
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Selected Member Detail Modal */}
      {selectedMember && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-32 bg-gradient-to-br from-[#19aaba] via-[#158c99] to-[#116d77] relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
              
              <button
                onClick={() => setSelectedMember(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="relative -mt-16 px-6 pb-6">
              <div className="w-28 h-28 mx-auto bg-white rounded-full border-4 border-white shadow-xl overflow-hidden ring-4 ring-gray-100 mb-4">
                <img 
                  src={memberPhotos[selectedMember.id]} 
                  alt={selectedMember.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center hidden">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 text-center mb-6">
                {selectedMember.name}
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Briefcase className="w-5 h-5 text-[#19aaba]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-0.5 font-medium">Department</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedMember.department}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Phone className="w-5 h-5 text-[#19aaba]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-0.5 font-medium">Phone</p>
                    <a href={`tel:${selectedMember.phone}`} className="text-sm font-semibold text-gray-900 hover:text-[#19aaba] transition-colors">
                      {selectedMember.phone}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Mail className="w-5 h-5 text-[#19aaba]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-0.5 font-medium">Email</p>
                    <a href={`mailto:${selectedMember.email}`} className="text-sm font-semibold text-gray-900 hover:text-[#19aaba] transition-colors break-all">
                      {selectedMember.email}
                    </a>
                  </div>
                </div>
              </div>

              <a
                href={`mailto:${selectedMember.email}`}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#19aaba] to-[#158c99] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <MessageSquare className="w-5 h-5" />
                Send Message
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommitteePage;
