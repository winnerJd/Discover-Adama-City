import React from "react";

const SiteFooter: React.FC = () => {
  return (
    <footer className="border-t">
      <div className="container mx-auto py-8 text-sm text-muted-foreground flex flex-col md:flex-row gap-4 items-center justify-between">
        <p>© {new Date().getFullYear()} Discover Adama • Smart City Initiative</p>
        <div className="flex items-center gap-4">
          <a className="hover:text-foreground transition-colors" href="/privacy">Privacy Policy</a>
          <a 
  className="hover:text-foreground transition-colors" 
  href="https://t.me/jossy4713" 
  target="_blank"
>
  Chat with Developer on Telegram
</a>

        </div>
        <div className="flex items-center gap-4">
          <a className="hover:text-foreground transition-colors" href="/about">About</a>
          <a className="hover:text-foreground transition-colors" href="/browse">Browse Services</a>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
