import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { FileText, Plus, Eye, Trash2, Calendar, Download } from 'lucide-react'

export default function Dashboard() {
  const { user } = useAuth()
  const [curriculos, setCurriculos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchCurriculos()
    }
  }, [user])

  const fetchCurriculos = async () => {
    try {
      const { data, error } = await supabase
        .from('curriculos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCurriculos(data || [])
    } catch (error) {
      console.error('Erro ao buscar currículos:', error)
    }
    setLoading(false)
  }

  const deleteCurriculo = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este currículo?')) return

    try {
      const { error } = await supabase
        .from('curriculos')
        .delete()
        .eq('id', id)

      if (error) throw error
      setCurriculos(prev => prev.filter(c => c.id !== id))
    } catch (error) {
      console.error('Erro ao excluir currículo:', error)
      alert('Erro ao excluir currículo')
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Meus Currículos</h1>
          <p className="text-gray-600 mt-2">Gerencie seus currículos salvos</p>
        </div>
        
        <Link
          to="/create-resume"
          className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Currículo</span>
        </Link>
      </div>

      {/* Currículos Grid */}
      {curriculos.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum currículo encontrado</h3>
          <p className="text-gray-600 mb-6">Crie seu primeiro currículo profissional agora</p>
          <Link
            to="/create-resume"
            className="inline-flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>Criar Primeiro Currículo</span>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {curriculos.map((curriculo) => (
            <div key={curriculo.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{curriculo.titulo}</h3>
                    <div className="flex items-center space-x-1 text-gray-500 text-sm">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(curriculo.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => deleteCurriculo(curriculo.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  <p><strong>Nome:</strong> {curriculo.dados?.nome || 'Não informado'}</p>
                  <p><strong>Email:</strong> {curriculo.dados?.email || 'Não informado'}</p>
                </div>

                <div className="flex space-x-2 pt-4">
                  <button
                    onClick={() => {
                      if (onPreview) {
                        onPreview(curriculo.dados)
                      }
                    }}
                    className="flex-1 flex items-center justify-center space-x-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">Visualizar</span>
                  </button>
                  <button
                    onClick={() => {
                      // Implementar download direto
                      console.log('Download PDF para:', curriculo.dados?.nome)
                    }}
                    className="flex-1 flex items-center justify-center space-x-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span className="text-sm">PDF</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}