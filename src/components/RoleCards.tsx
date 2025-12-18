import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Stethoscope, 
  Heart, 
  Pill, 
  Building2,
  ArrowRight,
  CheckCircle
} from "lucide-react";

const roles = [
  {
    icon: User,
    title: "Patient",
    description: "Get AI-matched with specialists, book consultations, and manage your health records",
    benefits: [
      "Instant symptom analysis",
      "24/7 doctor access",
      "Secure health records",
      "Pharmacy delivery"
    ],
    color: "primary",
    gradient: "gradient-primary"
  },
  {
    icon: Stethoscope,
    title: "Doctor",
    description: "Join our network, manage appointments, and provide telehealth consultations",
    benefits: [
      "Flexible scheduling",
      "Video consultations",
      "E-prescriptions",
      "Patient analytics"
    ],
    color: "secondary",
    gradient: "gradient-secondary"
  },
  {
    icon: Heart,
    title: "Nurse",
    description: "Support patient care, log vitals, and coordinate with medical teams",
    benefits: [
      "Vitals tracking",
      "Team collaboration",
      "Shift management",
      "Patient monitoring"
    ],
    color: "accent",
    gradient: "gradient-primary"
  },
  {
    icon: Pill,
    title: "Pharmacy",
    description: "Receive e-prescriptions, manage inventory, and offer delivery services",
    benefits: [
      "Digital prescriptions",
      "Inventory tracking",
      "Delivery management",
      "Analytics dashboard"
    ],
    color: "primary",
    gradient: "gradient-secondary"
  },
  {
    icon: Building2,
    title: "Hospital",
    description: "Multi-tenant dashboard for managing staff, beds, and facility operations",
    benefits: [
      "Staff management",
      "Bed allocation",
      "Department analytics",
      "Resource tracking"
    ],
    color: "secondary",
    gradient: "gradient-primary"
  }
];

export const RoleCards = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            For Everyone in Healthcare
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Role
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Whether you're seeking care or providing it, we have tailored solutions for you
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role, index) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-8 h-full hover:shadow-strong transition-smooth border-border/50 flex flex-col">
                <div className={`w-16 h-16 rounded-2xl ${role.gradient} flex items-center justify-center mb-6`}>
                  <role.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-3">{role.title}</h3>
                <p className="text-muted-foreground mb-6 flex-grow">
                  {role.description}
                </p>

                <div className="space-y-3 mb-6">
                  {role.benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>

                <Button className={`w-full ${role.gradient} text-white group`} asChild>
                  <Link to={`/${role.title.toLowerCase()}-dashboard`}>
                    Get Started as {role.title}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-smooth" />
                  </Link>
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
