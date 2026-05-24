# Tarefas de Refatoração e Otimização - Sistema PontoWeb

Este documento contém as diretrizes e passos em blocos isolados para a refatoração do sistema PontoWeb. As instruções foram projetadas para serem lidas por desenvolvedores ou IA, mantendo a consistência com o `03-especs.md` e focando em código limpo, testável e sem abstrações desnecessárias.

---

## Etapa 1: Utilitários de Validação (Backend)
Para manter o código modular e facilitar a criação de testes unitários no futuro, isole as lógicas de validação em um arquivo dedicado (ex: `utils/validators.js`). Não instale bibliotecas externas pesadas para isso; utilize código nativo.

### 1.1 Validação de E-mail
* **Ação:** Crie uma função `isValidEmail(email)`.
* **Regra:** Utilize uma Expressão Regular (Regex) nativa para verificar se a string obedece ao formato padrão `texto@texto.dominio`.
* **Retorno:** Booleano (`true` ou `false`).

### 1.2 Validação de CPF
* **Ação:** Crie uma função `isValidCPF(cpf)`.
* **Regras:** 1. Remova qualquer formatação do CPF (pontos e traços), deixando apenas números.
    2. Bloqueie sequências conhecidas de números repetidos (ex: `111.111.111-11`), pois passam na conta matemática mas são falsos.
    3. Implemente o algoritmo padrão da Receita Federal para validação do 1º e 2º dígitos verificadores.
* **Retorno:** Booleano (`true` ou `false`).

---

## Etapa 2: Refatoração do Cadastro de Funcionários (Backend)
Agora, aplique os utilitários criados no fluxo de registro. No controlador responsável por salvar novos usuários (geralmente mapeado em `POST /api/users`):

* **Ação:** Intercepte o corpo da requisição (`req.body`) antes da chamada ao banco de dados (Supabase).
* **Validação 1:** Passe `req.body.email` na função `isValidEmail`. Se falhar, interrompa e retorne Status Code `400` - JSON `{ "erro": "Formato de e-mail inválido." }`.
* **Validação 2:** Passe `req.body.cpf` na função `isValidCPF`. Se falhar, interrompa e retorne Status Code `400` - JSON `{ "erro": "O CPF informado é inválido." }`.
* **Rastreabilidade:** Essa etapa não deve modificar a regra existente que define a senha padrão como `mudar123`.

---

## Etapa 3: Alteração da Própria Senha pelo Administrador
O administrador deve poder gerenciar sua própria segurança através do painel, utilizando a mesma base visual e lógica já aplicada ao perfil de funcionário.

### 3.1 Frontend (Interface do Admin)
* **Ação:** No arquivo principal do painel administrativo (ex: `admin.html`), localize o cabeçalho superior direito.
* **Modificação:** Adicione o botão "Alterar Senha" ao lado do botão "Sair", copiando a mesma estrutura de classes e CSS utilizada no painel do funcionário (Figura 6 do manual).
* **Interação:** Vincule o evento de clique deste botão ao pop-up/modal de digitação de senha já existente no sistema.

### 3.2 Integração Frontend/Backend
* **Ação:** Quando o administrador confirmar a nova senha no pop-up, dispare a requisição para a rota de alteração de senha.
* **Validação:** A requisição deve enviar o ID do próprio administrador (obtido do token ou sessão ativa no local storage) para a rota de atualização (ex: `PUT /api/users/senha`).
* **Segurança:** O backend já deve possuir a regra que permite a um usuário autenticado alterar sua própria senha. Certifique-se apenas de que a consulta no banco (Supabase) atualize o hash corretamente, sem alterar a *role* administrativa do usuário.
