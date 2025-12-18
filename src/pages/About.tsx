import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  Shield, 
  Users, 
  Activity, 
  Globe, 
  Heart,
  Award,
  Target,
  Zap
} from "lucide-react";

const team = [
  { name: "Dr. Sarah Johnson", role: "Chief Medical Officer", image: "👩‍⚕️" },
  { name: "Michael Chen", role: "CEO & Founder", image: "👨‍💼" },
  { name: "Emily Davis", role: "Head of Technology", image: "👩‍💻" },
  { name: "Robert Wilson", role: "Director of Operations", image: "👨‍💻" },
];

const values = [
  { 
    icon: Shield, 
    title: "Security First", 
    description: "HIPAA & GDPR compliant with blockchain-secured records" 
  },
  { 
    icon: Users, 
    title: "Patient-Centered", 
    description: "Designed around patient needs and healthcare accessibility" 
  },
  { 
    icon: Activity, 
    title: "Innovation", 
    description: "AI-powered matching and telehealth solutions" 
  },
  { 
    icon: Globe, 
    title: "Accessibility", 
    description: "Connecting rural communities to quality healthcare" 
  },
];

const stats = [
  { value: "10,000+", label: "Active Users" },
  { value: "500+", label: "Healthcare Providers" },
  { value: "50+", label: "Partner Pharmacies" },
  { value: "99.9%", label: "Uptime" },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4">About Us</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Revolutionizing Healthcare Through Technology
            </h1>
            <p className="text-xl text-muted-foreground">
              MediConnect Hub is a decentralized healthcare marketplace connecting patients, 
              doctors, nurses, pharmacies, and hospitals on a single secure platform.
            </p>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="bg-muted/30 py-16 mb-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <p className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="container mx-auto px-4 mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Badge className="mb-4">
                <Target className="w-3 h-3 mr-1" />
                Our Mission
              </Badge>
              <h2 className="text-3xl font-bold mb-4">
                Making Quality Healthcare Accessible to Everyone
              </h2>
              <p className="text-muted-foreground mb-6">
                We believe that everyone deserves access to quality healthcare, regardless of 
                their location or economic status. Our platform bridges the gap between patients 
                and healthcare providers through innovative technology.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Zap className="w-4 h-4 text-primary" />
                  </div>
                  <span>AI-powered symptom matching for faster care</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-primary" />
                  </div>
                  <span>Blockchain-secured medical records</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Heart className="w-4 h-4 text-primary" />
                  </div>
                  <span>Telehealth consultations anytime, anywhere</span>
                </li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl gradient-primary p-8 flex items-center justify-center">
                <Activity className="w-32 h-32 text-white" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
        <section className="container mx-auto px-4 mb-16">
          <div className="text-center mb-12">
            <Badge className="mb-4">
              <Award className="w-3 h-3 mr-1" />
              Our Values
            </Badge>
            <h2 className="text-3xl font-bold">What Drives Us</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-smooth">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="container mx-auto px-4 mb-16">
          <div className="text-center mb-12">
            <Badge className="mb-4">
              <Users className="w-3 h-3 mr-1" />
              Our Team
            </Badge>
            <h2 className="text-3xl font-bold">Meet the Leaders</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 text-center hover:shadow-lg transition-smooth">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-4xl mx-auto mb-4">
                    {member.image}
                  </div>
                  <h3 className="text-lg font-semibold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
