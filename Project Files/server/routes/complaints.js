import express from 'express';
import Complaint from '../models/Complaint.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all complaints (filtered by role)
router.get('/', authenticate, async (req, res) => {
  try {
    let query = {};

    // Filter complaints based on user role
    if (req.user.role === 'user') {
      query.createdBy = req.user._id;
    } else if (req.user.role === 'engineer') {
      query.assignedTo = req.user._id;
    }
    // Admin sees all complaints (no filter)

    const complaints = await Complaint.find(query)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single complaint
router.get('/:id', authenticate, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Check if user has permission to view this complaint
    const canView = 
      req.user.role === 'admin' ||
      complaint.createdBy._id.toString() === req.user._id.toString() ||
      (complaint.assignedTo && complaint.assignedTo._id.toString() === req.user._id.toString());

    if (!canView) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(complaint);
  } catch (error) {
    console.error('Get complaint error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new complaint
router.post('/', authenticate, authorize('user'), async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    const complaint = new Complaint({
      title,
      description,
      priority: priority || 'medium',
      createdBy: req.user._id,
    });

    await complaint.save();
    await complaint.populate('createdBy', 'name email');

    res.status(201).json(complaint);
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Assign complaint to engineer (admin only)
router.put('/:id/assign', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { engineerId } = req.body;

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      {
        assignedTo: engineerId,
        status: 'assigned',
      },
      { new: true }
    )
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json(complaint);
  } catch (error) {
    console.error('Assign complaint error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update complaint status (engineer only)
router.put('/:id/status', authenticate, async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Check permissions
    const canUpdate = 
      req.user.role === 'admin' ||
      (req.user.role === 'engineer' && 
       complaint.assignedTo && 
       complaint.assignedTo.toString() === req.user._id.toString());

    if (!canUpdate) {
      return res.status(403).json({ message: 'Access denied' });
    }

    complaint.status = status;
    await complaint.save();
    await complaint.populate('createdBy', 'name email');
    await complaint.populate('assignedTo', 'name email');

    res.json(complaint);
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;