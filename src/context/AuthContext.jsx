import { createContext, useContext, useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const AuthContext = createContext();
const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const loadUserFromStorage = () => {
  try {
    const saved = localStorage.getItem("aliza-user");
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    if (!parsed) return null;
    if (typeof parsed.isAdmin === "boolean") return parsed;
    return {
      ...parsed,
      isAdmin: adminEmails.includes((parsed.email || "").toLowerCase()),
    };
  } catch {
    return null;
  }
};

const saveUserToStorage = (user) => {
  try {
    if (user) {
      localStorage.setItem("aliza-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("aliza-user");
    }
  } catch {
    // noop
  }
};

const mapSupabaseUser = (supabaseUser) => {
  if (!supabaseUser) return null;
  const email = supabaseUser.email || "";
  const emailMatch = adminEmails.includes(email.toLowerCase());
  const metadataAdmin = supabaseUser.user_metadata?.is_admin === true;
  return {
    id: supabaseUser.id,
    name:
      supabaseUser.user_metadata?.name ||
      supabaseUser.user_metadata?.full_name ||
      supabaseUser.email?.split("@")[0] ||
      "User",
    email,
    isAdmin: emailMatch || metadataAdmin,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const localUser = loadUserFromStorage();
        
        if (!isSupabaseConfigured || !supabase) {
          setUser(localUser);
          setLoading(false);
          return;
        }

        try {
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("timeout")), 3000)
          );

          const sessionPromise = supabase.auth.getSession();
          
          const result = await Promise.race([sessionPromise, timeoutPromise]);
          const data = result && typeof result === 'object' ? result : null;

          if (data?.session?.user) {
            const supabaseUser = mapSupabaseUser(data.session.user);
            setUser(supabaseUser);
            saveUserToStorage(supabaseUser);
          } else if (localUser) {
            setUser(localUser);
          }
        } catch (sessionError) {
          console.warn("Supabase session error:", sessionError);
          if (localUser) {
            setUser(localUser);
          }
        }
      } catch (error) {
        console.error("Auth bootstrap error:", error);
      }
      setLoading(false);
    };

    bootstrap();

    if (isSupabaseConfigured && supabase) {
      let isMounted = true;
      
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!isMounted) return;
        
        if (session?.user) {
          const mappedUser = mapSupabaseUser(session.user);
          setUser(mappedUser);
          saveUserToStorage(mappedUser);
        } else {
          const localUser = loadUserFromStorage();
          setUser(localUser);
        }
      });

      return () => {
        isMounted = false;
        subscription.unsubscribe();
      };
    }
  }, []);

  const login = async (email, password) => {
    setAuthLoading(true);
    if (!isSupabaseConfigured || !supabase) {
      const mockUser = {
        id: 1,
        name: "Demo User",
        email,
        isAdmin: adminEmails.includes(email.toLowerCase()),
      };
      setUser(mockUser);
      saveUserToStorage(mockUser);
      setAuthLoading(false);
      return { success: true };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthLoading(false);
      return { success: false, error: error.message };
    }

    const mappedUser = mapSupabaseUser(data.user);
    setUser(mappedUser);
    saveUserToStorage(mappedUser);
    setAuthLoading(false);
    return { success: true };
  };

  const register = async (name, email, password) => {
    setAuthLoading(true);
    if (!isSupabaseConfigured || !supabase) {
      const newUser = {
        id: Date.now(),
        name,
        email,
        isAdmin: adminEmails.includes(email.toLowerCase()),
      };
      setUser(newUser);
      saveUserToStorage(newUser);
      setAuthLoading(false);
      return { success: true };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (error) {
      setAuthLoading(false);
      return { success: false, error: error.message };
    }

    const mappedUser = mapSupabaseUser(data.user);
    setUser(mappedUser);
    saveUserToStorage(mappedUser);
    setAuthLoading(false);
    return { success: true };
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    saveUserToStorage(null);
  };

  const resendVerificationEmail = async (email) => {
    if (!email) return { success: false, error: "Email is required." };

    if (!isSupabaseConfigured || !supabase) {
      return { success: true };
    }

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const isAuthenticated = !!user;
  const isAdmin = !!user?.isAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        resendVerificationEmail,
        isAuthenticated,
        isAdmin,
        loading,
        authLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
