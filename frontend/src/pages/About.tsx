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
      <section className="relative overflow-hidden bg-gradient-primary">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgZmlsbC1vcGFjaXR5PSIwLjEiPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjIiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center text-white space-y-6 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              About Discover Adama
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
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
              <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-2xl flex items-center justify-center">
                <span className="text-2xl text-white">🏙️</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
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
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center">
                  <span className="text-2xl text-white">⚡</span>
                </div>
                <h2 className="text-3xl font-bold">Smart City Technology</h2>
                <p className="text-muted-foreground leading-relaxed">
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
            <h2 className="text-3xl md:text-4xl font-bold">Platform Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4">
                  <span className="text-xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact/CTA Section */}
        <section className="max-w-4xl mx-auto animate-fade-in">
          <div className="bg-gradient-primary rounded-3xl p-8 md:p-12 text-center text-white">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Ready to Explore?</h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Start discovering the best services Adama City has to offer. From essential healthcare to amazing dining experiences.
              </p>
              <div className="pt-4">
                <a 
                  href="/browse" 
                  className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-full font-semibold hover:bg-white/90 transition-colors hover-scale"
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
