import Service from '../models/service.js';


// Create a new place
export const createService = async (req, res) => {
  try {
   
    let { name, description, category, coordinates, location, phone ,website, rating, tags} = req.body;

    // Normalize coordinates from multipart/form-data
    // Accept either coordinates as JSON string or coordinates[lat]/coordinates[lng]
    if (!coordinates && (req.body['coordinates[lat]'] || req.body['coordinates[lng]'])) {
      coordinates = {
        lat: req.body['coordinates[lat]'],
        lng: req.body['coordinates[lng]'],
      };
    }
    if (typeof coordinates === 'string') {
      try { coordinates = JSON.parse(coordinates); } catch (_) {}
    }

    // Validate required fields
    if (!name || !description || !category || !location || !coordinates?.lat || !coordinates?.lng || !phone) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Handle images and videos
    const images = req.files?.images?.map(file => file.filename) || [];
    const videos = req.files?.videos?.map(file => file.filename) || [];

    const newService = new Service({
      name,
      description,
      category,
      location,
      coordinates: {
        lat: Number(coordinates.lat),
        lng: Number(coordinates.lng)
      },
      website,
      phone,
      images,
      rating,
      videos,
      tags,
    });
    

    const savedService = await newService.save();
    return res.status(201).json(savedService);


  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};


// Get all places
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().populate('category', 'name');
    if (!services || services.length === 0) {
      return res.status(404).json({ message: 'No places found for this category' });
    }
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get place by ID
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate('category', 'name');
    if (!service) {
      return res.status(404).json({ message: 'Place not found' });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get places by category
export const getServiceByCategory = async (req, res) => {
  try {
    const service = await Service.find({
      category: { $regex: new RegExp(`^${req.params.categoryId}$`, "i") }
    });
    
    if (!service || service.length === 0) {
      return res.status(404).json({ message: "No places found for this category" });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update place
export const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Place not found' });
    }

    let { coordinates } = req.body;

    // Normalize coordinates
    if (!coordinates && (req.body['coordinates[lat]'] || req.body['coordinates[lng]'])) {
      coordinates = {
        lat: req.body['coordinates[lat]'],
        lng: req.body['coordinates[lng]'],
      };
    }
    if (typeof coordinates === 'string') {
      try { coordinates = JSON.parse(coordinates); } catch (_) {}
    }

    // Primitive fields
    if (req.body.name) service.name = req.body.name;
    if (req.body.description) service.description = req.body.description;
    if (req.body.location) service.location = req.body.location;
    if (coordinates && coordinates.lat != null && coordinates.lng != null) {
      service.coordinates = { lat: Number(coordinates.lat), lng: Number(coordinates.lng) };
    }
    if (req.body.category) service.category = req.body.category;

    // Files: append new uploads to existing arrays
    const newImages = req.files?.images?.map(f => f.filename) || [];
    const newVideos = req.files?.videos?.map(f => f.filename) || [];
    if (newImages.length > 0) {
      service.images = Array.isArray(service.images) ? [...service.images, ...newImages] : newImages;
    }
    if (newVideos.length > 0) {
      service.videos = Array.isArray(service.videos) ? [...service.videos, ...newVideos] : newVideos;
    }

    const updatedService = await service.save();
    res.json(updatedService);
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: error.message });
  }
};

// Delete place
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Place not found' });
    }

    await Service.deleteOne({ _id: req.params.id });
    res.json({ message: 'Place deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add review
export const addReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Place not found' });
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    service.reviews.push(review);
    service.rating =
      service.reviews.reduce((acc, item) => item.rating + acc, 0) /
      service.reviews.length;

    await service.save();
    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
