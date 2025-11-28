const Faculty = require('../models/faculty');
const { cloudinary } = require('../configs/cloudinary');

// Helper function to upload image to Cloudinary
const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'image'
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
    uploadStream.end(buffer);
  });
};

// Helper function to delete image from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  if (publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error);
    }
  }
};

// Get all faculty members (public)
const getAllFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find({ isActive: true })
      .select('-__v')
      .sort({ name: 1 });
    
    res.status(200).json({
      success: true,
      count: faculty.length,
      data: faculty
    });
  } catch (error) {
    console.error('Get all faculty error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch faculty members',
      error: error.message
    });
  }
};

// Get faculty member by ID (public)
const getFacultyById = async (req, res) => {
  try {
    const { id } = req.params;
    const faculty = await Faculty.findById(id).select('-__v');
    
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty member not found'
      });
    }

    res.status(200).json({
      success: true,
      data: faculty
    });
  } catch (error) {
    console.error('Get faculty by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch faculty member',
      error: error.message
    });
  }
};

// Get all faculty members (admin - includes inactive)
const getAllFacultyAdmin = async (req, res) => {
  try {
    const faculty = await Faculty.find()
      .select('-__v')
      .sort({ name: 1 });
    
    res.status(200).json({
      success: true,
      count: faculty.length,
      data: faculty
    });
  } catch (error) {
    console.error('Get all faculty (admin) error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch faculty members',
      error: error.message
    });
  }
};

// Create new faculty member (admin)
const createFaculty = async (req, res) => {
  try {
    const {
      name,
      designation,
      department,
      email,
      phone,
      bio,
      researchInterests,
      qualifications,
      officeRoom,
      officeHours,
      website,
      googleScholar,
      linkedIn
    } = req.body;

    // Check if email already exists
    const existingFaculty = await Faculty.findOne({ email });
    if (existingFaculty) {
      return res.status(400).json({
        success: false,
        message: 'A faculty member with this email already exists'
      });
    }

    // Handle profile picture upload if provided
    let profilePicture = { url: null, publicId: null };
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'faculty-pictures');
      profilePicture = {
        url: result.secure_url,
        publicId: result.public_id
      };
    }

    // Parse arrays and objects if they're strings
    const parsedResearchInterests = typeof researchInterests === 'string' 
      ? JSON.parse(researchInterests) 
      : researchInterests || [];
    
    const parsedQualifications = typeof qualifications === 'string' 
      ? JSON.parse(qualifications) 
      : qualifications || [];

    const faculty = new Faculty({
      name,
      designation,
      department: department || "Computer Science & Engineering",
      email,
      phone,
      profilePicture,
      bio,
      researchInterests: parsedResearchInterests,
      qualifications: parsedQualifications,
      officeRoom,
      officeHours,
      website,
      googleScholar,
      linkedIn
    });

    await faculty.save();

    res.status(201).json({
      success: true,
      message: 'Faculty member created successfully',
      data: faculty
    });
  } catch (error) {
    console.error('Create faculty error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create faculty member',
      error: error.message
    });
  }
};

// Update faculty member (admin)
const updateFaculty = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      designation,
      department,
      email,
      phone,
      bio,
      researchInterests,
      qualifications,
      officeRoom,
      officeHours,
      website,
      googleScholar,
      linkedIn,
      isActive
    } = req.body;

    const faculty = await Faculty.findById(id);

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty member not found'
      });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== faculty.email) {
      const existingFaculty = await Faculty.findOne({ email, _id: { $ne: id } });
      if (existingFaculty) {
        return res.status(400).json({
          success: false,
          message: 'This email is already in use by another faculty member'
        });
      }
      faculty.email = email;
    }

    // Update fields
    if (name) faculty.name = name;
    if (designation) faculty.designation = designation;
    if (department) faculty.department = department;
    if (phone !== undefined) faculty.phone = phone;
    if (bio !== undefined) faculty.bio = bio;
    if (officeRoom !== undefined) faculty.officeRoom = officeRoom;
    if (officeHours !== undefined) faculty.officeHours = officeHours;
    if (website !== undefined) faculty.website = website;
    if (googleScholar !== undefined) faculty.googleScholar = googleScholar;
    if (linkedIn !== undefined) faculty.linkedIn = linkedIn;
    if (typeof isActive !== 'undefined') faculty.isActive = isActive;

    // Parse arrays and objects if they're strings
    if (researchInterests !== undefined) {
      faculty.researchInterests = typeof researchInterests === 'string' 
        ? JSON.parse(researchInterests) 
        : researchInterests;
    }
    
    if (qualifications !== undefined) {
      faculty.qualifications = typeof qualifications === 'string' 
        ? JSON.parse(qualifications) 
        : qualifications;
    }

    // Handle profile picture update if provided
    if (req.file) {
      // Delete old profile picture if exists
      if (faculty.profilePicture && faculty.profilePicture.publicId) {
        await deleteFromCloudinary(faculty.profilePicture.publicId);
      }

      // Upload new profile picture
      const result = await uploadToCloudinary(req.file.buffer, 'faculty-pictures');
      faculty.profilePicture = {
        url: result.secure_url,
        publicId: result.public_id
      };
    }

    await faculty.save();

    res.status(200).json({
      success: true,
      message: 'Faculty member updated successfully',
      data: faculty
    });
  } catch (error) {
    console.error('Update faculty error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update faculty member',
      error: error.message
    });
  }
};

