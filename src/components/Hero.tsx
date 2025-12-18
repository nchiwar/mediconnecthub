import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Search, Stethoscope, Users, Activity } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 gradient-hero opacity-90" />
      
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--medical-blue)) 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, hsl(var(--medical-teal)) 2px, transparent 2px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 text-white">
              <Activity className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Healthcare Matching</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Your Health, Our Priority
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
              Connect with verified doctors, nurses, pharmacies, and hospitals instantly. 
              AI-matched care, blockchain-secured records, accessible anywhere.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-strong">
                <Search className="w-5 h-5 mr-2" />
                Start Symptom Checker
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm">
                <Users className="w-5 h-5 mr-2" />
                Join as Provider
              </Button>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
            >
              {[
                { icon: Stethoscope, label: "Active Doctors", value: "500+" },
                { icon: Users, label: "Patients Served", value: "10K+" },
                { icon: Activity, label: "Pharmacies", value: "200+" },
                { icon: Search, label: "AI Matches/Day", value: "1.5K+" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                >
                  <stat.icon className="w-8 h-8 text-white mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-20 fill-background">
          <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" />
        </svg>
      </div>
    </section>
  );
};
