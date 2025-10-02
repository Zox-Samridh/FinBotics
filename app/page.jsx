import HeroSection from "@/components/hero";
import { statsData, testimonialsData, howItWorksData } from "@/data/landing";
import { featuresData } from "@/data/landing";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Star, Users, DollarSign, TrendingUp } from "lucide-react"; // Icons for stats

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Dark linear gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#191919] to-[#191919]" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statsData.map((stat, index) => (
              <div
                key={index}
                className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.6)] transition-shadow duration-500"
              >
                <div className="text-4xl font-bold text-blue-400 mb-2 flex items-center justify-center gap-2">
                  {stat.value}
                  {index === 0 && <Users size={32} className="text-blue-400" />}
                  {index === 1 && (
                    <DollarSign size={32} className="text-green-400" />
                  )}
                  {index === 2 && (
                    <TrendingUp size={32} className="text-purple-400" />
                  )}
                  {index === 3 && (
                    <Star size={32} className="text-yellow-400" />
                  )}
                </div>
                <div className="text-gray-300 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 relative"
        style={{
          background: "linear-gradient(to right, #282828 0%, #282828 100%)",
        }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">
            Everything you need to manage your finances
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresData.map((feature, index) => (
              <div key={index} className="relative group">
                {/* Optional glowing shadow behind card */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-blue-600/20 via-indigo-600/20 to-purple-600/20 blur-3xl opacity-50 transition-all duration-500 group-hover:opacity-80" />
                <Card
                  className="relative p-8 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 z-10"
                  style={{
                    background:
                      "linear-gradient(to right, #282828 0%, #282828 100%)",
                  }}
                >
                  <CardContent className="space-y-4 pt-0">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg"
                      style={{
                        background:
                          "linear-gradient(to right, #282828 0%, #191919 100%)",
                      }}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Dark linear gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#191919] to-[#191919]" />

        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl font-bold text-center mb-16 text-white">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {howItWorksData.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-shadow duration-300">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">
                  {step.title}
                </h3>
                <p className="text-gray-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Dark gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to right, #282828 0%, #282828 100%)",
          }}
        />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of users who are already managing their finances
            smarter with Welth
          </p>
          <div>
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-200 px-12 py-4 text-xl font-semibold shadow-2xl hover:shadow-xl transition-all duration-300"
              >
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
