import { Link } from 'react-router-dom';
import { 
  Vote, 
  Shield, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  Lock, 
  Zap, 
  Award,
  ArrowRight,
  BarChart3,
  Clock,
  Globe
} from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Voting",
      description: "End-to-end encrypted voting system ensuring your vote remains confidential and tamper-proof."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Easy Participation",
      description: "Simple and intuitive interface for all Perceptron-13 members to cast their votes effortlessly."
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Real-time Results",
      description: "Get instant access to live voting statistics and transparent result tracking."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "24/7 Availability",
      description: "Vote anytime, anywhere within the voting period. No geographical constraints."
    }
  ];

  const stats = [
    { number: "200+", label: "Active Members", icon: <Users className="w-6 h-6" /> },
    { number: "50+", label: "Events Organized", icon: <Award className="w-6 h-6" /> },
    { number: "98%", label: "Satisfaction Rate", icon: <TrendingUp className="w-6 h-6" /> },
    { number: "100%", label: "Secure & Private", icon: <Lock className="w-6 h-6" /> }
  ];

  const benefits = [
    { text: "Transparent and auditable voting process", icon: <CheckCircle2 className="w-5 h-5" /> },
    { text: "Instant result declaration", icon: <CheckCircle2 className="w-5 h-5" /> },
    { text: "Mobile-friendly interface", icon: <CheckCircle2 className="w-5 h-5" /> },
    { text: "One person, one vote guarantee", icon: <CheckCircle2 className="w-5 h-5" /> },
    { text: "Email verification & OTP security", icon: <CheckCircle2 className="w-5 h-5" /> },
    { text: "Eco-friendly paperless voting", icon: <CheckCircle2 className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center md:text-left space-y-6">
              <div className="inline-block">
                <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold border border-white/30">
                  Perceptron - 13 | CSE, JUST
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Welcome to
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  VoterX
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-100 max-w-2xl">
                The official digital voting platform for Perceptron-13 batch of Computer Science and Engineering, 
                Jashore University of Science and Technology. Making democracy digital, secure, and accessible.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link
                  to="/login"
                  className="group bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/votes"
                  className="group bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-indigo-600 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  View Active Votes
                  <Vote className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Right Content - Batch Photo */}
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl blur-3xl opacity-30 animate-pulse"></div>
                <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-4 border border-white/20 shadow-2xl overflow-hidden">
                  <img 
                    src="/src/assets/perceptron-13.jpg" 
                    alt="Perceptron-13 Batch" 
                    className="w-full h-full object-cover rounded-2xl shadow-xl"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6">
                    <h3 className="text-white text-2xl font-bold mb-1">Perceptron - 13</h3>
                    <p className="text-gray-200 text-sm">CSE, JUST | Session 20-21</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center border border-gray-100"
              >
                <div className="flex justify-center mb-3">
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white p-3 rounded-xl">
                    {stat.icon}
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</h3>
                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">VoterX</span>?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Built specifically for Perceptron-13, our platform ensures every voice is heard fairly and securely.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-indigo-200"
              >
                <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-4 rounded-xl w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                About <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Perceptron-13</span>
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                We are the 13th batch of Computer Science and Engineering at Jashore University of Science and Technology (JUST). 
                Known as <strong>Perceptron-13</strong>, we represent innovation, unity, and excellence in technology.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                VoterX was created by our batch to streamline and modernize all voting events, ensuring transparency, 
                security, and accessibility for every member of our community.
              </p>
              <div className="flex items-center gap-4">
                <Award className="w-12 h-12 text-indigo-600" />
                <div>
                  <p className="font-bold text-gray-900">Perceptron - 13</p>
                  <p className="text-gray-600">CSE, JUST | Session 20-21</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="text-green-500 flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <p className="text-gray-700 font-medium">{benefit.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Make Your Voice Heard?
          </h2>
          <p className="text-lg md:text-xl text-gray-100 mb-10 max-w-2xl mx-auto">
            Join your fellow Perceptron-13 members in shaping our batch's future through secure and transparent voting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="group bg-white text-indigo-600 px-10 py-4 rounded-full font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Start Voting Now
              <Vote className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </Link>
            <Link
              to="/about"
              className="group bg-transparent border-2 border-white text-white px-10 py-4 rounded-full font-bold hover:bg-white hover:text-indigo-600 transition-all duration-300 flex items-center justify-center gap-2"
            >
              Learn More
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
