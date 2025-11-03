import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive ? "bg-secondary text-secondary-foreground" : "hover:bg-accent hover:text-accent-foreground"
  }`;

const SiteHeader: React.FC = () => {
  const location = useLocation();
  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="inline-block h-6 w-6 rounded bg-gradient-primary" aria-hidden />
          <span>Discover Adama</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/browse" className={navLinkClass}>
            Browse Services
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
        </nav>
        <div className="flex items-center gap-2">
          {location.pathname !== "/browse" && (
            <Button asChild variant="hero" size="lg">
              <Link to="/browse">Explore Now</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
