import React from 'react';

const Template2 = ({ data, colors, fonts }) => {
  // Default colors and fonts if not provided
  const C = colors || { primary: 'bg-emerald-700', text: 'text-gray-800', accent: 'text-emerald-600', background: 'bg-gray-50' };
  const F = fonts || { heading: 'font-sans', body: 'font-sans' };

  if (!data) {
    return <div className="p-4 text-center text-gray-500">Carregando dados do currículo...</div>;
  }

  const { fullName, email, phone, summary, experiences, education, skills } = data;

  return (
    <div className={`max-w-4xl mx-auto my-8 shadow-lg rounded-lg overflow-hidden ${C.background} ${F.body} ${C.text}`}>
      {/* Layout de duas colunas */}
      <div className="flex flex-col md:flex-row">
        {/* Coluna lateral */}
        <div className={`w-full md:w-1/3 p-6 ${C.primary} text-white`}>
          <div className="mb-10 text-center">
            <div className="w-32 h-32 rounded-full bg-white mx-auto mb-4 flex items-center justify-center">
              <span className="text-4xl font-bold text-gray-400">
                {fullName ? fullName.charAt(0) : 'A'}
              </span>
            </div>
            <h1 className={`text-2xl font-bold mb-2 ${F.heading}`}>{fullName || 'Nome Completo'}</h1>
          </div>

          <div className="mb-8">
            <h2 className={`text-lg font-semibold mb-3 border-b border-white pb-2 ${F.heading}`}>Contato</h2>
            <div className="space-y-2">
              <p className="flex items-center">
                <span className="mr-2">📧</span> {email || 'seu.email@example.com'}
              </p>
              <p className="flex items-center">
                <span className="mr-2">📱</span> {phone || '(XX) XXXXX-XXXX'}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className={`text-lg font-semibold mb-3 border-b border-white pb-2 ${F.heading}`}>Habilidades</h2>
            {skills ? (
              <div className="space-y-3">
                {skills.split(',').map((skill, index) => (
                  <div key={index} className="relative pt-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-semibold inline-block py-1">
                          {skill.trim()}
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-white">
                      <div style={{ width: `${Math.floor(Math.random() * 40) + 60}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-white bg-opacity-30"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p>Nenhuma habilidade adicionada.</p>}
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="w-full md:w-2/3 p-8">
          <section className="mb-8">
            <h2 className={`text-2xl font-semibold ${C.accent} mb-4 ${F.heading}`}>Resumo Profissional</h2>
            <p className="leading-relaxed">{summary || 'Um breve resumo sobre suas qualificações e objetivos profissionais.'}</p>
          </section>

          <section className="mb-8">
            <h2 className={`text-2xl font-semibold ${C.accent} mb-4 ${F.heading}`}>Experiência Profissional</h2>
            {experiences && experiences.length > 0 ? experiences.map((exp, index) => (
              <div key={index} className="mb-6">
                <div className="flex flex-col md:flex-row md:justify-between mb-1">
                  <h3 className={`text-xl font-semibold ${F.heading}`}>{exp.jobTitle || 'Cargo'}</h3>
                  <span className="text-sm text-gray-600">{exp.period || 'Período'}</span>
                </div>
                <p className="text-md mb-2">{exp.company || 'Nome da Empresa'}</p>
                {/* Adicionar descrição da experiência se houver no formulário */}
              </div>
            )) : <p>Nenhuma experiência adicionada.</p>}
          </section>

          <section>
            <h2 className={`text-2xl font-semibold ${C.accent} mb-4 ${F.heading}`}>Educação</h2>
            {education && education.length > 0 ? education.map((edu, index) => (
              <div key={index} className="mb-6">
                <div className="flex flex-col md:flex-row md:justify-between mb-1">
                  <h3 className={`text-xl font-semibold ${F.heading}`}>{edu.course || 'Curso'}</h3>
                  <span className="text-sm text-gray-600">{edu.period || 'Período'}</span>
                </div>
                <p className="text-md">{edu.institution || 'Instituição de Ensino'}</p>
              </div>
            )) : <p>Nenhuma formação adicionada.</p>}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Template2;
