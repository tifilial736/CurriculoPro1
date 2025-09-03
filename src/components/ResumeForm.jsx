import { useState, useEffect, useCallback } from 'react';
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
  Download,
  FileText,
  Palette,
  Zap,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { generateAIContent, improveTextWithAI } from '../services/aiService';
import { exportToPDF } from '../utils/exportUtils';
import { validateResumeData } from '../utils/validation';
import TemplateSelector from '../components/TemplateSelector';
import AutocompleteSuggestions from '../components/AutocompleteSuggestions';

// Templates pré-definidos
const RESUME_TEMPLATES = {
  modern: {
    name: 'Moderno',
    colors: {
      primary: '#2563eb',
      secondary: '#4f46e5',
      accent: '#0ea5e9'
    }
  },
  classic: {
    name: 'Clássico',
    colors: {
      primary: '#1e40af',
      secondary: '#374151',
      accent: '#6b7280'
    }
  },
  creative: {
    name: 'Criativo',
    colors: {
      primary: '#7c3aed',
      secondary: '#db2777',
      accent: '#f59e0b'
    }
  }
};

export default function ResumeForm({ onPreview }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [aiLoading, setAiLoading] = useState(false);
  const [suggestions, setSuggestions] = useState({});

  // Estado inicial do formulário
  const initialData = {
    personal: {
      nome: '',
      email: '',
      telefone: '',
      endereco: '',
      linkedin: '',
      site: '',
    },
    resumo: '',
    experiencias: [
      { cargo: '', empresa: '', periodo: '', descricao: '', local: '' },
    ],
    formacao: [{ curso: '', instituicao: '', periodo: '', descricao: '' }],
    habilidades: { 
      tecnicas: '', 
      idiomas: '', 
      certificacoes: '',
      softSkills: '' 
    },
    projetos: [{ nome: '', descricao: '', tecnologias: '', link: '' }],
    voluntariado: '',
    premios: '',
    idiomas: '',
    interesses: '',
  };

  const [formData, setFormData] = useState(initialData);

  // Etapas do formulário
  const steps = [
    { id: 1, title: 'Informações Pessoais', icon: '👤' },
    { id: 2, title: 'Experiência Profissional', icon: '💼' },
    { id: 3, title: 'Formação & Habilidades', icon: '🎓' },
    { id: 4, title: 'Projetos & Extras', icon: '🚀' },
    { id: 5, title: 'Template & Finalizar', icon: '🎨' },
  ];

  // Carregar dados salvos
  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = useCallback(async () => {
    // Primeiro verifica no localStorage
    const savedData = localStorage.getItem('resumeForm');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
    
    // Depois tenta carregar da nuvem
    try {
      const { data, error } = await supabase
        .from('curriculos')
        .select('dados, template')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (!error && data.length > 0) {
        setFormData(data[0].dados);
        if (data[0].template) {
          setSelectedTemplate(data[0].template);
        }
      }
    } catch (error) {
      console.log('Nenhum dado salvo na nuvem');
    }
  }, [user]);

  // Auto-save com debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (JSON.stringify(formData) !== JSON.stringify(initialData)) {
        autoSave();
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [formData]);

  const autoSave = useCallback(async () => {
    setAutoSaving(true);
    
    // Salva localmente
    localStorage.setItem('resumeForm', JSON.stringify(formData));
    
    // Tenta salvar na nuvem
    try {
      const { error } = await supabase
        .from('curriculos_autosave')
        .upsert({
          user_id: user.id,
          dados: formData,
          updated_at: new Date().toISOString(),
        });
      
      if (!error) {
        setLastSaved(new Date());
      }
    } catch (error) {
      console.error('Erro no autosave:', error);
    }
    
    setTimeout(() => {
      setAutoSaving(false);
    }, 1000);
  }, [formData, user]);

  // Validação por etapa
  const validateStep = useCallback((step) => {
    return validateResumeData(formData, step);
  }, [formData]);

  // Navegação entre etapas
  const nextStep = useCallback(() => {
    const errors = validateStep(currentStep);
    setValidationErrors(errors);
    if (Object.keys(errors).length === 0 && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      
      // Scroll para o topo ao mudar de etapa
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep, validateStep, steps.length]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);

  // Handlers para mudanças no formulário
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('personal.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        personal: { ...prev.personal, [field]: value }
      }));
    } 
    else if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: { ...prev[section], [field]: value },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Limpar erro de validação
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }, [validationErrors]);

  const handleArrayChange = useCallback((section, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  }, []);

  const addArrayItem = useCallback((section, template) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], template],
    }));
  }, []);

  const removeArrayItem = useCallback((section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  }, []);

  // Funcionalidades de IA
  const generateAISummary = useCallback(async () => {
    setAiLoading(true);
    try {
      const summary = await generateAIContent({
        type: 'summary',
        experiences: formData.experiencias,
        skills: formData.habilidades
      });
      
      setFormData(prev => ({ ...prev, resumo: summary }));
    } catch (error) {
      console.error('Erro ao gerar resumo com IA:', error);
      alert('Erro ao gerar resumo. Tente novamente.');
    }
    setAiLoading(false);
  }, [formData.experiencias, formData.habilidades]);

  const improveWithAI = useCallback(async (field, currentValue) => {
    setAiLoading(true);
    try {
      const improvedText = await improveTextWithAI(currentValue);
      
      if (field.includes('.')) {
        const [section, subField] = field.split('.');
        setFormData(prev => ({
          ...prev,
          [section]: { ...prev[section], [subField]: improvedText }
        }));
      } else {
        setFormData(prev => ({ ...prev, [field]: improvedText }));
      }
    } catch (error) {
      console.error('Erro ao melhorar texto com IA:', error);
    }
    setAiLoading(false);
  }, []);

  const generateAISuggestions = useCallback(async (field, context) => {
    try {
      const suggestions = await generateAIContent({
        type: 'suggestions',
        field,
        context
      });
      
      setSuggestions(prev => ({ ...prev, [field]: suggestions }));
    } catch (error) {
      console.error('Erro ao gerar sugestões:', error);
    }
  }, []);

  // Exportar para PDF
  const handleExportPDF = useCallback(async () => {
    setLoading(true);
    try {
      await exportToPDF(formData, selectedTemplate);
      alert('Currículo exportado com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      alert('Erro ao exportar currículo.');
    }
    setLoading(false);
  }, [formData, selectedTemplate]);

  // Salvar currículo
  const handleSave = useCallback(async () => {
    const allErrors = validateResumeData(formData, 'all');
    
    if (Object.keys(allErrors).length > 0) {
      setValidationErrors(allErrors);
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('curriculos').insert([
        {
          user_id: user.id,
          dados: formData,
          titulo: `Currículo - ${formData.personal.nome || 'Sem título'}`,
          template: selectedTemplate,
        },
      ]);

      if (error) throw error;

      localStorage.removeItem('resumeForm');
      alert('Currículo salvo com sucesso!');
      
      if (onPreview) {
        onPreview(formData, selectedTemplate);
        navigate('/preview');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar currículo. Tente novamente.');
    }
    setLoading(false);
  }, [formData, user, selectedTemplate, onPreview, navigate]);

  const handlePreview = useCallback(() => {
    if (onPreview) {
      onPreview(formData, selectedTemplate);
      navigate('/preview');
    }
  }, [formData, selectedTemplate, onPreview, navigate]);

  const clearForm = useCallback(() => {
    if (window.confirm('Tem certeza que deseja limpar todos os dados?')) {
      setFormData(initialData);
      localStorage.removeItem('resumeForm');
      setCurrentStep(1);
      setValidationErrors({});
    }
  }, [initialData]);

  // Renderização condicional para cada etapa
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep 
          formData={formData} 
          onChange={handleChange}
          validationErrors={validationErrors}
          onGenerateAI={generateAISummary}
          onImproveAI={improveWithAI}
          aiLoading={aiLoading}
        />;
      case 2:
        return <ExperienceStep 
          formData={formData}
          onChange={handleArrayChange}
          onAdd={() => addArrayItem('experiencias', { cargo: '', empresa: '', periodo: '', descricao: '', local: '' })}
          onRemove={(index) => removeArrayItem('experiencias', index)}
          validationErrors={validationErrors}
          onSuggest={generateAISuggestions}
          suggestions={suggestions}
        />;
      case 3:
        return <EducationSkillsStep 
          formData={formData}
          onChange={handleChange}
          onArrayChange={handleArrayChange}
          onAddEducation={() => addArrayItem('formacao', { curso: '', instituicao: '', periodo: '', descricao: '' })}
          onRemoveEducation={(index) => removeArrayItem('formacao', index)}
          validationErrors={validationErrors}
        />;
      case 4:
        return <ProjectsExtrasStep 
          formData={formData}
          onChange={handleChange}
          onArrayChange={handleArrayChange}
          onAddProject={() => addArrayItem('projetos', { nome: '', descricao: '', tecnologias: '', link: '' })}
          onRemoveProject={(index) => removeArrayItem('projetos', index)}
        />;
      case 5:
        return <TemplateStep 
          selectedTemplate={selectedTemplate}
          onSelectTemplate={setSelectedTemplate}
          onExportPDF={handleExportPDF}
        />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
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
          <div className="flex items-center justify-center space-x-2 mt-1">
            {autoSaving && (
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Salvando...</span>
              </div>
            )}
            {lastSaved && !autoSaving && (
              <div className="text-sm text-gray-500">
                Último salvamento: {lastSaved.toLocaleTimeString('pt-BR')}
              </div>
            )}
          </div>
        </div>

        <div className="flex space-x-3 flex-wrap gap-2">
          <button
            onClick={handlePreview}
            className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-xl hover:bg-gray-700 transition-all duration-200 shadow-lg"
          >
            <Eye className="w-4 h-4" />
            <span>Visualizar</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg"
          >
            <Download className="w-4 h-4" />
            <span>Exportar PDF</span>
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Salvando...' : 'Salvar'}</span>
          </button>
          <button
            onClick={clearForm}
            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-all duration-200 shadow-lg"
          >
            <XCircle className="w-4 h-4" />
            <span>Limpar</span>
          </button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center mb-6 flex-wrap gap-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all duration-300 ${
                  currentStep === step.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110'
                    : currentStep > step.id
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {currentStep > step.id ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  step.id
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 h-1 mx-2 rounded transition-colors ${
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
          {renderStepContent()}
          
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

            {currentStep < steps.length ? (
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
                  Visualização do template: {RESUME_TEMPLATES[selectedTemplate]?.name}
                </p>
              </div>

              <div className="p-6 max-h-[600px] overflow-y-auto">
                <ResumePreview 
                  data={formData} 
                  template={selectedTemplate} 
                />
              </div>

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

// Componentes para cada etapa (seriam em arquivos separados)
const PersonalInfoStep = ({ formData, onChange, validationErrors, onGenerateAI, onImproveAI, aiLoading }) => (
  <div className="space-y-8">
    {/* Seu código para informações pessoais */}
  </div>
);

const ExperienceStep = ({ formData, onChange, onAdd, onRemove, validationErrors, onSuggest, suggestions }) => (
  <div className="space-y-8">
    {/* Seu código para experiências profissionais */}
  </div>
);

// ... outros componentes de etapa

const TemplateStep = ({ selectedTemplate, onSelectTemplate, onExportPDF }) => (
  <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
    <div className="flex items-center space-x-3 mb-6">
      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
        <Palette className="w-5 h-5 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-gray-900">Escolher Template</h3>
    </div>
    
    <TemplateSelector 
      selectedTemplate={selectedTemplate}
      onSelect={onSelectTemplate}
      templates={RESUME_TEMPLATES}
    />
    
    <div className="mt-8">
      <button
        onClick={onExportPDF}
        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg"
      >
        <Download className="w-5 h-5" />
        <span>Exportar para PDF</span>
      </button>
    </div>
  </div>
);