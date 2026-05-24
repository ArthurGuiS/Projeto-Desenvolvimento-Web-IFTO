// Supondo que o api.js já foi carregado
const usuarioData = JSON.parse(localStorage.getItem('usuarioLogado'));

if (!usuarioData || usuarioData.role !== 'admin') {
  alert("Acesso restrito a administradores.");
  window.location.href = 'index.html';
}

async function aoSubmeterFormularioNovoFuncionario(evento) {
  evento.preventDefault();
  
  const nome = document.querySelector('#nome').value;
  const email = document.querySelector('#email').value;
  const cpf = document.querySelector('#cpf').value;

  try {
    const resultado = await api.criarUsuario({ nome, email, cpf });
    if (resultado.message === "Usuário criado") {
      alert("Funcionário cadastrado");
      recarregarListaDeFuncionarios();
      document.querySelector('#form-novo-func').reset();
    } else {
      const msg = resultado.details ? `${resultado.message}: ${resultado.details}` : resultado.message;
      alert("Falha ao cadastrar: " + msg);
    }
  } catch (error) {
    alert("Erro na comunicação com o servidor");
  }
}

async function recarregarListaDeFuncionarios() {
  const funcionarios = await api.listarFuncionarios();
  const container = document.querySelector('#lista-funcionarios');
  if (container) {
    container.innerHTML = funcionarios.map(func => `
      <div class="funcionario" style="margin-bottom: 15px; padding: 10px; border: 1px solid #ddd; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;">
        <div>
            <strong>${func.nome}</strong><br>
            <small>${func.email}</small>
        </div>
        <div>
            <button onclick="promptRedefinirSenha('${func.id}', '${func.nome}')" style="background: #f0ad4e; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Redefinir Senha</button>
        </div>
      </div>
    `).join('');
  }
}

async function promptRedefinirSenha(usuarioId, nome) {
    const novaSenha = prompt(`Digite a nova senha para ${nome}:`);
    if (novaSenha) {
        try {
            const resultado = await api.redefinirSenha(usuarioId, novaSenha);
            if (resultado.message === "Senha atualizada com sucesso") {
                alert("Senha atualizada!");
            } else {
                alert("Erro: " + resultado.message);
            }
        } catch (error) {
            alert("Erro na comunicação com o servidor.");
        }
    }
}

async function buscarHistoricoPorNome() {
  const nomeBusca = document.querySelector('#busca-nome').value.toLowerCase();
  const container = document.querySelector('#resultado-busca-historico');
  
  if (!nomeBusca) {
    alert("Digite um nome para buscar.");
    return;
  }

  container.innerHTML = "Buscando...";

  try {
    // 1. Listar todos os funcionários para encontrar o ID pelo nome
    const funcionarios = await api.listarFuncionarios();
    const funcionarioEncontrado = funcionarios.find(f => f.nome.toLowerCase().includes(nomeBusca));

    if (!funcionarioEncontrado) {
      container.innerHTML = "<p style='color: red;'>Funcionário não encontrado.</p>";
      return;
    }

    // 2. Buscar o histórico pelo ID encontrado
    const historico = await api.buscarHistorico(funcionarioEncontrado.id);
    
    if (historico.length === 0) {
      container.innerHTML = `<p>Nenhum registro encontrado para <strong>${funcionarioEncontrado.nome}</strong>.</p>`;
      return;
    }

    // 3. Renderizar o histórico
    container.innerHTML = `<h3>Histórico de ${funcionarioEncontrado.nome}</h3>` + historico.map(reg => {
      const cor = reg.tipo === 'entrada' ? '#28a745' : '#dc3545';
      const label = reg.tipo === 'entrada' ? 'ENTRADA' : 'SAÍDA';
      return `
        <div class="registro" style="margin-bottom: 8px; padding: 10px; border-left: 5px solid ${cor}; background: #f9f9f9;">
          <strong>${label}</strong> - 
          <span>${new Date(reg.data_hora).toLocaleString('pt-BR')}</span>
        </div>
      `;
    }).join('');

  } catch (error) {
    console.error("Erro na busca:", error);
    container.innerHTML = "<p style='color: red;'>Erro ao buscar histórico.</p>";
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

  const btnBuscar = document.querySelector('#btn-buscar');
  if (btnBuscar) {
    btnBuscar.addEventListener('click', buscarHistoricoPorNome);
  }

  const formNovoFunc = document.querySelector('#form-novo-func');
  if (formNovoFunc) {
    formNovoFunc.addEventListener('submit', aoSubmeterFormularioNovoFuncionario);
  }
  recarregarListaDeFuncionarios();
});
