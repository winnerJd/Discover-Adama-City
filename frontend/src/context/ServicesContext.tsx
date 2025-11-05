import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export type ServiceCategory = {
  _id: string;
  name: string;
};

export type Service = {
  _id: string;
  name: string;
  description: string;
  location: string;
  category: ServiceCategory;
  website?: string;
  phone:string;
  coordinates: {
        lat: Number,
        lng: Number
      },
  rating?: number;
  tags?: string[];
  imageUrl?: string |File;
  videoUrl?: string |File;
};

export type ServiceInput = Omit<Service, "_id" | "category"> & { category: string };

type ServicesContextType = {
  services: Service[];
  categories: ServiceCategory[];
  addService: (input: ServiceInput, files?: FormData) => Promise<boolean>;
  updateService: (id: string, input: Partial<ServiceInput>, files?: FormData) => Promise<boolean>;
  deleteService: (id: string) => Promise<void>;
  getServiceById: (id: string) => Promise<Service | undefined>;
  getAllServices: () => Promise<void>;
  getServicesByCategory: (categoryId: string) => Promise<Service[]>;
  addReview: (id: string, review: { comment: string; stars: number }) => Promise<void>;
};

const ServicesContext = createContext<ServicesContextType | undefined>(undefined);
const API_URL = import.meta.env.VITE_API_BASE_URL;


export const ServicesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  axios.defaults.withCredentials = true;

  // 🔹 Get all categories
  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/categories`);
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // 🔹 Get all services
  const getAllServices = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/services`);
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  // 🔹 Get service by ID
  const getServiceById = async (id: string) => {
    try {
      const { data } = await axios.get(`${API_URL}/services/${id}`);
      return data;
    } catch (error) {
      console.error("Error fetching service:", error);
      return undefined;
    }
  };

  // 🔹 Get services by category
  const getServicesByCategory = async (categoryId: string) => {
    try {
      const { data } = await axios.get(`${API_URL}/services/category/${categoryId}`);
      return data;
    } catch (error) {
      console.error("Error fetching category services:", error);
      return [];
    }
  };

// Add new service
const addService = async (input: ServiceInput, files?: FormData): Promise<boolean> => {
  try {
    const formData = files ?? new FormData();

    if (!files) {
      if (input.imageUrl instanceof File) {
        formData.append("images", input.imageUrl);
      }
      if (input.videoUrl instanceof File) {
        formData.append("videos", input.videoUrl);
      }
      Object.entries(input).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === "coordinates") {
            const coords = value as any;
            formData.append("coordinates[lat]", String(coords.lat));
            formData.append("coordinates[lng]", String(coords.lng));
          } else if (key !== "imageUrl" && key !== "videoUrl") {
            formData.append(key, value as any);
          }
        }
      });
    }

    const { data } = await axios.post(`${API_URL}/services/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });

    // Prefer server truth over optimistic
    await getAllServices();
    return true;
  } catch (error) {
    console.error("Error creating service:", error);
    return false;
  }
};


// Update existing service
const updateService = async (id: string, input: Partial<ServiceInput>, files?: FormData): Promise<boolean> => {
  try {
    const formData = files ?? new FormData();

    if (!files) {
      Object.entries(input).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === "coordinates") {
            const coords = value as any;
            formData.append(`coordinates[lat]`, String(coords.lat));
            formData.append(`coordinates[lng]`, String(coords.lng));
          } else if (key === "imageUrl" && value instanceof File) {
            formData.append("images", value);
          } else if (key === "videoUrl" && value instanceof File) {
            formData.append("videos", value);
          } else {
            formData.append(key, value as any);
          }
        }
      });
    }

    const { data } = await axios.put(`${API_URL}/services/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });

    await getAllServices();
    return true;
  } catch (error) {
    console.error("Error updating service:", error);
    return false;
  }
};


  // 🔹 Delete service

  const deleteService = async (id: string) => {
    try {
      axios.defaults.withCredentials=true
      await axios.delete(`${API_URL}/services/${id}`, { withCredentials: true });
      setServices((prev) => prev.filter((s) => s._id !== id));
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  // 🔹 Add review
  const addReview = async (id: string, review: { comment: string; stars: number }) => {
    try {
      await axios.post(`${API_URL}/services/${id}/review`, review, {
        withCredentials: true,
      });
      await getAllServices();
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  // 🔹 Load services + categories on mount
  useEffect(() => {
    getAllServices();
    getAllCategories();
  }, []);

  const value: ServicesContextType = {
    services,
    categories,
    addService,
    updateService,
    deleteService,
    getServiceById,
    getAllServices,
    getServicesByCategory,
    addReview,
  
  };

  return <ServicesContext.Provider value={value}>{children}</ServicesContext.Provider>;
};

export const useServices = () => {
  const ctx = useContext(ServicesContext);
  if (!ctx) throw new Error("useServices must be used within ServicesProvider");
  return ctx;
};
