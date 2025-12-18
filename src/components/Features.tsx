import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { 
  Brain, 
  Shield, 
  Video, 
  MapPin, 
  Clock, 
  TrendingUp,
  Users,
  Pill
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Matching",
    description: "Our machine learning algorithm analyzes symptoms and matches you with the most suitable specialist in seconds.",
    color: "text-primary"
  },
  {
    icon: Shield,
    title: "Blockchain Security",
    description: "Medical records secured on Ethereum testnet with immutable, verifiable consultation transcripts.",
    color: "text-secondary"
  },
  {
    icon: Video,
    title: "Telehealth Consultations",
    description: "HD video consultations with WebRTC integration for seamless remote healthcare delivery.",
    color: "text-accent"
  },
  {
    icon: MapPin,
    title: "Geo-Located Services",
    description: "Find nearby pharmacies and doctors with real-time availability and instant booking.",
    color: "text-primary"
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    description: "Access healthcare professionals round the clock with our decentralized provider network.",
    color: "text-secondary"
  },
  {
    icon: TrendingUp,
    title: "Real-Time Analytics",
    description: "Comprehensive dashboards for patients, providers, and hospitals with HIPAA compliance.",
    color: "text-accent"
  },
  {
    icon: Users,
    title: "Multi-Tenant System",
    description: "Separate portals for patients, doctors, nurses, pharmacies, and hospital administrators.",
    color: "text-primary"
  },
  {
    icon: Pill,
    title: "Pharmacy Network",
    description: "Direct prescription fulfillment with inventory tracking and geo-located delivery options.",
    color: "text-secondary"
  }
];

export const Features = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose MediConnect Hub?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Combining cutting-edge technology with healthcare expertise to revolutionize patient care
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 h-full hover:shadow-medium transition-smooth border-border/50">
                <div className={`w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
