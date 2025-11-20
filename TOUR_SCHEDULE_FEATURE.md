# Tour Schedule Management System

This feature allows admins to manage tour schedules, including creating, editing, and updating schedule details and events.

## Features

### Admin Capabilities
- **Create Schedules**: Add new tour days with date, title, location, and status
- **Edit Schedules**: Modify existing schedule information
- **Delete Schedules**: Remove tour days from the system
- **Manage Events**: Add, edit, or delete events within each schedule
- **Status Management**: Update schedule and event statuses (upcoming, ongoing, completed, cancelled, delayed)
- **Statistics Dashboard**: View overview of schedules and events

### Public View
- View complete tour schedule timeline
- Filter schedules by status
- See detailed information for each day and event
- Real-time status indicators
- Responsive design for all devices

## Backend Structure

### Models
- **TourSchedule** (`/backend/models/tourSchedule.js`)
  - Fields: day, date, dateObj, title, location, status, events[]
  - Event fields: time, title, description, type, status

### Controllers
- **tourScheduleController.js** (`/backend/controllers/tourScheduleController.js`)
  - `getAllSchedules`: Get all tour schedules (with optional filters)
  - `getScheduleByDay`: Get specific schedule by day number
  - `createSchedule`: Create new schedule (admin only)
  - `updateSchedule`: Update existing schedule (admin only)
  - `deleteSchedule`: Delete schedule (admin only)
  - `addEvent`: Add event to schedule (admin only)
  - `updateEvent`: Update event in schedule (admin only)
  - `deleteEvent`: Delete event from schedule (admin only)
  - `getScheduleStats`: Get schedule statistics

### Routes
- **GET** `/api/tour/schedules` - Get all schedules (public)
- **GET** `/api/tour/schedules/:day` - Get schedule by day (public)
- **GET** `/api/tour/stats` - Get statistics (public)
- **POST** `/api/tour/schedules` - Create schedule (admin)
- **PUT** `/api/tour/schedules/:day` - Update schedule (admin)
- **DELETE** `/api/tour/schedules/:day` - Delete schedule (admin)
- **POST** `/api/tour/schedules/:day/events` - Add event (admin)
- **PUT** `/api/tour/schedules/:day/events/:eventId` - Update event (admin)
- **DELETE** `/api/tour/schedules/:day/events/:eventId` - Delete event (admin)

## Frontend Structure

### Pages
1. **ManageTourSchedules** (`/frontend/src/pages/Admin/ManageTourSchedules.jsx`)
   - Admin interface for schedule management
   - CRUD operations for schedules and events
   - Modal-based forms for editing

2. **TourSchedulePage** (`/frontend/src/pages/Public/TourSchedulePage.jsx`)
   - Public view of tour schedules
   - Timeline interface
   - Status filtering
   - Responsive design

### API Service
- **tourScheduleApi.js** (`/frontend/src/services/tourScheduleApi.js`)
  - API calls for all schedule operations
  - Axios-based with authentication

## Event Types
- `departure`: Journey departure
- `arrival`: Journey arrival
- `meal`: Breakfast, lunch, dinner
- `accommodation`: Hotel check-in/out
- `sightseeing`: Tourist attractions
- `activity`: Activities and experiences
- `industrial`: Industrial visits
- `travel`: Transportation
- `break`: Rest stops
- `shopping`: Shopping time
- `leisure`: Free time
- `special`: Special events
- `completion`: Tour completion

## Status Options
- `upcoming`: Not yet started
- `ongoing`: Currently in progress
- `completed`: Finished
- `cancelled`: Cancelled
- `delayed`: Delayed (events only)

## Setup Instructions

### 1. Run Database Seed (Optional)
```bash
cd backend
node scripts/seedTourSchedules.js
```

### 2. Access Admin Panel
- Login as admin
- Navigate to `/admin/schedules`
- Create, edit, or manage schedules

### 3. View Public Schedule
- Navigate to `/schedule` (public route)
- No authentication required

## API Usage Examples

### Create Schedule (Admin)
```javascript
POST /api/tour/schedules
{
  "day": 1,
  "date": "December 04, 2025",
  "dateObj": "2025-12-04",
  "title": "Departure Day",
  "location": "JUST Campus → Cox's Bazar",
  "status": "upcoming"
}
```

### Add Event to Schedule (Admin)
```javascript
POST /api/tour/schedules/1/events
{
  "time": "07:00 PM",
  "title": "Start Journey",
  "description": "Board the bus",
  "type": "departure",
  "status": "upcoming"
}
```

### Update Event Status (Admin)
```javascript
PUT /api/tour/schedules/1/events/{eventId}
{
  "status": "completed"
}
```

## Security
- All admin routes require authentication
- Admin role verification via middleware
- Public routes are read-only
- JWT-based authentication

## Future Enhancements
- [ ] Email notifications for schedule updates
- [ ] Push notifications for ongoing events
- [ ] Schedule export (PDF/Excel)
- [ ] Attendee check-in system
- [ ] Photo gallery integration
- [ ] Real-time updates via WebSocket
- [ ] Schedule comparison/history
- [ ] Mobile app integration
