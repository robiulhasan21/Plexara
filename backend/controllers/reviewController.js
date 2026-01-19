import Review from '../models/reviewModel.js'

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { name, email, rating, review } = req.body
    
    if (!name || !email || !rating || !review) {
      return res.status(400).json({ 
        success: false,
        message: 'Name, email, rating and review are required' 
      })
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false,
        message: 'Rating must be between 1 and 5' 
      })
    }

    const newReview = new Review({ name, email, rating, review })
    await newReview.save()

    return res.status(201).json({ 
      success: true,
      message: 'Review submitted successfully',
      review: newReview
    })
  } catch (err) {
    console.error('createReview error:', err)
    return res.status(500).json({ 
      success: false,
      message: 'Unable to submit review',
      error: err.message 
    })
  }
}

// Get all reviews (for admin)
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 })
    
    return res.status(200).json({ 
      success: true,
      reviews 
    })
  } catch (err) {
    console.error('getAllReviews error:', err)
    return res.status(500).json({ 
      success: false,
      message: 'Unable to fetch reviews',
      error: err.message 
    })
  }
}

