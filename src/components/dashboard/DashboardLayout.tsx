import { ReactNode, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Activity, ArrowLeft, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  role?: string;
}

export const DashboardLayout = ({ children, title, subtitle, role }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border shadow-soft">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 transition-smooth hover:opacity-80">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">MediConnect Hub</span>
          </Link>
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm text-muted-foreground hidden md:inline">
                {user.email}
              </span>
            )}
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Home
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          {role && (
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-3">
              {role}
            </div>
          )}
          <h1 className="text-4xl font-bold mb-2">{title}</h1>
          {subtitle && (
            <p className="text-lg text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {children}
      </main>
    </div>
  );
};