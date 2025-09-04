import { useState } from 'react';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';
import AutocompleteSuggestions from '../common/AutocompleteSuggestions';

const ExperienceStep = ({ 
  formData, 
  onChange, 
  onAdd, 
  onRemove, 
  validationErrors,
  onSuggest,
  suggestions 
}) => {
  const [activeSuggestions, setActiveSuggestions] = useState({ field: null, index: null });

  const handleSuggestionClick = (field, index) => {
    setActiveSuggestions({ field, index });
  };

  const handleSelectSuggestion = (suggestion) => {
    if (activeSuggestions.field && activeSuggestions.index !== null) {
      onChange('experiencias', activeSuggestions.index, activeSuggestions.field, suggestion);
    }
    setActiveSuggestions({ field: null, index: null });
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg">💼</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Experiência Profissional</h3>
          </div>
          <button
            type="button"
            onClick={onAdd}
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
                  onClick={() => onRemove(index)}
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
                    onChange={(e) => onChange('experiencias', index, 'cargo', e.target.value)}
                    onFocus={() => handleSuggestionClick('cargo', index)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Ex: Desenvolvedor Senior"
                  />
                  {activeSuggestions.field === 'cargo' && activeSuggestions.index === index && (
                    <AutocompleteSuggestions
                      field="cargo"
                      context={exp.cargo}
                      onSelectSuggestion={handleSelectSuggestion}
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Empresa
                  </label>
                  <input
                    type="text"
                    value={exp.empresa}
                    onChange={(e) => onChange('experiencias', index, 'empresa', e.target.value)}
                    onFocus={() => handleSuggestionClick('empresa', index)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Ex: TechCorp Ltda"
                  />
                  {activeSuggestions.field === 'empresa' && activeSuggestions.index === index && (
                    <AutocompleteSuggestions
                      field="empresa"
                      context={exp.empresa}
                      onSelectSuggestion={handleSelectSuggestion}
                    />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Período
                  </label>
                  <input
                    type="text"
                    value={exp.periodo}
                    onChange={(e) => onChange('experiencias', index, 'periodo', e.target.value)}
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
                    onChange={(e) => onChange('experiencias', index, 'local', e.target.value)}
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
                  onChange={(e) => onChange('experiencias', index, 'descricao', e.target.value)}
                  onFocus={() => handleSuggestionClick('descricao', index)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="• Liderou equipe de 5 desenvolvedores no projeto X"
                />
                {activeSuggestions.field === 'descricao' && activeSuggestions.index === index && (
                  <AutocompleteSuggestions
                    field="descricao"
                    context={exp.cargo}
                    onSelectSuggestion={handleSelectSuggestion}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExperienceStep;