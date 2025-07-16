import express from 'express';
import Complaint from '../models/Complaint.js';
import User from '../models/User.js';
import { protect, adminOnly, authorize } from '../middleware/auth.js';
import {
  validateComplaintCreation,
  validateComplaintUpdate,
  validateComplaintComment,
  validateObjectId,
  validatePagination,
  validateComplaintFilters
} from '../middleware/validation.js';
import { buildPaginatedResponse, paginate } from '../utils/pagination.js';

const router = express.Router();

// @desc    Get all complaints (admin) or user's complaints
// @route   GET /api/complaints
// @access  Private
router.get('/', protect, validatePagination, validateComplaintFilters, async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = '-createdAt',
      status,
      priority,
      category,
      search,
      assignedTo
    } = req.query;

    // Build query
    let query = {};

    // If not admin, only show user's complaints
    if (req.user.role !== 'admin') {
      query.user = req.user._id;
    }

    // Apply filters
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (assignedTo && req.user.role === 'admin') query.assignedTo = assignedTo;

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Get total count
    const total = await Complaint.countDocuments(query);

    // Build and execute query with pagination
    let complaintsQuery = Complaint.find(query)
      .populate('user', 'name email')
      .populate('assignedTo', 'name email')
      .sort(sort);

    complaintsQuery = paginate(complaintsQuery, page, limit);
    const complaints = await complaintsQuery;

    res.status(200).json(
      buildPaginatedResponse(complaints, total, page, limit, 'Complaints retrieved successfully')
    );
  } catch (error) {
    next(error);
  }
});

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
router.get('/:id', protect, validateObjectId('id'), async (req, res, next) => {
  try {
    let query = { _id: req.params.id };

    // If not admin, only allow access to own complaints
    if (req.user.role !== 'admin') {
      query.user = req.user._id;
    }

    const complaint = await Complaint.findOne(query)
      .populate('user', 'name email phone')
      .populate('assignedTo', 'name email')
      .populate('comments.user', 'name email')
      .populate('resolution.resolvedBy', 'name email');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Filter internal comments for non-admin users
    if (req.user.role !== 'admin') {
      complaint.comments = complaint.comments.filter(comment => !comment.isInternal);
    }

    res.status(200).json({
      success: true,
      message: 'Complaint retrieved successfully',
      data: complaint
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create new complaint
// @route   POST /api/complaints
// @access  Private
router.post('/', protect, validateComplaintCreation, async (req, res, next) => {
  try {
    const { title, description, category, priority, tags } = req.body;

    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority: priority || 'medium',
      user: req.user._id,
      tags: tags || [],
      metadata: {
        source: 'web',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    // Populate user data
    await complaint.populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Complaint created successfully',
      data: complaint
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update complaint
// @route   PUT /api/complaints/:id
// @access  Private
router.put('/:id', protect, validateObjectId('id'), validateComplaintUpdate, async (req, res, next) => {
  try {
    let query = { _id: req.params.id };

    // If not admin, only allow updating own complaints
    if (req.user.role !== 'admin') {
      query.user = req.user._id;
      // Users can only update title, description, and category
      const { title, description, category } = req.body;
      req.body = { title, description, category };
    }

    const complaint = await Complaint.findOne(query);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        complaint[key] = req.body[key];
      }
    });

    await complaint.save();
    await complaint.populate('user', 'name email');
    await complaint.populate('assignedTo', 'name email');

    res.status(200).json({
      success: true,
      message: 'Complaint updated successfully',
      data: complaint
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update complaint status
// @route   PUT /api/complaints/:id/status
// @access  Private (Admin only)
router.put('/:id/status', protect, adminOnly, validateObjectId('id'), async (req, res, next) => {
  try {
    const { status, resolution } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Update status using the model method
    await complaint.updateStatus(status, req.user._id);

    // Add resolution message if provided
    if (status === 'resolved' && resolution) {
      complaint.resolution.message = resolution;
      await complaint.save();
    }

    await complaint.populate('user', 'name email');
    await complaint.populate('assignedTo', 'name email');
    await complaint.populate('resolution.resolvedBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Complaint status updated successfully',
      data: complaint
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Assign complaint to user
// @route   PUT /api/complaints/:id/assign
// @access  Private (Admin only)
router.put('/:id/assign', protect, adminOnly, validateObjectId('id'), async (req, res, next) => {
  try {
    const { assignedTo } = req.body;

    if (!assignedTo) {
      return res.status(400).json({
        success: false,
        message: 'assignedTo user ID is required'
      });
    }

    // Check if assigned user exists and is admin
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser || assignedUser.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Invalid user or user is not an admin'
      });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { assignedTo },
      { new: true, runValidators: true }
    )
      .populate('user', 'name email')
      .populate('assignedTo', 'name email');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Complaint assigned successfully',
      data: complaint
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Add comment to complaint
// @route   POST /api/complaints/:id/comments
// @access  Private
router.post('/:id/comments', protect, validateObjectId('id'), validateComplaintComment, async (req, res, next) => {
  try {
    const { message, isInternal = false } = req.body;

    let query = { _id: req.params.id };

    // If not admin, only allow commenting on own complaints
    if (req.user.role !== 'admin') {
      query.user = req.user._id;
    }

    const complaint = await Complaint.findOne(query);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Only admins can add internal comments
    const commentIsInternal = req.user.role === 'admin' ? isInternal : false;

    await complaint.addComment(req.user._id, message, commentIsInternal);
    await complaint.populate('comments.user', 'name email');

    // Filter internal comments for non-admin users
    let comments = complaint.comments;
    if (req.user.role !== 'admin') {
      comments = comments.filter(comment => !comment.isInternal);
    }

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: { comments }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Escalate complaint
// @route   PUT /api/complaints/:id/escalate
// @access  Private (Admin only)
router.put('/:id/escalate', protect, adminOnly, validateObjectId('id'), async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    if (complaint.escalated) {
      return res.status(400).json({
        success: false,
        message: 'Complaint is already escalated'
      });
    }

    await complaint.escalate(req.user._id);
    await complaint.populate('user', 'name email');
    await complaint.populate('escalatedBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Complaint escalated successfully',
      data: complaint
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
// @access  Private (Admin only)
router.delete('/:id', protect, adminOnly, validateObjectId('id'), async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    await complaint.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Complaint deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get complaint statistics
// @route   GET /api/complaints/stats/overview
// @access  Private (Admin only)
router.get('/stats/overview', protect, adminOnly, async (req, res, next) => {
  try {
    const stats = await Complaint.aggregate([
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
          },
          high: {
            $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] }
          },
          medium: {
            $sum: { $cond: [{ $eq: ['$priority', 'medium'] }, 1, 0] }
          },
          low: {
            $sum: { $cond: [{ $eq: ['$priority', 'low'] }, 1, 0] }
          },
          escalated: {
            $sum: { $cond: ['$escalated', 1, 0] }
          }
        }
      }
    ]);

    const result = stats[0] || {
      total: 0,
      pending: 0,
      inProgress: 0,
      resolved: 0,
      closed: 0,
      high: 0,
      medium: 0,
      low: 0,
      escalated: 0
    };

    res.status(200).json({
      success: true,
      message: 'Complaint statistics retrieved successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
});

export default router;