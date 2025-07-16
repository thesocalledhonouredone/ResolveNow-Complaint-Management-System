import express from 'express';
import User from '../models/User.js';
import Complaint from '../models/Complaint.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { validateObjectId, validatePagination } from '../middleware/validation.js';
import { buildPaginatedResponse, paginate } from '../utils/pagination.js';

const router = express.Router();

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin only)
router.get('/', protect, adminOnly, validatePagination, async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = '-createdAt',
      role,
      isActive,
      search
    } = req.query;

    // Build query
    let query = {};

    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Get total count
    const total = await User.countDocuments(query);

    // Build and execute query with pagination
    let usersQuery = User.find(query)
      .select('-password -emailVerificationToken -passwordResetToken -passwordResetExpires')
      .sort(sort);

    usersQuery = paginate(usersQuery, page, limit);
    const users = await usersQuery;

    // Get complaint counts for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const complaintsCount = await Complaint.countDocuments({ user: user._id });
        return {
          ...user.toObject(),
          complaintsCount
        };
      })
    );

    res.status(200).json(
      buildPaginatedResponse(usersWithStats, total, page, limit, 'Users retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private (Admin only)
router.get('/:id', protect, adminOnly, validateObjectId('id'), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -emailVerificationToken -passwordResetToken -passwordResetExpires');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's complaint statistics
    const complaintsStats = await Complaint.aggregate([
      { $match: { user: user._id } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] }
          },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] }
          },
          closed: {
            $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] }
          }
        }
      }
    ]);

    const stats = complaintsStats[0] || {
      total: 0,
      pending: 0,
      inProgress: 0,
      resolved: 0,
      closed: 0
    };

    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: {
        ...user.toObject(),
        complaintsStats: stats
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin only)
router.put('/:id', protect, adminOnly, validateObjectId('id'), async (req, res, next) => {
  try {
    const { name, email, role, isActive, phone, address } = req.body;

    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (email) fieldsToUpdate.email = email;
    if (role) fieldsToUpdate.role = role;
    if (isActive !== undefined) fieldsToUpdate.isActive = isActive;
    if (phone) fieldsToUpdate.phone = phone;
    if (address) fieldsToUpdate.address = address;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    ).select('-password -emailVerificationToken -passwordResetToken -passwordResetExpires');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
router.delete('/:id', protect, adminOnly, validateObjectId('id'), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has complaints
    const complaintsCount = await Complaint.countDocuments({ user: user._id });
    
    if (complaintsCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete user with existing complaints. Please resolve or transfer complaints first.'
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get user's complaints
// @route   GET /api/users/:id/complaints
// @access  Private (Admin only)
router.get('/:id/complaints', protect, adminOnly, validateObjectId('id'), validatePagination, async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

    // Check if user exists
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get total count
    const total = await Complaint.countDocuments({ user: req.params.id });

    // Build and execute query with pagination
    let complaintsQuery = Complaint.find({ user: req.params.id })
      .populate('assignedTo', 'name email')
      .sort(sort);

    complaintsQuery = paginate(complaintsQuery, page, limit);
    const complaints = await complaintsQuery;

    res.status(200).json(
      buildPaginatedResponse(complaints, total, page, limit, 'User complaints retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
});

// @desc    Get user statistics
// @route   GET /api/users/stats/overview
// @access  Private (Admin only)
router.get('/stats/overview', protect, adminOnly, async (req, res, next) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: {
            $sum: { $cond: ['$isActive', 1, 0] }
          },
          inactive: {
            $sum: { $cond: ['$isActive', 0, 1] }
          },
          admins: {
            $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] }
          },
          users: {
            $sum: { $cond: [{ $eq: ['$role', 'user'] }, 1, 0] }
          },
          verified: {
            $sum: { $cond: ['$emailVerified', 1, 0] }
          }
        }
      }
    ]);

    const result = stats[0] || {
      total: 0,
      active: 0,
      inactive: 0,
      admins: 0,
      users: 0,
      verified: 0
    };

    res.status(200).json({
      success: true,
      message: 'User statistics retrieved successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
});

export default router;