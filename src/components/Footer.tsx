import { Link } from "react-router-dom";
import { Activity, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">MediConnect Hub</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Revolutionizing healthcare through AI-powered matching and blockchain security.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>support@mediconnect.com</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>

          {/* For Patients */}
          <div>
            <h3 className="font-semibold mb-4">For Patients</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/symptom-checker" className="hover:text-primary transition-smooth">Symptom Checker</Link></li>
              <li><Link to="/find-doctors" className="hover:text-primary transition-smooth">Find Doctors</Link></li>
              <li><Link to="/pharmacies" className="hover:text-primary transition-smooth">Pharmacies</Link></li>
              <li><Link to="/book-consultation" className="hover:text-primary transition-smooth">Book Consultation</Link></li>
            </ul>
          </div>

          {/* For Providers */}
          <div>
            <h3 className="font-semibold mb-4">For Providers</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/register-doctor" className="hover:text-primary transition-smooth">Doctor Registration</Link></li>
              <li><Link to="/register-nurse" className="hover:text-primary transition-smooth">Nurse Registration</Link></li>
              <li><Link to="/register-pharmacy" className="hover:text-primary transition-smooth">Pharmacy Registration</Link></li>
              <li><Link to="/register-hospital" className="hover:text-primary transition-smooth">Hospital Registration</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-smooth">About Us</Link></li>
              <li><Link to="/blog" className="hover:text-primary transition-smooth">Blog</Link></li>
              <li><Link to="/careers" className="hover:text-primary transition-smooth">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-smooth">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 MediConnect Hub. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-primary transition-smooth">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-primary transition-smooth">Terms of Service</Link>
              <Link to="/hipaa" className="hover:text-primary transition-smooth">HIPAA Compliance</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
