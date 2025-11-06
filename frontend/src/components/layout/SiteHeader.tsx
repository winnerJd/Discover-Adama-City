import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Menu, Sparkles } from "lucide-react";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
    isActive 
      ? "bg-sky-500 text-white shadow-md" 
      : "hover:bg-slate-100 hover:text-slate-800 text-slate-500"
  }`;

const SiteHeader: React.FC = () => {
  const location = useLocation();
  const isBrowse = location.pathname === "/browse";
  
  return (
    <header className="sticky top-0 z-50 w-full bg-slate-50/80 backdrop-blur-md supports-[backdrop-filter]:bg-slate-50/60 border-b border-border/50 shadow-sm">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 font-bold text-lg group transition-transform hover:scale-105"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg blur-sm opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <div className="relative p-1.5 rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              <MapPin className="h-5 w-5 text-slate-50" />
            </div>
          </div>
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Discover Adama
          </span>
          <Sparkles className="h-4 w-4 text-sky-500 animate-pulse" />
        </Link>
        
        <nav className="hidden md:flex items-center gap-2">
          <NavLink to="/browse" className={navLinkClass}>
            Browse Services
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
        </nav>
        
        <div className="flex items-center gap-3">
          {!isBrowse && (
            <Button 
              asChild 
              size="lg"
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-slate-50 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Link to="/browse" className="group">
                Explore Now
                <Sparkles className="ml-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
