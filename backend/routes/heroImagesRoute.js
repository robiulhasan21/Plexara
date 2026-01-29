import express from 'express';
import { getHeroImages, addHeroImages, deleteHeroImage, reorderHeroImages, deleteSubheroImage, deleteHeroVideo } from '../controllers/heroImagesController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const heroImagesRouter = express.Router();

// Get hero images (public endpoint - frontend can fetch)
heroImagesRouter.get('/', getHeroImages);

// Add hero images (admin only) - supports unlimited images
heroImagesRouter.post(
  '/add',
  adminAuth,
  upload.any(), // Accept any number of files with any field names
  addHeroImages
);

// Delete hero image by index (admin only)
heroImagesRouter.post('/delete', adminAuth, deleteHeroImage);

// Delete individual subhero image field
heroImagesRouter.post('/delete-subhero', adminAuth, deleteSubheroImage);

// Delete individual hero video field
heroImagesRouter.post('/delete-video', adminAuth, deleteHeroVideo);

// Reorder hero images (admin only)
heroImagesRouter.post('/reorder', adminAuth, reorderHeroImages);

export default heroImagesRouter;

