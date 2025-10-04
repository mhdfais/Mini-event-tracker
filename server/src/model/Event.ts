import mongoose, { Schema } from "mongoose";
import { IEvent } from "../types";
import crypto from 'crypto';

const eventSchema = new Schema<IEvent>({
  user: {
    type: String,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  dateTime: {
    type: Date,
    required: [true, 'Date and time are required']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  shareToken: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

eventSchema.pre('save', function(next) {
  if (!this.shareToken) {
    this.shareToken = crypto.randomBytes(16).toString('hex');
  }
  next();
});

eventSchema.index({ user: 1, dateTime: -1 });

export default mongoose.model<IEvent>('Event', eventSchema);