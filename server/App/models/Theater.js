import mongoose from "mongoose";

const theaterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Theater name is required'],
    trim: true,
    maxlength: [100, 'Theater name cannot exceed 100 characters'],
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
    maxlength: [255, 'Address cannot exceed 255 characters'],
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
    maxlength: [50, 'City cannot exceed 50 characters'],
  },
  screens: [{
    screenNumber: {
      type: Number,
      required: true, 
      min: [1, 'Screen number must be at least 1'],
    },
    totalSeats: {
      type: Number,
      required: [true, 'Total seats is required'],
      min: [1, 'Total seats must be at least 1'],
    },
    seatLayout: [{
      seatNumber: {
        type: String,
        required: [true, 'Seat number is required'],
        trim: true, // e.g., "A1", "B12"
      },
      seatType: {
        type: String,
        enum: ['STANDARD', 'PREMIUM', 'VIP'],
        default: 'STANDARD',
      },
      isAvailable: {
        type: Boolean,
        default: true,
      },
    }],
  }],
}, {
  timestamps: true,
});

// Indexes for efficient querying
theaterSchema.index({ name: 'text', city: 'text' });
theaterSchema.index({ 'screens.screenNumber': 1 });

const Theater = mongoose.model('Theater', theaterSchema);

export default Theater;