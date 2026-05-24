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
      const tipoFormatado = resultado.tipo === 'entrada' ? 'Entrada' : 'Saída';
      alert(`${tipoFormatado} registrada com sucesso!`);
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
    container.innerHTML = historico.map(reg => {
      const cor = reg.tipo === 'entrada' ? '#28a745' : '#dc3545';
      const label = reg.tipo === 'entrada' ? 'ENTRADA' : 'SAÍDA';
      return `
        <div class="registro" style="margin-bottom: 8px; padding: 10px; border-left: 5px solid ${cor}; background: #f9f9f9;">
          <strong>${label}</strong> - 
          <span>${new Date(reg.data_hora).toLocaleString('pt-BR')}</span>
        </div>
      `;
    }).join('');
  }
}

async function aoClicarAlterarSenha() {
  const novaSenha = prompt("Digite sua nova senha:");
  if (novaSenha) {
    try {
      const resultado = await api.redefinirSenha(usuarioId, novaSenha);
      if (resultado.message === "Senha atualizada com sucesso") {
        alert("Sua senha foi alterada com sucesso!");
      } else {
        alert("Erro ao alterar senha: " + resultado.message);
      }
    } catch (error) {
      alert("Erro na comunicação com o servidor.");
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Exibe o nome do usuário no cabeçalho
  const elNome = document.querySelector('#nome-usuario');
  if (elNome && usuarioData) {
    elNome.textContent = `Olá, ${usuarioData.nome}`;
  }

  const btnAlterarSenha = document.querySelector('#btn-alterar-senha');
  if (btnAlterarSenha) {
    btnAlterarSenha.addEventListener('click', aoClicarAlterarSenha);
  }

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
