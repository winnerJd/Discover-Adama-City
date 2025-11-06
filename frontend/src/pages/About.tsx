import React from "react";
import { Helmet } from "react-helmet-async";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

const About: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/30">
      <Helmet>
        <title>About Discover Adama — Smart City Guide</title>
        <meta name="description" content="Discover Adama is a smart city guide to hotels, hospitals, offices, restaurants and transport across Adama City." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <SiteHeader />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-evening">
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center text-slate-100 space-y-6 animate-fade-in">
            <h1 className="text-title md:text-6xl tracking-tight">
              About Discover Adama
            </h1>
            <p className="text-paragraph md:text-2xl text-slate-200">
              Your comprehensive guide to navigating Adama City's essential services
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto flex-1 py-16 space-y-16">
        {/* Mission Section */}
        <section className="max-w-4xl mx-auto animate-fade-in">
          <div className="bg-card rounded-3xl border shadow-elegant p-8 md:p-12">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-skyline-glow rounded-2xl flex items-center justify-center">
                <span className="text-2xl text-white">🏙️</span>
              </div>
              <h2 className="text-subtitle md:text-3xl md:text-4xl font-bold text-slate-800">Our Mission</h2>
              <p className="text-paragraph text-slate-700 max-w-3xl mx-auto">
                Discover Adama is a centralized, mobile-responsive platform designed to help residents and visitors explore essential city services. From hospitals and hotels to government offices, restaurants, and transportation hubs, we make it easy to search, filter, view on map, and get directions instantly.
              </p>
            </div>
          </div>
        </section>

        {/* Smart City Initiative */}
        <section className="max-w-4xl mx-auto animate-fade-in">
          <div className="bg-gradient-to-br from-card to-muted/20 rounded-3xl border shadow-elegant p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="w-16 h-16 bg-skyline-glow rounded-2xl flex items-center justify-center">
                  <span className="text-2xl text-white">⚡</span>
                </div>
                <h2 className="text-subtitle text-3xl font-bold text-slate-800">Smart City Technology</h2>
                <p className="text-paragraph text-slate-700">
                  Built as part of the Adama Smart City initiative, our platform leverages modern technology to bridge the gap between citizens and city services. We provide real-time information and seamless navigation to make urban life more accessible.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background rounded-2xl p-6 text-center shadow-sm">
                  <div className="text-2xl mb-2">🏥</div>
                  <div className="font-semibold">Healthcare</div>
                </div>
                <div className="bg-background rounded-2xl p-6 text-center shadow-sm">
                  <div className="text-2xl mb-2">🏨</div>
                  <div className="font-semibold">Hospitality</div>
                </div>
                <div className="bg-background rounded-2xl p-6 text-center shadow-sm">
                  <div className="text-2xl mb-2">🏛️</div>
                  <div className="font-semibold">Government</div>
                </div>
                <div className="bg-background rounded-2xl p-6 text-center shadow-sm">
                  <div className="text-2xl mb-2">🚌</div>
                  <div className="font-semibold">Transport</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="max-w-6xl mx-auto animate-fade-in">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-subtitle md:text-3xl md:text-4xl font-bold text-slate-800">Platform Features</h2>
            <p className="text-paragraph text-slate-700 max-w-2xl mx-auto">
              Comprehensive tools designed to make exploring Adama City effortless and efficient
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🗺️",
                title: "Interactive Maps",
                description: "Navigate with ease using our integrated map system with real-time directions and location services."
              },
              {
                icon: "🔍",
                title: "Advanced Search",
                description: "Find exactly what you need with powerful filtering by category, location, rating, and more."
              },
              {
                icon: "⚙️",
                title: "Admin Dashboard",
                description: "Authorized officials can manage listings, add new services, and keep information up-to-date."
              },
              {
                icon: "📱",
                title: "Mobile Responsive",
                description: "Access all features seamlessly across desktop, tablet, and mobile devices."
              },
              {
                icon: "🌐",
                title: "Multilingual Support",
                description: "Available in Amharic, Afan Oromo, and English to serve our diverse community."
              },
              {
                icon: "📊",
                title: "Analytics & Insights",
                description: "Monitor service coverage and usage patterns to improve city planning and resource allocation."
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-card rounded-2xl border shadow-elegant p-6 hover-scale transition-all duration-300 hover:shadow-glow"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-sky-500 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-800">{feature.title}</h3>
                <p className="text-slate-700 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact/CTA Section */}
        <section className="max-w-4xl mx-auto animate-fade-in">
          <div className="bg-skyline-glow rounded-3xl p-8 md:p-12 text-center text-white">
            <div className="space-y-6">
              <h2 className="text-subtitle md:text-3xl md:text-4xl font-bold">Ready to Explore?</h2>
              <p className="text-paragraph text-white/90 max-w-2xl mx-auto">
                Start discovering the best services Adama City has to offer. From essential healthcare to amazing dining experiences.
              </p>
              <div className="pt-4">
                <a 
                  href="/browse" 
                  className="inline-flex items-center gap-2 bg-white text-sky-600 px-8 py-4 rounded-full font-semibold hover:bg-white/90 transition-colors hover-scale"
                >
                  Browse Services
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default About;
