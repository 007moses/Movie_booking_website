import { Router } from 'express';
import { createScreen, getScreensByTheater, getScreenById, updateScreen, deleteScreen } from '../controllers/screen-controller.js';
import { protect, admin } from '../../middleware/auth-middleware.js'; // Assuming admin middleware for role check

const screenRouter = Router();

// @desc    Create a new screen for a theater
// @route   POST /api/screens
// @access  Private (Admin)
screenRouter.post('/', protect, admin, createScreen);

// @desc    Get all screens for a theater
// @route   GET /api/screens/theater/:theaterId
// @access  Public
screenRouter.get('/theater/:theaterId', getScreensByTheater);

// @desc    Get a single screen by ID
// @route   GET /api/screens/:id
// @access  Public
screenRouter.get('/:id', getScreenById);

// @desc    Update screen details
// @route   PATCH /api/screens/:id
// @access  Private (Admin)
screenRouter.patch('/:id', protect, admin, updateScreen);

// @desc    Delete a screen
// @route   DELETE /api/screens/:id
// @access  Private (Admin)
screenRouter.delete('/:id', protect, admin, deleteScreen);

export default screenRouter;