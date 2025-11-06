import Service from "../models/service.js";

// Create a new service
export const createService = async (req, res) => {
  try {
    let {
      name,
      description,
      category,
      coordinates,
      location,
      phone,
      website,
      rating,
      tags,
    } = req.body;

    // Normalize coordinates
    if (!coordinates && (req.body["coordinates[lat]"] || req.body["coordinates[lng]"])) {
      coordinates = {
        lat: req.body["coordinates[lat]"],
        lng: req.body["coordinates[lng]"],
      };
    }
    if (typeof coordinates === "string") {
      try {
        coordinates = JSON.parse(coordinates);
      } catch (_) {}
    }

    // Validation
    if (
      !name ||
      !description ||
      !category ||
      !location ||
      !coordinates?.lat ||
      !coordinates?.lng ||
      !phone
    ) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Cloudinary uploads return URLs in `file.path` or `file.secure_url`
    const images = req.files?.images?.map((file) => file.path || file.secure_url).filter(Boolean) || [];
    const videos = req.files?.videos?.map((file) => file.path || file.secure_url).filter(Boolean) || [];
    
    console.log("Uploaded images:", images);
    console.log("Uploaded videos:", videos);

    const newService = new Service({
      name,
      description,
      category,
      location,
      coordinates: {
        lat: Number(coordinates.lat),
        lng: Number(coordinates.lng),
      },
      website,
      phone,
      images, // Now contains Cloudinary URLs
      rating,
      videos,
      tags,
    });

    const savedService = await newService.save();
    return res.status(201).json(savedService);
  } catch (error) {
    console.error("Error creating service:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Get all services
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().populate("category", "name");
    if (!services || services.length === 0) {
      return res.status(404).json({ message: "No services found" });
    }
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get service by ID
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate("category", "name");
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get services by category
export const getServiceByCategory = async (req, res) => {
  try {
    const service = await Service.find({
      category: { $regex: new RegExp(`^${req.params.categoryId}$`, "i") },
    });

    if (!service || service.length === 0) {
      return res.status(404).json({ message: "No services found for this category" });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update service
export const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    let { coordinates } = req.body;

    if (!coordinates && (req.body["coordinates[lat]"] || req.body["coordinates[lng]"])) {
      coordinates = {
        lat: req.body["coordinates[lat]"],
        lng: req.body["coordinates[lng]"],
      };
    }
    if (typeof coordinates === "string") {
      try {
        coordinates = JSON.parse(coordinates);
      } catch (_) {}
    }

    // Update primitive fields
    service.name = req.body.name || service.name;
    service.description = req.body.description || service.description;
    service.location = req.body.location || service.location;
    service.category = req.body.category || service.category;
    service.website = req.body.website || service.website;
    service.phone = req.body.phone || service.phone;

    if (coordinates?.lat && coordinates?.lng) {
      service.coordinates = {
        lat: Number(coordinates.lat),
        lng: Number(coordinates.lng),
      };
    }

    // Append Cloudinary file URLs (check both path and secure_url)
    const newImages = req.files?.images?.map((f) => f.path || f.secure_url).filter(Boolean) || [];
    const newVideos = req.files?.videos?.map((f) => f.path || f.secure_url).filter(Boolean) || [];
    
    console.log("New images to add:", newImages);
    console.log("New videos to add:", newVideos);

    if (newImages.length > 0) {
      service.images = [...(service.images || []), ...newImages];
    }

    if (newVideos.length > 0) {
      service.videos = [...(service.videos || []), ...newVideos];
    }

    const updatedService = await service.save();
    res.json(updatedService);
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete service
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    await Service.deleteOne({ _id: req.params.id });
    res.json({ message: "Service deleted successfully" });
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
      return res.status(404).json({ message: "Service not found" });
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
    res.status(201).json({ message: "Review added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
