import express from 'express';
import {
  addReview,
  createService,
  getAllServices,
  getServiceById,
  getServiceByCategory,
  updateService,
  deleteService
} from '../controllers/servicesController.js';
import upload, { handleUploadError } from '../middleware/uploadMiddleware.js';
import { protect, admin } from '../middleware/authmiddleware.js';

const router = express.Router();

// Create new service
router.post(
  '/',
  protect,
  upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'videos', maxCount: 3 },
  ]),
  handleUploadError,
  createService
);

// Get all services
router.get('/', getAllServices);

// ✅ Specific route before :id
router.get('/category/:categoryId', getServiceByCategory);

// Get service by id
router.get('/:id', getServiceById);

// Update service
router.put(
  '/:id',
  protect,
  admin,
  upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'videos', maxCount: 3 },
  ]),
  handleUploadError,
  updateService
);

// Delete service
router.delete('/:id', protect, admin, deleteService);

// Add review
router.post('/:id/review', protect, addReview);

export default router;
