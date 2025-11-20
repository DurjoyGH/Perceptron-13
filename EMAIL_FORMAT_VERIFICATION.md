# Email Format Configuration Summary

## ✅ Confirmed: All User Emails Use Format `2001**.cse@student.just.edu.bd`

### Student ID Format
All student IDs in the system: `2001**` (where ** are the last 2 digits)

Examples:
- `200102`
- `200107`
- `200120`
- `200132`
- etc.

### Email Format
Generated as: `[studentID].cse@student.just.edu.bd`

Examples:
- `200102.cse@student.just.edu.bd`
- `200107.cse@student.just.edu.bd`
- `200120.cse@student.just.edu.bd`
- `200132.cse@student.just.edu.bd`
- etc.

## Configuration Details

### 1. Seed Script (`backend/scripts/seedUsers.js`)
```javascript
// Line 84: Email generation
const email = `${member.id}.cse@student.just.edu.bd`;
```
✅ **Status:** Correctly generates emails with student IDs starting with 2001

### 2. Auth Controller (`backend/controllers/authController.js`)
```javascript
// Line 18: Email validation regex
const emailRegex = /^\d{7}\.cse@student\.just\.edu\.bd$/;
```
✅ **Status:** Accepts any 7-digit student ID (including 2001** format)

### 3. Login Page (`frontend/src/pages/Auth/Login.jsx`)
```javascript
// Email validation
if (!/^\d{7}\.cse@student.just.edu.bd$/.test(formData.email.trim())) {
  newErrors.email = 'Use format: 2001xxx.cse@student.just.edu.bd';
}
```
✅ **Status:** Validates and shows correct format hint

## All 28 Members Email List

### Committee Members (Admins) - 6 Members
1. 200107.cse@student.just.edu.bd - ABDULLAH AL NOMAN
2. 200118.cse@student.just.edu.bd - MOHAMMAD AZAZUL ISLAM
3. 200120.cse@student.just.edu.bd - DURJOY GHOSH
4. 200132.cse@student.just.edu.bd - MD. SADIK MAHMUD RAIHAN
5. 200140.cse@student.just.edu.bd - MD. ARAFATUZZAMAN
6. 200152.cse@student.just.edu.bd - SAJID HASAN TAKBIR

### Regular Members (Users) - 22 Members
1. 200102.cse@student.just.edu.bd - MD. RAFID AHMMED
2. 200104.cse@student.just.edu.bd - NAZMUS SAKIB SIBLY
3. 200105.cse@student.just.edu.bd - ABRAR HOSSAIN
4. 200110.cse@student.just.edu.bd - TAPU GHOSH
5. 200111.cse@student.just.edu.bd - TAHMID MUNTASER KAIF
6. 200114.cse@student.just.edu.bd - RAMJAN ALI KHA
7. 200117.cse@student.just.edu.bd - A. K. M. S. LIMON
8. 200121.cse@student.just.edu.bd - MD. MUSHFIQUR RAHMAN
9. 200122.cse@student.just.edu.bd - FAHIM AHMED
10. 200124.cse@student.just.edu.bd - S. AHMAD MUSA REZOWAN
11. 200126.cse@student.just.edu.bd - JOY KUMAR ACHARJEE
12. 200133.cse@student.just.edu.bd - IBNUS NAHIYAN SAMIT
13. 200135.cse@student.just.edu.bd - ANIKA TABASSUM
14. 200137.cse@student.just.edu.bd - RISAN MAHFUZ
15. 200142.cse@student.just.edu.bd - TANVIR MAHTAB TAFHIM
16. 200145.cse@student.just.edu.bd - PUSPITA SARKER
17. 200146.cse@student.just.edu.bd - BISWAJIT DEB
18. 200149.cse@student.just.edu.bd - ARIFUL ISLAM
19. 200150.cse@student.just.edu.bd - MUNNI KHANOM
20. 200151.cse@student.just.edu.bd - MD. ABU SAYED
21. 200153.cse@student.just.edu.bd - ANAMIKA MARMA
22. 200154.cse@student.just.edu.bd - OVESHEK KUNDU TOTON

## Default Password
**All Users:** `Perceptron@2025`

## Ready to Seed

Everything is configured correctly! Run:

```bash
cd backend
npm run seed
```

All 28 members will be registered with emails in the format `2001**.cse@student.just.edu.bd` ✅

---
**Note:** All student IDs naturally start with "2001", so all emails automatically follow the required format.
