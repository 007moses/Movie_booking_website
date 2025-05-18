import { Router } from 'express';
import { createBooking, getUserBookings, getBookingById, updateBookingStatus, cancelBooking } from '../controllers/booking-controller.js';
// import { protect } from '../../middleware/auth-middleware.js'; // Assuming you have an auth middleware

const bookingRouter = Router();

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
bookingRouter.post('/',createBooking);

// @desc    Get all bookings for a user
// @route   GET /api/bookings
// @access  Private
bookingRouter.get('/', getUserBookings);

// @desc    Get a single booking by ID
// @route   GET /api/bookings/:id
// @access  Private
bookingRouter.get('/:id', getBookingById);

// @desc    Update booking status (e.g., confirm after payment)
// @route   PATCH /api/bookings/:id
// @access  Private
bookingRouter.patch('/:id', updateBookingStatus);

// @desc    Cancel a booking
// @route   DELETE /api/bookings/:id
// @access  Private
bookingRouter.delete('/:id', cancelBooking);

export default bookingRouter;