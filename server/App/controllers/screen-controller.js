import Booking from '../models/Bookings.js';
import Screen from '../models/Screen.js';
import Theater from '../models/Theater.js';

// @desc    Create a new screen for a theater
// @route   POST /api/screens
// @access  Private (Admin)
const createScreen = async (req, res) => {
  const { theaterId, screenNumber, totalSeats, seatLayout } = req.body;

  // Validate input
  if (!theaterId || !screenNumber || !totalSeats || !seatLayout) {
    res.status(400);
    throw new Error('All fields are required');
  }

  // Check if theater exists
  const theater = await Theater.findById(theaterId);
  if (!theater) {
    res.status(404);
    throw new Error('Theater not found');
  }

  // Check if screen number already exists for this theater
  const screenExists = await Screen.findOne({ theaterId, screenNumber });
  if (screenExists) {
    res.status(400);
    throw new Error('Screen number already exists for this theater');
  }

  // Validate seatLayout matches totalSeats
  if (seatLayout.length !== totalSeats) {
    res.status(400);
    throw new Error('Seat layout count must match total seats');
  }

  // Create screen
  const screen = await Screen.create({
    theaterId,
    screenNumber,
    totalSeats,
    seatLayout,
  });

  res.status(201).json({
    success: true,
    data: screen,
  });
};

// @desc    Get all screens for a theater
// @route   GET /api/screens/theater/:theaterId
// @access  Public
const getScreensByTheater = async (req, res) => {
  const screens = await Screen.find({ theaterId: req.params.theaterId }).select(
    'screenNumber totalSeats seatLayout'
  );

  res.status(200).json({
    success: true,
    data: screens,
  });
};

// @desc    Get a single screen by ID
// @route   GET /api/screens/:id
// @access  Public
const getScreenById = async (req, res) => {
  const screen = await Screen.findById(req.params.id);

  if (!screen) {
    res.status(404);
    throw new Error('Screen not found');
  }

  res.status(200).json({
    success: true,
    data: screen,
  });
};

// @desc    Update screen details
// @route   PATCH /api/screens/:id
// @access  Private (Admin)
const updateScreen = async (req, res) => {
  const { screenNumber, totalSeats, seatLayout } = req.body;

  const screen = await Screen.findById(req.params.id);

  if (!screen) {
    res.status(404);
    throw new Error('Screen not found');
  }

  // Validate seatLayout matches totalSeats if both provided
  if (seatLayout && totalSeats && seatLayout.length !== totalSeats) {
    res.status(400);
    throw new Error('Seat layout count must match total seats');
  }

  // Update fields if provided
  if (screenNumber) screen.screenNumber = screenNumber;
  if (totalSeats) screen.totalSeats = totalSeats;
  if (seatLayout) screen.seatLayout = seatLayout;

  const updatedScreen = await screen.save();

  res.status(200).json({
    success: true,
    data: updatedScreen,
  });
};

// @desc    Delete a screen
// @route   DELETE /api/screens/:id
// @access  Private (Admin)
const deleteScreen = async (req, res) => {
  const screen = await Screen.findById(req.params.id);

  if (!screen) {
    res.status(404);
    throw new Error('Screen not found');
  }

  // Check for active bookings
  const activeBookings = await Booking.find({
    'showtime.screenId': req.params.id,
    status: { $ne: 'CANCELLED' },
  });

  if (activeBookings.length > 0) {
    res.status(400);
    throw new Error('Cannot delete screen with active bookings');
  }

  await screen.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Screen deleted successfully',
  });
};

export { createScreen, getScreensByTheater, getScreenById, updateScreen, deleteScreen };