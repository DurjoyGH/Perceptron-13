const mongoose = require("mongoose");

const facultySchema = new mongoose.Schema(
  {
    facultyID: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    designation: { type: String, default: null }, // e.g., Professor, Associate Professor, Assistant Professor
    department: { type: String, default: null },
    email: { type: String, required: true, unique: true },
    phone: { type: String, default: null },
    profilePicture: {
      url: { type: String, default: null },
      publicId: { type: String, default: null }
    },
    bio: { type: String, default: null },
    researchInterests: [{ type: String }], // Array of research areas
    qualifications: [
      {
        degree: { type: String, required: true }, // e.g., PhD, MSc, BSc
        institution: { type: String, required: true },
        year: { type: Number },
        field: { type: String }
      }
    ],
    officeRoom: { type: String, default: null },
    officeHours: { type: String, default: null },
    website: { type: String, default: null },
    googleScholar: { type: String, default: null },
    linkedIn: { type: String, default: null },
    isActive: { type: Boolean, default: true }, // To show/hide faculty member
    featuredPhotos: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
        caption: { type: String, default: '' }
      }
    ]
  },
  { timestamps: true }
);

const Faculty = mongoose.model("Faculty", facultySchema);

module.exports = Faculty;
