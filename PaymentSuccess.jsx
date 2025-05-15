import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom'; // Assuming you use React Router

const PaymentSuccess = () => {
  const location = useLocation();
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadInitiated, setDownloadInitiated] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const sId = queryParams.get('session_id');
    setSessionId(sId);

    if (sId && !downloadInitiated) {
      const pendingData = localStorage.getItem('pendingResumeData');
      const pendingTemplateId = localStorage.getItem('pendingTemplateId');

      if (pendingData && pendingTemplateId) {
        const resumeData = JSON.parse(pendingData);
        
        // Verify session with backend (optional but recommended for security)
        // fetch(`http://localhost:5000/api/stripe/checkout-session/${sId}`)
        // .then(res => res.json())
        // .then(sessionData => {
        //   if (sessionData.payment_status === 'paid') {

        // Proceed to generate and download PDF
        fetch('http://localhost:5000/api/pdf/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
              resumeData: resumeData, 
              templateId: pendingTemplateId 
          }),
        })
        .then(response => {
          if (response.ok) {
            return response.blob().then(blob => ({blob, response}));
          } else {
            response.json().then(err => {
                throw new Error(err.error || 'Falha ao gerar PDF pós-pagamento.');
            });
          }
        })
        .then(({blob, response}) => {
          const downloadUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = downloadUrl;
          const filename = response.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') || `curriculo-${resumeData.fullName.replace(' ', '_')}.pdf`;
          link.setAttribute('download', filename);
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
          window.URL.revokeObjectURL(downloadUrl);
          setDownloadInitiated(true);
          localStorage.removeItem('pendingResumeData');
          localStorage.removeItem('pendingTemplateId');
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Erro ao gerar PDF pós-pagamento:', err);
          setError(err.message);
          setIsLoading(false);
        });
        //   } else {
        //     setError('Pagamento não confirmado.');
        //     setIsLoading(false);
        //   }
        // })
        // .catch(err => {
        //   setError('Erro ao verificar sessão de pagamento.');
        //   setIsLoading(false);
        // });
      } else {
        setError('Dados do currículo não encontrados para download.');
        setIsLoading(false);
      }
    } else if (!sId) {
        setError('ID da sessão de pagamento não encontrado.');
        setIsLoading(false);
    }

  }, [location, downloadInitiated]);

  if (isLoading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
            <p className="mt-4 text-xl text-gray-700">Processando seu pagamento e preparando o download...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-6 text-center">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <h1 className="text-3xl font-bold text-red-700 mb-2">Erro no Processamento</h1>
            <p className="text-red-600 text-lg mb-6">{error}</p>
            <p className="text-gray-600 mb-8">Por favor, tente novamente ou entre em contato com o suporte se o problema persistir.</p>
            <Link to="/" className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition duration-300">
                Voltar para o Início
            </Link>
        </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 p-6 text-center">
      <svg className="w-20 h-20 text-green-500 mx-auto mb-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      <h1 className="text-4xl font-bold text-green-700 mb-3">Pagamento Confirmado!</h1>
      <p className="text-gray-700 text-lg mb-4">
        Seu currículo em PDF deve ter iniciado o download automaticamente.
      </p>
      <p className="text-gray-600 mb-8">
        Obrigado por utilizar nosso gerador de currículos! Esperamos que ele ajude você a conquistar seus objetivos profissionais.
      </p>
      
      {/* Upsell Section */}
      <div className="mt-10 p-6 bg-white rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-semibold text-indigo-700 mb-4">Potencialize Ainda Mais Sua Carreira!</h2>
        <p className="text-gray-600 mb-3">
Gostou do seu currículo? Que tal explorar nossos pacotes de templates premium ou serviços de revisão especializada para garantir que sua candidatura seja imbatível?
        </p>
        <div className="space-y-3">
            <Link to="/templates-premium" className="block w-full text-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition duration-300">
                Ver Templates Premium
            </Link>
            <Link to="/revisao-profissional" className="block w-full text-center px-6 py-3 bg-teal-500 text-white font-semibold rounded-md hover:bg-teal-600 transition duration-300">
                Solicitar Revisão Profissional
            </Link>
        </div>
      </div>

      <Link to="/" className="mt-10 px-6 py-3 text-indigo-600 font-semibold rounded-md hover:text-indigo-800 transition duration-300">
        Criar Novo Currículo
      </Link>
    </div>
  );
};

export default PaymentSuccess;

