import express from 'express'
import { createCategory, getCategories, deleteCategory, updateCategory } from '../controllers/categoryController.js'
import {protect,admin} from '../middleware/authmiddleware.js'
const router=express.Router()
// routes
router.post('/', protect, admin, createCategory)
router.get('/',getCategories)
router.delete('/:id', protect, admin, deleteCategory)
router.put('/:id', protect, admin, updateCategory)
export default router