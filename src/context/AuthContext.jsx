import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const AuthContext = createContext();

const getAdminEmails = () => {
  try {
    return (import.meta.env.VITE_ADMIN_EMAILS || "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);
  } catch {
    return [];
  }
};

const loadUserFromStorage = () => {
  try {
    const saved = localStorage.getItem("aliza-user");
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    if (!parsed) return null;
    return parsed;
  } catch {
    return null;
  }
};

const saveUserToStorage = (user) => {
  try {
    if (user) {
      const adminEmails = getAdminEmails();
      const userWithAdmin = {
        ...user,
        isAdmin: user.isAdmin || adminEmails.includes((user.email || "").toLowerCase()),
      };
      localStorage.setItem("aliza-user", JSON.stringify(userWithAdmin));
    } else {
      localStorage.removeItem("aliza-user");
    }
  } catch {
    // noop
  }
};

const mapSupabaseUser = (supabaseUser) => {
  if (!supabaseUser) return null;
  const adminEmails = getAdminEmails();
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
    let isMounted = true;

    const initAuth = async () => {
      const savedUser = loadUserFromStorage();
      
      if (!isSupabaseConfigured || !supabase) {
        if (isMounted) {
          setUser(savedUser);
          setLoading(false);
        }
        return;
      }

      try {
        const { data } = await supabase.auth.getSession();
        
        if (isMounted) {
          if (data?.session?.user) {
            const supabaseUser = mapSupabaseUser(data.session.user);
            setUser(supabaseUser);
            saveUserToStorage(supabaseUser);
          } else if (savedUser) {
            setUser(savedUser);
          }
          setLoading(false);
        }
      } catch (error) {
        console.warn("Auth init error:", error);
        if (isMounted) {
          setUser(savedUser);
          setLoading(false);
        }
      }
    };

    initAuth();

    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (!isMounted) return;
        
        if (event === "SIGNED_IN" && session?.user) {
          const supabaseUser = mapSupabaseUser(session.user);
          setUser(supabaseUser);
          saveUserToStorage(supabaseUser);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          saveUserToStorage(null);
        }
      });

      return () => {
        isMounted = false;
        subscription.unsubscribe();
      };
    } else {
      isMounted = false;
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setAuthLoading(true);
    try {
      if (!isSupabaseConfigured || !supabase) {
        const adminEmails = getAdminEmails();
        const mockUser = {
          id: Date.now(),
          name: email.split("@")[0],
          email,
          isAdmin: adminEmails.includes(email.toLowerCase()),
        };
        setUser(mockUser);
        saveUserToStorage(mockUser);
        return { success: true };
      }

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, error: error.message };

      const mappedUser = mapSupabaseUser(data.user);
      setUser(mappedUser);
      saveUserToStorage(mappedUser);
      return { success: true };
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setAuthLoading(true);
    try {
      if (!isSupabaseConfigured || !supabase) {
        const adminEmails = getAdminEmails();
        const newUser = {
          id: Date.now(),
          name,
          email,
          isAdmin: adminEmails.includes(email.toLowerCase()),
        };
        setUser(newUser);
        saveUserToStorage(newUser);
        return { success: true };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });

      if (error) return { success: false, error: error.message };

      const mappedUser = mapSupabaseUser(data.user);
      setUser(mappedUser);
      saveUserToStorage(mappedUser);
      return { success: true };
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn("Signout error:", e);
      }
    }
    setUser(null);
    saveUserToStorage(null);
  }, []);

  const resendVerificationEmail = useCallback(async (email) => {
    if (!email) return { success: false, error: "Email is required." };
    if (!isSupabaseConfigured || !supabase) return { success: true };

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  }, []);

  const value = {
    user,
    login,
    register,
    logout,
    resendVerificationEmail,
    isAuthenticated: !!user,
    isAdmin: !!user?.isAdmin,
    loading,
    authLoading,
  };

  return (
    <AuthContext.Provider value={value}>
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
