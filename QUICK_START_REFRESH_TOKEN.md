# Refresh Token Implementation - Quick Start Guide

## Setup Instructions

### 1. Backend Setup

#### Add Environment Variable
Add this to your `.env` file:
```env
JWT_REFRESH_SECRET=your_secure_refresh_secret_here
```

**Note**: Make it different from `JWT_SECRET` for better security.

#### Run Migration (Optional)
```bash
cd backend
node migrateRefreshTokens.js
```

To force all users to re-login:
```bash
node migrateRefreshTokens.js --clear-tokens
```

#### Restart Server
```bash
npm run dev
# or
npm start
```

### 2. Frontend Setup

No code changes needed! Just ensure users clear their browser cache/localStorage or log out and log back in.

## What Changed

### Token Structure
**Before:**
```javascript
localStorage.setItem('token', singleToken);
```

**After:**
```javascript
localStorage.setItem('accessToken', shortLivedToken);  // 15 min
localStorage.setItem('refreshToken', longLivedToken);  // 7 days
```

### API Response
**Login/Register Response:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### New Endpoint
```
POST /api/auth/refresh-token
Body: { "refreshToken": "token_string" }
Response: { "success": true, "data": { "accessToken": "new_token" } }
```

## How It Works

1. **User logs in** → Gets both access & refresh tokens
2. **Access token expires (15 min)** → Frontend automatically detects
3. **Frontend requests new token** → Using refresh token
4. **Server validates & issues new access token** → Frontend stores it
5. **Original request retries** → With new access token
6. **User continues working** → No interruption!

## Testing

### Test Automatic Refresh
1. Log in to the application
2. Open browser DevTools → Network tab
3. Wait 15 minutes (or temporarily change token expiry to 30 seconds for testing)
4. Make any API request (navigate, update profile, etc.)
5. Watch the Network tab: you'll see:
   - Failed request with 401
   - Call to `/auth/refresh-token`
   - Retry of original request with new token

### Test Manual Refresh
```bash
# 1. Log in and get tokens
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "your_id", "password": "your_password"}'

# 2. Use refresh token to get new access token
curl -X POST http://localhost:5000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "YOUR_REFRESH_TOKEN_HERE"}'
```

## Troubleshooting

### Issue: "Invalid refresh token"
**Solution**: User needs to log in again. Refresh token may have expired (7 days) or been invalidated.

### Issue: Infinite redirect to login
**Solution**: 
1. Clear browser localStorage
2. Clear all application cookies
3. Hard refresh (Ctrl+Shift+R)
4. Log in again

### Issue: Token keeps expiring immediately
**Solution**: Check server time is correct. JWT expiry is time-based.

### Issue: CORS errors after implementation
**Solution**: Ensure your backend CORS configuration allows the frontend origin.

## Security Notes

✅ **DO:**
- Use HTTPS in production
- Keep secrets in environment variables
- Use different secrets for access and refresh tokens
- Clear tokens on logout

❌ **DON'T:**
- Store tokens in plain text in database (they're already hashed in JWT)
- Share tokens between users
- Log tokens in console/logs
- Extend access token lifetime too much (defeats the purpose)

## Key Files Modified

### Backend
- ✅ `models/user.js` - Added refreshToken field
- ✅ `controllers/authController.js` - Updated login/register/logout, added refresh endpoint
- ✅ `middlewares/authMiddleware.js` - Enhanced error codes
- ✅ `routes/authRoutes.js` - Added refresh token route

### Frontend
- ✅ `services/authApi.js` - Added automatic token refresh interceptor
- ✅ `context/AuthContext.jsx` - Updated to handle dual tokens
- ✅ `services/userApi.js` - Updated token reference
- ✅ `services/tourScheduleApi.js` - Updated token reference

## Support

If you encounter issues:
1. Check browser console for errors
2. Check backend logs
3. Verify environment variables are set
4. Ensure database migration ran successfully
5. Clear tokens and try logging in again

## Done! 🎉

Your application now has a robust token refresh system that:
- Enhances security with short-lived access tokens
- Provides seamless user experience with automatic refresh
- Reduces the need for users to re-login frequently
