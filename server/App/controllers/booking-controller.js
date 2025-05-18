import Booking from '../models/Bookings.js';
import Movie from '../models/movie.js';
import Theater from '../models/Theater.js';
import Screen from '../models/Screen.js'; // Assuming a Screen model exists

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  const { movieId, theaterId, screenId, showtime, seats, totalPrice } = req.body;

  // Validate input
  if (!movieId || !theaterId || !screenId || !showtime || !seats || !totalPrice) {
    res.status(400);
    throw new Error('All fields are required');
  }

  // Check if movie exists
  const movie = await Movie.findById(movieId);
  if (!movie) {
    res.status(404);
    throw new Error('Movie not found');
  }

  // Check if theater exists
  const theater = await Theater.findById(theaterId);
  if (!theater) {
    res.status(404);
    throw new Error('Theater not found');
  }

  // Check if screen exists
  const screen = await Screen.findById(screenId);
  if (!screen) {
    res.status(404);
    throw new Error('Screen not found');
  }

  // Check seat availability (assuming Screen model has seat data)
  const unavailableSeats = await Booking.find({
    movieId,
    theaterId,
    'showtime.startTime': new Date(showtime),
    'seats.seatNumber': { $in: seats.map(s => s.seatNumber) },
    status: { $ne: 'CANCELLED' },
  });

  if (unavailableSeats.length > 0) {
    res.status(400);
    throw new Error('Some seats are already booked');
  }

  // Create booking
  const booking = await Booking.create({
    userId: req.user._id, // Assuming user is authenticated and req.user is set
    movieId,
    theaterId,
    showtime: { startTime: new Date(showtime), screenId },
    seats,
    totalPrice,
    status: 'PENDING',
    paymentStatus: 'PENDING',
  });

  res.status(201).json({
    success: true,
    data: booking,
  });
};

// @desc    Get all bookings for a user
// @route   GET /api/bookings
// @access  Private
const getUserBookings = async (req, res) => {
  const bookings = await Booking.find({ userId: req.user._id })
    .populate('movieId', 'title poster')
    .populate('theaterId', 'name city')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: bookings,
  });
};

// @desc    Get a single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('movieId', 'title poster')
    .populate('theaterId', 'name city');

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Ensure user owns the booking
  if (booking.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this booking');
  }

  res.status(200).json({
    success: true,
    data: booking,
  });
};

// @desc    Update booking status (e.g., confirm after payment)
// @route   PATCH /api/bookings/:id
// @access  Private
const updateBookingStatus =  async (req, res) => {
  const { status, paymentStatus } = req.body;

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Ensure user owns the booking
  if (booking.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this booking');
  }

  // Validate status
  if (status && !['PENDING', 'CONFIRMED', 'CANCELLED'].includes(status)) {
    res.status(400);
    throw new Error('Invalid booking status');
  }

  // Validate payment status
  if (paymentStatus && !['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'].includes(paymentStatus)) {
    res.status(400);
    throw new Error('Invalid payment status');
  }

  // Update booking
  if (status) booking.status = status;
  if (paymentStatus) booking.paymentStatus = paymentStatus;

  const updatedBooking = await booking.save();

  res.status(200).json({
    success: true,
    data: updatedBooking,
  });
};

// @desc    Cancel a booking
// @route   DELETE /api/bookings/:id
// @access  Private
const cancelBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Ensure user owns the booking
  if (booking.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to cancel this booking');
  }

  // Check if already cancelled
  if (booking.status === 'CANCELLED') {
    res.status(400);
    throw new Error('Booking is already cancelled');
  }

  booking.status = 'CANCELLED';
  booking.paymentStatus = 'REFUNDED';

  const updatedBooking = await booking.save();

  res.status(200).json({
    success: true,
    data: updatedBooking,
  });
};

export { createBooking, getUserBookings, getBookingById, updateBookingStatus, cancelBooking };