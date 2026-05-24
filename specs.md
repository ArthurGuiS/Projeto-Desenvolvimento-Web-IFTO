# Especificações Técnicas - Sistema PontoWeb

## ⚙️ Configurações e Ponto de Entrada

/backend/config/supabase.js
- ação: criar
- descrição: Estabelecer e exportar a conexão com o banco de dados Supabase garantindo a correta leitura das credenciais.

/backend/server.js
- ação: criar
- descrição: Inicializar o servidor HTTP, configurar middlewares (CORS, JSON) e mapear as rotas globais da API.
- Port: 3000

---

## 🔐 Autenticação

/api/auth/login [POST]
- Descrição: Receber email e senha, validar no Supabase e retornar dados do usuário (id, role, nome).

---

## ⏱️ Registro de Ponto

/api/ponto/registrar [POST]
- Descrição: Registrar a marcação de ponto utilizando a hora do servidor.

/api/ponto/historico/:usuario_id [GET]
- Descrição: Recuperar o histórico de registros de um usuário específico.

---

## 👥 Gestão de Usuários (Admin)

/api/users [POST]
- Descrição: Criar um novo usuário (funcionário). Senha padrão: "mudar123".

/api/users/funcionarios [GET]
- Descrição: Listar todos os usuários com role 'employee'.

/api/users/redefinir-senha [PUT]
- Descrição: Atualizar a senha de um usuário.

---

## 🖥️ Frontend (Lógica de Cliente)

### Design System
- **Cores:** Primária (#007bff), Sucesso (#28a745), Erro (#dc3545), Fundo (#f8f9fa).
- **Estilo:** Bordas arredondadas (8px), sombras suaves, transições suaves.
- **Responsividade:** Mobile-first, adaptável para tablet e desktop.

### Componentes e Telas
- **Login (index.html):** Formulário de acesso com validação visual e feedback de carregamento.
- **Funcionário (funcionario.html):** Registro de ponto, histórico pessoal e alteração de senha.
- **Admin (admin.html):** Cadastro de funcionários, lista de ativos, busca de histórico e alteração de senha.

### Integração
- **api.js:** Centraliza chamadas `fetch` com tratamento de erros.
- **Estados:** Tratamento explícito de Loading, Erro e Vazio.

---

## 🚀 Instruções de Execução

1. **Backend:**
   - `cd backend`
   - `npm install`
   - Configurar `.env` com `SUPABASE_URL` e `SUPABASE_KEY`.
   - `node server.js`
2. **Frontend:**
   - Abrir `frontend/index.html` em um navegador.

---

## 🛠️ Comandos Disponíveis

- `npm start` (no backend): Inicia o servidor.
- `npm test`: (A implementar) Executa os testes unitários e de integração.
