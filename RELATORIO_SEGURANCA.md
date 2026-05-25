# Relatório de Inspeção de Segurança - PontoWeb

## 1. Resumo Executivo

Esta inspeção superficial de segurança identificou vulnerabilidades críticas no sistema PontoWeb, principalmente relacionadas ao armazenamento de credenciais, controle de acesso e proteção contra ataques de injeção no frontend.

### Contagem de Achados por Severidade:
- **Crítica:** 1
- **Alta:** 3
- **Média:** 2
- **Baixa:** 1

### As 5 Ações Mais Urgentes:
1. Implementar Hashing de senhas (ex: bcrypt) no Backend.
2. Implementar middleware de autenticação e autorização em todas as rotas da API.
3. Corrigir vulnerabilidades de XSS substituindo `innerHTML` por métodos seguros ou sanitização.
4. Restringir a política de CORS e adicionar cabeçalhos de segurança (Helmet).
5. Validar a identidade do usuário na rota de redefinição de senha para evitar IDOR.

---

## 2. Detalhamento das Vulnerabilidades

### V01: Armazenamento de Senhas em Texto Claro (A07: Authentication Failures)
- **Localização:** `backend/controllers/authController.js`, Função `login`, Linha 19.
- **Descrição:** O sistema compara a senha fornecida pelo usuário diretamente com a senha armazenada no banco de dados sem o uso de algoritmos de hashing. Se o banco de dados for exposto, todas as senhas dos usuários estarão imediatamente visíveis.
- **Evidência:**
```javascript
if (error || !usuario || usuario.senha !== senha) {
  return res.status(401).json({ message: "Acesso negado" });
}
```
- **Impacto Potencial:** Exposição total das credenciais de todos os usuários em caso de vazamento de dados.
- **Nível de Severidade:** **Crítica**
- **Recomendação:** Utilizar a biblioteca `bcrypt` ou `argon2` para gerar e validar hashes de senhas. Nunca armazenar senhas em texto claro.
- **Referências:** CWE-257, OWASP A07:2021.

---

### V02: Falha no Controle de Acesso (A01: Broken Access Control)
- **Localização:** `backend/routes/userRoutes.js`, `backend/routes/pontoRoutes.js`.
- **Descrição:** As rotas da API não possuem middlewares de verificação de token (JWT) ou sessão. Qualquer pessoa com conhecimento do endpoint pode criar usuários, listar funcionários ou registrar pontos sem estar autenticada.
- **Evidência:**
```javascript
router.post('/', userController.criarUsuario);
router.get('/funcionarios', userController.listarFuncionarios);
```
- **Impacto Potencial:** Acesso não autorizado a dados sensíveis de funcionários e manipulação fraudulenta de registros de ponto.
- **Nível de Severidade:** **Alta**
- **Recomendação:** Implementar autenticação via JWT ou Session e um middleware de RBAC (Role-Based Access Control) para proteger rotas administrativas.
- **Referências:** CWE-285, OWASP A01:2021.

---

### V03: Injeção de Script - XSS via innerHTML (A05: Injection)
- **Localização:** `frontend/js/admin.js` (Função `carregarFuncionarios`) e `frontend/js/funcionario.js` (Função `carregarHistorico`).
- **Descrição:** O sistema renderiza dados provenientes do banco de dados (como nomes e tipos de registros) diretamente no DOM utilizando `innerHTML`, sem sanitização. Um atacante pode injetar scripts maliciosos através do campo "Nome" no cadastro.
- **Evidência:**
```javascript
html += `<tr><td>${f.nome}</td><td>${f.email}</td>...`;
...
container.innerHTML = html;
```
- **Impacto Potencial:** Execução de scripts no navegador de outros usuários, roubo de cookies/tokens de sessão e redirecionamentos maliciosos.
- **Nível de Severidade:** **Alta**
- **Recomendação:** Utilizar `textContent` ou `innerText` para dados textuais, ou utilizar uma biblioteca de sanitização como `DOMPurify` antes de usar `innerHTML`.
- **Referências:** CWE-79, OWASP A05:2021.

---

### V04: Insecure Direct Object Reference - IDOR na Redefinição de Senha (A01: Broken Access Control)
- **Localização:** `backend/controllers/userController.js`, Função `redefinirSenha`, Linhas 50-60.
- **Descrição:** A função de redefinição de senha aceita um `usuario_id` no corpo da requisição e altera a senha desse ID sem validar se o ID pertence ao usuário autenticado ou se quem solicita é um administrador.
- **Evidência:**
```javascript
const { usuario_id, nova_senha } = req.body;
const { data, error } = await supabase
  .from('usuarios')
  .update({ senha: nova_senha })
  .eq('id', usuario_id);
```
- **Impacto Potencial:** Um usuário autenticado (ou atacante) pode alterar a senha de qualquer outro usuário, incluindo o administrador, apenas alterando o ID na requisição.
- **Nível de Severidade:** **Alta**
- **Recomendação:** Validar a identidade do usuário através do token de sessão e garantir que um usuário só possa alterar sua própria senha (ou que apenas administradores possam alterar de outros).
- **Referências:** CWE-639, OWASP A01:2021.

---

### V05: Configuração de CORS Permissiva (A02: Security Misconfiguration)
- **Localização:** `backend/server.js`, Linha 12.
- **Descrição:** O middleware CORS está configurado para aceitar requisições de qualquer origem (`*`), o que é inseguro em ambientes de produção.
- **Evidência:**
```javascript
app.use(cors()); // Sem opções, o padrão é aceitar tudo
```
- **Impacto Potencial:** Facilita ataques de Cross-Site Request Forgery (CSRF) e permite que sites maliciosos interajam com a API do sistema.
- **Nível de Severidade:** **Média**
- **Recomendação:** Configurar o CORS para aceitar apenas domínios específicos e confiáveis através de uma lista de permissões (whitelist).
- **Referências:** CWE-942, OWASP A02:2021.

---

### V06: Falta de Cabeçalhos de Segurança (A02: Security Misconfiguration)
- **Localização:** `backend/server.js`.
- **Descrição:** O servidor Express não utiliza cabeçalhos de segurança padrão (como Content Security Policy, X-Content-Type-Options, etc.) que ajudam a mitigar diversos ataques web comuns.
- **Evidência:** Ausência de middleware como `helmet`.
- **Impacto Potencial:** Aumento da superfície de ataque para clickjacking, sniffing de MIME-type e ataques baseados em cache.
- **Nível de Severidade:** **Média**
- **Recomendação:** Instalar e configurar o middleware `helmet` no servidor Express.
- **Referências:** CWE-693, OWASP A02:2021.

---

### V07: Exposição de Informações Sensíveis via HTTP (A04: Cryptographic Failures)
- **Localização:** `frontend/js/api.js`.
- **Descrição:** A API está configurada para se comunicar via `http://localhost:3000`. Em produção, o tráfego não criptografado expõe credenciais e dados a ataques de Man-in-the-Middle (MitM).
- **Evidência:**
```javascript
const BASE_URL = "http://localhost:3000/api";
```
- **Impacto Potencial:** Interceptação de senhas e dados de ponto em redes Wi-Fi públicas ou comprometidas.
- **Nível de Severidade:** **Baixa** (em desenvolvimento) / **Alta** (em produção).
- **Recomendação:** Forçar o uso de HTTPS em produção e configurar cabeçalhos HSTS.
- **Referências:** CWE-319, OWASP A04:2021.
