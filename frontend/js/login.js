document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const btnLogin = document.getElementById('btn-login');
    const errorMessage = document.getElementById('error-message');
    
    // Reset state
    errorMessage.classList.add('hidden');
    btnLogin.disabled = true;
    const originalText = btnLogin.innerHTML;
    btnLogin.innerHTML = '<span class="spinner"></span> <span>Carregando...</span>';
    btnLogin.setAttribute('aria-busy', 'true');

    try {
        const data = await apiLogin(email, senha);
        const user = data.user;
        
        // Salvar dados do usuário
        localStorage.setItem('usuario', JSON.stringify(user));
        
        // Redirecionar baseado na role
        if (user.role === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'funcionario.html';
        }
    } catch (error) {
        errorMessage.textContent = error.message || "E-mail ou senha inválidos.";
        errorMessage.classList.remove('hidden');
        btnLogin.disabled = false;
        btnLogin.innerHTML = originalText;
        btnLogin.setAttribute('aria-busy', 'false');
    }
});
