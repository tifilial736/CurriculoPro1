// Importe os novos componentes
import PersonalInfoStep from './steps/PersonalInfoStep';
import ExperienceStep from './steps/ExperienceStep';
import EducationSkillsStep from './steps/EducationSkillsStep';
import ProjectsExtrasStep from './steps/ProjectsExtrasStep';
import TemplateStep from './steps/TemplateStep';
import ResumePreview from './preview/ResumePreview';

// No seu componente principal, substitua o conteúdo das etapas pelas importações:
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
    // ... outras etapas
  }
};

// E no JSX, substitua o preview pelo componente
<div className="p-6 max-h-[600px] overflow-y-auto">
  <ResumePreview 
    data={formData} 
    template={selectedTemplate} 
  />
</div>