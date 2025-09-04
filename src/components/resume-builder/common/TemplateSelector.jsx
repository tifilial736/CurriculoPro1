import { Check } from 'lucide-react';

const TemplateSelector = ({ selectedTemplate, onSelect, templates }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Object.entries(templates).map(([key, template]) => (
        <div
          key={key}
          className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
            selectedTemplate === key
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onSelect(key)}
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900">{template.name}</h4>
            {selectedTemplate === key && (
              <Check className="w-5 h-5 text-blue-500" />
            )}
          </div>
          
          <div className="h-32 rounded-lg overflow-hidden relative">
            <div 
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${template.colors.primary} 0%, ${template.colors.secondary} 100%)`
              }}
            >
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-20 text-white text-xs">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: template.colors.primary }}></div>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: template.colors.secondary }}></div>
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: template.colors.accent }}></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-3 flex justify-between items-center">
            <span className="text-sm text-gray-600">Cores principais</span>
            <div className="flex space-x-1">
              <div 
                className="w-4 h-4 rounded-full border border-gray-200"
                style={{ backgroundColor: template.colors.primary }}
              ></div>
              <div 
                className="w-4 h-4 rounded-full border border-gray-200"
                style={{ backgroundColor: template.colors.secondary }}
              ></div>
              <div 
                className="w-4 h-4 rounded-full border border-gray-200"
                style={{ backgroundColor: template.colors.accent }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TemplateSelector;