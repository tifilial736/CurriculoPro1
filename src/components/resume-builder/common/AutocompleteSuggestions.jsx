import { useState, useEffect } from 'react';
import { Lightbulb, X } from 'lucide-react';

const AutocompleteSuggestions = ({ field, context, onSelectSuggestion, visible = true }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Sugestões pré-definidas para campos comuns
  const predefinedSuggestions = {
    cargo: [
      "Desenvolvedor Front-end",
      "Desenvolvedor Back-end",
      "Desenvolvedor Full-stack",
      "Engenheiro de Software",
      "Analista de Sistemas",
      "Arquiteto de Software",
      "DevOps Engineer",
      "Product Manager",
      "UI/UX Designer"
    ],
    empresa: [
      "Google", "Microsoft", "Amazon", "Facebook", "Apple",
      "Netflix", "Twitter", "Uber", "Airbnb", "Spotify",
      "IBM", "Oracle", "Adobe", "Salesforce", "Shopify"
    ],
    curso: [
      "Ciência da Computação",
      "Engenharia de Software",
      "Sistemas de Informação",
      "Análise e Desenvolvimento de Sistemas",
      "Engenharia da Computação",
      "Tecnologia em Redes de Computadores",
      "Tecnologia em Banco de Dados"
    ],
    instituicao: [
      "Universidade de São Paulo (USP)",
      "Universidade Estadual de Campinas (UNICAMP)",
      "Universidade Federal do Rio de Janeiro (UFRJ)",
      "Universidade Federal de Minas Gerais (UFMG)",
      "Instituto Tecnológico de Aeronáutica (ITA)",
      "Instituto Militar de Engenharia (IME)",
      "Pontifícia Universidade Católica (PUC)"
    ],
    tecnologias: [
      "JavaScript, React, Node.js, MongoDB",
      "Python, Django, PostgreSQL, Docker",
      "Java, Spring Boot, MySQL, AWS",
      "C#, .NET, SQL Server, Azure",
      "PHP, Laravel, MySQL, Linux"
    ]
  };

  useEffect(() => {
    if (visible && field) {
      loadSuggestions();
    }
  }, [field, context, visible]);

  const loadSuggestions = async () => {
    setLoading(true);
    
    // Simula um delay de carregamento
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Primeiro tenta usar sugestões pré-definidas
    if (predefinedSuggestions[field]) {
      setSuggestions(predefinedSuggestions[field]);
    } else {
      // Fallback para sugestões genéricas baseadas no contexto
      const contextSuggestions = generateContextSuggestions(field, context);
      setSuggestions(contextSuggestions);
    }
    
    setLoading(false);
  };

  const generateContextSuggestions = (field, context) => {
    if (!context) return [];
    
    // Lógica simples para gerar sugestões baseadas no contexto
    if (field === 'descricao') {
      return [
        `Desenvolvimento de ${context} utilizando melhores práticas de programação`,
        `Gestão e implementação de ${context} em ambiente corporativo`,
        `Otimização e manutenção de ${context} para melhor performance`,
        `Liderança técnica no projeto de ${context}`
      ];
    }
    
    return [
      `Sugestão 1 para ${field}`,
      `Sugestão 2 para ${field}`,
      `Sugestão 3 para ${field}`
    ];
  };

  if (!visible || !field) return null;

  return (
    <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Lightbulb className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">Sugestões</span>
        </div>
        {loading && (
          <div className="text-xs text-blue-600">Carregando...</div>
        )}
      </div>
      
      <div className="space-y-2">
        {suggestions.slice(0, 3).map((suggestion, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-2 bg-white rounded-md border border-blue-100 cursor-pointer hover:bg-blue-50 transition-colors"
            onClick={() => onSelectSuggestion(suggestion)}
          >
            <span className="text-sm text-gray-700">{suggestion}</span>
            <button
              type="button"
              className="text-blue-600 hover:text-blue-800"
              onClick={(e) => {
                e.stopPropagation();
                onSelectSuggestion(suggestion);
              }}
            >
              Usar
            </button>
          </div>
        ))}
        
        {suggestions.length === 0 && !loading && (
          <div className="text-sm text-gray-500 text-center py-2">
            Nenhuma sugestão disponível
          </div>
        )}
      </div>
    </div>
  );
};

export default AutocompleteSuggestions;