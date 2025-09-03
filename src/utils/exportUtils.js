import html2pdf from 'html2pdf.js';

export const exportToPDF = async (formData, template) => {
  try {
    // Aqui você implementaria a geração do HTML para o PDF
    // baseado no template selecionado
    const element = document.getElementById('resume-preview');
    const opt = {
      margin: 10,
      filename: `curriculo_${formData.personal.nome || 'sem_nome'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    await html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error('Erro ao exportar PDF:', error);
    throw error;
  }
};