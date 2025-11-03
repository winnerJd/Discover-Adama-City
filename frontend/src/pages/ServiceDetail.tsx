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
import type { Service } from "@/context/ServicesContext";
const API_URL = "http://localhost:5000";
const ServiceDetail: React.FC = () => {
  const { getServiceById } = useServices();
  const { id } = useParams();
  const [svc, setSvc] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        <main className="container mx-auto flex-1 py-10">
          <p>Loading service details...</p>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (error || !svc) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="container mx-auto flex-1 py-10">
          <p>{error || "Service not found."} <Link className="underline" to="/browse">Back to browse</Link></p>
        </main>
        <SiteFooter />
      </div>
    );
  }

  // compute safe media once svc is available
  const toImageUrl = (p?: string) => (p && /^https?:\/\//i.test(p)) ? p : (p ? `${API_URL}/uploads/images/${p}` : undefined);
  const toVideoUrl = (p?: string) => (p && /^https?:\/\//i.test(p)) ? p : (p ? `${API_URL}/uploads/videos/${p}` : undefined);
  const imagesArr: string[] = svc && Array.isArray((svc as any).images) ? (svc as any).images : [];
  const firstImage = imagesArr[0];
  const bgImage = toImageUrl(firstImage) ?? (typeof (svc as any)?.imageUrl === 'string' ? (svc as any).imageUrl : "/placeholder.svg");
  const videosArr: string[] = svc && Array.isArray((svc as any).videos) ? (svc as any).videos : [];
  const firstVideo = videosArr[0];
  const videoUrl = toVideoUrl(firstVideo) ?? (typeof (svc as any)?.videoUrl === 'string' ? (svc as any).videoUrl : undefined);

  return (
    <div className="min-h-screen flex flex-col">
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
      <main className="container mx-auto flex-1 py-8 space-y-6">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_minmax(420px,0.9fr)]">
          <Card>
            <CardHeader className="flex-row items-start justify-between">
              <CardTitle className="text-2xl">{svc.name}</CardTitle>
              <Badge variant="secondary">{svc.category?.name}</Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">{svc.description}</p>
              {/* Contact Information */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Contact Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-primary">📍</span>
                    <span>{svc.location}</span>
                  </div>
                  {svc.phone && (
                    <div className="flex items-center gap-2">
                      <span className="text-primary">☎️</span>
                      <a href={`tel:${svc.phone}`} className="hover:underline">{svc.phone}</a>
                    </div>
                  )}
                  {svc.website && (
                    <div className="flex items-center gap-2">
                      <span className="text-primary">🔗</span>
                      <a className="hover:underline text-primary" href={svc.website} target="_blank" rel="noreferrer">Visit Website</a>
                    </div>
                  )}
                  {svc.rating && (
                    <div className="flex items-center gap-2">
                      <span className="text-primary">⭐</span>
                      <span>{svc.rating}/5.0 rating</span>
                    </div>
                  )}
                </div>
              </div>
              {/* Tags */}
              {svc.tags && svc.tags.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {svc.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-2 pt-4">
                <Button asChild>
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${svc.coordinates.lat},${svc.coordinates.lng}`} target="_blank" rel="noreferrer">Get Directions</a>
                </Button>
                <Button asChild variant="secondary">
                  <Link to="/browse">Back to Browse</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          <div className="h-[520px]">
            <MapGoogle services={[svc]} height="100%" />
          </div>
        </div>
        {/* Enhanced Media Section */}
        <section className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Service Information Card */}
            <Card className="bg-gradient-to-br from-card to-background border shadow-elegant">
              <CardHeader>
                <CardTitle className="text-xl">About {svc.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">{svc.description}</p>
                {/* Service Details */}
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-medium text-sm">Service Category</h4>
                  <Badge variant="secondary" className="text-sm">{svc.category?.name}</Badge>
                  {svc.rating && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Customer Rating</h4>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < Math.floor(svc.rating!) ? "text-yellow-500" : "text-gray-300"}>
                              ⭐
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">({svc.rating}/5.0)</span>
                      </div>
                    </div>
                  )}
                  {svc.tags && svc.tags.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Available Features</h4>
                      <div className="flex flex-wrap gap-2">
                        {svc.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs capitalize">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            {/* Video Section */}
            <Card className="bg-gradient-to-br from-card to-background border shadow-elegant">
              <CardHeader>
                <CardTitle className="text-xl">Service Video</CardTitle>
              </CardHeader>
              <CardContent>
                {videoUrl ? (
                  <div className="w-full aspect-video rounded-lg overflow-hidden shadow-lg">
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
                        className="h-full w-full rounded-lg"
                        controls
                        playsInline
                        preload="metadata"
                        src={videoUrl}
                        onError={(e) => {
                          (e.currentTarget as HTMLVideoElement).poster = bgImage || "/placeholder.svg";
                        }}
                        controlsList="nodownload noplaybackrate"
                      />
                    )}
                  </div>
                ) : (
                  <div className="aspect-video rounded-lg bg-muted/50 border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <div className="text-4xl text-muted-foreground/50">🎥</div>
                      <p className="text-sm text-muted-foreground">No video available for this service yet</p>
                      <p className="text-xs text-muted-foreground/70">Videos are uploaded by administrators</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Images Section */}
          <section className="space-y-4">
            <Card className="bg-gradient-to-br from-card to-background border shadow-elegant">
              <CardHeader>
                <CardTitle className="text-xl">Images</CardTitle>
              </CardHeader>
              <CardContent>
                {imagesArr.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {imagesArr.map((img) => (
                      <img key={img} src={toImageUrl(img)} alt={`${svc.name}`} className="w-full h-64 md:h-72 object-cover rounded-lg border" loading="lazy" />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg bg-muted/50 border-2 border-dashed border-muted-foreground/20 p-6 text-center text-sm text-muted-foreground">
                    No images uploaded for this service yet
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
          {/* Background Image Section */}
          <div 
            className="relative h-64 rounded-xl overflow-hidden border shadow-elegant"
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">{svc.name}</h3>
              <p className="text-white/90 text-sm">{svc.location}</p>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default ServiceDetail;