document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const errorMsg = document.getElementById('error-message');
    
    errorMsg.style.display = 'none';
    
    try {
        const resultado = await api.login(email, senha);
        
        if (resultado.user) {
            // Salva os dados do usuário no localStorage para usar depois
            localStorage.setItem('usuarioLogado', JSON.stringify(resultado.user));
            
            // Redirecionamento baseado na role
            if (resultado.user.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'funcionario.html';
            }
        } else {
            errorMsg.textContent = resultado.message || "Erro ao realizar login.";
            errorMsg.style.display = 'block';
        }
    } catch (error) {
        console.error("Erro no login:", error);
        errorMsg.textContent = "Erro na comunicação com o servidor.";
        errorMsg.style.display = 'block';
    }
});
