# Gallery Upload & Display Debug Guide

## Overview
This guide helps debug the gallery image upload to Cloudinary and display on homepage functionality.

## What I've Added

### 1. Backend Logging (tourScheduleController.js)
Added comprehensive logging to the `addGalleryImage` function:
- Logs day, caption, and file details when upload is attempted
- Logs Cloudinary upload process and results
- Logs database save operations
- Detailed error logging with stack traces

### 2. Frontend API Logging (tourScheduleApi.js)
Added logging to the `addGalleryImage` API function:
- Logs file details before upload
- Logs FormData contents
- Logs successful upload responses
- Logs detailed error information

### 3. Homepage Logging (HomePage.jsx)
Added logging to the schedule fetch function:
- Logs API response
- Logs gallery data for each day
- Logs transformed schedule data

## Current Configuration

### Cloudinary Setup ✓
- **Cloud Name**: des0whrgl
- **API Key**: 687825574999146
- **API Secret**: Configured
- **Folder**: tour-gallery
- **Transformation**: 1200x1200 limit

### API Endpoints
- **Upload**: POST `/api/tour/schedules/:day/gallery`
- **Update**: PUT `/api/tour/schedules/:day/gallery/:imageId`
- **Delete**: DELETE `/api/tour/schedules/:day/gallery/:imageId`
- **Get All**: GET `/api/tour/schedules` (includes gallery data)

## How to Debug

### Step 1: Test Upload
1. Open ManageGallery page as admin
2. Open browser DevTools (F12) → Console tab
3. Click "Upload Photo" button
4. Select a day and an image file
5. Click "Upload Photo"
6. **Check Console for**:
   ```
   === addGalleryImage API Call ===
   Day: [number]
   Image File: { name, type, size... }
   Caption: [text]
   FormData entries:
     image: File(...)
     caption: [text]
   ```

### Step 2: Check Backend
1. Open terminal where backend is running
2. **Look for backend logs**:
   ```
   === Add Gallery Image Request ===
   Day: [number]
   Caption: [text]
   File present: true
   File details: { fieldname, originalname, mimetype, size, buffer }
   Schedule found: [ObjectId]
   Uploading to Cloudinary...
   Cloudinary upload success: { public_id, secure_url, format, width, height }
   Image saved to database successfully
   ```

### Step 3: Verify Upload Success
1. Check frontend console for:
   ```
   Upload response: { success: true, message: "Image added to gallery successfully", data: {...} }
   ```
2. Toast notification should show: "Image uploaded successfully"

### Step 4: Check Homepage Display
1. Navigate to homepage
2. Open browser console
3. **Look for**:
   ```
   === Homepage Gallery Fetch ===
   API Response: { success: true, count: X, data: [...] }
   Schedules data: [...]
   Day X gallery: [{ url, publicId, caption, uploadedAt, _id }]
   Transformed schedules: [...]
   ```
4. Each schedule card should show:
   - "View Gallery (X photos)" if images exist
   - "No photos yet" if no images

### Step 5: Test Gallery Modal
1. Click on a schedule card with images
2. Gallery modal should open showing images
3. Navigation arrows should work if multiple images
4. Image counter should show "1 / X"

## Common Issues & Solutions

### Issue 1: "No image file provided"
**Symptom**: Backend responds with 400 error
**Check**:
- File input ref is working
- File is being set in state
- FormData is being created correctly
**Solution**: Verify `imageFile` state is populated before upload

### Issue 2: "Schedule not found"
**Symptom**: Backend responds with 404 error
**Check**:
- Selected day matches a created schedule
- Day is being parsed as integer correctly
**Solution**: Ensure schedules exist in database for the selected day

### Issue 3: Cloudinary upload fails
**Symptom**: Error during Cloudinary upload
**Check**:
- Environment variables are set correctly
- Cloudinary credentials are valid
- File buffer is available
**Solution**: 
```bash
# Verify env vars
cd backend
grep CLOUDINARY .env
```

### Issue 4: Images not showing on homepage
**Symptom**: Cards show "No photos yet" despite uploads
**Possible Causes**:
1. **Gallery array is empty** - Check database:
   ```javascript
   // In MongoDB compass or shell
   db.tourschedules.findOne({ day: 1 })
   // Look for 'gallery' field
   ```
2. **API response missing gallery** - Check console logs
3. **Transformation error** - Check if `schedule.gallery` exists

**Solution**:
- Refresh homepage after upload
- Check network tab for `/api/tour/schedules` response
- Verify gallery array has items with `url` field

### Issue 5: CORS errors
**Symptom**: Network errors in console
**Check**: Backend ALLOWED_ORIGINS includes frontend URL
**Solution**:
```bash
# In backend/.env
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5000
```

## Testing Checklist

- [ ] Backend server is running
- [ ] Frontend dev server is running
- [ ] Logged in as admin user
- [ ] At least one tour schedule exists
- [ ] Cloudinary credentials are configured
- [ ] Browser console is open
- [ ] Backend terminal logs are visible

## Direct API Test (Optional)

Use curl or Postman to test the API directly:

```bash
# Get auth token first (login as admin)
TOKEN="your_jwt_token_here"

# Upload image
curl -X POST http://localhost:5000/api/tour/schedules/1/gallery \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@/path/to/test-image.jpg" \
  -F "caption=Test Image"

# Get schedules with gallery
curl http://localhost:5000/api/tour/schedules | jq '.data[0].gallery'
```

## Data Flow

```
Frontend (ManageGallery.jsx)
  ↓ File selected
  ↓ imageFile state updated
  ↓ handleUploadImage() called
  ↓
API Layer (tourScheduleApi.js)
  ↓ addGalleryImage(day, file, caption)
  ↓ FormData created
  ↓ POST to /api/tour/schedules/:day/gallery
  ↓
Backend (tourScheduleController.js)
  ↓ Multer processes file → req.file
  ↓ Find TourSchedule by day
  ↓ Upload buffer to Cloudinary
  ↓ Push to schedule.gallery array
  ↓ Save to MongoDB
  ↓ Return success response
  ↓
Frontend (ManageGallery.jsx)
  ↓ Show success toast
  ↓ Close modal
  ↓ fetchData() - refresh gallery
  ↓
Homepage (HomePage.jsx)
  ↓ fetchSchedules() on mount
  ↓ Transform data with gallery images
  ↓ Render schedule cards
  ↓ Click card → open gallery modal
```

## Database Schema

```javascript
TourSchedule {
  day: Number,
  date: String,
  dateObj: Date,
  title: String,
  location: String,
  events: [Event],
  gallery: [
    {
      url: String,        // Cloudinary URL
      publicId: String,   // Cloudinary public_id
      caption: String,    // Optional caption
      uploadedAt: Date,   // Auto-generated
      _id: ObjectId       // Auto-generated
    }
  ]
}
```

## Next Steps

1. **Start both servers** (backend and frontend)
2. **Open browser console** and keep it visible
3. **Attempt to upload** an image through ManageGallery
4. **Review all logs** in both frontend console and backend terminal
5. **Check the specific error** if any occurs
6. **Refer to this guide** for the matching issue/solution

## Success Indicators

✓ Backend logs show "Image saved to database successfully"
✓ Frontend shows "Image uploaded successfully" toast
✓ ManageGallery refreshes and shows the new image
✓ Homepage displays image count on schedule card
✓ Clicking schedule card opens gallery modal with image
✓ Image loads from Cloudinary URL

---

**Note**: All logging is already added to the code. Just run the application and follow the debug steps above.
