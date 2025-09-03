// src/lib/supabase.js
import { createClient } from "@supabase/supabase-js";

// Variáveis de ambiente (apenas via import.meta.env no Vite)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "❌ Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env.local ou no Vercel."
  );
}

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Exportar de duas formas (named e default)
export { supabase };
export default supabase;
