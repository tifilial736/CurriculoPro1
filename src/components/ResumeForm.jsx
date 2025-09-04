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
import TemplateSelector from './resume-builder/common/TemplateSelector';
import AutocompleteSuggestions from './resume-builder/common/AutocompleteSuggestions';

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

function ResumeForm({ onPreview }) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      address: '',
      summary: ''
    },
    experience: [],
    education: [],
    skills: [],
    languages: [],
    certifications: []
  });

  const [step, setStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [validationErrors, setValidationErrors] = useState({});
  const [aiLoading, setAiLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // Carregar dados salvos
  useEffect(() => {
    const loadSavedData = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('curriculos')
        .select('dados')
        .eq('user_id', user.id)
        .single();

      if (data?.dados) {
        setFormData(data.dados);
      }
    };
    loadSavedData();
  }, [user]);

  // Atualizar campos
  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (section, index, field, value) => {
    const updatedArray = [...formData[section]];
    updatedArray[index][field] = value;
    setFormData(prev => ({
      ...prev,
      [section]: updatedArray
    }));
  };

  const handleAddItem = (section, newItem) => {
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], newItem]
    }));
  };

  const handleRemoveItem = (section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  // Salvar currículo
  const handleSave = async () => {
    const errors = validateResumeData(formData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    if (!user) return;

    const { error } = await supabase
      .from('curriculos')
      .upsert({
        user_id: user.id,
        dados: formData,
        template: selectedTemplate,
        updated_at: new Date()
      });

    if (error) {
      console.error('Erro ao salvar:', error.message);
    } else {
      alert('Currículo salvo com sucesso!');
    }
  };

  // Exportar PDF
  const handleExportPDF = async () => {
    await exportToPDF(formData, selectedTemplate);
  };

  // Gerar conteúdo com IA
  const handleGenerateAI = async (field, prompt) => {
    try {
      setAiLoading(true);
      const generated = await generateAIContent(prompt);
      handleChange('personalInfo', field, generated);
    } catch (error) {
      console.error('Erro IA:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleImproveAI = async (field, text) => {
    try {
      setAiLoading(true);
      const improved = await improveTextWithAI(text);
      handleChange('personalInfo', field, improved);
    } catch (error) {
      console.error('Erro IA:', error);
    } finally {
      setAiLoading(false);
    }
  };

  // Sugestões automáticas
  const fetchSuggestions = useCallback(async (section, input) => {
    if (input.length < 2) return;
    setSuggestions(['Sugestão 1', 'Sugestão 2', 'Sugestão 3']);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-5 h-5 mr-2" /> Voltar
        </button>
        <div className="flex space-x-3">
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center">
            <Save className="w-4 h-4 mr-2" /> Salvar
          </button>
          <button onClick={() => onPreview?.(formData)} className="px-4 py-2 bg-gray-100 rounded-lg flex items-center">
            <Eye className="w-4 h-4 mr-2" /> Pré-visualizar
          </button>
        </div>
      </div>

      {/* Etapas do formulário */}
      {step === 0 && (
        <PersonalInfoStep
          formData={formData}
          onChange={handleChange}
          validationErrors={validationErrors}
          onGenerateAI={handleGenerateAI}
          onImproveAI={handleImproveAI}
          aiLoading={aiLoading}
        />
      )}

      {step === 1 && (
        <ExperienceStep
          formData={formData}
          onChange={handleArrayChange}
          onAdd={handleAddItem}
          onRemove={handleRemoveItem}
          validationErrors={validationErrors}
          onSuggest={fetchSuggestions}
          suggestions={suggestions}
        />
      )}

      {/* Outras etapas aqui... */}

      {step === 4 && (
        <TemplateStep
          selectedTemplate={selectedTemplate}
          onSelectTemplate={setSelectedTemplate}
          onExportPDF={handleExportPDF}
        />
      )}

      <div className="flex justify-between pt-6">
        <button
          onClick={() => setStep(prev => Math.max(0, prev - 1))}
          disabled={step === 0}
          className="px-4 py-2 bg-gray-100 rounded-lg flex items-center disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Anterior
        </button>
        <button
          onClick={() => setStep(prev => Math.min(4, prev + 1))}
          disabled={step === 4}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center disabled:opacity-50"
        >
          Próximo <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
}

// Componentes auxiliares (você pode separar em arquivos depois)
const PersonalInfoStep = ({ formData, onChange, validationErrors, onGenerateAI, onImproveAI, aiLoading }) => (
  <div className="space-y-8">
    {/* Campos de informações pessoais */}
  </div>
);

const ExperienceStep = ({ formData, onChange, onAdd, onRemove, validationErrors, onSuggest, suggestions }) => (
  <div className="space-y-8">
    {/* Campos de experiência profissional */}
  </div>
);

const TemplateStep = ({ selectedTemplate, onSelectTemplate, onExportPDF }) => (
  <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
    {/* Seleção de template */}
  </div>
);

export default ResumeForm;
