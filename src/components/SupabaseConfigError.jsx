// src/components/SupabaseConfigError.jsx
import { AlertCircle, Database, RefreshCw, ExternalLink } from 'lucide-react';

function SupabaseConfigError({ error, configStatus }) {
  const openVercelSettings = () => {
    // Esta função pode ser adaptada para abrir as configurações do Vercel
    window.open('https://vercel.com/docs/projects/environment-variables', '_blank');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-red-100">
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Database className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Configuração Necessária
          </h2>
          <p className="text-gray-600 text-center mb-6">
            O aplicativo precisa ser configurado para se conectar ao banco de dados.
          </p>
        </div>
        
        <div className="bg-red-50 p-4 rounded-xl mb-6 border border-red-200">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-red-700 font-medium mb-2">Erro de configuração:</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-xl mb-6 border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
            <Database className="h-4 w-4 mr-2" />
            Status da Configuração
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-700">REACT_APP_SUPABASE_URL:</span>
              <span className={`font-medium ${configStatus.supabaseUrl === 'Configurada' ? 'text-green-600' : 'text-red-600'}`}>
                {configStatus.supabaseUrl}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">REACT_APP_SUPABASE_ANON_KEY:</span>
              <span className={`font-medium ${configStatus.supabaseAnonKey === 'Configurada' ? 'text-green-600' : 'text-red-600'}`}>
                {configStatus.supabaseAnonKey}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-xl mb-6 border border-yellow-200">
          <h3 className="font-semibold text-yellow-800 mb-2">Como resolver no Vercel:</h3>
          <ol className="text-sm text-yellow-700 space-y-2 list-decimal list-inside">
            <li>Acesse seu projeto no painel do Vercel</li>
            <li>Vá em <span className="font-mono">Settings → Environment Variables</span></li>
            <li>Adicione as variáveis:
              <ul className="list-disc list-inside ml-5 mt-1">
                <li><span className="font-mono">REACT_APP_SUPABASE_URL</span></li>
                <li><span className="font-mono">REACT_APP_SUPABASE_ANON_KEY</span></li>
              </ul>
            </li>
            <li>Faça redeploy da aplicação</li>
          </ol>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={openVercelSettings}
            className="flex items-center justify-center gap-2 bg-gray-800 text-white py-3 px-4 rounded-xl hover:bg-gray-900 transition-colors font-medium"
          >
            <ExternalLink className="h-4 w-4" />
            Ver Documentação do Vercel
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            <RefreshCw className="h-4 w-4" />
            Recarregar Página
          </button>
        </div>
      </div>
    </div>
  );
}

export default SupabaseConfigError;