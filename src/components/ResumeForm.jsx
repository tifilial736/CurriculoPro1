import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Save,
  Eye,
  XCircle,
  Sparkles,
  Brain,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function ResumeForm({ onPreview }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Estado inicial do formulário
  const initialData = {
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    linkedin: '',
    site: '',
    resumo: '',
    experiencias: [
      { cargo: '', empresa: '', periodo: '', descricao: '', local: '' },
    ],
    formacao: [{ curso: '', instituicao: '', periodo: '', descricao: '' }],
    habilidades: { tecnicas: '', idiomas: '', certificacoes: '' },
    projetos: [{ nome: '', descricao: '', tecnologias: '', link: '' }],
    voluntariado: '',
    premios: '',
  };

  const [formData, setFormData] = useState(initialData);

  // Etapas do formulário
  const steps = [
    { id: 1, title: 'Informações Pessoais', icon: '👤' },
    { id: 2, title: 'Experiência Profissional', icon: '💼' },
    { id: 3, title: 'Formação & Habilidades', icon: '🎓' },
    { id: 4, title: 'Projetos & Extras', icon: '🚀' },
  ];

  // Carregar dados salvos
  useEffect(() => {
    const savedData = localStorage.getItem('resumeForm');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  // Auto-save
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (JSON.stringify(formData) !== JSON.stringify(initialData)) {
        autoSave();
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [formData]);

  const autoSave = () => {
    setAutoSaving(true);
    localStorage.setItem('resumeForm', JSON.stringify(formData));
    setLastSaved(new Date());
    setTimeout(() => {
      setAutoSaving(false);
    }, 1000);
  };

  // Validação por etapa
  const validateStep = (step) => {
    const errors = {};
    switch (step) {
      case 1:
        if (!formData.nome.trim()) errors.nome = 'Nome é obrigatório';
        if (!formData.email.trim()) errors.email = 'Email é obrigatório';
        if (!formData.telefone.trim())
          errors.telefone = 'Telefone é obrigatório';
        break;
      case 2:
        if (!formData.experiencias.some((exp) => exp.cargo.trim())) {
          errors.experiencias = 'Adicione pelo menos uma experiência';
        }
        break;
      case 3:
        if (!formData.formacao.some((edu) => edu.curso.trim())) {
          errors.formacao = 'Adicione pelo menos uma formação';
        }
        break;
    }
    return errors;
  };

  // Navegação entre etapas
  const nextStep = () => {
    const errors = validateStep(currentStep);
    setValidationErrors(errors);
    if (Object.keys(errors).length === 0 && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handlers para mudanças no formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Limpar erro de validação
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleArrayChange = (section, index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addArrayItem = (section, template) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [...prev[section], template],
    }));
  };

  const removeArrayItem = (section, index) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  // Funcionalidades de IA
  const generateSummary = async () => {
    // Simular geração de resumo com IA
    const suggestions = [
      `Profissional experiente com sólida formação em ${
        formData.experiencias[0]?.cargo || 'sua área'
      } e histórico comprovado de resultados excepcionais. Especialista em liderança de equipes e desenvolvimento de soluções inovadoras que geram impacto real nos negócios.`,
      `${
        formData.experiencias[0]?.cargo || 'Profissional'
      } altamente qualificado com expertise em gestão de projetos complexos e capacidade comprovada de superar metas. Focado em resultados e com forte orientação para trabalho em equipe.`,
      `Especialista em ${
        formData.experiencias[0]?.cargo || 'área de atuação'
      } com histórico de sucesso em ambientes dinâmicos. Combinando conhecimento técnico com visão estratégica para entregar soluções que agregam valor aos negócios.`,
    ];

    const randomSuggestion =
      suggestions[Math.floor(Math.random() * suggestions.length)];
    setFormData((prev) => ({ ...prev, resumo: randomSuggestion }));
  };

  const improveSummary = async () => {
    if (!formData.resumo) return;

    // Simular melhoria do texto
    const improvedText = formData.resumo.replace(/\b\w+/g, (word) => {
      const improvements = {
        bom: 'excepcional',
        trabalho: 'desenvolvimento',
        fazer: 'executar',
        muito: 'significativamente',
      };
      return improvements[word.toLowerCase()] || word;
    });

    setFormData((prev) => ({ ...prev, resumo: improvedText }));
  };

  // Salvar currículo
  const handleSave = async () => {
    const allErrors = validateStep(1);
    Object.assign(allErrors, validateStep(2));
    Object.assign(allErrors, validateStep(3));

    if (Object.keys(allErrors).length > 0) {
      setValidationErrors(allErrors);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('curriculos').insert([
        {
          user_id: user.id,
          dados: formData,
          titulo: `Currículo - ${formData.nome || 'Sem título'}`,
        },
      ]);

      if (error) throw error;

      localStorage.removeItem('resumeForm');
      if (onPreview) {
        onPreview(formData);
        navigate('/preview');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar currículo. Tente novamente.');
    }
    setLoading(false);
  };

  const handlePreview = () => {
    if (onPreview) {
      onPreview(formData);
      navigate('/preview');
    }
  };

  const clearForm = () => {
    if (window.confirm('Tem certeza que deseja limpar todos os dados?')) {
      setFormData(initialData);
      localStorage.removeItem('resumeForm');
      setCurrentStep(1);
      setValidationErrors({});
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </button>

        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Criar Currículo
          </h1>
          {autoSaving && (
            <div className="flex items-center justify-center space-x-2 text-sm text-green-600 mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Salvamento automático...</span>
            </div>
          )}
          {lastSaved && !autoSaving && (
            <div className="text-sm text-gray-500 mt-1">
              Salvo às{' '}
              {lastSaved.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          )}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handlePreview}
            className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 transition-all duration-200 shadow-lg"
          >
            <Eye className="w-4 h-4" />
            <span>Visualizar</span>
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Salvando...' : 'Salvar'}</span>
          </button>
          <button
            onClick={clearForm}
            className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-all duration-200 shadow-lg"
          >
            <XCircle className="w-4 h-4" />
            <span>Limpar</span>
          </button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full font-bold transition-all duration-300 ${
                  currentStep === step.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110'
                    : currentStep > step.id
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {currentStep > step.id ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  step.id
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-1 mx-4 rounded transition-colors ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {steps[currentStep - 1].title}
          </h2>
          <p className="text-gray-600">
            Passo {currentStep} de {steps.length}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Form Content */}
        <div className="lg:col-span-7">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-lg">👤</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Informações Pessoais
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        validationErrors.nome
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                      placeholder="Digite seu nome completo"
                    />
                    {validationErrors.nome && (
                      <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                        <AlertTriangle className="w-4 h-4" />
                        <span>{validationErrors.nome}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Profissional *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        validationErrors.email
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                      placeholder="seu.email@exemplo.com"
                    />
                    {validationErrors.email && (
                      <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                        <AlertTriangle className="w-4 h-4" />
                        <span>{validationErrors.email}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        validationErrors.telefone
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                      placeholder="(11) 99999-9999"
                    />
                    {validationErrors.telefone && (
                      <p className="text-red-500 text-sm mt-1 flex items-center space-x-1">
                        <AlertTriangle className="w-4 h-4" />
                        <span>{validationErrors.telefone}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cidade, Estado
                    </label>
                    <input
                      type="text"
                      name="endereco"
                      value={formData.endereco}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="São Paulo, SP"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="https://linkedin.com/in/seu-perfil"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Portfolio/Site
                    </label>
                    <input
                      type="url"
                      name="site"
                      value={formData.site}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="https://seu-portfolio.com"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Summary */}
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-lg">📝</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Resumo Profissional
                  </h3>
                </div>

                <div className="space-y-4">
                  <textarea
                    name="resumo"
                    value={formData.resumo}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Descreva brevemente sua experiência, principais habilidades e objetivos profissionais..."
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        type="button"
                        onClick={generateSummary}
                        className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Gerar com IA</span>
                      </button>
                      <button
                        type="button"
                        onClick={improveSummary}
                        className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                      >
                        <Brain className="w-4 h-4" />
                        <span>Melhorar Texto</span>
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formData.resumo.length}/500 caracteres
                    </span>
                  </div>
                </div>

                {/* AI Tips */}
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Brain className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        💡 Dica da IA
                      </h4>
                      <p className="text-sm text-gray-600">
                        Use um email profissional e inclua sua localização para
                        aumentar suas chances com recrutadores locais.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Professional Experience */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <span className="text-white text-lg">💼</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Experiência Profissional
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      addArrayItem('experiencias', {
                        cargo: '',
                        empresa: '',
                        periodo: '',
                        descricao: '',
                        local: '',
                      })
                    }
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar</span>
                  </button>
                </div>

                {validationErrors.experiencias && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-600 text-sm flex items-center space-x-1">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{validationErrors.experiencias}</span>
                    </p>
                  </div>
                )}

                <div className="space-y-6">
                  {formData.experiencias.map((exp, index) => (
                    <div
                      key={index}
                      className="group relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200"
                    >
                      {formData.experiencias.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('experiencias', index)}
                          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4 mx-auto" />
                        </button>
                      )}

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cargo
                          </label>
                          <input
                            type="text"
                            value={exp.cargo}
                            onChange={(e) =>
                              handleArrayChange(
                                'experiencias',
                                index,
                                'cargo',
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Ex: Desenvolvedor Senior"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Empresa
                          </label>
                          <input
                            type="text"
                            value={exp.empresa}
                            onChange={(e) =>
                              handleArrayChange(
                                'experiencias',
                                index,
                                'empresa',
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Ex: TechCorp Ltda"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Período
                          </label>
                          <input
                            type="text"
                            value={exp.periodo}
                            onChange={(e) =>
                              handleArrayChange(
                                'experiencias',
                                index,
                                'periodo',
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Ex: Jan 2020 - Atual"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Local
                          </label>
                          <input
                            type="text"
                            value={exp.local}
                            onChange={(e) =>
                              handleArrayChange(
                                'experiencias',
                                index,
                                'local',
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="Ex: São Paulo, SP"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Principais responsabilidades e conquistas
                        </label>
                        <textarea
                          rows="3"
                          value={exp.descricao}
                          onChange={(e) =>
                            handleArrayChange(
                              'experiencias',
                              index,
                              'descricao',
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                          placeholder="• Liderou equipe de 5 desenvolvedores no projeto X&#10;• Aumentou a eficiência em 30% implementando nova metodologia&#10;• Responsável por arquitetura de sistemas críticos"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Education & Skills */}
          {currentStep === 3 && (
            <div className="space-y-8">
              {/* Education */}
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <span className="text-white text-lg">🎓</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Formação Acadêmica
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      addArrayItem('formacao', {
                        curso: '',
                        instituicao: '',
                        periodo: '',
                        descricao: '',
                      })
                    }
                    className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar</span>
                  </button>
                </div>

                {validationErrors.formacao && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-600 text-sm flex items-center space-x-1">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{validationErrors.formacao}</span>
                    </p>
                  </div>
                )}

                <div className="space-y-6">
                  {formData.formacao.map((edu, index) => (
                    <div
                      key={index}
                      className="group relative bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-200 hover:shadow-lg transition-all duration-200"
                    >
                      {formData.formacao.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('formacao', index)}
                          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4 mx-auto" />
                        </button>
                      )}

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Curso
                          </label>
                          <input
                            type="text"
                            value={edu.curso}
                            onChange={(e) =>
                              handleArrayChange(
                                'formacao',
                                index,
                                'curso',
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                            placeholder="Ex: Bacharelado em Ciência da Computação"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Instituição
                          </label>
                          <input
                            type="text"
                            value={edu.instituicao}
                            onChange={(e) =>
                              handleArrayChange(
                                'formacao',
                                index,
                                'instituicao',
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                            placeholder="Ex: Universidade de São Paulo"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Período
                          </label>
                          <input
                            type="text"
                            value={edu.periodo}
                            onChange={(e) =>
                              handleArrayChange(
                                'formacao',
                                index,
                                'periodo',
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                            placeholder="Ex: 2016 - 2020"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Descrição (opcional)
                          </label>
                          <input
                            type="text"
                            value={edu.descricao}
                            onChange={(e) =>
                              handleArrayChange(
                                'formacao',
                                index,
                                'descricao',
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                            placeholder="Ex: Ênfase em Engenharia de Software"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-lg">⚡</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Habilidades
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Habilidades Técnicas
                    </label>
                    <textarea
                      name="habilidades.tecnicas"
                      value={formData.habilidades.tecnicas}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Ex: JavaScript, React, Node.js, Python, SQL, Git, AWS..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Idiomas
                    </label>
                    <textarea
                      name="habilidades.idiomas"
                      value={formData.habilidades.idiomas}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Ex: Português (Nativo), Inglês (Avançado), Espanhol (Intermediário)..."
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certificações
                  </label>
                  <textarea
                    name="habilidades.certificacoes"
                    value={formData.habilidades.certificacoes}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Ex: AWS Solutions Architect, Scrum Master Certified, Google Analytics..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Projects & Extras */}
          {currentStep === 4 && (
            <div className="space-y-8">
              {/* Projects */}
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                      <span className="text-white text-lg">🚀</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Projetos
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      addArrayItem('projetos', {
                        nome: '',
                        descricao: '',
                        tecnologias: '',
                        link: '',
                      })
                    }
                    className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-xl hover:bg-orange-700 transition-all duration-200 shadow-lg"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar</span>
                  </button>
                </div>

                <div className="space-y-6">
                  {formData.projetos.map((projeto, index) => (
                    <div
                      key={index}
                      className="group relative bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-200 hover:shadow-lg transition-all duration-200"
                    >
                      {formData.projetos.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeArrayItem('projetos', index)}
                          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4 mx-auto" />
                        </button>
                      )}

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nome do Projeto
                          </label>
                          <input
                            type="text"
                            value={projeto.nome}
                            onChange={(e) =>
                              handleArrayChange(
                                'projetos',
                                index,
                                'nome',
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                            placeholder="Ex: Sistema de Gestão de Vendas"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Link (opcional)
                          </label>
                          <input
                            type="url"
                            value={projeto.link}
                            onChange={(e) =>
                              handleArrayChange(
                                'projetos',
                                index,
                                'link',
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                            placeholder="https://github.com/seu-usuario/projeto"
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tecnologias Utilizadas
                        </label>
                        <input
                          type="text"
                          value={projeto.tecnologias}
                          onChange={(e) =>
                            handleArrayChange(
                              'projetos',
                              index,
                              'tecnologias',
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                          placeholder="Ex: React, Node.js, MongoDB, Docker"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Descrição
                        </label>
                        <textarea
                          rows="3"
                          value={projeto.descricao}
                          onChange={(e) =>
                            handleArrayChange(
                              'projetos',
                              index,
                              'descricao',
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 resize-none"
                          placeholder="Descreva o projeto, seus objetivos e principais funcionalidades..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-lg">✨</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Informações Adicionais
                  </h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trabalho Voluntário
                    </label>
                    <textarea
                      name="voluntariado"
                      value={formData.voluntariado}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Descreva suas atividades de voluntariado..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prêmios e Reconhecimentos
                    </label>
                    <textarea
                      name="premios"
                      value={formData.premios}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Liste prêmios, reconhecimentos ou conquistas relevantes..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-12">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
              >
                <span>Próximo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 transition-all duration-200 shadow-lg"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Salvando...' : 'Finalizar Currículo'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Preview Sidebar */}
        <div className="lg:col-span-5">
          <div className="sticky top-24">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <h3 className="font-bold text-lg mb-2 flex items-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <span>Preview ao Vivo</span>
                </h3>
                <p className="text-blue-100 text-sm">
                  Veja como ficará seu currículo em tempo real
                </p>
              </div>

              <div className="p-6 max-h-[600px] overflow-y-auto">
                {/* Resume Preview Content */}
                <div className="space-y-6 text-sm">
                  {/* Header Preview */}
                  <div className="border-b-2 border-blue-600 pb-4">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {formData.nome || 'Seu Nome'}
                    </h1>
                    <div className="space-y-1 text-gray-600">
                      {formData.email && <div>{formData.email}</div>}
                      {formData.telefone && <div>{formData.telefone}</div>}
                      {formData.endereco && <div>{formData.endereco}</div>}
                    </div>
                  </div>

                  {/* Summary Preview */}
                  {formData.resumo && (
                    <div>
                      <h3 className="font-bold text-blue-700 mb-2 uppercase tracking-wide text-sm">
                        Resumo Profissional
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-sm">
                        {formData.resumo}
                      </p>
                    </div>
                  )}

                  {/* Experience Preview */}
                  {formData.experiencias.some((exp) => exp.cargo) && (
                    <div>
                      <h3 className="font-bold text-blue-700 mb-3 uppercase tracking-wide text-sm">
                        Experiência Profissional
                      </h3>
                      <div className="space-y-4">
                        {formData.experiencias
                          .filter((exp) => exp.cargo)
                          .map((exp, index) => (
                            <div
                              key={index}
                              className="border-l-4 border-blue-200 pl-4"
                            >
                              <div className="flex justify-between items-start mb-1">
                                <div>
                                  <h4 className="font-semibold text-gray-900 text-sm">
                                    {exp.cargo}
                                  </h4>
                                  <p className="text-blue-600 text-sm">
                                    {exp.empresa}
                                  </p>
                                </div>
                                {exp.periodo && (
                                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    {exp.periodo}
                                  </span>
                                )}
                              </div>
                              {exp.descricao && (
                                <p className="text-gray-600 text-xs">
                                  {exp.descricao.substring(0, 100)}...
                                </p>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Education Preview */}
                  {formData.formacao.some((edu) => edu.curso) && (
                    <div>
                      <h3 className="font-bold text-blue-700 mb-3 uppercase tracking-wide text-sm">
                        Formação Acadêmica
                      </h3>
                      <div className="space-y-3">
                        {formData.formacao
                          .filter((edu) => edu.curso)
                          .map((edu, index) => (
                            <div
                              key={index}
                              className="border-l-4 border-blue-200 pl-4"
                            >
                              <h4 className="font-semibold text-gray-900 text-sm">
                                {edu.curso}
                              </h4>
                              <p className="text-blue-600 text-sm">
                                {edu.instituicao}
                              </p>
                              {edu.periodo && (
                                <p className="text-xs text-gray-500">
                                  {edu.periodo}
                                </p>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Skills Preview */}
                  {(formData.habilidades.tecnicas ||
                    formData.habilidades.idiomas) && (
                    <div>
                      <h3 className="font-bold text-blue-700 mb-3 uppercase tracking-wide text-sm">
                        Habilidades
                      </h3>
                      <div className="space-y-2">
                        {formData.habilidades.tecnicas && (
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm">
                              Técnicas
                            </h4>
                            <p className="text-gray-600 text-xs">
                              {formData.habilidades.tecnicas.substring(0, 80)}
                              ...
                            </p>
                          </div>
                        )}
                        {formData.habilidades.idiomas && (
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm">
                              Idiomas
                            </h4>
                            <p className="text-gray-600 text-xs">
                              {formData.habilidades.idiomas.substring(0, 80)}...
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Projects Preview */}
                  {formData.projetos.some((proj) => proj.nome) && (
                    <div>
                      <h3 className="font-bold text-blue-700 mb-3 uppercase tracking-wide text-sm">
                        Projetos
                      </h3>
                      <div className="space-y-3">
                        {formData.projetos
                          .filter((proj) => proj.nome)
                          .map((projeto, index) => (
                            <div
                              key={index}
                              className="border-l-4 border-blue-200 pl-4"
                            >
                              <h4 className="font-semibold text-gray-900 text-sm">
                                {projeto.nome}
                              </h4>
                              {projeto.tecnologias && (
                                <p className="text-blue-600 text-xs">
                                  {projeto.tecnologias}
                                </p>
                              )}
                              {projeto.descricao && (
                                <p className="text-gray-600 text-xs">
                                  {projeto.descricao.substring(0, 60)}...
                                </p>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Preview Actions */}
              <div className="p-4 border-t border-gray-100 bg-gray-50">
                <button
                  onClick={handlePreview}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                >
                  <Eye className="w-4 h-4" />
                  <span>Visualização Completa</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
