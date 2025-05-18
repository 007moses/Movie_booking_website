import mongoose from "mongoose";

const screenSchema = new mongoose.Schema({
  theaterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater',
    required: [true, 'Theater ID is required'],
  },
  screenNumber: {
    type: Number,
    required: [true, 'Screen number is required'],
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
}, {
  timestamps: true,
});

// Indexes for efficient querying
screenSchema.index({ theaterId: 1, screenNumber: 1 }, { unique: true });
screenSchema.index({ theaterId: 1 });

const Screen = mongoose.model('Screen', screenSchema);

export default Screen;