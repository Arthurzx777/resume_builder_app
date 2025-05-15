import React from 'react';
import { render, screen } from '@testing-library/react';
import ResumeForm from '../components/ResumeForm'; // Adjust path if necessary

// Mock Stripe a nível global para todos os testes neste arquivo
// Isso é importante porque o componente ResumeForm tenta carregar o Stripe
jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(() => Promise.resolve({
    redirectToCheckout: jest.fn(() => Promise.resolve({})),
    // Adicione outros mocks de funções do Stripe que seu componente possa usar
  })),
}));

describe('ResumeForm', () => {
  test('renders form fields correctly', () => {
    render(<ResumeForm />);
    
    // Check for a few key elements to ensure the form is rendering
    expect(screen.getByLabelText(/Nome Completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Telefone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Resumo Profissional/i)).toBeInTheDocument();
    expect(screen.getByText(/Experiências Profissionais/i)).toBeInTheDocument();
    expect(screen.getByText(/Educação/i)).toBeInTheDocument();
    expect(screen.getByText(/Habilidades-Chave/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Pagar e Gerar Currículo/i })).toBeInTheDocument();
  });

  // Testes mais complexos podem ser adicionados aqui, como:
  // - Simular preenchimento de campos e submissão
  // - Verificar mensagens de validação
  // - Mockar a chamada fetch para o backend
});

