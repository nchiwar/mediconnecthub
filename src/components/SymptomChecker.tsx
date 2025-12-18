import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Brain, 
  Sparkles,
  ArrowRight,
  Loader2,
  Star,
  Award,
  Calendar
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BookAppointmentDialog } from "./appointments/BookAppointmentDialog";
import { useNavigate } from "react-router-dom";

interface MatchedDoctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  yearsExperience: number;
  consultationFee: number;
  matchScore: number;
}

export const SymptomChecker = () => {
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    specialty: string;
    doctors: MatchedDoctor[];
  } | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<{ id: string; name: string } | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) {
      toast.error("Please describe your symptoms");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('ai-match-doctor', {
        body: { symptoms },
      });

      if (error) throw error;

      if (data.doctors && data.doctors.length > 0) {
        setResult(data);
        toast.success(`Found ${data.doctors.length} matching doctors`);
      } else {
        // Show demo result if no real doctors found
        setResult({
          specialty: data.specialty || "General Medicine",
          doctors: [
            {
              id: "demo-1",
              name: "Dr. Sarah Johnson",
              specialty: data.specialty || "General Medicine",
              rating: 4.9,
              yearsExperience: 12,
              consultationFee: 150,
              matchScore: 95,
            },
            {
              id: "demo-2",
              name: "Dr. Michael Chen",
              specialty: data.specialty || "General Medicine",
              rating: 4.8,
              yearsExperience: 8,
              consultationFee: 120,
              matchScore: 88,
            },
          ],
        });
        toast.info("Showing demo doctors. Sign up real doctors to see live matches.");
      }
    } catch (error: any) {
      console.error('Symptom analysis error:', error);
      // Fallback to demo mode
      setResult({
        specialty: "General Medicine",
        doctors: [
          {
            id: "demo-1",
            name: "Dr. Sarah Johnson",
            specialty: "General Medicine",
            rating: 4.9,
            yearsExperience: 12,
            consultationFee: 150,
            matchScore: 95,
          },
        ],
      });
      toast.info("Using demo mode - AI service temporarily unavailable");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleBookAppointment = async (doctorId: string, doctorName: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast.error("Please sign in to book an appointment");
      navigate("/auth");
      return;
    }

    if (doctorId.startsWith("demo-")) {
      toast.info("This is a demo doctor. Sign up real doctors to book appointments.");
      return;
    }

    setSelectedDoctor({ id: doctorId, name: doctorName });
    setBookingOpen(true);
  };

  return (
    <>
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <Sparkles className="w-3 h-3 mr-1" />
                AI-Powered Analysis
              </Badge>
              <h2 className="text-4xl font-bold mb-4">Smart Symptom Checker</h2>
              <p className="text-lg text-muted-foreground">
                Describe your symptoms and let our AI match you with the right specialist
              </p>
            </div>

            <Card className="p-8 shadow-medium">
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">What symptoms are you experiencing?</h3>
                <Textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe your symptoms in detail. For example: I have been experiencing severe headaches for the past 3 days, along with sensitivity to light and occasional nausea..."
                  className="min-h-[150px] text-base"
                  disabled={isAnalyzing}
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Button
                  onClick={analyzeSymptoms}
                  disabled={isAnalyzing || !symptoms.trim()}
                  size="lg"
                  className="w-full gradient-primary text-white"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing Symptoms with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Find Matching Doctors
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </motion.div>

              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mt-8 space-y-6"
                  >
                    <div className="p-6 bg-primary/5 rounded-xl border border-primary/20">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <Brain className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold mb-2">Analysis Complete</h4>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Recommended Specialty:</span>
                            <Badge className="bg-primary text-white">{result.specialty}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xl font-bold">Matched Doctors ({result.doctors.length})</h3>
                      {result.doctors.map((doctor, index) => (
                        <motion.div
                          key={doctor.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-6 rounded-xl border border-border hover:border-primary/50 transition-smooth bg-card"
                        >
                          <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div className="flex-1 min-w-[200px]">
                              <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <h4 className="text-lg font-bold">{doctor.name}</h4>
                                <Badge className="bg-accent/10 text-accent border-accent/20">
                                  {doctor.matchScore}% Match
                                </Badge>
                              </div>
                              <p className="text-muted-foreground mb-3">{doctor.specialty}</p>
                              <div className="flex flex-wrap items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-accent text-accent" />
                                  <span className="font-medium">{doctor.rating}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Award className="w-4 h-4 text-muted-foreground" />
                                  <span>{doctor.yearsExperience} years exp</span>
                                </div>
                                <div className="text-muted-foreground">
                                  Fee: ${doctor.consultationFee}
                                </div>
                              </div>
                            </div>
                            <Button
                              onClick={() => handleBookAppointment(doctor.id, doctor.name)}
                              className="gradient-secondary text-white"
                            >
                              <Calendar className="w-4 h-4 mr-2" />
                              Book Now
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </div>
      </section>

      {selectedDoctor && (
        <BookAppointmentDialog
          open={bookingOpen}
          onOpenChange={setBookingOpen}
          doctorId={selectedDoctor.id}
          doctorName={selectedDoctor.name}
          onSuccess={() => {
            setResult(null);
            setSymptoms("");
          }}
        />
      )}
    </>
  );
};