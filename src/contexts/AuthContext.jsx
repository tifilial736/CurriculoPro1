import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

// Criação do contexto de autenticação
const AuthContext = createContext();

// Hook personalizado para usar AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Provider de autenticação
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sessão inicial
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Escutar mudanças na auth
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Funções de autenticação
  const signUp = async (email, password) => {
    return await supabase.auth.signUp({ email, password });
  };

  const signIn = async (email, password) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    setUser(null);
    return { error };
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
