import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Activity, User as UserIcon, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

export const Navigation = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 transition-smooth hover:opacity-80">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">MediConnect Hub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-foreground hover:text-primary transition-smooth">
              Home
            </Link>
            <Link to="/providers" className="text-foreground hover:text-primary transition-smooth">
              Find Providers
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-smooth">
              About
            </Link>
            
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">
                  {user.email}
                </span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
                  <UserIcon className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
                <Button size="sm" className="gradient-primary text-white" onClick={() => navigate("/auth")}>
                  <LogIn className="w-4 h-4 mr-2" />
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground hover:text-primary transition-smooth"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-4">
                <Link
                  to="/"
                  className="block text-foreground hover:text-primary transition-smooth"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/providers"
                  className="block text-foreground hover:text-primary transition-smooth"
                  onClick={() => setIsOpen(false)}
                >
                  Find Providers
                </Link>
                <Link
                  to="/about"
                  className="block text-foreground hover:text-primary transition-smooth"
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>
                <div className="pt-4 space-y-2">
                  {user ? (
                    <>
                      <div className="text-sm text-muted-foreground px-2">
                        {user.email}
                      </div>
                      <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" className="w-full justify-start" onClick={() => navigate("/auth")}>
                        <UserIcon className="w-4 h-4 mr-2" />
                        Sign In
                      </Button>
                      <Button className="w-full gradient-primary text-white" onClick={() => navigate("/auth")}>
                        <LogIn className="w-4 h-4 mr-2" />
                        Get Started
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};