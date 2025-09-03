import { createClient } from '@supabase/supabase-js'

// Obter variáveis de ambiente com fallback para valores vazios
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || ''
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || ''

// Verificar se as variáveis de ambiente estão configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variáveis de ambiente do Supabase não configuradas:');
  console.error('REACT_APP_SUPABASE_URL:', supabaseUrl ? 'Configurada' : 'Não configurada');
  console.error('REACT_APP_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Configurada' : 'Não configurada');
  
  // Não lançar erro imediatamente para permitir que o app carregue
  // O erro será tratado quando tentar usar o Supabase
}

// Criar e exportar o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})