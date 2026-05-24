# Especificações Técnicas Refinadas - Frontend PontoWeb

## 🎨 Design System e Identidade Visual

### Cores e Estilos
- **Paleta de Cores:**
  - Primária: `#007bff` (Azul Interativo) - Usada para ações principais e cabeçalhos.
  - Sucesso: `#28a745` (Verde) - Usada para feedbacks positivos e botões de confirmação.
  - Erro/Alerta: `#dc3545` (Vermelho) - Usada para mensagens de erro e ações destrutivas.
  - Fundo: `#f8f9fa` (Cinza muito claro) - Fundo das páginas para reduzir cansaço visual.
  - Superfícies: `#ffffff` (Branco) - Cards, containers e inputs.
  - Texto Principal: `#212529` (Cinza escuro).
  - Texto Secundário: `#6c757d` (Cinza médio).

### Componentes de Interface
- **Bordas:** Todos os containers, botões e inputs devem possuir `border-radius: 8px` para um aspecto moderno e amigável.
- **Botões:**
  - Devem possuir estados de `:hover` (leve escurecimento) e `:active` (leve redução de escala ou sombra interna).
  - Devem possuir estado `disabled` com opacidade reduzida e cursor `not-allowed`.
- **Inputs:**
  - Foco visível com `outline` ou `box-shadow` azul suave.
  - Placeholder em cinza claro.
  - Validação visual imediata (borda vermelha em caso de erro).

## 📱 Responsividade e Acessibilidade

### Responsividade
- **Mobile (até 480px):** Layout em coluna única, botões com largura total (full-width), fontes ligeiramente maiores para toque.
- **Tablet (481px a 768px):** Ajuste de margens e padding, tabelas podem se transformar em cards se necessário.
- **Desktop (acima de 769px):** Layout otimizado com largura máxima controlada para leitura confortável.

### Acessibilidade
- **Navegação:** Foco totalmente navegável via teclado (Tab).
- **Semântica:** Uso correto de tags HTML5 (`main`, `header`, `section`, `nav`, `footer`).
- **Labels:** Todo input deve ter um `<label>` associado ou um `aria-label` descritivo.
- **Contraste:** Garantir contraste mínimo de 4.5:1 para textos pequenos.
- **ARIA:** Uso de `aria-live="polite"` para feedbacks dinâmicos e `aria-busy` durante carregamentos.

## 🔄 Fluxos e Comportamentos

### Estados de Tela
- **Loading:** Exibir um spinner ou skeleton screen durante chamadas de API. O botão disparador deve ficar em estado de carregamento (desabilitado e com indicador visual).
- **Erro:** Mensagens de erro claras e acionáveis. Evitar apenas "Erro interno"; preferir "Não foi possível registrar o ponto. Tente novamente."
- **Vazio:** Quando não houver registros no histórico, exibir uma ilustração ou mensagem amigável: "Nenhum registro encontrado para este período."

### Validações e Feedbacks
- **Formulários:** Validação no `submit` e, preferencialmente, `onblur` para campos críticos (e-mail, CPF).
- **Toasts/Alertas:** Substituir alertas nativos do navegador por componentes de toast customizados para uma experiência integrada.

## 🛠️ Regras de Implementação Frontend

### Estrutura de Arquivos
- Centralizar estilos em `frontend/css/style.css`.
- Manter lógica de negócio e chamadas de API separadas da manipulação de DOM sempre que possível.

### Integração com Backend
- Todas as chamadas devem tratar timeouts e erros de rede graciosamente.
- Implementar lógica de retry simples para falhas de conexão intermitentes.

### Renderização
- Utilizar Template Literals para geração de HTML dinâmico no JS, garantindo a sanitização de dados básicos.
- Evitar reflows excessivos atualizando o DOM de forma otimizada.

## 📋 Requisitos de Navegação
- **Login:** Redirecionamento automático baseado na `role` retornada.
- **Sair (Logout):** Limpar `localStorage` e redirecionar para `index.html`.
- **Proteção de Rota:** Verificação básica no carregamento de `admin.html` e `funcionario.html` para garantir que o usuário está autenticado e possui a role correta.
