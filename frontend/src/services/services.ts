import axios from "axios";

const BASE_URL = "http://localhost:5000/api/services"; // replace with your backend URL

export type ServiceCategory = "Hotel" | "Hospital" | "Government" | "Restaurant" | "Transport";

export type Service = {
  id: string;
  name: string;
  description: string;
  address: string;
  category: ServiceCategory;
  phone?: string;
  website?: string;
  latitude: number;
  longitude: number;
  rating?: number;
  tags?: string[];
  imageUrl?: string;
  videoUrl?: string;
};

// Fetch all services
export const fetchServices = async (): Promise<Service[]> => {
  const res = await axios.get(BASE_URL);
  return res.data.map((item: any) => ({
    id: item._id,
    name: item.name,
    description: item.description,
    address: item.location,
    category: item.category,
    phone: item.phone,
    website: item.website,
    latitude: item.coordinates?.lat,
    longitude: item.coordinates?.lng,
    rating: item.rating,
    tags: item.tags,
    imageUrl: item.images?.[0],
    videoUrl: item.videos?.[0],
  }));
};

// Add a new service
export const createService = async (serviceData: Partial<Service>): Promise<Service> => {
  const res = await axios.post(BASE_URL, serviceData);
  return res.data;
};

// Update a service
export const updateServiceApi = async (id: string, serviceData: Partial<Service>): Promise<Service> => {
  const res = await axios.put(`${BASE_URL}/${id}`, serviceData);
  return res.data;
};

// Delete a service
export const deleteServiceApi = async (id: string): Promise<{ message: string }> => {
  const res = await axios.delete(`${BASE_URL}/${id}`);
  return res.data;
};
