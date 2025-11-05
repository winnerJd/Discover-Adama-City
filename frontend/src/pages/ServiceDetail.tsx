import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { useServices } from "@/context/ServicesContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MapGoogle from "@/components/MapGoogle";
import { MapPin, Phone, Globe, Star, ArrowLeft, ExternalLink, Navigation2, Calendar } from "lucide-react";
import type { Service } from "@/context/ServicesContext";
const API_URL = import.meta.env.VITE_API_BASE_URL;

const ServiceDetail: React.FC = () => {
  const { getServiceById } = useServices();
  const { id } = useParams();
  const [svc, setSvc] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // backend data used here
  useEffect(() => {
    if (id) {
      setLoading(true);
      getServiceById(id)
        .then((data) => {
          setSvc(data || null);
          setError(data ? null : "Service not found.");
        })
        .catch(() => setError("Error fetching service."))
        .finally(() => setLoading(false));
    }
  }, [id, getServiceById]);

  // Optimize Cloudinary image URLs
  const optimizeImageUrl = (url?: string) => {
    if (!url) return undefined;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `${API_URL}/uploads/images/${url}`;
    }
    // For Cloudinary URLs, add optimization if needed
    if (url.includes('res.cloudinary.com') || url.includes('cloudinary.com')) {
      if (url.includes('/image/upload/')) {
        const parts = url.split('/image/upload/');
        if (parts.length === 2) {
          const afterUpload = parts[1];
          // If no transformations, add them
          if (!afterUpload.match(/^[a-zA-Z0-9_\-]+\/[a-zA-Z0-9_\-]+/)) {
            return `${parts[0]}/image/upload/w_1200,h_800,c_fill,q_auto,f_auto/${afterUpload}`;
          }
        }
      }
    }
    return url;
  };

  // Media URLs will be computed after we confirm svc exists
  const getEmbedUrl = (url?: string) => {
    if (!url) return undefined;
    try {
      if (url.includes("youtu.be")) {
        const id = url.split("/").pop()?.split("?")[0];
        return id ? `https://www.youtube.com/embed/${id}` : undefined;
      }
      if (url.includes("youtube.com/watch")) {
        const id = new URL(url).searchParams.get("v");
        return id ? `https://www.youtube.com/embed/${id}` : undefined;
      }
      return url;
    } catch {
      return url;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="container mx-auto flex-1 py-20 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
            <p className="text-xl text-muted-foreground">Loading service details...</p>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (error || !svc) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="container mx-auto flex-1 py-20 text-center">
          <div className="space-y-4 max-w-md mx-auto">
            <div className="text-6xl">😕</div>
            <h2 className="text-2xl font-bold">{error || "Service not found."}</h2>
            <p className="text-muted-foreground">The service you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/browse">Back to Browse</Link>
            </Button>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  // compute safe media once svc is available
  const toImageUrl = (p?: string) => optimizeImageUrl(p);
  const toVideoUrl = (p?: string) => (p && /^https?:\/\//i.test(p)) ? p : (p ? `${API_URL}/uploads/videos/${p}` : undefined);
  const imagesArr: string[] = svc && Array.isArray((svc as any).images) ? (svc as any).images : [];
  const firstImage = imagesArr[0];
  const bgImage = toImageUrl(firstImage) ?? (typeof (svc as any)?.imageUrl === 'string' ? (svc as any).imageUrl : "/placeholder.svg");
  const videosArr: string[] = svc && Array.isArray((svc as any).videos) ? (svc as any).videos : [];
  const firstVideo = videosArr[0];
  const videoUrl = toVideoUrl(firstVideo) ?? (typeof (svc as any)?.videoUrl === 'string' ? (svc as any).videoUrl : undefined);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20">
      <Helmet>
        <title>{svc.name} — Discover Adama</title>
        <meta name="description" content={`${svc.name} in ${svc.location}. Category: ${svc.category?.name ?? ""}.`} />
        <link rel="canonical" href={window.location.href} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: svc.name,
          address: svc.location,
          telephone: svc.phone,
          url: svc.website,
          geo: { "@type": "GeoCoordinates", latitude: svc.coordinates.lat, longitude: svc.coordinates.lng },
          aggregateRating: svc.rating ? { "@type": "AggregateRating", ratingValue: svc.rating, reviewCount: 1 } : undefined,
        })}</script>
      </Helmet>
      <SiteHeader />
      
      {/* Hero Image Section */}
      <div className="relative h-[400px] md:h-[500px] overflow-hidden">
        <img
          src={bgImage}
          alt={svc.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="container mx-auto">
            <Button asChild variant="secondary" size="sm" className="mb-4">
              <Link to="/browse">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Browse
              </Link>
            </Button>
            <div className="flex items-start gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl md:text-5xl font-extrabold mb-3 text-white drop-shadow-lg">
                  {svc.name}
                </h1>
                <div className="flex items-center gap-3 flex-wrap">
                  {svc.category?.name && (
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                      {svc.category.name}
                    </Badge>
                  )}
                  {svc.rating && (
                    <div className="flex items-center gap-1 text-white bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{svc.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto flex-1 py-8 px-4 space-y-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_minmax(420px,0.9fr)]">
          {/* Left Column - Details */}
          <div className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl">About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground leading-relaxed text-lg">{svc.description}</p>
                
                {/* Contact Information */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Phone className="h-5 w-5 text-primary" />
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{svc.location}</span>
                    </div>
                    {svc.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                        <a href={`tel:${svc.phone}`} className="text-primary hover:underline font-medium">
                          {svc.phone}
                        </a>
                      </div>
                    )}
                    {svc.website && (
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-primary flex-shrink-0" />
                        <a 
                          className="text-primary hover:underline font-medium flex items-center gap-2" 
                          href={svc.website} 
                          target="_blank" 
                          rel="noreferrer"
                        >
                          Visit Website
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                {svc.tags && svc.tags.length > 0 && (
                  <div className="space-y-3 pt-4 border-t">
                    <h3 className="font-bold text-lg">Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {svc.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-sm px-3 py-1">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 pt-4 border-t">
                  <Button asChild size="lg" className="flex-1 min-w-[200px]">
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${svc.coordinates.lat},${svc.coordinates.lng}`} 
                      target="_blank" 
                      rel="noreferrer"
                    >
                      <Navigation2 className="mr-2 h-5 w-5" />
                      Get Directions
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/browse">
                      <ArrowLeft className="mr-2 h-5 w-5" />
                      Back
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Image Gallery */}
            {imagesArr.length > 0 && (
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">Gallery</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Main Image */}
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-muted">
                    <img
                      src={toImageUrl(imagesArr[selectedImageIndex])}
                      alt={`${svc.name} - Image ${selectedImageIndex + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/placeholder.svg"; }}
                    />
                  </div>
                  
                  {/* Thumbnail Grid */}
                  {imagesArr.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {imagesArr.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImageIndex(idx)}
                          className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImageIndex === idx
                              ? 'border-primary ring-2 ring-primary/20'
                              : 'border-transparent hover:border-primary/50'
                          }`}
                        >
                          <img
                            src={toImageUrl(img)}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/placeholder.svg"; }}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Video Section */}
            {videoUrl && (
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">Video</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full aspect-video rounded-xl overflow-hidden bg-muted">
                    {getEmbedUrl(videoUrl)?.includes("youtube.com/embed/") ? (
                      <iframe
                        title={`${svc.name} video`}
                        src={getEmbedUrl(videoUrl)}
                        loading="lazy"
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        className="h-full w-full rounded-xl"
                        controls
                        playsInline
                        preload="metadata"
                        src={videoUrl}
                        onError={(e) => {
                          (e.currentTarget as HTMLVideoElement).poster = bgImage || "/placeholder.svg";
                        }}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Map */}
          <div className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl">Location</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[520px] rounded-b-xl overflow-hidden">
                  <MapGoogle services={[svc]} height="100%" />
                </div>
                <div className="p-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{svc.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default ServiceDetail;