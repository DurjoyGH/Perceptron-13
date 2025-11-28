import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'sonner';
import PublicLayout from './components/Layouts/PublicLayout';
import AdminLayout from './components/Layouts/AdminLayout';
import UserLayout from './components/Layouts/UserLayout';
import { AdminRoute, UserRoute } from './components/ProtectedRoutes/ProtectedRoutes';
import ScrollTop from './components/ScrollTop/ScrollTop';
import HomePage from './pages/Public/HomePage';
import MembersPage from './pages/Public/MembersPage';
import MemberProfilePage from './pages/Public/MemberProfilePage';
import TourSchedulePage from './pages/Public/TourSchedulePage';
import BusSeatAllocationPage from './pages/Public/BusSeatAllocationPage';
import ShipSeatAllocationPage from './pages/Public/ShipSeatAllocationPage';
import RoomAllocationPage from './pages/Public/RoomAllocationPage';
import CommitteePage from './pages/Public/CommitteePage';
import TransactionPage from './pages/Public/TransactionPage';
import Login from './pages/Auth/Login';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ManageTourSchedules from './pages/Admin/ManageTourSchedules';
import ManageGallery from './pages/Admin/ManageGallery';
import ManageUsers from './pages/Admin/ManageUsers';
import ManageFaculty from './pages/Admin/ManageFaculty';
import SendEmail from './pages/Admin/SendEmail';
import ProfilePage from './pages/User/ProfilePage';
import FacultyProfileViewPage from './pages/Public/FacultyProfileViewPage';
import { useAuth } from './context/AuthContext';

function ProfileRouteWrapper() {
  const { user } = useAuth();
  // Always show ProfilePage - FacultyProfileViewPage is only for public viewing
  return <ProfilePage />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster 
          position="top-right" 
          richColors 
          closeButton
          duration={3000}
        />
        <ScrollTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="members" element={<MembersPage />} />
            <Route path="member/:id" element={<MemberProfilePage />} />
            <Route path="faculty/:id" element={<FacultyProfileViewPage />} />
            <Route path="schedule" element={<TourSchedulePage />} />
            <Route path='bus-seat-allocation' element={<BusSeatAllocationPage />} />
            <Route path='ship-seat-allocation' element={<ShipSeatAllocationPage />} />
            <Route path='room-allocation' element={<RoomAllocationPage />} />
            <Route path='transactions' element={<TransactionPage />} />
            <Route path="contact" element={<CommitteePage />} />
            <Route path="privacy" element={<div className="p-8 text-center min-h-screen flex items-center justify-center"><h1 className="text-2xl font-bold text-gray-800">Privacy Policy - Coming Soon</h1></div>} />
            <Route path="terms" element={<div className="p-8 text-center min-h-screen flex items-center justify-center"><h1 className="text-2xl font-bold text-gray-800">Terms of Service - Coming Soon</h1></div>} />
            <Route path="security" element={<div className="p-8 text-center min-h-screen flex items-center justify-center"><h1 className="text-2xl font-bold text-gray-800">Security Page - Coming Soon</h1></div>} />
            <Route path="faq" element={<div className="p-8 text-center min-h-screen flex items-center justify-center"><h1 className="text-2xl font-bold text-gray-800">FAQ Page - Coming Soon</h1></div>} />
          </Route>

          {/* Auth Routes (without layout) */}
          <Route path="/login" element={<Login />} />

          {/* User Routes (Protected) */}
          <Route path="/user" element={<UserRoute><UserLayout /></UserRoute>}>
            <Route path="profile" element={<ProfileRouteWrapper />} />
          </Route>

          {/* Admin Routes (Protected) */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="profile" element={<ProfileRouteWrapper />} />
            <Route path="manage-users" element={<ManageUsers />} />
            <Route path="manage-faculty" element={<ManageFaculty />} />
            <Route path="send-email" element={<SendEmail />} />
            <Route path="schedules" element={<ManageTourSchedules />} />
            <Route path="gallery" element={<ManageGallery />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<div className="p-8 text-center min-h-screen flex items-center justify-center bg-gray-100"><h1 className="text-2xl font-bold text-gray-800">404 - Page Not Found</h1></div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
