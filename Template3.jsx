import React from 'react';

const Template3 = ({ data, colors, fonts }) => {
  const C = colors || { primary: 'bg-slate-800', text: 'text-gray-700', accent: 'text-slate-600', background: 'bg-white' };
  const F = fonts || { heading: 'font-serif', body: 'font-sans' };

  if (!data) {
    return <div className="p-4 text-center text-gray-500">Carregando dados do currículo...</div>;
  }

  const { fullName, email, phone, summary, experiences, education, skills } = data;

  return (
    <div className={`max-w-4xl mx-auto my-8 p-10 shadow-2xl rounded-md ${C.background} ${F.body} ${C.text}`}>
      {/* Header com Nome e Contato Centralizados */}
      <header className="text-center mb-10 pb-6 border-b-2 border-gray-200">
        <h1 className={`text-5xl font-bold ${C.primary} text-white py-3 px-6 inline-block rounded-md ${F.heading}`}>{fullName || 'Nome Completo'}</h1>
        <div className={`mt-4 text-sm ${C.accent} space-x-6`}>
          <span>{email || 'seu.email@example.com'}</span>
          <span>|</span>
          <span>{phone || '(XX) XXXXX-XXXX'}</span>
        </div>
      </header>

      {/* Resumo Profissional com destaque */}
      <section className="mb-10">
        <h2 className={`text-xl font-semibold ${C.accent} mb-3 uppercase tracking-wider ${F.heading}`}>Perfil</h2>
        <p className="text-gray-600 leading-relaxed text-justify italic">
          {summary || 'Um breve resumo sobre suas qualificações e objetivos profissionais.'}
        </p>
      </section>

      {/* Layout Principal em Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Coluna Esquerda: Experiências */}
        <div className="md:col-span-2">
          <section className="mb-8">
            <h2 className={`text-xl font-semibold ${C.accent} mb-4 uppercase tracking-wider ${F.heading}`}>Experiência Profissional</h2>
            {experiences && experiences.length > 0 ? experiences.map((exp, index) => (
              <div key={index} className="mb-6 relative pl-6 after:absolute after:left-0 after:top-1 after:w-2 after:h-2 after:bg-slate-300 after:rounded-full">
                <h3 className={`text-lg font-semibold ${F.heading}`}>{exp.jobTitle || 'Cargo'}</h3>
                <p className={`text-sm font-medium ${C.accent}`}>{exp.company || 'Nome da Empresa'}</p>
                <p className="text-xs text-gray-500">{exp.period || 'Período'}</p>
                {/* <p className="text-sm text-gray-600 mt-1">Descrição da experiência...</p> */}
              </div>
            )) : <p>Nenhuma experiência adicionada.</p>}
          </section>
        </div>

        {/* Coluna Direita: Educação e Habilidades */}
        <div>
          <section className="mb-8">
            <h2 className={`text-xl font-semibold ${C.accent} mb-4 uppercase tracking-wider ${F.heading}`}>Educação</h2>
            {education && education.length > 0 ? education.map((edu, index) => (
              <div key={index} className="mb-5 relative pl-6 after:absolute after:left-0 after:top-1 after:w-2 after:h-2 after:bg-slate-300 after:rounded-full">
                <h3 className={`text-lg font-semibold ${F.heading}`}>{edu.course || 'Curso'}</h3>
                <p className={`text-sm font-medium ${C.accent}`}>{edu.institution || 'Instituição de Ensino'}</p>
                <p className="text-xs text-gray-500">{edu.period || 'Período'}</p>
              </div>
            )) : <p>Nenhuma formação adicionada.</p>}
          </section>

          <section>
            <h2 className={`text-xl font-semibold ${C.accent} mb-4 uppercase tracking-wider ${F.heading}`}>Habilidades</h2>
            {skills ? (
              <div className="flex flex-wrap gap-2">
                {skills.split(',').map((skill, index) => (
                  <span key={index} className={`px-3 py-1 text-sm rounded-full ${C.primary} text-white ${F.body}`}>
                    {skill.trim()}
                  </span>
                ))}
              </div>
            ) : <p>Nenhuma habilidade adicionada.</p>}
          </section>
        </div>
      </div>

      {/* Infográfico placeholder */}
      {/* <section className="mt-12 pt-6 border-t-2 border-gray-200">
        <h2 className={`text-xl font-semibold ${C.accent} mb-4 uppercase tracking-wider ${F.heading}`}>Nível de Proficiência (Exemplo)</h2>
        <div className="space-y-3">
          <div>
            <p className="text-sm">Photoshop</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className={`${C.primary} h-2.5 rounded-full`} style={{ width: '85%' }}></div>
            </div>
          </div>
          <div>
            <p className="text-sm">Illustrator</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className={`${C.primary} h-2.5 rounded-full`} style={{ width: '70%' }}></div>
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default Template3;

