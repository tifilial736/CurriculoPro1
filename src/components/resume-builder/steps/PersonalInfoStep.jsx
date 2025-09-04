const PersonalInfoStep = ({ formData, onChange, validationErrors, onGenerateAI, onImproveAI, aiLoading }) => {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-lg">👤</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Informações Pessoais</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo *</label>
            <input
              type="text"
              name="personal.nome"
              value={formData.personal.nome}
              onChange={onChange}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                validationErrors.nome ? 'border-red-500' : 'border-gray-300'
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

          {/* Outros campos de informações pessoais... */}
        </div>
      </div>

      {/* Professional Summary */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white text-lg">📝</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">Resumo Profissional</h3>
        </div>

        <div className="space-y-4">
          <textarea
            name="resumo"
            value={formData.resumo}
            onChange={onChange}
            rows="5"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
            placeholder="Descreva brevemente sua experiência, principais habilidades e objetivos profissionais..."
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onGenerateAI}
                disabled={aiLoading}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{aiLoading ? 'Gerando...' : 'Gerar com IA'}</span>
              </button>
              <button
                type="button"
                onClick={() => onImproveAI('resumo', formData.resumo)}
                disabled={aiLoading || !formData.resumo}
                className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
              >
                <Brain className="w-4 h-4" />
                <span>Melhorar Texto</span>
              </button>
            </div>
            <span className="text-sm text-gray-500">{formData.resumo.length}/500 caracteres</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoStep;