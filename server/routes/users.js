import express from 'express';
import User from '../models/User.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all engineers (for admin to assign complaints)
router.get('/engineers', authenticate, authorize('admin'), async (req, res) => {
  try {
    const engineers = await User.find({ role: 'engineer' }).select('name email');
    res.json(engineers);
  } catch (error) {
    console.error('Get engineers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;