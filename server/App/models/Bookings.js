import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: [true, 'Movie ID is required'],
  },
  theaterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater',
    required: [true, 'Theater ID is required'],
  },
  showtime: {
    startTime: {
      type: Date,
      required: [true, 'Showtime start time is required'],
    },
    screenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Screen',
      required: [true, 'Screen ID is required'],
    },
  },
  seats: [{
    seatNumber: {
      type: String,
      required: [true, 'Seat number is required'],
      trim: true,
    },
    seatType: {
      type: String,
      enum: ['STANDARD', 'PREMIUM', 'VIP'],
      default: 'STANDARD',
    },
  }],
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
    min: [0, 'Total price cannot be negative'],
  },
  status: {
    type: String,
    enum: ['PENDING', 'CONFIRMED', 'CANCELLED'],
    default: 'PENDING',
  },
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
    default: 'PENDING',
  },
}, {
  timestamps: true,
});

// Indexes for efficient querying
bookingSchema.index({ userId: 1 });
bookingSchema.index({ movieId: 1 });
bookingSchema.index({ theaterId: 1 });
bookingSchema.index({ 'showtime.startTime': 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;