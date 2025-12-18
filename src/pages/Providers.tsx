import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  Phone,
  Video,
  Calendar,
  Filter,
  Stethoscope,
  Heart,
  Brain,
  Bone,
  Eye,
  Baby
} from "lucide-react";
import { BookAppointmentDialog } from "@/components/appointments/BookAppointmentDialog";

const specialties = [
  { id: "all", name: "All Specialties", icon: Stethoscope },
  { id: "cardiology", name: "Cardiology", icon: Heart },
  { id: "neurology", name: "Neurology", icon: Brain },
  { id: "orthopedics", name: "Orthopedics", icon: Bone },
  { id: "ophthalmology", name: "Ophthalmology", icon: Eye },
  { id: "pediatrics", name: "Pediatrics", icon: Baby },
];

const mockProviders = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    rating: 4.9,
    reviews: 234,
    experience: 15,
    location: "New York, NY",
    distance: "2.3 miles",
    availability: "Available Today",
    consultationFee: 150,
    image: "👩‍⚕️",
    languages: ["English", "Spanish"],
    videoConsult: true,
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialty: "Neurology",
    rating: 4.8,
    reviews: 189,
    experience: 12,
    location: "Brooklyn, NY",
    distance: "4.1 miles",
    availability: "Next Available: Tomorrow",
    consultationFee: 175,
    image: "👨‍⚕️",
    languages: ["English", "Mandarin"],
    videoConsult: true,
  },
  {
    id: "3",
    name: "Dr. Emily Davis",
    specialty: "Pediatrics",
    rating: 4.95,
    reviews: 312,
    experience: 10,
    location: "Manhattan, NY",
    distance: "1.8 miles",
    availability: "Available Today",
    consultationFee: 125,
    image: "👩‍⚕️",
    languages: ["English", "French"],
    videoConsult: true,
  },
  {
    id: "4",
    name: "Dr. Robert Wilson",
    specialty: "Orthopedics",
    rating: 4.7,
    reviews: 156,
    experience: 20,
    location: "Queens, NY",
    distance: "5.5 miles",
    availability: "Next Available: Wed",
    consultationFee: 200,
    image: "👨‍⚕️",
    languages: ["English"],
    videoConsult: false,
  },
  {
    id: "5",
    name: "Dr. Lisa Park",
    specialty: "Ophthalmology",
    rating: 4.85,
    reviews: 178,
    experience: 8,
    location: "Bronx, NY",
    distance: "6.2 miles",
    availability: "Available Today",
    consultationFee: 160,
    image: "👩‍⚕️",
    languages: ["English", "Korean"],
    videoConsult: true,
  },
  {
    id: "6",
    name: "Dr. James Brown",
    specialty: "Cardiology",
    rating: 4.6,
    reviews: 145,
    experience: 18,
    location: "Staten Island, NY",
    distance: "8.0 miles",
    availability: "Next Available: Thu",
    consultationFee: 180,
    image: "👨‍⚕️",
    languages: ["English"],
    videoConsult: true,
  },
];

const Providers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  const filteredProviders = mockProviders.filter((provider) => {
    const matchesSearch = provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === "all" || 
                            provider.specialty.toLowerCase() === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const handleBookAppointment = (doctorId: string) => {
    setSelectedDoctor(doctorId);
    setBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        {/* Search Header */}
        <section className="bg-muted/30 py-12 mb-8">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl font-bold mb-4">Find Healthcare Providers</h1>
              <p className="text-muted-foreground text-lg">
                Connect with top-rated doctors, specialists, and healthcare professionals
              </p>
            </motion.div>

            <div className="max-w-3xl mx-auto">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, specialty, or condition..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 text-lg"
                  />
                </div>
                <Button size="lg" className="h-14 gradient-primary text-white">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Specialties</h3>
                <div className="space-y-2">
                  {specialties.map((specialty) => (
                    <button
                      key={specialty.id}
                      onClick={() => setSelectedSpecialty(specialty.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-smooth ${
                        selectedSpecialty === specialty.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <specialty.icon className="w-5 h-5" />
                      <span className="text-sm">{specialty.name}</span>
                    </button>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Availability</h3>
                <div className="space-y-2">
                  {["Available Today", "This Week", "Next Week"].map((option) => (
                    <label key={option} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Consultation Type</h3>
                <div className="space-y-2">
                  {["Video Consultation", "In-Person", "Both"].map((option) => (
                    <label key={option} className="flex items-center gap-3 cursor-pointer">
                      <input type="radio" name="consultation" className="rounded" />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              </Card>
            </div>

            {/* Provider Cards */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  Showing <span className="font-semibold text-foreground">{filteredProviders.length}</span> providers
                </p>
                <select className="border rounded-lg px-4 py-2 bg-background">
                  <option>Sort by: Relevance</option>
                  <option>Sort by: Rating</option>
                  <option>Sort by: Distance</option>
                  <option>Sort by: Experience</option>
                </select>
              </div>

              <div className="space-y-4">
                {filteredProviders.map((provider, index) => (
                  <motion.div
                    key={provider.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-smooth">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-shrink-0">
                          <div className="w-24 h-24 rounded-xl bg-muted flex items-center justify-center text-5xl">
                            {provider.image}
                          </div>
                        </div>

                        <div className="flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                            <div>
                              <h3 className="text-xl font-semibold">{provider.name}</h3>
                              <p className="text-primary font-medium">{provider.specialty}</p>
                            </div>
                            <Badge variant={provider.availability.includes("Today") ? "default" : "secondary"}>
                              <Clock className="w-3 h-3 mr-1" />
                              {provider.availability}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span className="font-medium text-foreground">{provider.rating}</span>
                              <span>({provider.reviews} reviews)</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{provider.location}</span>
                              <span>• {provider.distance}</span>
                            </div>
                            <span>{provider.experience} years exp.</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 mb-4">
                            {provider.languages.map((lang) => (
                              <Badge key={lang} variant="outline" className="text-xs">
                                {lang}
                              </Badge>
                            ))}
                            {provider.videoConsult && (
                              <Badge variant="outline" className="text-xs">
                                <Video className="w-3 h-3 mr-1" />
                                Video Available
                              </Badge>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                              <span className="text-2xl font-bold">${provider.consultationFee}</span>
                              <span className="text-muted-foreground text-sm"> / consultation</span>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Phone className="w-4 h-4 mr-2" />
                                Call
                              </Button>
                              <Button 
                                size="sm" 
                                className="gradient-primary text-white"
                                onClick={() => handleBookAppointment(provider.id)}
                              >
                                <Calendar className="w-4 h-4 mr-2" />
                                Book Appointment
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <BookAppointmentDialog
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        doctorId={selectedDoctor}
        doctorName={mockProviders.find(p => p.id === selectedDoctor)?.name}
      />
    </div>
  );
};

export default Providers;
