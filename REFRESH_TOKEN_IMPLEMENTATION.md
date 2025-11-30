# Refresh Token Implementation

## Overview
This application now uses a dual-token authentication system with:
- **Access Token**: Short-lived token (15 minutes) for API requests
- **Refresh Token**: Long-lived token (7 days) for obtaining new access tokens

## Backend Changes

### 1. User Model (`/backend/models/user.js`)
Added `refreshToken` field to store the current refresh token:
```javascript
refreshToken: { type: String, default: null }
```

### 2. Auth Controller (`/backend/controllers/authController.js`)

#### Updated Login & Register
Both endpoints now return both tokens:
```javascript
{
  success: true,
  data: {
    user: { ... },
    accessToken: "short_lived_token",
    refreshToken: "long_lived_token"
  }
}
```

#### New Refresh Token Endpoint
- **Route**: `POST /api/auth/refresh-token`
- **Request Body**: `{ refreshToken: "token_string" }`
- **Response**: 
```javascript
{
  success: true,
  data: {
    accessToken: "new_access_token"
  }
}
```

#### Updated Logout
Clears the refresh token from the database on logout.

### 3. Auth Middleware (`/backend/middlewares/authMiddleware.js`)
Enhanced to provide specific error codes:
- `NO_TOKEN`: No authorization token provided
- `TOKEN_EXPIRED`: Access token has expired
- `INVALID_TOKEN`: Token is invalid or malformed
- `USER_NOT_FOUND`: User associated with token not found

### 4. Auth Routes (`/backend/routes/authRoutes.js`)
Added new route:
```javascript
router.post('/refresh-token', authController.refreshAccessToken);
```

### 5. Environment Variables
Add to your `.env` file:
```env
JWT_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
```

If `JWT_REFRESH_SECRET` is not provided, `JWT_SECRET` will be used as fallback.

## Frontend Changes

### 1. Auth API (`/frontend/src/services/authApi.js`)

#### Axios Interceptors
- **Request Interceptor**: Automatically adds access token to all requests
- **Response Interceptor**: Automatically handles token refresh on 401 errors
  - Queues failed requests during refresh
  - Retries queued requests with new token
  - Redirects to login if refresh fails

#### Token Refresh Flow
```
1. API Request with expired access token
2. Server responds with 401 + TOKEN_EXPIRED code
3. Frontend intercepts response
4. Calls refresh token endpoint
5. Stores new access token
6. Retries original request
7. Returns response to caller
```

### 2. Auth Context (`/frontend/src/context/AuthContext.jsx`)
Updated to manage both tokens:
- `accessToken`: Stored in localStorage as `accessToken`
- `refreshToken`: Stored in localStorage as `refreshToken`

### 3. Other API Services
Updated `userApi.js` and `tourScheduleApi.js` to use `accessToken` instead of `token`.

## Token Lifetimes

| Token Type | Lifetime | Purpose |
|------------|----------|---------|
| Access Token | 15 minutes | API authentication |
| Refresh Token | 7 days | Obtaining new access tokens |

## Security Features

1. **Short-lived Access Tokens**: Reduces the window of opportunity for token theft
2. **Refresh Token Rotation**: Each login generates a new refresh token
3. **Database Storage**: Refresh tokens stored in database for validation
4. **Token Invalidation**: Logout clears refresh token from database
5. **Automatic Refresh**: Transparent token refresh without user intervention

## Migration Guide

### For Existing Users
Users will need to log in again after deployment as the token format has changed from single token to dual tokens.

### For Developers

1. **Backend**:
   - Add `JWT_REFRESH_SECRET` to environment variables
   - Restart the backend server

2. **Frontend**:
   - Clear browser localStorage to remove old tokens
   - The app will automatically redirect to login

## Testing

### Test Token Expiration
To test the refresh token flow:
1. Log in to get tokens
2. Wait 15+ minutes (or manually set a shorter access token expiration for testing)
3. Make an API request
4. Observe automatic token refresh in Network tab

### Test Token Refresh Endpoint
```bash
curl -X POST http://localhost:5000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "your_refresh_token_here"}'
```

### Test Logout
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer your_access_token_here"
```

## Error Handling

### Frontend Error Codes
The frontend handles these backend error codes automatically:
- `TOKEN_EXPIRED`: Triggers automatic refresh
- `NO_TOKEN`: Redirects to login
- `INVALID_TOKEN`: Redirects to login
- `USER_NOT_FOUND`: Redirects to login

### Refresh Token Failures
If refresh token is:
- Missing: Immediate redirect to login
- Expired: Redirect to login after failed refresh
- Invalid: Redirect to login after failed refresh

## Best Practices

1. **Never expose tokens in logs**: Tokens are sensitive data
2. **Use HTTPS in production**: Prevents token interception
3. **Rotate refresh tokens**: Consider rotating refresh tokens periodically
4. **Monitor failed refresh attempts**: Could indicate security issues
5. **Clear tokens on logout**: Always clear both tokens from storage

## Future Enhancements

Potential improvements:
1. **Refresh Token Rotation**: Generate new refresh token on each refresh
2. **Device Tracking**: Associate tokens with devices
3. **Token Blacklist**: Maintain a blacklist for revoked tokens
4. **Multiple Sessions**: Support multiple concurrent sessions per user
5. **Token Activity Logging**: Log all token generation and refresh events
