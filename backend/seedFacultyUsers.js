const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user');
require('dotenv').config();

const connectDB = require('./configs/db');

const facultyData = [
  {
    name: "Dr. A F M Shahab Uddin",
    gender: "male",
    email: "s.uddin@just.edu.bd",
    type: "faculty",
    studentID: "FACULTY001", // Using as faculty ID
    password: "Faculty@123",
    role: "user",
    contactNumber: "+8801712345678",
    designation: "Professor",
    department: "Computer Science & Engineering",
    bio: "Dr. A F M Shahab Uddin is a distinguished Professor in the Department of Computer Science and Engineering at JUST. With over 15 years of experience in academia and research, he has made significant contributions to the fields of artificial intelligence, machine learning, and software engineering. He has published numerous research papers in international journals and conferences.",
    officeRoom: "CSE-301",
    officeHours: "Saturday-Thursday: 10:00 AM - 4:00 PM",
    researchInterests: [
      "Artificial Intelligence",
      "Machine Learning", 
      "Deep Learning",
      "Natural Language Processing",
      "Computer Vision",
      "Software Engineering"
    ],
    qualifications: [
      {
        degree: "Ph.D. in Computer Science",
        institution: "Bangladesh University of Engineering and Technology (BUET)",
        year: "2010"
      },
      {
        degree: "M.Sc. in Computer Science",
        institution: "University of Dhaka",
        year: "2005"
      },
      {
        degree: "B.Sc. in Computer Science & Engineering",
        institution: "Bangladesh University of Engineering and Technology (BUET)",
        year: "2003"
      }
    ],
    googleScholar: "https://scholar.google.com/citations?user=example1",
    researchGate: "https://www.researchgate.net/profile/example1",
    orcid: "https://orcid.org/0000-0000-0000-0001",
    personalWebsite: "https://shahab.just.edu.bd",
    dialogue: "Passionate about advancing computer science education and conducting cutting-edge research in artificial intelligence to solve real-world problems."
  },
  {
    name: "Sk. Shalauddin Kabir",
    gender: "male", 
    email: "sks.kabir@just.edu.bd",
    type: "faculty",
    studentID: "FACULTY002", // Using as faculty ID
    password: "Faculty@123",
    role: "user",
    contactNumber: "+8801787654321",
    designation: "Associate Professor",
    department: "Computer Science & Engineering",
    bio: "Sk. Shalauddin Kabir is an Associate Professor in the Department of Computer Science and Engineering at JUST. He specializes in software engineering, database systems, and web technologies. With a strong background in both academia and industry, he brings practical insights to theoretical concepts, making complex topics accessible to students.",
    officeRoom: "CSE-205",
    officeHours: "Saturday-Thursday: 11:00 AM - 3:00 PM",
    researchInterests: [
      "Software Engineering",
      "Database Systems",
      "Web Technologies",
      "Mobile Application Development",
      "Software Architecture",
      "Human-Computer Interaction"
    ],
    qualifications: [
      {
        degree: "Ph.D. in Software Engineering",
        institution: "Jahangirnagar University",
        year: "2015"
      },
      {
        degree: "M.Sc. in Computer Science",
        institution: "Jashore University of Science and Technology (JUST)",
        year: "2008"
      },
      {
        degree: "B.Sc. in Computer Science & Engineering",
        institution: "Jashore University of Science and Technology (JUST)",
        year: "2006"
      }
    ],
    googleScholar: "https://scholar.google.com/citations?user=example2",
    researchGate: "https://www.researchgate.net/profile/example2",
    orcid: "https://orcid.org/0000-0000-0000-0002",
    personalWebsite: "https://shalauddin.just.edu.bd",
    dialogue: "Dedicated to advancing software engineering practices and mentoring the next generation of software developers and engineers."
  }
];

const seedFacultyUsers = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing faculty user accounts
    await User.deleteMany({ type: 'faculty' });
    console.log('Cleared existing faculty user accounts');

    for (const facultyInfo of facultyData) {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(facultyInfo.password, salt);

      // Create User account for faculty
      const user = new User({
        name: facultyInfo.name,
        gender: facultyInfo.gender,
        email: facultyInfo.email,
        type: facultyInfo.type,
        studentID: facultyInfo.studentID, // Using as faculty ID
        password: hashedPassword,
        role: facultyInfo.role,
        contactNumber: facultyInfo.contactNumber,
        designation: facultyInfo.designation,
        department: facultyInfo.department,
        bio: facultyInfo.bio,
        officeRoom: facultyInfo.officeRoom,
        officeHours: facultyInfo.officeHours,
        researchInterests: facultyInfo.researchInterests,
        qualifications: facultyInfo.qualifications,
        googleScholar: facultyInfo.googleScholar,
        researchGate: facultyInfo.researchGate,
        orcid: facultyInfo.orcid,
        personalWebsite: facultyInfo.personalWebsite,
        dialogue: facultyInfo.dialogue
      });

      await user.save();
      console.log(`✓ Created faculty user: ${facultyInfo.name} (${facultyInfo.studentID})`);
    }

    console.log('\n✅ Faculty user seeding completed successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('==========================================');
    facultyData.forEach(f => {
      console.log(`\nName: ${f.name}`);
      console.log(`Email: ${f.email}`);
      console.log(`Student ID: ${f.studentID}`);
      console.log(`Password: ${f.password}`);
      console.log(`Type: ${f.type}`);
    });
    console.log('\n==========================================');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding faculty users:', error);
    process.exit(1);
  }
};

seedFacultyUsers();