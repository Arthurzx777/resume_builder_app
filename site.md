# Lista de Tarefas: Gerador de Currículos Profissionais

## Fase 1: Planejamento e Estrutura Base

- [ ] **1. Coleta de Dados:**
    - [x] Criar formulário HTML simples para: nome completo, e-mail, telefone, resumo profissional, experiências (cargo, empresa, período), educação e habilidades-chave.
    - [x] Implementar validação em tempo real dos campos obrigatórios (JavaScript).
- [x] **2. Seleção de Template e Arquitetura:**
    - [x] Definir a arquitetura do projeto (Frontend: React com Tailwind CSS; Backend: Flask para PDF e pagamentos).
    - [x] Configurar ambiente de desenvolvimento.
    - [x] Criar estrutura de pastas do projeto.
- [x] **9. Código e Arquitetura (Inicial):**
    - [x] Configurar Tailwind CSS.
    - [x] Escrever HTML base para a página única.

## Fase 2: Design e Funcionalidades Principais

- [x] **2. Templates Modernos:**
    - [x] Desenvolver 3 layouts responsivos com estética minimalista e infográficos.
        - [x] Layout 1
        - [x] Layout 2
        - [x] Layout 3
    - [x] Implementar funcionalidade para seleção de esquema de cores.
    - [x] Implementar funcionalidade para seleção de fontes personalizadas.
- [x] **3. Geração de PDF Instantânea:**
    - [x] Pesquisar e definir como usar a "API interna da Manus" para criar PDF. (Alternativa escolhida: WeasyPrint com backend Flask).
    - [x] Implementar a lógica para enviar dados do formulário para o backend/API.
    - [x] Implementar a geração do PDF com o layout selecionado, ícones e formatação ATS-friendly.
- [x] **7. Fluxo de UX Simplificado (Inicial):**
    - [x] Desenvolver a tela inicial com call-to-action único.
    - [x] Estruturar o fluxo em 3 etapas: Dados -> Revisão -> Pagamento.

## Fase 3: Monetização e Deploy

- [x] **4. Integração de Pagamento:**
    - [x] Pesquisar e escolher alternativa ao Stripe, se necessário, ou prosseguir com Stripe.
    - [x] Configurar conta de teste do Stripe (ou alternativa).
    - [x] Implementar a integração para cobrar R$ 15 por download do PDF.
    - [x] Implementar redirecionamento para página de confirmação.
    - [ ] Implementar envio de e-mail automático com o link do arquivo PDF (requer serviço de e-mail).
- [x] **5. Hospedagem e Deploy Automáticos:**
    - [x] Gerar configurações para deploy em Vercel (ou Netlify).
    - [x] Criar `vercel.json` (ou equivalente).
    - [x] Criar script de build (instalar dependências, etc.).
    - [x] Testar o deploy.
- [x] **9. Código e Arquitetura (Backend e Infraestrutura):**
    - [x] Se usar Flask: Criar `Dockerfile` ou configurar para Vercel/Netlify serverless functions.
    - [ ] Se usar AWS Lambda: Criar `serverless.yml`.

## Fase 4: Otimização e Marketing

- [x] **6. SEO e Analytics:**
    - [x] Criar `<meta>` tags para título, descrição e Open Graph (foco: "gerador de currículo online").
    - [x] Integrar Google Analytics.
    - [x] Integrar Google Tag Manager.
- [x] **7. Fluxo de UX Simplificado (Final):**
    - [x] Desenvolver página de "obrigado" com upsell de pacotes de templates ou serviços de revisão.
- [x] **8. Marketing e Divulgação:**
    - [x] Gerar copy para anúncios em LinkedIn.
    - [x] Gerar copy para anúncios em WhatsApp.
    - [x] Criar SEO landing page para "currículo profissional grátis".
    - [x] Criar SEO landing page para "comprar currículo online".

## Fase 5: Testes e Documentação

- [x] **9. Código e Arquitetura (Testes):**
    - [x] Implementar testes automatizados para formulários.
    - [x] Implementar testes automatizados para geração de PDF.
- [x] **10. Guia de Operação:**
    - [x] Escrever manual em Markdown para: monitorar créditos (se aplicável à "API Manus"), atualizar preços, adicionar novos templates, editar cópias de marketing.
- [x] **Entrega Final:**
    - [x] Fornecer código-fonte completo.
    - [x] Fornecer instruções de infraestrutura como código.

## Objetivos de Negócio:
- [ ] Validar em poucas horas.
- [ ] Gerar os primeiros R$ 200 em vendas nas próximas 24 horas.
- [ ] Otimizar o site para conversão imediata.
- [ ] Baixo consumo de créditos na Manus AI.
