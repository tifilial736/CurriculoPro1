import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Zap,
  Download,
  Shield,
  ArrowRight,
  CheckCircle,
  Eye,
  Palette,
  Smartphone,
  Share,
  Sparkles,
  Star,
  Users,
  TrendingUp,
  Play,
  Globe,
} from 'lucide-react';

export default function HomePage() {
  const [isHovered, setIsHovered] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState(0);
  const [stats, setStats] = useState({
    users: 0,
    resumes: 0,
    downloads: 0,
    rating: 0,
  });

  // Animação dos números das estatísticas
  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        users: 50000,
        resumes: 150000,
        downloads: 89000,
        rating: 4.9,
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Templates disponíveis
  const templates = [
    {
      id: 1,
      name: 'Moderno Azul',
      description: 'Ideal para profissionais de tecnologia',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      popular: true,
    },
    {
      id: 2,
      name: 'Executivo',
      description: 'Perfeito para cargos de liderança',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
      premium: true,
    },
    {
      id: 3,
      name: 'Criativo',
      description: 'Para designers e criativos',
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
      borderColor: 'border-green-200',
      new: true,
    },
  ];

  // Features principais
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Criação Inteligente',
      description:
        'IA integrada que sugere melhorias e otimiza automaticamente o conteúdo do seu currículo para ATS.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: 'Preview ao Vivo',
      description:
        'Veja seu currículo sendo criado em tempo real enquanto preenche os dados. Sem surpresas no resultado final.',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: 'Templates Profissionais',
      description:
        'Escolha entre 12+ templates criados por designers especialistas em recrutamento e RH.',
      color: 'from-green-500 to-green-600',
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'Auto-Save Inteligente',
      description:
        'Nunca perca seu progresso. Salvamento automático a cada alteração com sincronização na nuvem.',
      color: 'from-orange-500 to-orange-600',
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: 'Totalmente Responsivo',
      description:
        'Crie e edite seus currículos em qualquer dispositivo. Interface otimizada para mobile e desktop.',
      color: 'from-teal-500 to-teal-600',
    },
    {
      icon: <Share className="w-6 h-6" />,
      title: 'Compartilhamento Fácil',
      description:
        'Gere links únicos, exporte em múltiplos formatos ou envie diretamente por email para recrutadores.',
      color: 'from-red-500 to-red-600',
    },
  ];

  // Depoimentos
  const testimonials = [
    {
      name: 'Maria Silva',
      role: 'Desenvolvedora Frontend',
      company: 'TechCorp',
      text: 'Consegui minha vaga dos sonhos graças ao CurrículoPro. O template moderno e as dicas de IA fizeram toda a diferença!',
      avatar: 'MS',
    },
    {
      name: 'João Santos',
      role: 'Gerente de Marketing',
      company: 'StartupXYZ',
      text: 'A plataforma é incrível! Criei meu currículo em 15 minutos e já recebi 3 chamadas para entrevistas.',
      avatar: 'JS',
    },
    {
      name: 'Ana Costa',
      role: 'UX Designer',
      company: 'Design Studio',
      text: 'O template criativo é perfeito para minha área. O resultado final ficou muito mais profissional do que eu imaginava.',
      avatar: 'AC',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 min-h-screen flex items-center">
        {/* Elementos decorativos animados */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-purple-300/20 rounded-full blur-lg animate-bounce"></div>
          <div
            className="absolute bottom-32 left-1/4 w-40 h-40 bg-blue-300/10 rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: '1s' }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            {/* Logo animado */}
            <div className="inline-flex items-center justify-center p-6 bg-white/10 backdrop-blur-sm rounded-3xl mb-8 animate-bounce">
              <FileText className="w-12 h-12 text-white" />
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Transforme sua
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent animate-pulse">
                carreira
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Crie currículos profissionais impressionantes que capturam a
              atenção dos recrutadores e destacam suas qualificações únicas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                to="/create-resume"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative bg-white text-blue-700 px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center space-x-3">
                  <span>Criar Meu Currículo</span>
                  <ArrowRight
                    className={`w-5 h-5 transition-transform duration-300 ${
                      isHovered ? 'translate-x-1' : ''
                    }`}
                  />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>

              <button className="group flex items-center space-x-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/20 transition-all duration-300">
                <Play className="w-5 h-5" />
                <span>Ver Demo</span>
              </button>
            </div>

            {/* Badges de features */}
            <div className="flex items-center justify-center space-x-8 text-blue-200">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>100% Gratuito</span>
              </div>
              <div className="flex items-center space-x-2">
                <Download className="w-5 h-5 text-green-400" />
                <span>Export PDF</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-green-400" />
                <span>Dados Seguros</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            <div className="group">
              <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform">
                {stats.users.toLocaleString()}+
              </div>
              <div className="text-blue-200">Usuários Ativos</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform">
                {stats.resumes.toLocaleString()}+
              </div>
              <div className="text-blue-200">Currículos Criados</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform">
                {stats.downloads.toLocaleString()}+
              </div>
              <div className="text-blue-200">Downloads</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold mb-2 group-hover:scale-110 transition-transform flex items-center justify-center">
                {stats.rating}
                <Star className="w-6 h-6 ml-1 fill-current text-yellow-400" />
              </div>
              <div className="text-blue-200">Avaliação Média</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Por que o CurrículoPro é{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                diferente?
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Nossa plataforma combina tecnologia avançada com design intuitivo
              para criar a melhor experiência de criação de currículos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Preview */}
      <section className="py-24 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Templates que{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                impressionam
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Escolha entre nossa coleção exclusiva de templates profissionais,
              criados especificamente para diferentes áreas e níveis de
              experiência.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {templates.map((template, index) => (
              <div
                key={template.id}
                className={`group bg-gradient-to-br ${template.bgColor} rounded-3xl p-6 shadow-lg cursor-pointer border-2 ${template.borderColor} hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2`}
                onMouseEnter={() => setActiveTemplate(index)}
              >
                <div className="bg-white rounded-2xl p-4 mb-4 shadow-inner">
                  <div className="space-y-2">
                    <div
                      className={`h-3 bg-gradient-to-r ${template.color} rounded w-3/4`}
                    ></div>
                    <div className="h-2 bg-gray-200 rounded w-full"></div>
                    <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                    <div className="mt-3 space-y-1">
                      <div
                        className={`h-2 bg-gradient-to-r ${template.color} opacity-60 rounded w-2/3`}
                      ></div>
                      <div
                        className={`h-2 bg-gradient-to-r ${template.color} opacity-40 rounded w-4/5`}
                      ></div>
                    </div>
                  </div>
                </div>

                <h3 className="font-bold text-gray-900 mb-2">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-600">{template.description}</p>

                <div className="mt-4 flex items-center justify-between">
                  {template.popular && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">
                      Mais Popular
                    </span>
                  )}
                  {template.premium && (
                    <span className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full font-medium">
                      Premium
                    </span>
                  )}
                  {template.new && (
                    <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
                      Novo
                    </span>
                  )}
                  <CheckCircle className="w-5 h-5 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/templates"
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors text-lg"
            >
              <span>Ver todos os templates</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              O que nossos{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                usuários
              </span>{' '}
              dizem
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Mais de 50.000 profissionais já transformaram suas carreiras com o
              CurrículoPro
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      {testimonial.company}
                    </p>
                  </div>
                </div>

                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-current text-yellow-400"
                    />
                  ))}
                </div>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Como{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                funciona
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Crie seu currículo profissional em apenas 4 passos simples
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Escolha um Template',
                description:
                  'Selecione entre nossos designs profissionais criados por especialistas',
                icon: <Palette className="w-8 h-8" />,
              },
              {
                step: '02',
                title: 'Preencha seus Dados',
                description:
                  'Adicione suas informações pessoais, experiências e habilidades',
                icon: <FileText className="w-8 h-8" />,
              },
              {
                step: '03',
                title: 'Personalize o Design',
                description:
                  'Ajuste cores, fontes e layout para combinar com seu estilo',
                icon: <Sparkles className="w-8 h-8" />,
              },
              {
                step: '04',
                title: 'Baixe e Compartilhe',
                description:
                  'Exporte em PDF ou compartilhe via link personalizado',
                icon: <Download className="w-8 h-8" />,
              },
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <div className="text-white">{item.icon}</div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {item.step}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
        {/* Elementos decorativos */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-300/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Pronto para criar seu currículo
            <span className="block text-yellow-400">profissional?</span>
          </h2>

          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Junte-se a milhares de profissionais que já conquistaram suas vagas
            dos sonhos com o CurrículoPro
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              to="/create-resume"
              className="group bg-white text-blue-700 px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-300 flex items-center space-x-3"
            >
              <span>Começar Agora</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/templates"
              className="group bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white/20 transition-all duration-300 flex items-center space-x-3"
            >
              <Eye className="w-5 h-5" />
              <span>Ver Templates</span>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center space-x-8 text-blue-200 text-sm">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>50k+ usuários</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>95% de aprovação</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>Usado em 50+ países</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
