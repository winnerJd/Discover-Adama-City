import { Helmet } from "react-helmet-async";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useServices } from "@/context/ServicesContext";

import { MapPin, Search, Star, Users, Clock, Shield, ArrowRight, Sparkles, Heart, Award } from "lucide-react";

const Index = () => {

  // services used for service length and category length
    const { services, categories } = useServices(); // get backend data

  // loading state to prevent errors while data is being fetched
  if (!services || !categories) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-xl text-muted-foreground">Loading Discover Adama...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Discover Adama — Smart City Guide</title>
        <meta name="description" content="Find hotels, hospitals, restaurants, transport and government services across Adama City. Search, filter and navigate with ease." />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <SiteHeader />
      <main className="flex-1 bg-slate-50">
        {/* Hero Section */}
        <section className="relative overflow-hidden min-h-screen flex items-center bg-gradient-to-br from-sky-50 via-slate-50 to-amber-50">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-200 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-200 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-100 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
          
          <div className="container mx-auto px-4 py-20 text-center relative z-10">
            <div className="flex items-center justify-center gap-3 mb-8 animate-fade-in">
              <div className="p-4 rounded-full bg-skyline-glow shadow-elegant">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <span className="text-sky-600 text-xl font-bold tracking-wide">Adama Smart City</span>
              <Sparkles className="h-6 w-6 text-amber-500 animate-pulse" />
            </div>
            
            <h1 className="text-title md:text-6xl md:text-8xl tracking-tight mb-8 bg-skyline-glow bg-clip-text text-transparent animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Discover Adama
            </h1>
            
            <p className="text-paragraph md:text-2xl md:text-3xl text-slate-700 max-w-4xl mx-auto mb-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              Your ultimate companion for exploring the vibrant city of Adama — from essential services to hidden gems
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <Button asChild size="lg" className="px-10 py-7 text-lg bg-sky-500 hover:bg-sky-600 text-white shadow-elegant hover:shadow-glow transition-all duration-300 group">
                <Link to="/browse">
                  <Search className="mr-3 h-6 w-6 transition-transform group-hover:scale-110" />
                  Explore Services
                  <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <div className="relative flex-1 max-w-lg">
                <Input 
                  placeholder="Search hotels, restaurants, hospitals..." 
                  className="pl-6 pr-14 py-7 text-lg border-2 border-sky-300 focus:border-sky-500 bg-white backdrop-blur-sm rounded-xl shadow-lg transition-all duration-300 focus:shadow-elegant"
                />
                <Search className="absolute right-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-slate-500" />
              </div>
            </div>
            
            {/* Enhanced Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <Card className="bg-gradient-to-br from-sky-100 to-sky-50 border-sky-200 backdrop-blur-sm shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-105 group">
                <CardContent className="p-10 text-center">
                  <div className="text-5xl md:text-6xl font-bold text-sky-600 mb-3 group-hover:scale-110 transition-transform duration-300">{categories?.length || 0}+</div>
                  <div className="text-slate-700 text-xl font-medium">Premium Services</div>
                  <Star className="h-6 w-6 text-sky-500 mx-auto mt-2 opacity-60" />
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-amber-100 to-amber-50 border-amber-200 backdrop-blur-sm shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-105 group">
                <CardContent className="p-10 text-center">
                  <div className="text-5xl md:text-6xl font-bold text-amber-600 mb-3 group-hover:scale-110 transition-transform duration-300">{services?.length || 0}+</div>
                  <div className="text-slate-700 text-xl font-medium">Total Listings</div>
                  <Award className="h-6 w-6 text-amber-500 mx-auto mt-2 opacity-60" />
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-sky-100 to-amber-50 border-sky-200 backdrop-blur-sm shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-105 group">
                <CardContent className="p-10 text-center">
                  <div className="text-5xl md:text-6xl font-bold text-sky-600 mb-3 group-hover:scale-110 transition-transform duration-300">24/7</div>
                  <div className="text-slate-700 text-xl font-medium">Always Available</div>
                  <Heart className="h-6 w-6 text-amber-500 mx-auto mt-2 opacity-60" />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-slate-100 relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-subtitle md:text-4xl md:text-5xl font-bold mb-6 text-slate-800">
                Why Choose Discover Adama?
              </h2>
              <p className="text-paragraph text-slate-700 max-w-2xl mx-auto">
                Experience the difference with our premium city guide platform
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="group text-center p-8 hover:shadow-elegant transition-all duration-300 hover:scale-105 bg-gradient-to-br from-sky-50 to-sky-100 border-sky-200">
                <CardContent className="p-0">
                  <div className="p-6 rounded-full bg-sky-500 inline-block mb-6 shadow-lg group-hover:shadow-glow transition-all duration-300">
                    <Star className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-slate-800 group-hover:text-sky-600 transition-colors">Quality Services</h3>
                  <p className="text-slate-700 leading-relaxed">Carefully curated and verified service providers ensuring the highest quality standards</p>
                </CardContent>
              </Card>
              
              <Card className="group text-center p-8 hover:shadow-elegant transition-all duration-300 hover:scale-105 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                <CardContent className="p-0">
                  <div className="p-6 rounded-full bg-amber-500 inline-block mb-6 shadow-lg group-hover:shadow-glow transition-all duration-300">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-slate-800 group-hover:text-amber-600 transition-colors">Community Driven</h3>
                  <p className="text-slate-700 leading-relaxed">Built by locals for locals, ensuring authentic and relevant recommendations</p>
                </CardContent>
              </Card>
              
              <Card className="group text-center p-8 hover:shadow-elegant transition-all duration-300 hover:scale-105 bg-gradient-to-br from-sky-50 to-amber-50 border-sky-200">
                <CardContent className="p-0">
                  <div className="p-6 rounded-full bg-sky-500 inline-block mb-6 shadow-lg group-hover:shadow-glow transition-all duration-300">
                    <Clock className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-slate-800 group-hover:text-sky-600 transition-colors">Always Updated</h3>
                  <p className="text-slate-700 leading-relaxed">Real-time information with regular updates to keep you informed</p>
                </CardContent>
              </Card>
              
              <Card className="group text-center p-8 hover:shadow-elegant transition-all duration-300 hover:scale-105 bg-gradient-to-br from-sky-50 to-amber-50 border-amber-200">
                <CardContent className="p-0">
                  <div className="p-6 rounded-full bg-skyline-glow inline-block mb-6 shadow-lg group-hover:shadow-glow transition-all duration-300">
                    <Shield className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-slate-800 group-hover:text-sky-600 transition-colors">Trusted Platform</h3>
                  <p className="text-slate-700 leading-relaxed">Secure, reliable, and trusted by thousands of Adama residents</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-evening relative overflow-hidden">
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-title md:text-6xl mb-8 text-slate-100">
                Ready to Explore Adama?
              </h2>
              <p className="text-paragraph md:text-2xl text-slate-200 mb-12 max-w-3xl mx-auto">
                Join thousands of residents and visitors who trust Discover Adama to navigate the city's best offerings
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button asChild size="lg" className="px-12 py-8 text-xl bg-amber-500 hover:bg-amber-600 text-white shadow-elegant hover:shadow-glow transition-all duration-300 group">
                  <Link to="/browse">
                    <Sparkles className="mr-3 h-6 w-6 transition-transform group-hover:rotate-12" />
                    Start Exploring
                    <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <div className="text-slate-200">
                  <span className="text-sm">Trusted by</span>
                  <div className="font-bold text-amber-400 text-lg">10,000+ Users</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Index;
