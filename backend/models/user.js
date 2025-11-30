const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    gender: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    type: {
      type: String,
      enum: ["student", "alumni", "faculty", "staff"],
      required: true,
    },
    studentID: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      required: true,
    },
    profilePicture: {
      url: { type: String, default: null },
      publicId: { type: String, default: null }
    },
    contactNumber: { type: String, default: null },
    dialogue: { type: String, default: null },
    
    // Faculty-specific fields
    designation: { type: String, default: null },
    department: { type: String, default: null },
    bio: { type: String, default: null },
    officeRoom: { type: String, default: null },
    officeHours: { type: String, default: null },
    researchInterests: { type: [String], default: [] },
    qualifications: [{
      degree: { type: String, default: '' },
      institution: { type: String, default: '' },
      year: { type: String, default: '' },
      field: { type: String, default: '' }
    }],
    personalWebsite: { type: String, default: null },
    googleScholar: { type: String, default: null },
    researchGate: { type: String, default: null },
    orcid: { type: String, default: null },
    
    featuredPhotos: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        caption: { type: String, default: '' }
      }
    ],
    
    // Refresh token for JWT authentication
    refreshToken: { type: String, default: null }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;