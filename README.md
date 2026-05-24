# PontoWeb

Sistema de registro de ponto com backend em Node.js e banco de dados Supabase.

## Estrutura do Projeto

- `/backend`: API REST em Node.js/Express.
- `/frontend`: Interface do usuário em HTML/JS puro.

## Configuração do Ambiente

### Backend

1. Entre na pasta `backend`:
   ```bash
   cd backend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente:
   - Renomeie `.env.example` para `.env`.
   - Preencha `SUPABASE_URL` e `SUPABASE_KEY` com suas credenciais do projeto Supabase.
4. Inicie o servidor:
   ```bash
   node server.js
   ```

### Banco de Dados (Supabase)

Você precisará das seguintes tabelas no seu projeto Supabase:

1. **usuarios**:
   - `id`: uuid (primary key)
   - `nome`: text
   - `email`: text (unique)
   - `senha`: text
   - `cpf`: text
   - `role`: text (ex: 'admin', 'employee')

2. **registros_ponto**:
   - `id`: uuid (primary key)
   - `usuario_id`: uuid (foreign key para usuarios.id)
   - `data_hora`: timestamptz
   - `tipo`: text (ex: 'entrada', 'saida')

### Frontend

Abra os arquivos `.html` na pasta `frontend` em seu navegador ou utilize um servidor estático. Certifique-se de que o backend esteja rodando para que as chamadas de API funcionem.
