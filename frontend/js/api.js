const BASE_URL = "http://localhost:3000/api";

const api = {
  async login(email, senha) {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });
    return response.json();
  },

  async baterPonto(usuarioId) {
    const response = await fetch(`${BASE_URL}/ponto/registrar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario_id: usuarioId })
    });
    return response.json();
  },

  async buscarHistorico(usuarioId) {
    const response = await fetch(`${BASE_URL}/ponto/historico/${usuarioId}`);
    return response.json();
  },

  async criarUsuario(dadosUsuario) {
    const response = await fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dadosUsuario)
    });
    return response.json();
  },

  async listarFuncionarios() {
    const response = await fetch(`${BASE_URL}/users/funcionarios`);
    return response.json();
  },

  async redefinirSenha(usuarioId, novaSenha) {
    const response = await fetch(`${BASE_URL}/users/redefinir-senha`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario_id: usuarioId, nova_senha: novaSenha })
    });
    return response.json();
  }
};
