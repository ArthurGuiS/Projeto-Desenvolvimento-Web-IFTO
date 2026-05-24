// Recupera o objeto do usuário logado
const usuarioData = JSON.parse(localStorage.getItem('usuarioLogado'));
const usuarioId = usuarioData ? usuarioData.id : null;

// Verifica se o usuário está logado, senão redireciona para o login
if (!usuarioId) {
  window.location.href = 'index.html';
}

async function aoClicarBaterPonto() {
  try {
    const resultado = await api.baterPonto(usuarioId);
    if (resultado.message === "Ponto registrado") {
      alert("Ponto registrado com sucesso");
      atualizarHistoricoNaTela();
    } else {
      alert("Falha ao registrar ponto: " + resultado.message);
    }
  } catch (error) {
    alert("Erro na comunicação com o servidor");
  }
}

async function atualizarHistoricoNaTela() {
  const historico = await api.buscarHistorico(usuarioId);
  const container = document.querySelector('#historico-container');
  if (container) {
    container.innerHTML = historico.map(reg => `
      <div class="registro">
        <span>${new Date(reg.data_hora).toLocaleString()}</span> - 
        <span>${reg.tipo}</span>
      </div>
    `).join('');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const btnSair = document.querySelector('#btn-sair');
  if (btnSair) {
    btnSair.addEventListener('click', () => {
      localStorage.removeItem('usuarioLogado');
      window.location.href = 'index.html';
    });
  }

  const btnBaterPonto = document.querySelector('#btn-bater-ponto');
  if (btnBaterPonto) {
    btnBaterPonto.addEventListener('click', aoClicarBaterPonto);
  }
  atualizarHistoricoNaTela();
});
