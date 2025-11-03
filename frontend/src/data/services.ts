// src/types/service.ts
export type ServiceCategory = {
  _id: string;
  name: string;
};

export type Service = {
  _id: string;
  name: string;
  description: string;
  location: string;
  category: ServiceCategory | null;  // ✅ always object
  phone?: string;
  website?: string;
  latitude: number;
  longitude: number;
  rating?: number;
  tags?: string[];
  imageUrl?: string | File;
  videoUrl?: string | File;
};


