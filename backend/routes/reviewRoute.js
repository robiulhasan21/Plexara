import express from 'express'
import { createReview, getAllReviews } from '../controllers/reviewController.js'
import adminAuth from '../middleware/adminAuth.js'

const router = express.Router()

// POST /api/review - Create a new review (public)
router.post('/', createReview)

// GET /api/review - Get all reviews (admin only)
router.get('/', adminAuth, getAllReviews)

export default router

