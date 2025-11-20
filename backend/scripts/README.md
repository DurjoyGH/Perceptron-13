# User Seeding Guide

## Overview
This script will register all 28 members from the Perceptron-13 tour and automatically assign admin roles to the 6 committee members.

## Members to be Registered

### Total: 28 Members
- 24 Regular Users
- 4 Female Members
- 6 Committee Members (Admins)

### Committee Members (Will be Admins)
1. **ABDULLAH AL NOMAN** - 200107.cse@student.just.edu.bd
2. **MOHAMMAD AZAZUL ISLAM** - 200118.cse@student.just.edu.bd
3. **DURJOY GHOSH** - 200120.cse@student.just.edu.bd
4. **MD. SADIK MAHMUD RAIHAN** - 200132.cse@student.just.edu.bd
5. **MD. ARAFATUZZAMAN** - 200140.cse@student.just.edu.bd
6. **SAJID HASAN TAKBIR** - 200152.cse@student.just.edu.bd

## Default Credentials

**Email Format:** `[studentID].cse@student.just.edu.bd`

**Example:**
- Student ID: 200120
- Email: 200120.cse@student.just.edu.bd

**Default Password (for ALL users):** `Perceptron@2025`

⚠️ **IMPORTANT:** Users should change their password after first login!

## Prerequisites

1. MongoDB must be running
2. `.env` file must be configured with:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

## How to Run

### Method 1: Using npm script (Recommended)
```bash
cd backend
npm run seed
```

### Method 2: Using node directly
```bash
cd backend
node scripts/seedUsers.js
```

## What the Script Does

1. ✅ Connects to MongoDB
2. ✅ Checks for existing users (won't duplicate)
3. ✅ Creates all 28 user accounts
4. ✅ Assigns `admin` role to 6 committee members
5. ✅ Assigns `user` role to 22 regular members
6. ✅ Hashes passwords using bcrypt
7. ✅ Shows detailed summary of the operation

## Expected Output

```
🌱 Starting user seeding process...

✅ Added ADMIN: ABDULLAH AL NOMAN (200107.cse@student.just.edu.bd)
✅ Added ADMIN: MOHAMMAD AZAZUL ISLAM (200118.cse@student.just.edu.bd)
✅ Added ADMIN: DURJOY GHOSH (200120.cse@student.just.edu.bd)
✅ Added USER: MD. RAFID AHMMED (200102.cse@student.just.edu.bd)
...

============================================================
📊 SEEDING SUMMARY:
============================================================
✅ Successfully added: 28 users
   👑 Admins (Committee): 6
   👤 Regular Users: 22
⏭️  Skipped (already exist): 0
📧 Total members: 28
============================================================

🔑 DEFAULT CREDENTIALS:
============================================================
Email Format: [studentID].cse@student.just.edu.bd
Password (all users): Perceptron@2025
============================================================

👑 COMMITTEE MEMBERS (ADMINS):
============================================================
ABDULLAH AL NOMAN - 200107.cse@student.just.edu.bd
MOHAMMAD AZAZUL ISLAM - 200118.cse@student.just.edu.bd
DURJOY GHOSH - 200120.cse@student.just.edu.bd
MD. SADIK MAHMUD RAIHAN - 200132.cse@student.just.edu.bd
MD. ARAFATUZZAMAN - 200140.cse@student.just.edu.bd
SAJID HASAN TAKBIR - 200152.cse@student.just.edu.bd
============================================================

✨ Seeding completed successfully!
⚠️  IMPORTANT: Please ask users to change their passwords after first login.
```

## After Seeding

### Test Admin Login
1. Go to: http://localhost:5173/login
2. Use any committee member's credentials:
   - Email: `200120.cse@student.just.edu.bd`
   - Password: `Perceptron@2025`
3. Should redirect to: `/admin` dashboard

### Test Regular User Login
1. Go to: http://localhost:5173/login
2. Use any regular member's credentials:
   - Email: `200102.cse@student.just.edu.bd`
   - Password: `Perceptron@2025`
3. Should redirect to: `/` (home page)
4. Cannot access `/admin` (will show Access Denied)

## Troubleshooting

### "MongoDB connection error"
- Check if MongoDB is running
- Verify MONGODB_URI in .env file

### "Already exists" messages
- Script is safe to run multiple times
- Existing users will be skipped
- Only new users will be added

### "Module not found"
- Run `npm install` in backend directory
- Make sure all dependencies are installed

## Security Notes

1. 🔒 All passwords are hashed using bcrypt
2. 🔐 JWT tokens expire after 7 days
3. 🛡️ Admin routes are protected by roleMiddleware
4. ⚠️ Change default password after first login
5. 📧 Email format is validated

## Next Steps After Seeding

1. ✅ Test admin login
2. ✅ Test regular user login
3. ✅ Send a test email from admin dashboard
4. ✅ Notify all members about their accounts
5. ✅ Ask them to change passwords

## Complete Member List

| ID | Name | Gender | Role |
|----|------|--------|------|
| 200102 | MD. RAFID AHMMED | Male | User |
| 200104 | NAZMUS SAKIB SIBLY | Male | User |
| 200105 | ABRAR HOSSAIN | Male | User |
| 200107 | ABDULLAH AL NOMAN | Male | **Admin** |
| 200110 | TAPU GHOSH | Male | User |
| 200111 | TAHMID MUNTASER KAIF | Male | User |
| 200114 | RAMJAN ALI KHA | Male | User |
| 200117 | A. K. M. S. LIMON | Male | User |
| 200118 | MOHAMMAD AZAZUL ISLAM | Male | **Admin** |
| 200120 | DURJOY GHOSH | Male | **Admin** |
| 200121 | MD. MUSHFIQUR RAHMAN | Male | User |
| 200122 | FAHIM AHMED | Male | User |
| 200124 | S. AHMAD MUSA REZOWAN | Male | User |
| 200126 | JOY KUMAR ACHARJEE | Male | User |
| 200132 | MD. SADIK MAHMUD RAIHAN | Male | **Admin** |
| 200133 | IBNUS NAHIYAN SAMIT | Male | User |
| 200135 | ANIKA TABASSUM | Female | User |
| 200137 | RISAN MAHFUZ | Male | User |
| 200140 | MD. ARAFATUZZAMAN | Male | **Admin** |
| 200142 | TANVIR MAHTAB TAFHIM | Male | User |
| 200145 | PUSPITA SARKER | Female | User |
| 200146 | BISWAJIT DEB | Male | User |
| 200149 | ARIFUL ISLAM | Male | User |
| 200150 | MUNNI KHANOM | Female | User |
| 200151 | MD. ABU SAYED | Male | User |
| 200152 | SAJID HASAN TAKBIR | Male | **Admin** |
| 200153 | ANAMIKA MARMA | Female | User |
| 200154 | OVESHEK KUNDU TOTON | Male | User |

---
**Total: 28 Members | 6 Admins | 22 Users | 4 Female | 24 Male**
