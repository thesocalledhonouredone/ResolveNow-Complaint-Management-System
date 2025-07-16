import express from 'express';
import Complaint from '../models/Complaint.js';
import User from '../models/User.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get user dashboard stats
// @route   GET /api/dashboard/user
// @access  Private
router.get('/user', protect, async (req, res, next) => {
  try {
    // Get user's complaint statistics
    const stats = await Complaint.aggregate([
      { $match: { user: req.user._id } },
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

    const result = stats[0] || {
      total: 0,
      pending: 0,
      inProgress: 0,
      resolved: 0,
      closed: 0
    };

    // Get recent complaints
    const recentComplaints = await Complaint.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status priority createdAt');

    res.status(200).json({
      success: true,
      message: 'User dashboard data retrieved successfully',
      data: {
        stats: result,
        recentComplaints
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get admin dashboard stats
// @route   GET /api/dashboard/admin
// @access  Private (Admin only)
router.get('/admin', protect, adminOnly, async (req, res, next) => {
  try {
    // Get complaint statistics
    const complaintStats = await Complaint.aggregate([
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

    // Get user statistics
    const userStats = await User.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: {
            $sum: { $cond: ['$isActive', 1, 0] }
          },
          admins: {
            $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] }
          },
          users: {
            $sum: { $cond: [{ $eq: ['$role', 'user'] }, 1, 0] }
          }
        }
      }
    ]);

    // Get complaints by category
    const categoryStats = await Complaint.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get recent complaints
    const recentComplaints = await Complaint.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('title status priority user createdAt');

    // Get overdue complaints
    const overdueComplaints = await Complaint.find({
      dueDate: { $lt: new Date() },
      status: { $nin: ['resolved', 'closed'] }
    })
      .populate('user', 'name email')
      .sort({ dueDate: 1 })
      .limit(5)
      .select('title priority dueDate user');

    // Get complaints trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const trendData = await Complaint.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const complaintStatsResult = complaintStats[0] || {
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

    const userStatsResult = userStats[0] || {
      total: 0,
      active: 0,
      admins: 0,
      users: 0
    };

    res.status(200).json({
      success: true,
      message: 'Admin dashboard data retrieved successfully',
      data: {
        complaintStats: complaintStatsResult,
        userStats: userStatsResult,
        categoryStats,
        recentComplaints,
        overdueComplaints,
        trendData
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get complaints analytics
// @route   GET /api/dashboard/analytics
// @access  Private (Admin only)
router.get('/analytics', protect, adminOnly, async (req, res, next) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Resolution time analytics
    const resolutionTimeStats = await Complaint.aggregate([
      {
        $match: {
          status: 'resolved',
          'resolution.resolvedAt': { $exists: true }
        }
      },
      {
        $addFields: {
          resolutionTimeHours: {
            $divide: [
              { $subtract: ['$resolution.resolvedAt', '$createdAt'] },
              1000 * 60 * 60
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgResolutionTime: { $avg: '$resolutionTimeHours' },
          minResolutionTime: { $min: '$resolutionTimeHours' },
          maxResolutionTime: { $max: '$resolutionTimeHours' },
          totalResolved: { $sum: 1 }
        }
      }
    ]);

    // Complaints by priority over time
    const priorityTrend = await Complaint.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            priority: '$priority'
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    // User satisfaction (based on ratings)
    const satisfactionStats = await Complaint.aggregate([
      {
        $match: {
          'rating.score': { $exists: true }
        }
      },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating.score' },
          totalRatings: { $sum: 1 },
          ratings: {
            $push: '$rating.score'
          }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      message: 'Analytics data retrieved successfully',
      data: {
        resolutionTime: resolutionTimeStats[0] || {
          avgResolutionTime: 0,
          minResolutionTime: 0,
          maxResolutionTime: 0,
          totalResolved: 0
        },
        priorityTrend,
        satisfaction: satisfactionStats[0] || {
          avgRating: 0,
          totalRatings: 0,
          ratings: []
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;