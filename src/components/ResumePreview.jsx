import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { ArrowLeft, Download, Edit, Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react'

export default function ResumePreview({ data }) {
  const pdfRef = useRef()
  const navigate = useNavigate()

  const exportPDF = async () => {
    const element = pdfRef.current
    const canvas = await html2canvas(element, { 
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff'
    })
    const imgData = canvas.toDataURL('image/png')

    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = pageWidth
    const imgHeight = (canvas.height * pageWidth) / canvas.width

    let position = 0
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)

    if (imgHeight > pageHeight) {
      let heightLeft = imgHeight - pageHeight
      let y = -pageHeight

      while (heightLeft > 0) {
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, y, imgWidth, imgHeight)
        heightLeft -= pageHeight
        y -= pageHeight
      }
    }

    pdf.save(`curriculo-${data.nome.replace(/\s+/g, '-').toLowerCase()}.pdf`)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </button>
        
        <h1 className="text-2xl font-bold text-gray-900">Pré-visualização do Currículo</h1>
        
        <div className="flex space-x-3">
          <button
            onClick={() => navigate('/create-resume')}
            className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-2 rounded-xl hover:bg-gray-700 transition-all duration-200"
          >
            <Edit className="w-4 h-4" />
            <span>Editar</span>
          </button>
          <button
            onClick={exportPDF}
            className="flex items-center space-x-2 bg-primary-600 text-white px-6 py-2 rounded-xl hover:bg-primary-700 transition-all duration-200"
          >
            <Download className="w-4 h-4" />
            <span>Baixar PDF</span>
          </button>
        </div>
      </div>

      {/* Resume Preview */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div ref={pdfRef} className="bg-white p-12 max-w-4xl mx-auto" style={{ fontFamily: 'system-ui, sans-serif' }}>
          {/* Header */}
          <header className="border-b-2 border-primary-600 pb-8 mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{data.nome}</h1>
            
            <div className="flex flex-wrap gap-6 text-gray-600">
              {data.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{data.email}</span>
                </div>
              )}
              {data.telefone && (
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>{data.telefone}</span>
                </div>
              )}
              {data.endereco && (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{data.endereco}</span>
                </div>
              )}
              {data.linkedin && (
                <div className="flex items-center space-x-2">
                  <Linkedin className="w-4 h-4" />
                  <span>{data.linkedin}</span>
                </div>
              )}
              {data.site && (
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span>{data.site}</span>
                </div>
              )}
            </div>
          </header>

          {/* Resumo Profissional */}
          {data.resumo && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-primary-700 mb-3 uppercase tracking-wide">Resumo Profissional</h2>
              <p className="text-gray-700 leading-relaxed">{data.resumo}</p>
            </section>
          )}

          {/* Experiências Profissionais */}
          {data.experiencias.some(exp => exp.cargo) && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-primary-700 mb-4 uppercase tracking-wide">Experiência Profissional</h2>
              <div className="space-y-6">
                {data.experiencias.filter(exp => exp.cargo).map((exp, index) => (
                  <div key={index} className="border-l-4 border-primary-200 pl-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{exp.cargo}</h3>
                        <p className="text-primary-600 font-medium">{exp.empresa}</p>
                        {exp.local && <p className="text-gray-600 text-sm">{exp.local}</p>}
                      </div>
                      {exp.periodo && (
                        <span className="text-gray-600 text-sm font-medium bg-gray-100 px-3 py-1 rounded-full">
                          {exp.periodo}
                        </span>
                      )}
                    </div>
                    {exp.descricao && (
                      <p className="text-gray-700 leading-relaxed">{exp.descricao}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Formação Acadêmica */}
          {data.formacao.some(edu => edu.curso) && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-primary-700 mb-4 uppercase tracking-wide">Formação Acadêmica</h2>
              <div className="space-y-4">
                {data.formacao.filter(edu => edu.curso).map((edu, index) => (
                  <div key={index} className="border-l-4 border-primary-200 pl-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{edu.curso}</h3>
                        <p className="text-primary-600 font-medium">{edu.instituicao}</p>
                      </div>
                      {edu.periodo && (
                        <span className="text-gray-600 text-sm font-medium bg-gray-100 px-3 py-1 rounded-full">
                          {edu.periodo}
                        </span>
                      )}
                    </div>
                    {edu.descricao && (
                      <p className="text-gray-700">{edu.descricao}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Habilidades */}
          {(data.habilidades.tecnicas || data.habilidades.idiomas || data.habilidades.certificacoes) && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-primary-700 mb-4 uppercase tracking-wide">Habilidades</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {data.habilidades.tecnicas && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Técnicas</h3>
                    <p className="text-gray-700">{data.habilidades.tecnicas}</p>
                  </div>
                )}
                {data.habilidades.idiomas && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Idiomas</h3>
                    <p className="text-gray-700">{data.habilidades.idiomas}</p>
                  </div>
                )}
              </div>
              {data.habilidades.certificacoes && (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Certificações</h3>
                  <p className="text-gray-700">{data.habilidades.certificacoes}</p>
                </div>
              )}
            </section>
          )}

          {/* Projetos */}
          {data.projetos.some(proj => proj.nome) && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-primary-700 mb-4 uppercase tracking-wide">Projetos</h2>
              <div className="space-y-4">
                {data.projetos.filter(proj => proj.nome).map((projeto, index) => (
                  <div key={index} className="border-l-4 border-primary-200 pl-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{projeto.nome}</h3>
                      {projeto.link && (
                        <a href={projeto.link} className="text-primary-600 text-sm hover:underline">
                          Ver projeto
                        </a>
                      )}
                    </div>
                    {projeto.tecnologias && (
                      <p className="text-primary-600 text-sm font-medium mb-2">{projeto.tecnologias}</p>
                    )}
                    {projeto.descricao && (
                      <p className="text-gray-700">{projeto.descricao}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Informações Adicionais */}
          {(data.voluntariado || data.premios) && (
            <section>
              <h2 className="text-xl font-bold text-primary-700 mb-4 uppercase tracking-wide">Informações Adicionais</h2>
              <div className="space-y-4">
                {data.voluntariado && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Trabalho Voluntário</h3>
                    <p className="text-gray-700">{data.voluntariado}</p>
                  </div>
                )}
                {data.premios && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Prêmios e Reconhecimentos</h3>
                    <p className="text-gray-700">{data.premios}</p>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}