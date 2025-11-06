import React from "react";

const SiteFooter: React.FC = () => {
  return (
    <footer className="border-t bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200">
      <div className="container mx-auto py-8 text-sm text-slate-700 flex flex-col md:flex-row gap-4 items-center justify-between">
        <p>© {new Date().getFullYear()} Discover Adama • Smart City Initiative</p>
        <div className="flex items-center gap-4">
          <a className="hover:text-slate-800 transition-colors" href="/privacy">Privacy Policy</a>
          <a 
            className="hover:text-slate-800 transition-colors" 
            href="https://t.me/jossy4713" 
            target="_blank"
          >
            Chat with Developer on Telegram
          </a>
        </div>
        <div className="flex items-center gap-4">
          <a className="hover:text-slate-800 transition-colors" href="/about">About</a>
          <a className="hover:text-slate-800 transition-colors" href="/browse">Browse Services</a>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
