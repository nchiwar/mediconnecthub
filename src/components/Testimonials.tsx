import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Dr. Sarah Johnson",
    role: "Cardiologist",
    avatar: "SJ",
    rating: 5,
    text: "MediConnect Hub has transformed how I manage my practice. The AI matching system ensures I get patients who truly need my expertise.",
    color: "bg-primary"
  },
  {
    name: "Michael Chen",
    role: "Patient",
    avatar: "MC",
    rating: 5,
    text: "Found the perfect specialist for my condition in minutes. The telehealth feature saved me hours of travel time.",
    color: "bg-secondary"
  },
  {
    name: "Emily Rodriguez",
    role: "Nurse Practitioner",
    avatar: "ER",
    rating: 5,
    text: "The vitals tracking and team collaboration features make patient care so much more efficient and coordinated.",
    color: "bg-accent"
  },
  {
    name: "PharmaCare Plus",
    role: "Pharmacy Chain",
    avatar: "PP",
    rating: 5,
    text: "Digital prescriptions and delivery management have streamlined our operations. Inventory tracking is a game-changer.",
    color: "bg-primary"
  },
  {
    name: "City General Hospital",
    role: "Healthcare Facility",
    avatar: "CG",
    rating: 5,
    text: "The multi-tenant dashboard gives us complete visibility into all departments. Resource allocation has never been easier.",
    color: "bg-secondary"
  },
  {
    name: "James Williams",
    role: "Patient",
    avatar: "JW",
    rating: 5,
    text: "The symptom checker accurately identified my issue and connected me with a specialist the same day. Incredible service!",
    color: "bg-accent"
  }
];

export const Testimonials = () => {
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
            Trusted by Healthcare Professionals
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See what our community has to say about their experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 h-full hover:shadow-medium transition-smooth">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>

                <div className="flex items-center gap-3">
                  <Avatar className={testimonial.color}>
                    <AvatarFallback className="text-white font-semibold">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
