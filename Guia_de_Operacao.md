# Guia de Operação: Gerador de Currículos Profissionais

Este guia destina-se a auxiliar na operação e manutenção do site Gerador de Currículos Profissionais.

## 1. Visão Geral da Arquitetura

O projeto é composto por duas partes principais:

*   **Frontend:** Desenvolvido em React (localizado em `frontend/frontend_app`), responsável pela interface do usuário, coleta de dados, seleção de templates e interação com o backend para pagamento e geração de PDF.
*   **Backend:** Desenvolvido em Flask (Python) (localizado em `backend/backend_app`), responsável pela geração dos PDFs (usando WeasyPrint) e pela integração com o sistema de pagamento Stripe.

O deploy é configurado para a Vercel, utilizando o arquivo `vercel.json` na raiz do projeto para orquestrar os builds e roteamento.

## 2. Monitoramento

*   **Monitoramento de Vendas (Stripe):**
    *   Acesse seu Dashboard do Stripe ([https://dashboard.stripe.com/](https://dashboard.stripe.com/)).
    *   Lá você poderá acompanhar todas as transações, volume de vendas, pagamentos bem-sucedidos, tentativas falhas, etc.
    *   Configure alertas no Stripe para ser notificado sobre atividades importantes.
*   **Monitoramento de Tráfego e Comportamento (Google Analytics):**
    *   Acesse seu painel do Google Analytics ([https://analytics.google.com/](https://analytics.google.com/)).
    *   Monitore o tráfego do site, origens de tráfego, comportamento dos usuários nas páginas, conversões (se configuradas), e outros dados relevantes para entender o desempenho do site.
    *   Utilize o Google Tag Manager para gerenciar tags de rastreamento adicionais, se necessário.
*   **Monitoramento de Deploy (Vercel):**
    *   Acesse seu painel na Vercel ([https://vercel.com/dashboard](https://vercel.com/dashboard)).
    *   Verifique o status dos deploys, logs de build, consumo de recursos e configure domínios.

## 3. Atualização de Preços

O preço do download do PDF é atualmente fixado em R$ 15,00.

*   **Local da Configuração:** O preço está definido no backend, no arquivo `backend/backend_app/src/routes/stripe_payment.py`.
*   **Como Alterar:**
    1.  Abra o arquivo `backend/backend_app/src/routes/stripe_payment.py`.
    2.  Localize a função `create_checkout_session`.
    3.  Dentro desta função, encontre a linha `"unit_amount": 1500,  # R$ 15.00 em centavos`.
    4.  Altere o valor `1500` para o novo preço desejado, **em centavos**. Por exemplo, para R$ 20,00, use `2000`.
    5.  Salve o arquivo.
    6.  Faça o commit da alteração para seu repositório Git.
    7.  A Vercel deverá automaticamente realizar um novo deploy com o preço atualizado.
*   **Frontend:** Atualize também o texto do preço no frontend, no arquivo `frontend/frontend_app/src/components/ResumeForm.jsx`, no botão de pagamento, e nas Landing Pages (`FreeResumeLP.jsx`, `BuyResumeLP.jsx`) se o preço for mencionado.

## 4. Adicionar Novos Templates de Currículo

Os templates de currículo são componentes React localizados em `frontend/frontend_app/src/templates/`.

**Para adicionar um novo template (ex: `Template4.jsx`):**

1.  **Crie o Componente React:**
    *   Crie um novo arquivo, por exemplo, `Template4.jsx` dentro de `frontend/frontend_app/src/templates/`.
    *   Desenvolva o layout do novo template como um componente React, similar aos `Template1.jsx`, `Template2.jsx`, e `Template3.jsx`. Ele deve aceitar `data`, `colors`, e `fonts` como props.
    *   Exemplo da estrutura básica:
        ```jsx
        import React from 'react';

        const Template4 = ({ data, colors, fonts }) => {
          // Lógica e JSX do seu novo template aqui
          const C = colors || { primary: 'bg-purple-700', text: 'text-gray-800', accent: 'text-purple-500', background: 'bg-white' };
          const F = fonts || { heading: 'font-mono', body: 'font-sans' };

          if (!data) return <div>Carregando...</div>;

          return (
            <div className={`max-w-4xl mx-auto my-8 p-8 shadow-lg rounded-lg ${C.background} ${F.body} ${C.text}`}>
              {/* Estrutura do Template 4 */}
              <h1 className={`${C.primary} text-white p-4 ${F.heading}`}>{data.fullName}</h1>
              {/* ... resto do template ... */}
            </div>
          );
        };

        export default Template4;
        ```

2.  **Atualize a Seleção de Template no Formulário:**
    *   Abra o arquivo `frontend/frontend_app/src/components/ResumeForm.jsx`.
    *   No `select` de templates, adicione uma nova `<option>` para o seu novo template:
        ```jsx
        <select 
            id="template" 
            name="template" 
            value={selectedTemplate} 
            onChange={(e) => setSelectedTemplate(e.target.value)} 
            className="..."
        >
            <option value="template1">Moderno Clássico</option>
            <option value="template2">Barra Lateral Criativa</option>
            <option value="template3">Elegante Minimalista</option>
            <option value="template4">Seu Novo Template</option> {/* Nova Opção */}
        </select>
        ```

3.  **(Opcional) Atualize a Lógica de Renderização/Geração de PDF se for Diferente:**
    *   Atualmente, o backend (`pdf_generator.py`) usa uma lógica HTML genérica. Se o novo template exigir uma estrutura HTML muito diferente para a geração do PDF via WeasyPrint, você precisará:
        *   Modificar a função `generate_resume_html` em `backend/backend_app/src/routes/pdf_generator.py` para lidar com o `template_id` do novo template e gerar o HTML correspondente.
        *   Isso pode envolver condicionais baseadas no `template_id` para construir diferentes estruturas HTML ou carregar diferentes arquivos de template HTML (se você optar por usar Jinja2 no backend para isso).

4.  **Teste:**
    *   Execute o frontend localmente (`pnpm run dev`) e verifique se o novo template aparece na seleção e é renderizado corretamente na pré-visualização (se implementada).
    *   Teste o fluxo de geração de PDF com o novo template.

5.  **Deploy:**
    *   Faça commit das alterações e envie para o repositório Git. A Vercel fará o deploy automaticamente.

## 5. Editar Cópias de Marketing

As cópias de marketing principais estão localizadas em:

*   **Landing Pages:**
    *   `frontend/frontend_app/src/pages/FreeResumeLP.jsx` (para "currículo profissional grátis")
    *   `frontend/frontend_app/src/pages/BuyResumeLP.jsx` (para "comprar currículo online")
    *   `frontend/frontend_app/src/pages/PaymentSuccess.jsx` (para a página de obrigado e upsell)
    *   Edite o conteúdo JSX diretamente nesses arquivos para alterar títulos, parágrafos, CTAs, etc.
*   **Anúncios (LinkedIn e WhatsApp):**
    *   O arquivo `marketing_copy.md` na raiz do projeto (`/home/ubuntu/resume_builder_app/marketing_copy.md`) contém sugestões de headlines e corpos de anúncio.
    *   Você pode editar este arquivo Markdown diretamente para refinar as mensagens ou criar novas variações.
*   **Textos do Formulário Principal e Interface:**
    *   `frontend/frontend_app/src/components/ResumeForm.jsx`: Contém os rótulos dos campos, mensagens de erro, texto do botão de submit, etc.
    *   `frontend/frontend_app/public/index.html`: Contém as meta tags de SEO (título, descrição) que também são importantes para marketing.

**Para editar:**

1.  Identifique o arquivo que contém o texto que deseja alterar.
2.  Abra o arquivo em um editor de texto.
3.  Faça as modificações desejadas no conteúdo.
4.  Salve o arquivo.
5.  Teste localmente para garantir que as alterações aparecem como esperado.
6.  Faça commit e push para o repositório Git para deploy via Vercel.

## 6. Variáveis de Ambiente

Lembre-se de configurar as seguintes variáveis de ambiente na UI da Vercel para o correto funcionamento do projeto em produção:

*   **Para o Frontend (React App - Build Environment & Runtime):**
    *   `REACT_APP_STRIPE_PUBLISHABLE_KEY`: Sua chave publicável do Stripe (ex: `pk_test_YOUR_STRIPE_PUBLISHABLE_KEY`).
*   **Para o Backend (Flask App - Runtime):**
    *   `STRIPE_SECRET_KEY`: Sua chave secreta do Stripe (ex: `sk_test_YOUR_STRIPE_SECRET_KEY`).
    *   `FRONTEND_URL`: A URL pública do seu frontend após o deploy (ex: `https://seu-dominio-vercel.app`).

Consulte os arquivos `.env` (no frontend) e `.env.example` (no backend) para referência.

## 7. Considerações Adicionais

*   **Backup:** Mantenha backups regulares do seu código-fonte (o Git já ajuda com isso) e de quaisquer dados importantes (ex: dados do Stripe, Google Analytics).
*   **Segurança:** Mantenha suas chaves de API (Stripe) seguras e nunca as exponha no código do frontend diretamente (use variáveis de ambiente).
*   **Atualizações de Dependências:** Periodicamente, verifique e atualize as dependências do projeto (npm/pnpm para frontend, pip para backend) para garantir segurança e compatibilidade.

Para dúvidas mais complexas ou desenvolvimento de novas funcionalidades, pode ser necessário conhecimento em React, Flask, HTML, CSS e JavaScript.

