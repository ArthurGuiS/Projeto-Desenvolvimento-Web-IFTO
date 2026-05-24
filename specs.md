# Especificações Técnicas - Sistema PontoWeb

## ⚙️ Configurações e Ponto de Entrada

/backend/config/supabase.js
- ação: criar
- descrição: Estabelecer e exportar a conexão com o banco de dados Supabase garantindo a correta leitura das credenciais.
- pseudocódigo:
  IMPORTAR { createClient } de '@supabase/supabase-js'
  LER supabaseUrl = AMBIENTE('SUPABASE_URL')
  LER supabaseKey = AMBIENTE('SUPABASE_KEY')
  INSTANCIAR cliente = createClient(supabaseUrl, supabaseKey)
  EXPORTAR cliente

/backend/server.js
- ação: criar
- descrição: Inicializar o servidor HTTP, configurar interceptadores (middlewares) e mapear as rotas globais da API.
- pseudocódigo:
  IMPORTAR express, cors
  IMPORTAR authRoutes, userRoutes, pontoRoutes
  INSTANCIAR app = express()
  APLICAR middleware cors() no app
  APLICAR middleware express.json() no app
  VINCULAR '/api/auth' PARA authRoutes
  VINCULAR '/api/users' PARA userRoutes
  VINCULAR '/api/ponto' PARA pontoRoutes
  ESCUTAR na porta 3000

---

## 🔐 Autenticação

/backend/controllers/authController.js
- ação: criar
- descrição: Receber as credenciais do usuário, validar no banco de dados e retornar as informações de perfil (role).
- pseudocódigo:
  FUNÇÃO login(requisição, resposta):
      LER email, senha DO CORPO DA requisição
      SE email OU senha FOREM VAZIOS:
          RETORNAR STATUS 400 COM MENSAGEM "Credenciais inválidas"
      
      BUSCAR usuario NO supabase ONDE email = email
      SE usuario NAO EXISTE OU usuario.senha != senha:
          RETORNAR STATUS 401 COM MENSAGEM "Acesso negado"
          
      RETORNAR STATUS 200 COM DADOS { id: usuario.id, role: usuario.role, nome: usuario.nome }

/backend/routes/authRoutes.js
- ação: criar
- descrição: Definir os endpoints HTTP referentes aos processos de autenticação.
- pseudocódigo:
  IMPORTAR Router do express
  IMPORTAR authController
  INSTANCIAR router = Router()
  DEFINIR ROTA POST '/login' EXECUTANDO authController.login
  EXPORTAR router

---

## ⏱️ Registro de Ponto

/backend/controllers/pontoController.js
- ação: criar
- descrição: Registrar a marcação de ponto utilizando estritamente a hora do servidor para prevenir fraudes. Recuperar histórico.
- pseudocódigo:
  FUNÇÃO registrarPonto(requisição, resposta):
      LER usuario_id DO CORPO DA requisição
      OBTER dataHoraAtual = DATA_HORA_DO_SISTEMA()
      DETERMINAR tipoMarcacao (entrada, pausa, retorno, saida) BASEADO NO ULTIMO REGISTRO DO DIA
      INSERIR NO supabase (usuario_id, dataHoraAtual, tipoMarcacao)
      SE SUCESSO:
          RETORNAR STATUS 201 COM MENSAGEM "Ponto registrado"
      SENAO:
          RETORNAR STATUS 500 COM MENSAGEM "Erro ao registrar"

  FUNÇÃO buscarHistoricoFuncionario(requisição, resposta):
      LER usuario_id DOS PARAMETROS DA requisição
      BUSCAR registros NO supabase ONDE id_usuario = usuario_id ORDENADO POR data DESCENDENTE
      RETORNAR STATUS 200 COM DADOS registros

/backend/routes/pontoRoutes.js
- ação: criar
- descrição: Expor as rotas de registro e listagem de ponto.
- pseudocódigo:
  IMPORTAR Router do express
  IMPORTAR pontoController
  INSTANCIAR router = Router()
  DEFINIR ROTA POST '/registrar' EXECUTANDO pontoController.registrarPonto
  DEFINIR ROTA GET '/historico/:usuario_id' EXECUTANDO pontoController.buscarHistoricoFuncionario
  EXPORTAR router

---

## 👥 Gestão de Usuários (Admin)

/backend/controllers/userController.js
- ação: criar
- descrição: Controlar o CRUD de usuários restrito ao perfil de administrador.
- pseudocódigo:
  FUNÇÃO criarUsuario(requisição, resposta):
      LER dados_usuario DO CORPO DA requisição
      GERAR senha_padrao (ex: "mudar123")
      INSERIR dados_usuario + senha_padrao NO supabase
      RETORNAR STATUS 201 COM MENSAGEM "Usuário criado"

  FUNÇÃO listarFuncionarios(requisição, resposta):
      BUSCAR usuarios NO supabase ONDE role = 'employee'
      RETORNAR STATUS 200 COM DADOS usuarios

---

## 🖥️ Frontend (Lógica de Cliente)

/frontend/js/api.js
- ação: criar
- descrição: Centralizar todas as chamadas HTTP para a API local.
- pseudocódigo:
  CONSTANTE BASE_URL = "http://localhost:3000/api"

  FUNÇÃO ASSINCRONA apiLogin(email, senha):
      EXECUTAR fetch(BASE_URL + '/auth/login', METODO POST, CORPO {email, senha})
      RETORNAR resposta.json()

  FUNÇÃO ASSINCRONA apiBaterPonto(usuarioId):
      EXECUTAR fetch(BASE_URL + '/ponto/registrar', METODO POST, CORPO {usuario_id: usuarioId})
      RETORNAR resposta.json()

/frontend/js/funcionario.js
- ação: criar
- descrição: Lidar com a interface do funcionário, escutando cliques e atualizando o DOM.
- pseudocódigo:
  LER usuarioId DO localStorage

  FUNÇÃO aoClicarBaterPonto():
      CHAMAR apiBaterPonto(usuarioId)
      SE sucesso:
          EXIBIR ALERTA "Ponto registrado com sucesso"
          ATUALIZAR_HISTORICO_NA_TELA()
      SENAO:
          EXIBIR ALERTA "Falha ao registrar ponto"

  VINCULAR EVENTO 'click' DO BOTAO '#btn-bater-ponto' PARA aoClicarBaterPonto

/frontend/js/admin.js
- ação: criar
- descrição: Gerenciar a renderização e submissão de formulários do painel administrativo.
- pseudocódigo:
  FUNÇÃO aoSubmeterFormularioNovoFuncionario(evento):
      PREVENIR COMPORTAMENTO PADRAO DO EVENTO
      LER nome, email, cpf DO FORMULARIO
      CHAMAR api.criarUsuario({nome, email, cpf})
      SE sucesso:
          EXIBIR ALERTA "Funcionário cadastrado"
          RECARREGAR_LISTA_DE_FUNCIONARIOS()

  VINCULAR EVENTO 'submit' DO FORMULARIO '#form-novo-func' PARA aoSubmeterFormularioNovoFuncionario