import React, { useEffect, useRef } from "react";
import type { Service } from "@/context/ServicesContext";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    initDiscoverAdamaMap?: () => void;
  }
}

const MAPS_KEY_STORAGE = "discover-adama-google-maps-key";

type Props = {
  services: Service[];
  height?: string;
};

const MapGoogle: React.FC<Props> = ({ services, height = "500px" }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    const apiKey = localStorage.getItem(MAPS_KEY_STORAGE);
    if (!apiKey) return; // handled by fallback UI

    if (!mapRef.current) return;

    const existing = document.getElementById("google-maps-script") as HTMLScriptElement | null;
    const init = () => {
      const g = (window as any).google;
      if (!g?.maps) return;
      const map = new g.maps.Map(mapRef.current!, {
        center: {
          lat: (services[0] as any)?.coordinates?.lat ?? 8.5416,
          lng: (services[0] as any)?.coordinates?.lng ?? 39.2683,
        },
        zoom: 13,
        mapId: "DISCOVER_ADAMA_MAP",
      });

      const bounds = new g.maps.LatLngBounds();
      services.forEach((s) => {
        const pos = {
          lat: (s as any).coordinates?.lat,
          lng: (s as any).coordinates?.lng,
        };
        const marker = new g.maps.Marker({ position: pos, map, title: s.name });
        bounds.extend(pos);
        const infowindow = new g.maps.InfoWindow({
          content: `<div style=\"font-family: system-ui, -apple-system, Segoe UI, Roboto; padding:6px 0\"><strong>${(s as any).name}</strong><br/>${(s as any).location}<br/><a target=\"_blank\" href=\"https://www.google.com/maps/dir/?api=1&destination=${(s as any).coordinates?.lat},${(s as any).coordinates?.lng}\">Directions</a></div>`,
        });
        marker.addListener("click", () => infowindow.open({ anchor: marker, map }));
      });
      if (services.length > 1) map.fitBounds(bounds);
    };

    if (existing) {
      window.initDiscoverAdamaMap = init;
      if ((window as any).google?.maps) init();
      return;
    }

    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initDiscoverAdamaMap`;
    script.async = true;
    window.initDiscoverAdamaMap = init;
    document.body.appendChild(script);
    scriptRef.current = script;

    return () => {
      if (scriptRef.current) {
        scriptRef.current.remove();
        scriptRef.current = null;
      }
    };
  }, [services]);

  const apiKey = typeof window !== "undefined" ? localStorage.getItem(MAPS_KEY_STORAGE) : null;

  if (!apiKey) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border p-8 text-center bg-slate-100">
        
        <a
          href="https://developers.google.com/maps/documentation/javascript/get-api-key"
          className="underline mt-2 text-sm"
          target="_blank" rel="noreferrer"
        >
        
        </a>
      </div>
    );
  }

  return <div ref={mapRef} style={{ height }} className="rounded-lg border" />;
};

export const storeGoogleMapsApiKey = (key: string) => {
  localStorage.setItem(MAPS_KEY_STORAGE, key);
};

export default MapGoogle;
