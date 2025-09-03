export const validateResumeData = (formData, step) => {
  const errors = {};
  
  if (step === 1 || step === 'all') {
    if (!formData.personal.nome?.trim()) errors.nome = 'Nome é obrigatório';
    if (!formData.personal.email?.trim()) errors.email = 'Email é obrigatório';
    if (!formData.personal.telefone?.trim()) errors.telefone = 'Telefone é obrigatório';
  }
  
  if (step === 2 || step === 'all') {
    if (!formData.experiencias.some(exp => exp.cargo.trim() && exp.empresa.trim())) {
      errors.experiencias = 'Adicione pelo menos uma experiência válida';
    }
  }
  
  if (step === 3 || step === 'all') {
    if (!formData.formacao.some(edu => edu.curso.trim() && edu.instituicao.trim())) {
      errors.formacao = 'Adicione pelo menos uma formação acadêmica';
    }
    
    if (!formData.habilidades.tecnicas.trim()) {
      errors.habilidades = 'Habilidades técnicas são obrigatórias';
    }
  }
  
  return errors;
};