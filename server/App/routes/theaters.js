import express from 'express';
import { createTheater, getTheaters, getTheaterById, updateTheater, deleteTheater } from '../controllers/theater-controller.js';

const theaterRouter = express.Router();

// @route   POST /api/theaters
// @desc    Create a new theater
// @access  Private (Admin)
theaterRouter.post('/', createTheater);

// @route   GET /api/theaters
// @desc    Get all theaters
// @access  Public
theaterRouter.get('/', getTheaters);

// @route   GET /api/theaters/:id
// @desc    Get a single theater by ID
// @access  Public
theaterRouter.get('/:id', getTheaterById);

// @route   PATCH /api/theaters/:id
// @desc    Update theater details or screens
// @access  Private (Admin)
theaterRouter.patch('/:id', updateTheater);

// @route   DELETE /api/theaters/:id
// @desc    Delete a theater
// @access  Private (Admin)
theaterRouter.delete('/:id', deleteTheater);

export default theaterRouter;