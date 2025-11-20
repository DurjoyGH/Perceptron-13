# User Profile Feature Documentation

## Overview
Normal users can now login, access their profile page (styled like the member profile page), and update their information inline.

## Features Implemented

### Backend

1. **User Controller** (`backend/controllers/userController.js`)
   - `getUserProfile`: Get authenticated user's profile
   - `updateUserProfile`: Update user profile information (name, email, studentID, password)

2. **User Routes** (`backend/routes/userRoutes.js`)
   - `GET /api/user/profile` - Get user profile (requires authentication)
   - `PUT /api/user/profile` - Update user profile (requires authentication)

3. **Updated App Configuration** (`backend/app.js`)
   - Added user routes to the application

### Frontend

1. **User Profile Page** (`frontend/src/pages/User/UserProfile.jsx`)
   - Matches the design of MemberProfilePage for consistency
   - Inline edit mode with "Edit Profile" button
   - Change password via modal dialog
   - View profile information in card format
   - Academic information section
   - Featured tour images gallery
   - Real-time validation
   - Responsive design
   - Logout functionality from header

2. **User API Service** (`frontend/src/services/userApi.js`)
   - `getUserProfile()` - Fetch user profile data
   - `updateUserProfile(data)` - Update user profile

3. **User Layout** (`frontend/src/components/Layouts/UserLayout.jsx`)
   - Layout wrapper for user-specific pages

4. **Protected Routes** (`frontend/src/components/ProtectedRoutes/ProtectedRoutes.jsx`)
   - Added `UserRoute` component for user-only access
   - Prevents admin from accessing user routes (redirects to admin dashboard)
   - Prevents unauthenticated access (redirects to login)

5. **Updated App Routing** (`frontend/src/App.jsx`)
   - Added `/user/profile` route protected by `UserRoute`
   - Updated imports to include user components

6. **Updated Login** (`frontend/src/pages/Auth/Login.jsx`)
   - Redirects normal users to `/user/profile` after login
   - Redirects admins to `/admin` after login

7. **Updated Auth Context** (`frontend/src/context/AuthContext.jsx`)
   - Added `updateUser()` function to update user state after profile changes

## User Flow

1. **Login**
   - User logs in with Student ID/Email and password
   - System authenticates and checks user role
   - Normal users → redirected to `/user/profile`
   - Admins → redirected to `/admin`

2. **View Profile**
   - User lands on profile page with member profile layout
   - Profile information displayed in left sidebar (Name, Email, Student ID, Avatar)
   - Quick info cards showing Program, Batch, Institution
   - Academic information section on the right
   - Featured images gallery from tour
   - "Edit Profile" button to enable editing mode

3. **Update Profile**
   - Click "Edit Profile" button to enter edit mode
   - Inline editing of name, email, and student ID
   - "Save" and "Cancel" buttons appear when editing
   - Real-time validation with error messages
   - Email must match format: `2001xxx.cse@student.just.edu.bd`
   - Student ID must be 6 digits
   - Success toast notification on update
   - Profile updates immediately after save

4. **Change Password**
   - Click "Change Password" button in sidebar
   - Modal dialog opens for password change
   - Enter current password, new password, and confirmation
   - Passwords must match
   - Current password verified before update
   - Modal closes on successful update or cancel

5. **Logout**
   - Click logout button
   - Redirected to login page
   - Token removed from localStorage

## Validation Rules

### Profile Information
- **Name**: Required, cannot be empty
- **Email**: Required, must match format `2001xxx.cse@student.just.edu.bd` (7-digit student ID followed by .cse@student.just.edu.bd)
- **Student ID**: Required, must be exactly 6 digits

### Password
- **Current Password**: Required when changing password
- **New Password**: Required, minimum 6 characters
- **Confirm Password**: Must match new password

## API Endpoints

### Get User Profile
```
GET /api/user/profile
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "2001120.cse@student.just.edu.bd",
    "studentID": "200120",
    "role": "user",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

### Update User Profile
```
PUT /api/user/profile
Authorization: Bearer <token>
Content-Type: application/json

Request Body (all fields optional):
{
  "name": "Updated Name",
  "email": "2001130.cse@student.just.edu.bd",
  "studentID": "200130",
  "currentPassword": "oldpass123",  // Required if changing password
  "newPassword": "newpass123"       // Required if changing password
}

Response:
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "_id": "user_id",
    "name": "Updated Name",
    "email": "2001130.cse@student.just.edu.bd",
    "studentID": "200130",
    "role": "user",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

## Security Features

1. **Authentication Required**: All user profile endpoints require valid JWT token
2. **Password Protection**: Current password must be verified before allowing password change
3. **Unique Constraints**: Email and Student ID must be unique across all users
4. **Password Hashing**: Passwords are hashed using bcrypt before storage
5. **Role-Based Access**: Users cannot access admin routes and vice versa

## UI Features

1. **Responsive Design**: Works on mobile, tablet, and desktop
2. **Consistent Layout**: Matches MemberProfilePage design for unified experience
3. **Inline Editing**: Edit mode toggle without page navigation
4. **Modal Dialog**: Change password in a clean modal interface
5. **Loading States**: Shows loading spinner during data fetch and updates
6. **Error Handling**: Displays user-friendly error messages inline
7. **Success Feedback**: Toast notifications for successful operations
8. **Form Validation**: Real-time validation with error messages
9. **Password Toggle**: Show/hide password functionality in modal
10. **Sticky Sidebar**: Profile card stays visible while scrolling (desktop)
11. **Featured Gallery**: Display tour images in responsive grid
12. **Quick Access**: Logout button in header, home navigation available

## Testing the Feature

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

2. Start the frontend server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Login with a normal user account (not admin)
4. You should be redirected to `/user/profile`
5. Try updating your profile information
6. Try changing your password
7. Verify that changes are saved successfully

## Future Enhancements

- Profile picture upload
- Email verification for email changes
- Password strength indicator
- Account deletion option
- Activity log/history
- Two-factor authentication
