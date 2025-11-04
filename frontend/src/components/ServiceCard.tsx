import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { Service } from "@/context/ServicesContext";
const API_URL = import.meta.env.VITE_API_BASE_URL;

const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
  console.log(service)
 const defaultImageByCategory: Record<string, string> = {
  Hotel: "https://images.unsplash.com/photo-1551776235-dde6d4829808?auto=format&fit=crop&w=1200&q=60",
  Hospital: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=60",
  Government: "https://images.unsplash.com/photo-1505842465776-3b4953ca4f45?auto=format&fit=crop&w=1200&q=60",
  Restaurant: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=60",
  Transport: "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=60",
};

  const categoryName = (service as any).category?.name ?? (service as any).category ?? "";
  const firstImage = Array.isArray((service as any).images) && (service as any).images.length > 0 ? (service as any).images[0] : undefined;
  const imgSrc = firstImage
    ? `${API_URL}uploads/images/${firstImage}`
    : (service as any).imageUrl && typeof (service as any).imageUrl === 'string'
    ? (service as any).imageUrl
    : defaultImageByCategory[(categoryName as keyof typeof defaultImageByCategory) || "Hotel"] ?? "https://via.placeholder.com/400";

  
  const lat = (service as any).coordinates?.lat ?? (service as any).latitude;
  const lng = (service as any).coordinates?.lng ?? (service as any).longitude;

  return (
    <Card className="hover:shadow-elegant transition-shadow">
      <div className="relative aspect-[16/9] overflow-hidden rounded-t-lg">
        <img
          src={imgSrc}
          alt={`${service.name} — ${categoryName} in Adama`}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
      </div>
      <CardHeader className="flex-row items-start justify-between gap-2">
        <CardTitle className="text-lg">{service.name}</CardTitle>
        {categoryName && <Badge variant="secondary">{categoryName}</Badge>}
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-3">{service.description}</p>
        <div className="text-sm">
          <div>📍 {service.location}</div>
          {service.phone && <div>☎️ {service.phone}</div>}
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-muted-foreground">⭐ {service.rating ?? "N/A"}</div>
          <div className="flex gap-2">
            <Button asChild variant="secondary" size="sm">
              <Link to={`/service/${service._id}`}>Details</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Directions
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
