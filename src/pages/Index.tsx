import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { SymptomChecker } from "@/components/SymptomChecker";
import { Features } from "@/components/Features";
import { RoleCards } from "@/components/RoleCards";
import { Testimonials } from "@/components/Testimonials";
import { Footer } from "@/components/Footer";
import { VerifyRecordDialog } from "@/components/blockchain/VerifyRecordDialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Link as LinkIcon } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <SymptomChecker />
      <Features />
      
      {/* Blockchain Verification Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-green-500/10 text-green-600 border-green-500/20">
                <Shield className="w-3 h-3 mr-1" />
                Blockchain Secured
              </Badge>
              <h2 className="text-4xl font-bold mb-4">Verifiable Health Records</h2>
              <p className="text-lg text-muted-foreground">
                All consultations and prescriptions are secured on Polygon blockchain for transparency and verification
              </p>
            </div>

            <Card className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                  <LinkIcon className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">Verify Any Health Record</h3>
              <p className="text-muted-foreground mb-6">
                Enter a blockchain hash to verify the authenticity of consultation records, 
                prescriptions, and medical documentation.
              </p>
              <VerifyRecordDialog />
            </Card>
          </motion.div>
        </div>
      </section>
      
      <RoleCards />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;