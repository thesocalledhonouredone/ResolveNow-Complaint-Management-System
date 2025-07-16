import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Complaint title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Complaint description is required'],
    trim: true,
    minlength: [20, 'Description must be at least 20 characters'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Technical Support',
      'Billing & Payment',
      'Service Quality',
      'Product Defect',
      'Delivery Issue',
      'Customer Service',
      'Account Management',
      'Other'
    ]
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'resolved', 'closed'],
    default: 'pending'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  attachments: [{
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    path: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: [1000, 'Comment cannot be more than 1000 characters']
    },
    isInternal: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  resolution: {
    message: String,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    resolvedAt: Date
  },
  tags: [{
    type: String,
    trim: true
  }],
  metadata: {
    source: {
      type: String,
      enum: ['web', 'mobile', 'email', 'phone'],
      default: 'web'
    },
    ipAddress: String,
    userAgent: String,
    location: {
      country: String,
      city: String,
      coordinates: {
        lat: Number,
        lng: Number
      }
    }
  },
  escalated: {
    type: Boolean,
    default: false
  },
  escalatedAt: Date,
  escalatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  dueDate: Date,
  rating: {
    score: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: String,
    ratedAt: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
complaintSchema.index({ user: 1, status: 1 });
complaintSchema.index({ status: 1, priority: 1 });
complaintSchema.index({ category: 1 });
complaintSchema.index({ assignedTo: 1 });
complaintSchema.index({ createdAt: -1 });
complaintSchema.index({ 'title': 'text', 'description': 'text' });

// Virtual for complaint age in days
complaintSchema.virtual('ageInDays').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for time to resolution
complaintSchema.virtual('resolutionTime').get(function() {
  if (this.resolution && this.resolution.resolvedAt) {
    return Math.floor((this.resolution.resolvedAt - this.createdAt) / (1000 * 60 * 60 * 24));
  }
  return null;
});

// Pre-save middleware to set due date based on priority
complaintSchema.pre('save', function(next) {
  if (this.isNew && !this.dueDate) {
    const now = new Date();
    switch (this.priority) {
      case 'high':
        this.dueDate = new Date(now.getTime() + (24 * 60 * 60 * 1000)); // 1 day
        break;
      case 'medium':
        this.dueDate = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000)); // 3 days
        break;
      case 'low':
        this.dueDate = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days
        break;
    }
  }
  next();
});

// Method to add comment
complaintSchema.methods.addComment = function(userId, message, isInternal = false) {
  this.comments.push({
    user: userId,
    message,
    isInternal
  });
  return this.save();
};

// Method to update status
complaintSchema.methods.updateStatus = function(newStatus, userId) {
  const oldStatus = this.status;
  this.status = newStatus;
  
  if (newStatus === 'resolved' && oldStatus !== 'resolved') {
    this.resolution = {
      resolvedBy: userId,
      resolvedAt: new Date()
    };
  }
  
  return this.save();
};

// Method to escalate complaint
complaintSchema.methods.escalate = function(userId) {
  this.escalated = true;
  this.escalatedAt = new Date();
  this.escalatedBy = userId;
  this.priority = 'high';
  return this.save();
};

// Static method to get complaints by status
complaintSchema.statics.getByStatus = function(status) {
  return this.find({ status }).populate('user', 'name email').sort({ createdAt: -1 });
};

// Static method to get overdue complaints
complaintSchema.statics.getOverdue = function() {
  return this.find({
    dueDate: { $lt: new Date() },
    status: { $nin: ['resolved', 'closed'] }
  }).populate('user', 'name email').sort({ dueDate: 1 });
};

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;