// Delete faculty member (admin)
const deleteFaculty = async (req, res) => {
  try {
    const { id } = req.params;

    const faculty = await Faculty.findById(id);

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty member not found'
      });
    }

    // Delete profile picture from Cloudinary if exists
    if (faculty.profilePicture && faculty.profilePicture.publicId) {
      await deleteFromCloudinary(faculty.profilePicture.publicId);
    }

    await Faculty.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Faculty member deleted successfully'
    });
  } catch (error) {
    console.error('Delete faculty error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete faculty member',
      error: error.message
    });
  }
};

// Delete faculty profile picture (admin)
const deleteFacultyProfilePicture = async (req, res) => {
  try {
    const { id } = req.params;

    const faculty = await Faculty.findById(id);

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty member not found'
      });
    }

    if (!faculty.profilePicture || !faculty.profilePicture.publicId) {
      return res.status(400).json({
        success: false,
        message: 'No profile picture to delete'
      });
    }

    // Delete from Cloudinary
    await deleteFromCloudinary(faculty.profilePicture.publicId);

    faculty.profilePicture = {
      url: null,
      publicId: null
    };

    await faculty.save();

    res.status(200).json({
      success: true,
      message: 'Profile picture deleted successfully',
      data: faculty
    });
  } catch (error) {
    console.error('Delete faculty profile picture error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete profile picture',
      error: error.message
    });
  }
};

// Get faculty profile by authenticated user's email
const getFacultyProfile = async (req, res) => {
  try {
    // req.user is set by authMiddleware
    const faculty = await Faculty.findOne({ email: req.user.email }).select('-__v');
    
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: faculty
    });
  } catch (error) {
    console.error('Get faculty profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch faculty profile',
      error: error.message
    });
  }
};

// Update faculty profile by authenticated user
const updateFacultyProfile = async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ email: req.user.email });

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty profile not found'
      });
    }

    const {
      name,
      email,
      designation,
      department,
      phone,
      bio,
      researchInterests,
      qualifications,
      officeRoom,
      officeHours,
      website,
      googleScholar,
      linkedIn
    } = req.body;

    // Check if email is being changed and if it's already taken
    if (email && email !== faculty.email) {
      const existingFaculty = await Faculty.findOne({ email, _id: { $ne: faculty._id } });
      if (existingFaculty) {
        return res.status(400).json({
          success: false,
          message: 'This email is already in use by another faculty member'
        });
      }
      faculty.email = email;
    }

    // Update all fields
    if (name !== undefined) faculty.name = name;
    if (designation !== undefined) faculty.designation = designation;
    if (department !== undefined) faculty.department = department;
    if (phone !== undefined) faculty.phone = phone;
    if (bio !== undefined) faculty.bio = bio;
    if (officeRoom !== undefined) faculty.officeRoom = officeRoom;
    if (officeHours !== undefined) faculty.officeHours = officeHours;
    if (website !== undefined) faculty.website = website;
    if (googleScholar !== undefined) faculty.googleScholar = googleScholar;
    if (linkedIn !== undefined) faculty.linkedIn = linkedIn;

    // Parse arrays if they're strings
    if (researchInterests !== undefined) {
      faculty.researchInterests = typeof researchInterests === 'string' 
        ? JSON.parse(researchInterests) 
        : researchInterests;
    }
    
    if (qualifications !== undefined) {
      faculty.qualifications = typeof qualifications === 'string' 
        ? JSON.parse(qualifications) 
        : qualifications;
    }

    await faculty.save();

    res.status(200).json({
      success: true,
      message: 'Faculty profile updated successfully',
      data: faculty
    });
  } catch (error) {
    console.error('Update faculty profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update faculty profile',
      error: error.message
    });
  }
};

