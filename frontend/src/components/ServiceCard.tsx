import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MapPin, Phone, Star, ArrowRight, ExternalLink } from "lucide-react";
import type { Service } from "@/context/ServicesContext";
const API_URL = import.meta.env.VITE_API_BASE_URL;

const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const defaultImageByCategory: Record<string, string> = {
    Hotel: "https://images.unsplash.com/photo-1551776235-dde6d4829808?auto=format&fit=crop&w=1200&q=60",
    Hospital: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=60",
    Government: "https://images.unsplash.com/photo-1505842465776-3b4953ca4f45?auto=format&fit=crop&w=1200&q=60",
    Restaurant: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=60",
    Transport: "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=60",
  };

  const categoryName = (service as any).category?.name ?? (service as any).category ?? "";
  const firstImage = Array.isArray((service as any).images) && (service as any).images.length > 0 ? (service as any).images[0] : undefined;

  // Cloudinary URLs are already full URLs, use them directly with optimization
  // For Cloudinary, we can add transformation parameters for better performance
  const getOptimizedImageUrl = (url?: string) => {
    if (!url) return null;
    
    if (url.startsWith('http://') || url.startsWith('https://')) {
      // If it's a Cloudinary URL, add optimization parameters
      if (url.includes('res.cloudinary.com') || url.includes('cloudinary.com')) {
        // Check if it already has transformations
        if (url.includes('/image/upload/')) {
          const parts = url.split('/image/upload/');
          if (parts.length === 2) {
            // Check if transformations already exist (contains /v followed by numbers)
            const afterUpload = parts[1];
            // If no transformations (starts with folder or image name directly), add them
            if (!afterUpload.match(/^[a-zA-Z0-9_\-]+\//)) {
              // Add optimization: auto format, quality, and responsive sizing
              return `${parts[0]}/image/upload/w_800,h_450,c_fill,q_auto,f_auto/${afterUpload}`;
            }
          }
        }
        // Already has transformations or not a standard Cloudinary URL, use as is
        return url;
      }
      return url;
    }
    return `${API_URL}/uploads/images/${url}`;
  };

  const imgSrc = getOptimizedImageUrl(firstImage) || 
    ((service as any).imageUrl && typeof (service as any).imageUrl === 'string' ? (service as any).imageUrl : null) ||
    defaultImageByCategory[(categoryName as keyof typeof defaultImageByCategory) || "Hotel"] || 
    "https://via.placeholder.com/400";

  const lat = (service as any).coordinates?.lat ?? (service as any).latitude;
  const lng = (service as any).coordinates?.lng ?? (service as any).longitude;

  return (
    <Card className="group overflow-hidden hover:shadow-elegant hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card/50 backdrop-blur-sm">
      {/* Image Section with Overlay */}
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-muted via-muted/50 to-muted" />
        )}
        <img
          src={imageError ? (defaultImageByCategory[(categoryName as keyof typeof defaultImageByCategory) || "Hotel"] ?? "https://via.placeholder.com/400") : imgSrc}
          alt={`${service.name} — ${categoryName} in Adama`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
        
        {/* Category Badge on Image */}
        {categoryName && (
          <Badge 
            variant="secondary" 
            className="absolute top-3 right-3 shadow-lg backdrop-blur-sm bg-background/80 border-border/50"
          >
            {categoryName}
          </Badge>
        )}

        {/* Rating Badge */}
        {service.rating && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-background/90 backdrop-blur-sm shadow-lg">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold">{service.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2 min-h-[3rem]">
          {service.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {service.description}
        </p>

        {/* Location & Contact Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
            <span className="line-clamp-1">{service.location}</span>
          </div>
          {service.phone && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4 text-primary flex-shrink-0" />
              <a href={`tel:${service.phone}`} className="hover:text-primary transition-colors">
                {service.phone}
              </a>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-border/50">
          <Button 
            asChild 
            variant="default" 
            size="sm" 
            className="flex-1 group/btn"
          >
            <Link to={`/service/${service._id}`}>
              View Details
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </Button>
          <Button 
            asChild 
            variant="outline" 
            size="sm"
            className="group/dir"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4 group-hover/dir:scale-110 transition-transform" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
