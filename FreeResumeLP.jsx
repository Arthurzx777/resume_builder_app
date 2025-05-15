import React from 'react';

const FreeResumeLP = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Currículo Profissional Grátis | Crie o Seu Agora Mesmo</title>
        <meta name="description" content="Procurando um gerador de currículo profissional grátis? Crie um currículo impactante online em minutos e destaque-se no mercado de trabalho. Experimente!" />
        <meta property="og:title" content="Currículo Profissional Grátis | Crie o Seu Agora Mesmo" />
        <meta property="og:description" content="Procurando um gerador de currículo profissional grátis? Crie um currículo impactante online em minutos e destaque-se no mercado de trabalho. Experimente!" />
        {/* Add other relevant Open Graph and Twitter Card tags specific to this LP */}
      </Helmet>
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">Crie seu <span className="text-indigo-600">Currículo Profissional Grátis</span></span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Destaque-se na multidão com um currículo profissional e moderno, sem gastar nada! Nosso gerador de currículo online oferece templates e ferramentas para você criar o currículo perfeito em poucos minutos.
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
            <a href="/" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
              Começar Agora (Grátis)
            </a>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-10">Por que escolher nosso Gerador de Currículo Grátis?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold text-indigo-600 mb-3">Fácil de Usar</h3>
            <p className="text-gray-600">Interface intuitiva que guia você passo a passo. Mesmo sem experiência, você cria um currículo profissional rapidamente.</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold text-indigo-600 mb-3">Templates Modernos</h3>
            <p className="text-gray-600">Acesso a uma seleção de templates com design atual e otimizados para ATS, para causar a melhor primeira impressão.</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-semibold text-indigo-600 mb-3">Download Imediato</h3>
            <p className="text-gray-600">Preencha seus dados, escolha o modelo e baixe seu currículo em PDF instantaneamente. Pronto para enviar!</p>
          </div>
        </div>
      </div>
      
      <div className="mt-20 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Pronto para conquistar sua próxima vaga?</h2>
          <p className="text-xl text-gray-600 mb-8">Não deixe seu currículo ser mais um na pilha. Use nosso gerador gratuito e mostre seu potencial!</p>
          <a href="/" className="w-full sm:w-auto flex items-center justify-center px-10 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
            Criar Meu Currículo Grátis Agora
          </a>
      </div>
    </div>
  );
};

export default FreeResumeLP;

