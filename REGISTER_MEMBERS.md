# Quick Start Guide - Register All Members

## 🚀 Quick Steps

### 1. Test Database Connection
```bash
cd backend
npm run test-db
```

### 2. Run Seeding Script
```bash
npm run seed
```

### 3. Verify Registration
```bash
npm run list-users
```

That's it! All 28 members will be registered with committee members as admins.

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run test-db` | Test MongoDB connection |
| `npm run seed` | Register all members |
| `npm run list-users` | List all registered users |
| `npm start` | Start the backend server |

## 📋 What You Get

✅ **28 Users Registered:**
- 6 Committee Members with **Admin Role**
- 22 Regular Members with **User Role**

✅ **Default Login Credentials:**
- Email: `[studentID].cse@student.just.edu.bd`
- Password: `Perceptron@2025`

## 🔑 Admin Accounts (Committee Members)

| Name | Student ID | Email | Password |
|------|------------|-------|----------|
| ABDULLAH AL NOMAN | 200107 | 200107.cse@student.just.edu.bd | Perceptron@2025 |
| MOHAMMAD AZAZUL ISLAM | 200118 | 200118.cse@student.just.edu.bd | Perceptron@2025 |
| DURJOY GHOSH | 200120 | 200120.cse@student.just.edu.bd | Perceptron@2025 |
| MD. SADIK MAHMUD RAIHAN | 200132 | 200132.cse@student.just.edu.bd | Perceptron@2025 |
| MD. ARAFATUZZAMAN | 200140 | 200140.cse@student.just.edu.bd | Perceptron@2025 |
| SAJID HASAN TAKBIR | 200152 | 200152.cse@student.just.edu.bd | Perceptron@2025 |

**Note:** Users can login with either Student ID or Email

## 🧪 Test It

### Test Admin Login (2 options):
1. Go to: http://localhost:5173/login
2. **Option 1 - Student ID:** `200120`
   **Option 2 - Email:** `200120.cse@student.just.edu.bd`
3. Password: `Perceptron@2025`
4. Should redirect to `/admin` dashboard

### Test Regular User Login (2 options):
1. Go to: http://localhost:5173/login
2. **Option 1 - Student ID:** `200102`
   **Option 2 - Email:** `200102.cse@student.just.edu.bd`
3. Password: `Perceptron@2025`
4. Should redirect to `/` home page

## ⚠️ Important Notes

1. **Safe to Run Multiple Times** - Existing users will be skipped
2. **Ask Users to Change Password** - After first login
3. **All Passwords Are Hashed** - Using bcrypt for security

## 📚 Full Documentation

See `backend/scripts/README.md` for detailed information.

---
**Perceptron-13 Industrial Tour 2025**
