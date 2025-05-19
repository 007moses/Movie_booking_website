import Theater from '../models/Theater.js';
import Booking from '../models/Bookings.js';

// @desc    Create a new theater
// @route   POST /api/theaters
// @access  Private (Admin)
const createTheater = async (req, res) => {
  const { name, address, city, image, showtimes } = req.body;

  // Validate input with specific error messages
  const missingFields = [];
  if (!name) missingFields.push('name');
  if (!address) missingFields.push('address');
  if (!city) missingFields.push('city');

  if (missingFields.length > 0) {
    res.status(400);
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  // Validate showtimes if provided
  if (showtimes && (!Array.isArray(showtimes) || showtimes.length === 0)) {
    res.status(400);
    throw new Error('Showtimes must be a non-empty array');
  }

  // Validate image URL format if provided
  if (image && !/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg))$/i.test(image)) {
    res.status(400);
    throw new Error('Image must be a valid URL ending in .png, .jpg, .jpeg, .gif, .webp, or .svg');
  }

  // Check if theater already exists by name and city
  const theaterExists = await Theater.findOne({ name, city });
  if (theaterExists) {
    res.status(400);
    throw new Error('Theater already exists in this city');
  }

  try {
    // Create theater
    const theater = await Theater.create({
      name,
      address,
      city,
      image: image || null, // Default to null if not provided
      showtimes: showtimes || [], // Default to empty array if not provided
    });

    res.status(201).json({
      success: true,
      data: theater,
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      res.status(400);
      throw new Error(`Validation failed: ${errors.join(', ')}`);
    }
    throw error; // Rethrow other errors
  }
};

// @desc    Get all theaters
// @route   GET /api/theaters
// @access  Public
const getTheaters = async (req, res) => {
  const theaters = await Theater.find({})
    .select('name address city image showtimes')
    .populate('showtimes.movieId', '_id title');

  res.status(200).json({
    success: true,
    data: theaters,
  });
};

// @desc    Get a single theater by ID
// @route   GET /api/theaters/:id
// @access  Public
const getTheaterById = async (req, res) => {
  const theater = await Theater.findById(req.params.id)
    .select('name address city image showtimes')
    .populate('showtimes.movieId', '_id title');

  if (!theater) {
    res.status(404);
    throw new Error('Theater not found');
  }

  res.status(200).json({
    success: true,
    data: theater,
  });
};

// @desc    Update theater details or showtimes
// @route   PATCH /api/theaters/:id
// @access  Private (Admin)
const updateTheater = async (req, res) => {
  const { name, address, city, image, showtimes } = req.body;

  const theater = await Theater.findById(req.params.id);

  if (!theater) {
    res.status(404);
    throw new Error('Theater not found');
  }

  // Update fields if provided
  if (name) theater.name = name;
  if (address) theater.address = address;
  if (city) theater.city = city;
  if (image !== undefined) {
    if (image && !/^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg))$/i.test(image)) {
      res.status(400);
      throw new Error('Image must be a valid URL ending in .png, .jpg, .jpeg, .gif, .webp, or .svg');
    }
    theater.image = image || null;
  }
  if (showtimes !== undefined) {
    if (!Array.isArray(showtimes)) {
      res.status(400);
      throw new Error('Showtimes must be an array');
    }
    theater.showtimes = showtimes;
  }

  const updatedTheater = await theater.save();

  res.status(200).json({
    success: true,
    data: updatedTheater,
  });
};

// @desc    Delete a theater
// @route   DELETE /api/theaters/:id
// @access  Private (Admin)
const deleteTheater = async (req, res) => {
  const theater = await Theater.findById(req.params.id);

  if (!theater) {
    res.status(404);
    throw new Error('Theater not found');
  }

  // Check for active bookings
  const activeBookings = await Booking.find({
    theaterId: req.params.id,
    status: { $ne: 'CANCELLED' },
  });

  if (activeBookings.length > 0) {
    res.status(400);
    throw new Error('Cannot delete theater with active bookings');
  }

  await theater.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Theater deleted successfully',
  });
};

export { createTheater, getTheaters, getTheaterById, updateTheater, deleteTheater };