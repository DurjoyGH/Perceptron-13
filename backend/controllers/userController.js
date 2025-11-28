const User = require('../models/user');
const bcrypt = require('bcryptjs');
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

// Get all users (public - for members page)
const getAllMembers = async (req, res) => {
  try {
    // Only fetch users with type 'user' (students), exclude faculty
    const users = await User.find({ type: { $ne: 'faculty' } })
      .select('-password -__v')
      .sort({ studentID: 1 });
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Get all members error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch members',
      error: error.message
    });
  }
};

// Get user by student ID (public - for member profile page)
const getMemberByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    const user = await User.findOne({ studentID: studentId }).select('-password -__v');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Member not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get member by student ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch member',
      error: error.message
    });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile',
      error: error.message
    });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { name, email, contactNumber, dialogue, currentPassword, newPassword } = req.body;
    
    // Prevent studentID from being updated
    if (req.body.studentID) {
      return res.status(400).json({
        success: false,
        message: 'Student ID cannot be changed'
      });
    }
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email format is valid (if email is being updated)
    if (email && email !== user.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }

      // Check if new email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }

    // If password change is requested
    if (currentPassword && newPassword) {
      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }

      // Validate new password
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters'
        });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // Update other fields (studentID cannot be changed)
    if (name) user.name = name;
    if (email) user.email = email;
    if (contactNumber !== undefined) user.contactNumber = contactNumber;
    if (dialogue !== undefined) user.dialogue = dialogue;

    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(user._id).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser
    });

  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user profile',
      error: error.message
    });
  }
};

// Update profile picture
const updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete old profile picture if exists
    if (user.profilePicture && user.profilePicture.publicId) {
      await deleteFromCloudinary(user.profilePicture.publicId);
    }

    // Upload new profile picture
    const result = await uploadToCloudinary(req.file.buffer, 'profile-pictures');

    user.profilePicture = {
      url: result.secure_url,
      publicId: result.public_id
    };

    await user.save();

    const updatedUser = await User.findById(user._id).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile picture updated successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Update profile picture error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile picture',
      error: error.message
    });
  }
};

// Delete profile picture
const deleteProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.profilePicture || !user.profilePicture.publicId) {
      return res.status(400).json({
        success: false,
        message: 'No profile picture to delete'
      });
    }

    // Delete from Cloudinary
    await deleteFromCloudinary(user.profilePicture.publicId);

    user.profilePicture = {
      url: null,
      publicId: null
    };

    await user.save();

    const updatedUser = await User.findById(user._id).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile picture deleted successfully',
      data: updatedUser
    });
  } catch (error) {
    console.error('Delete profile picture error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete profile picture',
      error: error.message
    });
  }
};

// Add featured photo
const addFeaturedPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const { caption } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user already has 6 featured photos
    if (user.featuredPhotos.length >= 6) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 6 featured photos allowed'
      });
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, 'featured-photos');

    user.featuredPhotos.push({
      url: result.secure_url,
      publicId: result.public_id,
      caption: caption || ''
    });

    await user.save();

    const updatedUser = await User.findById(user._id).select('-password');

    res.status(200).json({
      success: true,
      message: 'Featured photo added successfully',
      data: updatedUser
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
const updateFeaturedPhoto = async (req, res) => {
  try {
    const { photoId } = req.params;
    const { caption } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const photo = user.featuredPhotos.id(photoId);
    
    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Featured photo not found'
      });
    }

    photo.caption = caption || '';
    await user.save();

    const updatedUser = await User.findById(user._id).select('-password');

    res.status(200).json({
      success: true,
      message: 'Featured photo updated successfully',
      data: updatedUser
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
const deleteFeaturedPhoto = async (req, res) => {
  try {
    const { photoId } = req.params;
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const photo = user.featuredPhotos.id(photoId);
    
    if (!photo) {
      return res.status(404).json({
        success: false,
        message: 'Featured photo not found'
      });
    }

    // Delete from Cloudinary
    await deleteFromCloudinary(photo.publicId);

    // Remove from array
    user.featuredPhotos.pull(photoId);
    await user.save();

    const updatedUser = await User.findById(user._id).select('-password');

    res.status(200).json({
      success: true,
      message: 'Featured photo deleted successfully',
      data: updatedUser
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
  getAllMembers,
  getMemberByStudentId,
  getUserProfile,
  updateUserProfile,
  updateProfilePicture,
  deleteProfilePicture,
  addFeaturedPhoto,
  updateFeaturedPhoto,
  deleteFeaturedPhoto
};
