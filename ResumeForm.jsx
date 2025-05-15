import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Make sure to replace with your actual publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_YOUR_STRIPE_PUBLISHABLE_KEY');

const ResumeForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    summary: '',
    experiences: [{ jobTitle: '', company: '', period: '' }],
    education: [{ institution: '', course: '', period: '' }],
    skills: '',
  });

  const [errors, setErrors] = useState({});
  const [selectedTemplate, setSelectedTemplate] = useState('template1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pdfBlob, setPdfBlob] = useState(null); // Store PDF blob after generation
  const [pdfFileName, setPdfFileName] = useState('');

  // This effect will run when pdfBlob is set, to trigger download *after* payment (simulated for now)
  useEffect(() => {
    if (pdfBlob && pdfFileName) {
      // In a real scenario, this download would be triggered *after* successful payment confirmation
      // For now, we are calling it directly after PDF generation for simplicity before full payment flow
      // The actual download post-payment will be handled on the success page.
      // This direct download here will be removed once payment success page is implemented.
      // const downloadUrl = window.URL.createObjectURL(pdfBlob);
      // const link = document.createElement('a');
      // link.href = downloadUrl;
      // link.setAttribute('download', pdfFileName);
      // document.body.appendChild(link);
      // link.click();
      // link.parentNode.removeChild(link);
      // window.URL.revokeObjectURL(downloadUrl);
      // console.log('PDF downloaded (simulated post-payment).');
      // setPdfBlob(null); // Clear blob after download
      // setPdfFileName('');
    }
  }, [pdfBlob, pdfFileName]);

  const handleChange = (e, index, section) => {
    const { name, value } = e.target;
    if (section) {
      const list = [...formData[section]];
      list[index][name] = value;
      setFormData({ ...formData, [section]: list });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    if (value.trim() === '') {
      setErrors({ ...errors, [name]: `${name} é obrigatório` });
    } else {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
    if (name === 'email' && value.trim() !== '' && !/\S+@\S+\.\S+/.test(value)) {
        setErrors({ ...errors, email: 'Formato de e-mail inválido' });
    } else if (name === 'email') {
        const newErrors = { ...errors };
        delete newErrors.email;
        setErrors(newErrors);
    }
  };

  const addSectionItem = (section) => {
    if (section === 'experiences') {
      setFormData({
        ...formData,
        experiences: [...formData.experiences, { jobTitle: '', company: '', period: '' }],
      });
    } else if (section === 'education') {
      setFormData({
        ...formData,
        education: [...formData.education, { institution: '', course: '', period: '' }],
      });
    }
  };

  const removeSectionItem = (index, section) => {
    const list = [...formData[section]];
    list.splice(index, 1);
    setFormData({ ...formData, [section]: list });
  };

  const handleGenerateAndPay = async () => {
    // Step 1: Call backend to create Stripe Checkout Session
    try {
      const stripeResponse = await fetch('http://localhost:5000/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            resumeData: formData, // Pass resume data for metadata if needed
            templateId: selectedTemplate
        }),
      });

      if (!stripeResponse.ok) {
        const errorData = await stripeResponse.json();
        throw new Error(errorData.error || 'Falha ao criar sessão de checkout.');
      }

      const session = await stripeResponse.json();

      // Step 2: Store form data and template selection in localStorage to retrieve after payment
      localStorage.setItem('pendingResumeData', JSON.stringify(formData));
      localStorage.setItem('pendingTemplateId', selectedTemplate);
      
      // Step 3: Redirect to Stripe Checkout
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (error) {
        console.error('Stripe redirectToCheckout error:', error);
        setErrors({ ...errors, form: error.message || 'Erro ao redirecionar para o pagamento.' });
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Erro no processo de pagamento:', error);
      setErrors({ ...errors, form: error.message || 'Erro de conexão ou no servidor durante o pagamento.' });
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({}); // Clear previous errors

    let submitErrors = {};
    if (!formData.fullName.trim()) submitErrors.fullName = 'Nome completo é obrigatório';
    if (!formData.email.trim()) submitErrors.email = 'E-mail é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) submitErrors.email = 'Formato de e-mail inválido';
    if (!formData.phone.trim()) submitErrors.phone = 'Telefone é obrigatório';
    if (!formData.summary.trim()) submitErrors.summary = 'Resumo profissional é obrigatório';
    if (formData.experiences.some(exp => !exp.jobTitle.trim() || !exp.company.trim() || !exp.period.trim())) {
        submitErrors.experiences = 'Todos os campos de experiência são obrigatórios.';
    }
    if (formData.education.some(edu => !edu.institution.trim() || !edu.course.trim() || !edu.period.trim())) {
        submitErrors.education = 'Todos os campos de educação são obrigatórios.';
    }
    if (!formData.skills.trim()) submitErrors.skills = 'Habilidades são obrigatórias';

    if (Object.keys(submitErrors).length > 0) {
        setErrors(submitErrors);
        setIsSubmitting(false);
        return;
    }

    // If validation passes, proceed to payment
    await handleGenerateAndPay();
    // setIsSubmitting(false) is called within handleGenerateAndPay on error, or redirect happens
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-8 bg-gray-50 rounded-lg shadow-md max-w-2xl mx-auto my-10">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">Informações Pessoais</h2>
      
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Nome Completo</label>
        <input type="text" name="fullName" id="fullName" value={formData.fullName} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`} />
        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`} />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone</label>
        <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className={`mt-1 block w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`} />
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
      </div>

      <div>
        <label htmlFor="summary" className="block text-sm font-medium text-gray-700">Resumo Profissional</label>
        <textarea name="summary" id="summary" value={formData.summary} onChange={handleChange} rows="4" className={`mt-1 block w-full px-3 py-2 border ${errors.summary ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}></textarea>
        {errors.summary && <p className="text-red-500 text-xs mt-1">{errors.summary}</p>}
      </div>

      <h2 className="text-2xl font-semibold text-gray-700 pt-6 mb-6 border-t border-gray-200">Experiências Profissionais</h2>
      {formData.experiences.map((exp, index) => (
        <div key={index} className="space-y-4 p-4 border border-gray-200 rounded-md relative">
          {formData.experiences.length > 1 && (
            <button type="button" onClick={() => removeSectionItem(index, 'experiences')} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
              Remover
            </button>
          )}
          <div>
            <label htmlFor={`jobTitle-${index}`} className="block text-sm font-medium text-gray-700">Cargo</label>
            <input type="text" name="jobTitle" id={`jobTitle-${index}`} value={exp.jobTitle} onChange={(e) => handleChange(e, index, 'experiences')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor={`company-${index}`} className="block text-sm font-medium text-gray-700">Empresa</label>
            <input type="text" name="company" id={`company-${index}`} value={exp.company} onChange={(e) => handleChange(e, index, 'experiences')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor={`period-${index}-exp`} className="block text-sm font-medium text-gray-700">Período (Ex: Jan 2020 - Dez 2022)</label>
            <input type="text" name="period" id={`period-${index}-exp`} value={exp.period} onChange={(e) => handleChange(e, index, 'experiences')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
        </div>
      ))}
      {errors.experiences && <p className="text-red-500 text-xs mt-1">{errors.experiences}</p>}
      <button type="button" onClick={() => addSectionItem('experiences')} className="mt-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
        Adicionar Experiência
      </button>

      <h2 className="text-2xl font-semibold text-gray-700 pt-6 mb-6 border-t border-gray-200">Educação</h2>
      {formData.education.map((edu, index) => (
        <div key={index} className="space-y-4 p-4 border border-gray-200 rounded-md relative">
          {formData.education.length > 1 && (
            <button type="button" onClick={() => removeSectionItem(index, 'education')} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
              Remover
            </button>
          )}
          <div>
            <label htmlFor={`institution-${index}`} className="block text-sm font-medium text-gray-700">Instituição</label>
            <input type="text" name="institution" id={`institution-${index}`} value={edu.institution} onChange={(e) => handleChange(e, index, 'education')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor={`course-${index}`} className="block text-sm font-medium text-gray-700">Curso</label>
            <input type="text" name="course" id={`course-${index}`} value={edu.course} onChange={(e) => handleChange(e, index, 'education')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor={`period-${index}-edu`} className="block text-sm font-medium text-gray-700">Período (Ex: Ago 2016 - Jul 2020)</label>
            <input type="text" name="period" id={`period-${index}-edu`} value={edu.period} onChange={(e) => handleChange(e, index, 'education')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
        </div>
      ))}
      {errors.education && <p className="text-red-500 text-xs mt-1">{errors.education}</p>}
      <button type="button" onClick={() => addSectionItem('education')} className="mt-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
        Adicionar Formação
      </button>

      <h2 className="text-2xl font-semibold text-gray-700 pt-6 mb-6 border-t border-gray-200">Habilidades-Chave</h2>
      <div>
        <label htmlFor="skills" className="block text-sm font-medium text-gray-700">Habilidades (separadas por vírgula)</label>
        <textarea name="skills" id="skills" value={formData.skills} onChange={handleChange} rows="3" className={`mt-1 block w-full px-3 py-2 border ${errors.skills ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}></textarea>
        {errors.skills && <p className="text-red-500 text-xs mt-1">{errors.skills}</p>}
      </div>

      <div className="pt-6 border-t border-gray-200">
        <label htmlFor="template" className="block text-sm font-medium text-gray-700">Escolha um Template</label>
        <select 
            id="template" 
            name="template" 
            value={selectedTemplate} 
            onChange={(e) => setSelectedTemplate(e.target.value)} 
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
            <option value="template1">Moderno Clássico</option>
            <option value="template2">Barra Lateral Criativa</option>
            <option value="template3">Elegante Minimalista</option>
        </select>
      </div>

      {errors.form && <p className="text-red-500 text-sm mt-4 text-center">{errors.form}</p>}

      <div className="pt-6">
        <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Processando...' : 'Pagar e Gerar Currículo (R$ 15,00)'}
        </button>
      </div>
    </form>
  );
};

export default ResumeForm;

