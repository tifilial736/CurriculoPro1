import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  Star,
  Eye,
  Palette,
  Briefcase,
  Code,
  Paintbrush,
  Users,
  Award,
  Search,
  Filter,
  Crown,
  Sparkles,
  X,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function TemplateSelector() {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showPreview, setShowPreview] = useState(null);
  const [previewStep, setPreviewStep] = useState(0);

  // Templates disponíveis
  const templates = [
    {
      id: 1,
      name: 'Moderno Azul',
      description:
        'Template contemporâneo ideal para profissionais de tecnologia',
      category: 'tech',
      colors: {
        primary: 'from-blue-500 to-blue-600',
        secondary: 'from-blue-400 to-blue-500',
        accent: 'from-blue-600 to-blue-700',
        bg: 'from-blue-50 to-blue-100',
      },
      borderColor: 'border-blue-200',
      hoverBorder: 'hover:border-blue-400',
      features: ['ATS-friendly', 'Design limpo', 'Seções destacadas'],
      popular: true,
      rating: 4.9,
      downloads: 15420,
    },
    {
      id: 2,
      name: 'Executivo Premium',
      description: 'Design sofisticado para cargos de liderança e C-level',
      category: 'executive',
      colors: {
        primary: 'from-purple-500 to-purple-600',
        secondary: 'from-purple-400 to-purple-500',
        accent: 'from-purple-600 to-purple-700',
        bg: 'from-purple-50 to-purple-100',
      },
      borderColor: 'border-purple-200',
      hoverBorder: 'hover:border-purple-400',
      features: [
        'Layout premium',
        'Tipografia elegante',
        'Destaque para conquistas',
      ],
      premium: true,
      rating: 4.8,
      downloads: 8950,
    },
    {
      id: 3,
      name: 'Criativo Designer',
      description:
        'Perfeito para designers, artistas e profissionais criativos',
      category: 'creative',
      colors: {
        primary: 'from-green-500 to-emerald-600',
        secondary: 'from-green-400 to-emerald-500',
        accent: 'from-emerald-600 to-emerald-700',
        bg: 'from-green-50 to-emerald-100',
      },
      borderColor: 'border-green-200',
      hoverBorder: 'hover:border-green-400',
      features: [
        'Visual impactante',
        'Espaço para portfolio',
        'Cores vibrantes',
      ],
      new: true,
      rating: 4.7,
      downloads: 3200,
    },
    {
      id: 4,
      name: 'Minimalista Elegante',
      description: 'Design clean e minimalista para qualquer área profissional',
      category: 'minimal',
      colors: {
        primary: 'from-gray-600 to-gray-700',
        secondary: 'from-gray-500 to-gray-600',
        accent: 'from-gray-700 to-gray-800',
        bg: 'from-gray-50 to-gray-100',
      },
      borderColor: 'border-gray-200',
      hoverBorder: 'hover:border-gray-400',
      features: ['Extremamente limpo', 'Foco no conteúdo', 'Versatilidade'],
      rating: 4.6,
      downloads: 12100,
    },
    {
      id: 5,
      name: 'Startup Inovador',
      description: 'Design moderno para empreendedores e startups',
      category: 'startup',
      colors: {
        primary: 'from-orange-500 to-red-500',
        secondary: 'from-orange-400 to-red-400',
        accent: 'from-red-500 to-red-600',
        bg: 'from-orange-50 to-red-100',
      },
      borderColor: 'border-orange-200',
      hoverBorder: 'hover:border-orange-400',
      features: ['Visual dinâmico', 'Destaque para projetos', 'Tom inovador'],
      rating: 4.5,
      downloads: 5600,
    },
    {
      id: 6,
      name: 'Corporate Tradicional',
      description:
        'Template clássico para ambientes corporativos conservadores',
      category: 'corporate',
      colors: {
        primary: 'from-indigo-500 to-blue-600',
        secondary: 'from-indigo-400 to-blue-500',
        accent: 'from-blue-600 to-blue-700',
        bg: 'from-indigo-50 to-blue-100',
      },
      borderColor: 'border-indigo-200',
      hoverBorder: 'hover:border-indigo-400',
      features: ['Formato tradicional', 'Confiável', 'Aceito universalmente'],
      rating: 4.4,
      downloads: 9800,
    },
  ];

  // Categorias para filtro
  const categories = [
    { id: 'all', name: 'Todos', icon: <Palette className="w-4 h-4" /> },
    { id: 'tech', name: 'Tecnologia', icon: <Code className="w-4 h-4" /> },
    {
      id: 'executive',
      name: 'Executivo',
      icon: <Briefcase className="w-4 h-4" />,
    },
    {
      id: 'creative',
      name: 'Criativo',
      icon: <Paintbrush className="w-4 h-4" />,
    },
    { id: 'startup', name: 'Startup', icon: <Sparkles className="w-4 h-4" /> },
    {
      id: 'corporate',
      name: 'Corporativo',
      icon: <Users className="w-4 h-4" />,
    },
    { id: 'minimal', name: 'Minimalista', icon: <Award className="w-4 h-4" /> },
  ];

  // Carregar template selecionado do localStorage ao inicializar
  useEffect(() => {
    const savedTemplate = localStorage.getItem('selectedTemplate');
    if (savedTemplate) {
      setSelectedTemplate(parseInt(savedTemplate));
    }
  }, []);

  // Filtrar templates
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === 'all' || template.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId);
    // Salvar template selecionado no localStorage
    localStorage.setItem('selectedTemplate', templateId.toString());
  };

  const handleContinue = () => {
    if (selectedTemplate) {
      navigate('/create-resume');
    }
  };

  const handlePreview = (templateId, e) => {
    if (e) e.stopPropagation();
    setShowPreview(templateId);
    setPreviewStep(0);
  };

  const nextPreview = () => {
    setPreviewStep((prev) => (prev + 1) % 3);
  };

  const prevPreview = () => {
    setPreviewStep((prev) => (prev - 1 + 3) % 3);
  };

  // Renderizar preview do template
  const renderTemplatePreview = (template) => {
    const previews = [
      // Preview 1: Cabeçalho
      <div key="preview-1" className="bg-white p-6 rounded-xl shadow-sm">
        <div
          className={`h-12 bg-gradient-to-r ${template.colors.primary} rounded-t-xl mb-4`}
        ></div>
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
          <div className="flex-1">
            <div
              className={`h-4 bg-gradient-to-r ${template.colors.primary} rounded w-3/4 mb-2`}
            ></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          <div className="h-3 bg-gray-200 rounded w-4/5"></div>
        </div>
      </div>,

      // Preview 2: Experiência
      <div key="preview-2" className="bg-white p-6 rounded-xl shadow-sm">
        <div
          className={`h-6 bg-gradient-to-r ${template.colors.secondary} rounded-t-xl mb-4 w-2/3`}
        ></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border-l-4 border-gray-300 pl-4">
              <div className="flex justify-between items-start mb-1">
                <div
                  className={`h-4 bg-gradient-to-r ${template.colors.primary} rounded w-1/2 mb-1`}
                ></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
              <div className="space-y-1">
                <div className="h-2 bg-gray-200 rounded w-full"></div>
                <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                <div className="h-2 bg-gray-200 rounded w-4/5"></div>
              </div>
            </div>
          ))}
        </div>
      </div>,

      // Preview 3: Habilidades
      <div key="preview-3" className="bg-white p-6 rounded-xl shadow-sm">
        <div
          className={`h-6 bg-gradient-to-r ${template.colors.secondary} rounded-t-xl mb-4 w-1/2`}
        ></div>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <div
            className={`h-6 bg-gradient-to-r ${template.colors.secondary} rounded-t-xl mb-4 w-1/3`}
          ></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>,
    ];

    return previews[previewStep];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors bg-white px-4 py-2 rounded-xl shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Escolha seu Template
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl">
              Selecione o design que melhor representa seu perfil profissional
            </p>
          </div>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12 bg-white p-6 rounded-2xl shadow-lg">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setFilterCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-200 ${
                  filterCategory === category.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category.icon}
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className={`group relative bg-gradient-to-br ${
                template.colors.bg
              } rounded-3xl overflow-hidden shadow-lg transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl border-2 ${
                selectedTemplate === template.id
                  ? 'border-blue-500 ring-4 ring-blue-200'
                  : `${template.borderColor} ${template.hoverBorder}`
              }`}
            >
              {/* Template Preview */}
              <div className="aspect-[3/4] p-6">
                <div className="bg-white rounded-2xl p-4 h-full shadow-inner relative overflow-hidden">
                  {/* Simulated Resume Content */}
                  <div className="space-y-2">
                    <div
                      className={`h-4 bg-gradient-to-r ${template.colors.primary} rounded w-3/4`}
                    ></div>
                    <div className="h-2 bg-gray-200 rounded w-full"></div>
                    <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                    <div className="mt-4 space-y-1">
                      <div
                        className={`h-2 bg-gradient-to-r ${template.colors.primary} opacity-60 rounded w-2/3`}
                      ></div>
                      <div
                        className={`h-2 bg-gradient-to-r ${template.colors.primary} opacity-40 rounded w-4/5`}
                      ></div>
                      <div
                        className={`h-2 bg-gradient-to-r ${template.colors.primary} opacity-30 rounded w-3/4`}
                      ></div>
                    </div>
                    <div className="mt-4 space-y-1">
                      <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex space-x-3">
                      <button
                        onClick={(e) => handlePreview(template.id, e)}
                        className="w-10 h-10 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center"
                        title="Visualizar"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleTemplateSelect(template.id)}
                        className="w-10 h-10 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center"
                        title="Selecionar"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Template Info */}
              <div className="p-6 bg-white">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-bold text-gray-900 text-lg">
                        {template.name}
                      </h3>
                      {template.premium && (
                        <Crown
                          className="w-4 h-4 text-yellow-500"
                          title="Premium"
                        />
                      )}
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {template.description}
                    </p>
                  </div>
                </div>

                {/* Rating and Downloads */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-current text-yellow-400" />
                    <span className="text-sm font-medium text-gray-700">
                      {template.rating}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({template.downloads.toLocaleString()} downloads)
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2 mb-4">
                  {template.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {template.popular && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">
                        Mais Popular
                      </span>
                    )}
                    {template.premium && (
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs px-3 py-1 rounded-full font-medium">
                        Premium
                      </span>
                    )}
                    {template.new && (
                      <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
                        Novo
                      </span>
                    )}
                  </div>

                  {selectedTemplate === template.id && (
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Nenhum template encontrado
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Tente buscar com outros termos ou ajuste os filtros para encontrar
              o template perfeito
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterCategory('all');
              }}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              <Filter className="w-4 h-4" />
              <span>Limpar Filtros</span>
            </button>
          </div>
        )}

        {/* Continue Button */}
        {selectedTemplate && (
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
            <button
              onClick={handleContinue}
              className="flex items-center space-x-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105"
            >
              <Check className="w-5 h-5" />
              <span className="font-semibold">
                Continuar com Template Selecionado
              </span>
            </button>
          </div>
        )}

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  Preview: {templates.find((t) => t.id === showPreview)?.name}
                </h3>
                <button
                  onClick={() => setShowPreview(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 p-6 overflow-y-auto">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 min-h-[400px] flex items-center justify-center">
                  <div className="w-full max-w-md">
                    {renderTemplatePreview(
                      templates.find((t) => t.id === showPreview)
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-center mt-6 space-x-4">
                  <button
                    onClick={prevPreview}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex space-x-2">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          previewStep === i ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      ></div>
                    ))}
                  </div>
                  <button
                    onClick={nextPreview}
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      handleTemplateSelect(showPreview);
                      setShowPreview(null);
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
                  >
                    Selecionar Este Template
                  </button>
                  <button
                    onClick={() => setShowPreview(null)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
