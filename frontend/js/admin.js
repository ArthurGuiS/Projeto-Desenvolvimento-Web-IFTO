const usuario = JSON.parse(localStorage.getItem('usuario'));

if (!usuario || usuario.role !== 'admin') {
    window.location.href = 'index.html';
}

// Listar Funcionários
async function carregarFuncionarios() {
    const container = document.getElementById('lista-funcionarios');
    try {
        const funcionarios = await apiListarFuncionarios();
        
        if (funcionarios.length === 0) {
            container.innerHTML = '<p class="text-center">Nenhum funcionário cadastrado.</p>';
            return;
        }

        let html = `
            <table class="data-list">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>CPF</th>
                    </tr>
                </thead>
                <tbody>
        `;

        funcionarios.forEach(f => {
            html += `
                <tr>
                    <td>${f.nome}</td>
                    <td>${f.email}</td>
                    <td>${f.cpf}</td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    } catch (error) {
        container.innerHTML = `<p class="alert alert-danger">Erro ao carregar funcionários: ${error.message}</p>`;
    }
}

// Cadastrar Funcionário
document.getElementById('form-novo-func').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const cpf = document.getElementById('cpf').value;

    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Cadastrando...';

    try {
        await apiCriarUsuario({ nome, email, cpf, role: 'employee' });
        alert('Funcionário cadastrado com sucesso!');
        e.target.reset();
        carregarFuncionarios();
    } catch (error) {
        alert('Erro ao cadastrar: ' + error.message);
    } finally {
        btn.disabled = false;
        btn.textContent = 'Cadastrar Funcionário';
    }
});

// Buscar Histórico
document.getElementById('btn-buscar').addEventListener('click', async () => {
    const buscaNome = document.getElementById('busca-nome').value.toLowerCase();
    const resultadoContainer = document.getElementById('resultado-busca-historico');
    
    if (!buscaNome) {
        alert('Digite o nome do funcionário para buscar.');
        return;
    }

    try {
        // Primeiro, precisamos achar o ID do funcionário pelo nome
        // Como não temos uma rota de busca por nome direta que retorne ID, vamos listar todos e filtrar no client (ou poderíamos ter uma rota melhor)
        const funcionarios = await apiListarFuncionarios();
        const func = funcionarios.find(f => f.nome.toLowerCase().includes(buscaNome));

        if (!func) {
            resultadoContainer.innerHTML = '<p class="alert alert-danger">Funcionário não encontrado.</p>';
            return;
        }

        const registros = await apiBuscarHistorico(func.id);
        
        if (registros.length === 0) {
            resultadoContainer.innerHTML = `<p class="alert alert-warning">Nenhum ponto registrado para <strong>${func.nome}</strong>.</p>`;
            return;
        }

        let html = `
            <div class="card" style="background: #f1f3f5; border: 1px solid #dee2e6;">
                <h4>Histórico de ${func.nome}</h4>
                <table class="data-list">
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Hora</th>
                            <th>Tipo</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        registros.forEach(reg => {
            const dataHora = new Date(reg.data_hora);
            const data = dataHora.toLocaleDateString('pt-BR');
            const hora = dataHora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            html += `
                <tr>
                    <td>${data}</td>
                    <td>${hora}</td>
                    <td>${reg.tipo.charAt(0).toUpperCase() + reg.tipo.slice(1)}</td>
                </tr>
            `;
        });

        html += '</tbody></table></div>';
        resultadoContainer.innerHTML = html;
    } catch (error) {
        resultadoContainer.innerHTML = `<p class="alert alert-danger">Erro ao buscar: ${error.message}</p>`;
    }
});

// Logout
document.getElementById('btn-sair').addEventListener('click', () => {
    localStorage.removeItem('usuario');
    window.location.href = 'index.html';
});

// Alterar Senha Modal (Reutilizado)
const modalSenha = document.getElementById('modal-senha');
document.getElementById('btn-alterar-senha').addEventListener('click', () => {
    modalSenha.classList.remove('hidden');
});

document.getElementById('btn-cancelar-senha').addEventListener('click', () => {
    modalSenha.classList.add('hidden');
});

document.getElementById('form-alterar-senha').addEventListener('submit', async (e) => {
    e.preventDefault();
    const novaSenha = document.getElementById('nova-senha').value;
    const btnSubmit = e.target.querySelector('button[type="submit"]');
    
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Salvando...';

    try {
        await apiAlterarSenha(usuario.id, novaSenha);
        alert('Sua senha foi alterada com sucesso!');
        modalSenha.classList.add('hidden');
        e.target.reset();
    } catch (error) {
        alert('Erro ao alterar senha: ' + error.message);
    } finally {
        btnSubmit.disabled = false;
        btnSubmit.textContent = 'Salvar Nova Senha';
    }
});

// Inicialização
carregarFuncionarios();
