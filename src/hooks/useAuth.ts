import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "patient" | "doctor" | "nurse" | "pharmacy" | "hospital_admin";

interface UseAuthReturn {
  user: User | null;
  session: Session | null;
  loading: boolean;
  roles: AppRole[];
  hasRole: (role: AppRole) => boolean;
  signOut: () => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<AppRole[]>([]);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Defer role fetching
      if (session?.user) {
        setTimeout(() => {
          fetchUserRoles(session.user.id);
        }, 0);
      } else {
        setRoles([]);
      }
    });

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserRoles(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRoles = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching roles:', error);
        return;
      }

      setRoles(data?.map(r => r.role as AppRole) ?? []);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const hasRole = (role: AppRole): boolean => {
    return roles.includes(role);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRoles([]);
  };

  return { user, session, loading, roles, hasRole, signOut };
};