// Update faculty profile picture
const updateFacultyProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const faculty = await Faculty.findOne({ email: req.user.email });

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty profile not found'
      });
    }

    // Delete old profile picture if exists
    if (faculty.profilePicture && faculty.profilePicture.publicId) {
      await deleteFromCloudinary(faculty.profilePicture.publicId);
    }

    // Upload new profile picture
    const result = await uploadToCloudinary(req.file.buffer, 'faculty-pictures');
    faculty.profilePicture = {
      url: result.secure_url,
      publicId: result.public_id
    };

    await faculty.save();

    res.status(200).json({
      success: true,
      message: 'Profile picture updated successfully',
      data: faculty
    });
  } catch (error) {
    console.error('Update faculty profile picture error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile picture',
      error: error.message
    });
  }
};

// Delete own faculty profile picture
const deleteOwnFacultyProfilePicture = async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ email: req.user.email });

    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty profile not found'
      });
    }

    if (!faculty.profilePicture || !faculty.profilePicture.publicId) {
      return res.status(400).json({
        success: false,
        message: 'No profile picture to delete'
      });
    }

    // Delete from Cloudinary
    await deleteFromCloudinary(faculty.profilePicture.publicId);

    faculty.profilePicture = {
      url: null,
      publicId: null
    };

    await faculty.save();

    res.status(200).json({
      success: true,
      message: 'Profile picture deleted successfully',
      data: faculty
    });
  } catch (error) {
    console.error('Delete own faculty profile picture error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete profile picture',
      error: error.message
    });
  }
};

// Add featured photo
const addFacultyFeaturedPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const { caption } = req.body;
    const faculty = await Faculty.findOne({ email: req.user.email });
    
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty profile not found'
      });
    }

    // Check if faculty already has 6 featured photos
    if (faculty.featuredPhotos && faculty.featuredPhotos.length >= 6) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 6 featured photos allowed'
      });
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, 'faculty-featured-photos');

    if (!faculty.featuredPhotos) {
      faculty.featuredPhotos = [];
    }

    faculty.featuredPhotos.push({
      url: result.secure_url,
      publicId: result.public_id,
      caption: caption || ''
    });

    await faculty.save();

    res.status(200).json({
      success: true,
      message: 'Featured photo added successfully',
      data: faculty
    });
  } catch (error) {
    console.error('Add featured photo error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add featured photo',
      error: error.message
    });
  }
};

// Update featured photo caption
const updateFacultyFeaturedPhoto = async (req, res) => {
  try {
    const { photoId } = req.params;
    const { caption } = req.body;
    
    const faculty = await Faculty.findOne({ email: req.user.email });
    
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty profile not found'
      });
    }

    const photo = faculty.featuredPhotos.id(photoId);
    
    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Featured photo not found'
      });
    }

    photo.caption = caption || '';
    await faculty.save();

    res.status(200).json({
      success: true,
      message: 'Featured photo updated successfully',
      data: faculty
    });
  } catch (error) {
    console.error('Update featured photo error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update featured photo',
      error: error.message
    });
  }
};

// Delete featured photo
const deleteFacultyFeaturedPhoto = async (req, res) => {
  try {
    const { photoId } = req.params;
    
    const faculty = await Faculty.findOne({ email: req.user.email });
    
    if (!faculty) {
      return res.status(404).json({
        success: false,
        message: 'Faculty profile not found'
      });
    }

    const photo = faculty.featuredPhotos.id(photoId);
    
    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Featured photo not found'
      });
    }

    // Delete from Cloudinary
    await deleteFromCloudinary(photo.publicId);

    // Remove from array
    faculty.featuredPhotos.pull(photoId);
    await faculty.save();

    res.status(200).json({
      success: true,
      message: 'Featured photo deleted successfully',
      data: faculty
    });
  } catch (error) {
    console.error('Delete featured photo error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete featured photo',
      error: error.message
    });
  }
};

module.exports = {
  getAllFaculty,
  getFacultyById,
  getAllFacultyAdmin,
  createFaculty,
  updateFaculty,
  deleteFaculty,
  deleteFacultyProfilePicture,
  getFacultyProfile,
  updateFacultyProfile,
  updateFacultyProfilePicture,
  deleteOwnFacultyProfilePicture,
  addFacultyFeaturedPhoto,
  updateFacultyFeaturedPhoto,
  deleteFacultyFeaturedPhoto
};
