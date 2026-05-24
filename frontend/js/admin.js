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
      <div class="funcionario">
        <span>${func.nome}</span> - <span>${func.email}</span>
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

  const formNovoFunc = document.querySelector('#form-novo-func');
  if (formNovoFunc) {
    formNovoFunc.addEventListener('submit', aoSubmeterFormularioNovoFuncionario);
  }
  recarregarListaDeFuncionarios();
});
