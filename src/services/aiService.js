import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Apenas para desenvolvimento
});

export const generateAIContent = async (params) => {
  try {
    let prompt = '';
    
    switch (params.type) {
      case 'summary':
        prompt = `Gere um resumo profissional em português para um currículo baseado nas seguintes experiências: ${JSON.stringify(params.experiences)} e habilidades: ${JSON.stringify(params.skills)}. O resumo deve ter no máximo 150 palavras e ser persuasivo.`;
        break;
      case 'suggestions':
        prompt = `Sugira melhorias para o campo ${params.field} do currículo com base no contexto: ${params.context}. Forneça 3 sugestões concisas.`;
        break;
      default:
        throw new Error('Tipo de conteúdo não suportado');
    }

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      max_tokens: 500,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Erro na API de IA:', error);
    throw error;
  }
};

export const improveTextWithAI = async (text) => {
  try {
    const prompt = `Melhore este texto para um currículo profissional em português: "${text}". Torne-o mais impactante e profissional.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
      max_tokens: 300,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Erro ao melhorar texto:', error);
    return text; // Retorna o texto original em caso de erro
  }
};