### 1 Módulo de Autenticação (`/api/auth`)
O cenário crítico aqui é impedir o acesso de credenciais falsas e garantir a correta identificação da *Role* do usuário.

* **Teste 1: Login com credenciais válidas (Caminho Feliz)**
    * **Pré-condição:** Fazer Mock do cliente do Supabase para que a busca pelo email retorne um usuário válido fictício com a senha esperada.
    * **Ação:** Fazer um POST com o *Supertest* para `/api/auth/login` enviando `{ "email": "admin@empresa.com", "senha": "123" }`.
    * **Resultado Esperado (Assert):** O sistema deve retornar Status Code `200` e o JSON da resposta deve conter o `id` e a `role` do usuário.

* **Teste 2: Login com senha incorreta**
    * **Pré-condição:** Mock do Supabase retorna o usuário, mas com hash/senha diferente da enviada.
    * **Ação:** Fazer POST enviando credenciais erradas.
    * **Resultado Esperado (Assert):** Status Code `401` com a mensagem `"Acesso negado"`.

* **Teste 3: Validação de campos vazios**
    * **Ação:** Fazer POST com body ausente ou sem o campo `email`.
    * **Resultado Esperado (Assert):** Status Code `400` com a mensagem `"Credenciais inválidas"`. O mock do banco **não** deve ser chamado (verificar com `jest.fn().mock.calls.length`).

### 1.2. Módulo de Registro de Ponto (`/api/ponto`)
O cenário crítico é a garantia de que o horário gravado é o do servidor e de que o banco receba os dados corretamente.

* **Teste 1: Registro bem-sucedido com bloqueio de horário local**
    * **Pré-condição:** 1. Fazer o Mock do banco de dados (Supabase) simulando sucesso na inserção. 2. **Mock temporal:** Utilizar `jest.useFakeTimers().setSystemTime(novaData)` para travar o relógio do servidor em um horário determinístico (ex: 10:00 AM).
    * **Ação:** POST para `/api/ponto/registrar` enviando `{ "usuario_id": "12345" }`.
    * **Resultado Esperado (Assert):** Status Code `201`. O principal assert aqui é verificar se o mock do Supabase foi chamado *exatamente* com a data que travamos no Mock (10:00 AM), ignorando qualquer data que pudesse vir no body da requisição.

* **Teste 2: Tratamento de falha na comunicação com o banco**
    * **Pré-condição:** Mock do Supabase configurado para estourar uma exceção (`throw new Error()`).
    * **Ação:** POST para registrar ponto.
    * **Resultado Esperado (Assert):** O sistema não deve travar. Deve ser retornado um Status Code `500` com a mensagem `"Erro ao registrar"`.

### 1.3. Gestão de Usuários / Admin (`/api/users`)
O cenário crítico é a garantia do fluxo de criação isolada, simulando que o admin está enviando os dados.

* **Teste 1: Cadastro de novo funcionário**
    * **Pré-condição:** Mock do banco para aceitar a gravação.
    * **Ação:** POST para `/api/users/` com `{ "nome": "João", "email": "joao@empresa.com" }`.
    * **Resultado Esperado (Assert):** Status Code `201`. Verificar se o sistema acoplou a senha padrão (ex: `mudar123`) ao objeto antes de chamar o mock de salvamento no Supabase.

* **Teste 2: Consulta de listagem de funcionários**
    * **Pré-condição:** Mock do Supabase retorna um Array com 3 objetos de usuários.
    * **Ação:** GET para `/api/users/funcionarios`.
    * **Resultado Esperado (Assert):** Status Code `200` e o `body` da resposta deve ser um array de comprimento igual a 3.