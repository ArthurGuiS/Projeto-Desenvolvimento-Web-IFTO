const usuario = JSON.parse(localStorage.getItem('usuario'));

if (!usuario || usuario.role !== 'employee') {
    if (!usuario || usuario.role !== 'admin') { // Permitir admin se necessário, mas geralmente cada um no seu painel
        window.location.href = 'index.html';
    }
}

document.getElementById('nome-usuario').textContent = `Bem-vindo(a), ${usuario.nome}`;

// Carregar Histórico
async function carregarHistorico() {
    const container = document.getElementById('historico-container');
    try {
        const registros = await apiBuscarHistorico(usuario.id);
        
        if (registros.length === 0) {
            container.innerHTML = '<p class="text-center" style="color: var(--text-secondary);">Nenhum registro encontrado.</p>';
            return;
        }

        let html = `
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

        html += '</tbody></table>';
        container.innerHTML = html;
    } catch (error) {
        container.innerHTML = `<p class="alert alert-danger">Erro ao carregar histórico: ${error.message}</p>`;
    }
}

// Bater Ponto
document.getElementById('btn-bater-ponto').addEventListener('click', async () => {
    const btn = document.getElementById('btn-bater-ponto');
    const feedback = document.getElementById('feedback-ponto');
    
    btn.disabled = true;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="spinner"></span> Registrando...';
    
    try {
        await apiBaterPonto(usuario.id);
        feedback.innerHTML = '<p class="alert alert-success">Ponto registrado com sucesso!</p>';
        carregarHistorico();
    } catch (error) {
        feedback.innerHTML = `<p class="alert alert-danger">Erro: ${error.message}</p>`;
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
        setTimeout(() => feedback.innerHTML = '', 5000);
    }
});

// Logout
document.getElementById('btn-sair').addEventListener('click', () => {
    localStorage.removeItem('usuario');
    window.location.href = 'index.html';
});

// Alterar Senha Modal
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
        alert('Senha alterada com sucesso!');
        modalSenha.classList.add('hidden');
        e.target.reset();
    } catch (error) {
        alert('Erro ao alterar senha: ' + error.message);
    } finally {
        btnSubmit.disabled = false;
        btnSubmit.textContent = 'Salvar';
    }
});

// Inicialização
carregarHistorico();
