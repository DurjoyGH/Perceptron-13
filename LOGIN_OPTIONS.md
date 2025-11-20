# Login System - Student ID or Email Support

## ✅ Users Can Now Login With Either:

### Option 1: Student ID (6 digits)
- **Input:** `200120`
- **Password:** `Perceptron@2025`

### Option 2: Full Email
- **Input:** `200120.cse@student.just.edu.bd`
- **Password:** `Perceptron@2025`

## Backend Changes

The login controller now automatically detects the input format:
- If input is **6 digits** → Searches by `studentID`
- If input is **email format** → Searches by `email`

```javascript
const isStudentID = /^\d{6}$/.test(email);
const user = await User.findOne(
  isStudentID 
    ? { studentID: email }
    : { email: email }
);
```

## Frontend Changes

The login form now accepts both formats:
- Label: "Student ID or Email"
- Placeholder: "200120 or 2001120.cse@student.just.edu.bd"
- Validates both formats

## Test Login Examples

### Admin Login (Committee Members)
```
Option 1:          Option 2:
ID: 200107         Email: 200107.cse@student.just.edu.bd
ID: 200118         Email: 200118.cse@student.just.edu.bd
ID: 200120         Email: 200120.cse@student.just.edu.bd
ID: 200132         Email: 200132.cse@student.just.edu.bd
ID: 200140         Email: 200140.cse@student.just.edu.bd
ID: 200152         Email: 200152.cse@student.just.edu.bd

Password (all): Perceptron@2025
```

### Regular User Login
```
Option 1:          Option 2:
ID: 200102         Email: 200102.cse@student.just.edu.bd
ID: 200104         Email: 200104.cse@student.just.edu.bd
ID: 200105         Email: 200105.cse@student.just.edu.bd
... (all other members)

Password (all): Perceptron@2025
```

## Quick Test

1. **Start Backend:**
   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test Login with Student ID:**
   - Go to: http://localhost:5173/login
   - Enter: `200120`
   - Password: `Perceptron@2025`
   - Should redirect to `/admin` (if admin) or `/` (if user)

4. **Test Login with Email:**
   - Go to: http://localhost:5173/login
   - Enter: `200120.cse@student.just.edu.bd`
   - Password: `Perceptron@2025`
   - Should redirect to `/admin` (if admin) or `/` (if user)

Both methods work! ✅

---
**Perceptron-13 Industrial Tour 2025**
