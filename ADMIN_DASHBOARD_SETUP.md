# Admin Dashboard Setup Guide

## Overview
A complete admin dashboard has been implemented for sending emails to all members and managing user roles. The system uses JWT authentication with role-based access control.

## Features Implemented

### Backend

#### 1. Authentication & Authorization
- **JWT-based authentication** (`authMiddleware.js`)
- **Role-based access control** (`roleMiddleware.js`)
- Supports two roles: `admin` and `user`

#### 2. User Management
- Email validation: `2001xxx.cse@student.just.edu.bd` format
- Default role is `user`
- Committee members can be assigned `admin` role

#### 3. Admin Controller (`adminController.js`)
- `getAllUsers()` - Get all registered users
- `getUserStats()` - Get user statistics (total, admins, users, recent)
- `sendEmailToAll()` - Send email to all members
- `sendEmailToSelected()` - Send email to selected members
- `updateUserRole()` - Update user role (admin/user)

#### 4. Email Service
- Professional email templates with Perceptron-13 branding
- Multiple email types: general, announcement, reminder, urgent
- Bulk email sending with error handling
- Success/failure tracking

#### 5. API Endpoints
```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
GET    /api/auth/me                - Get current user (protected)
POST   /api/auth/logout            - Logout user (protected)

GET    /api/admin/users            - Get all users (admin only)
GET    /api/admin/stats            - Get user statistics (admin only)
POST   /api/admin/send-email-all   - Send email to all members (admin only)
POST   /api/admin/send-email-selected - Send email to selected members (admin only)
PATCH  /api/admin/users/:userId/role - Update user role (admin only)
```

### Frontend

#### 1. Authentication Context
- `AuthContext` for global auth state management
- Auto token refresh
- Role checking utilities

#### 2. Protected Routes
- `ProtectedRoute` - For authenticated users
- `AdminRoute` - For admin users only
- Auto redirect to login if unauthorized

#### 3. Admin Dashboard
**Location:** `/admin`

**Tabs:**
1. **Overview** - Statistics and recent activity
2. **Manage Users** - View all users, update roles
3. **Send Email** - Compose and send emails

**Features:**
- Real-time user statistics
- User role management (promote/demote)
- Email composition with multiple types
- Select specific users or send to all
- Progress tracking for email sending
- Mobile-responsive design

#### 4. Admin Layout
- Custom navigation bar with admin branding
- User profile display
- Quick access to main site
- Logout functionality

#### 5. Login Page
- Updated to use email format: `2001xxx.cse@student.just.edu.bd`
- Form validation
- Auto redirect based on user role
- Remember me functionality

## Installation & Setup

### Backend Setup

1. Install dependencies (already done):
```bash
cd backend
npm install
```

2. Create `.env` file in backend directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
NODE_ENV=development
```

3. Start the backend server:
```bash
npm start
# or
node server.js
```

### Frontend Setup

1. Install required package:
```bash
cd frontend
npm install sonner
```

2. Create `.env` file in frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
```

3. Start the frontend:
```bash
npm run dev
```

## User Roles & Access

### Regular Users (role: 'user')
- Can access public pages
- Members list
- All with academic email: `2001xxx.cse@student.just.edu.bd`

### Admin Users (role: 'admin')
- Committee members
- Full access to admin dashboard
- Can send emails to all members
- Can manage user roles
- Can view statistics

## How to Make a User Admin

### Method 1: Direct Database Update
```javascript
// In MongoDB
db.users.updateOne(
  { email: "2001xxx.cse@student.just.edu.bd" },
  { $set: { role: "admin" } }
)
```

### Method 2: Via Admin Dashboard
1. Login as an existing admin
2. Go to "Manage Users" tab
3. Click "Make Admin" next to the user

### Method 3: During Registration (Code)
Modify the `register` controller to check committee member emails:
```javascript
const committeeEmails = [
  '2001001.cse@student.just.edu.bd',
  '2001002.cse@student.just.edu.bd',
  // Add committee member emails
];

const role = committeeEmails.includes(email) ? 'admin' : 'user';
```

## Email Types

1. **General** - Regular communications
2. **Announcement** - Important announcements
3. **Reminder** - Event or deadline reminders
4. **Urgent** - Time-sensitive information

## Email Template Features

- Perceptron-13 branding
- Responsive design
- Professional styling
- Dynamic content
- User personalization (greeting with name)
- Footer with tour information

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Protected routes
- Role-based access control
- Token expiration (7 days)
- CORS configuration
- Input validation

## Testing the Admin Dashboard

1. **Create a test admin user** (via MongoDB or registration)
2. **Login** at `/login` with admin credentials
3. **Access dashboard** - Should auto-redirect to `/admin`
4. **Test email sending:**
   - Compose an email
   - Select recipients or choose "Send to All"
   - Monitor success/failure feedback

## Mobile Responsiveness

All components are fully responsive:
- ✅ Admin Dashboard
- ✅ User Management Table
- ✅ Email Composer
- ✅ Statistics Cards
- ✅ Login Page
- ✅ Navigation

## Notes

- Email sending requires valid Gmail credentials with app password
- All users must have JUST CSE email format
- Default role is `user`
- Only admins can access `/admin` routes
- Email sending tracks both successes and failures
- Toast notifications using Sonner for better UX

## Troubleshooting

### "Access Denied" Error
- Ensure user has `admin` role in database
- Check JWT token is valid
- Verify user is logged in

### Email Not Sending
- Check EMAIL_USER and EMAIL_PASSWORD in .env
- Enable "Less secure app access" or use App Password for Gmail
- Verify internet connection

### Can't Access Admin Dashboard
- Ensure backend server is running
- Check VITE_API_URL in frontend .env
- Verify CORS settings in backend

## Next Steps

1. Install sonner package: `npm install sonner`
2. Set up environment variables
3. Create first admin user
4. Test email functionality
5. Add committee member emails

---

**Created for Perceptron-13 Industrial Tour 2025**
**CSE, JUST - Session 20-21**
