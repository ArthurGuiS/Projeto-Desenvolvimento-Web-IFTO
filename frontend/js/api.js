const BASE_URL = "http://localhost:3000/api";

async function apiLogin(email, senha) {
    try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || "Falha na autenticação");
        }
        
        return data;
    } catch (error) {
        console.error("Erro no login:", error);
        throw error;
    }
}

async function apiBaterPonto(usuarioId) {
    try {
        const response = await fetch(`${BASE_URL}/ponto/registrar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario_id: usuarioId })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || "Erro ao registrar ponto");
        }
        
        return data;
    } catch (error) {
        console.error("Erro ao registrar ponto:", error);
        throw error;
    }
}

async function apiBuscarHistorico(usuarioId) {
    try {
        const response = await fetch(`${BASE_URL}/ponto/historico/${usuarioId}`);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || "Erro ao buscar histórico");
        }
        
        return data;
    } catch (error) {
        console.error("Erro ao buscar histórico:", error);
        throw error;
    }
}

async function apiCriarUsuario(dados) {
    try {
        const response = await fetch(`${BASE_URL}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.erro || data.message || "Erro ao criar usuário");
        }
        
        return data;
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        throw error;
    }
}

async function apiListarFuncionarios() {
    try {
        const response = await fetch(`${BASE_URL}/users/funcionarios`);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || "Erro ao listar funcionários");
        }
        
        return data;
    } catch (error) {
        console.error("Erro ao listar funcionários:", error);
        throw error;
    }
}

async function apiAlterarSenha(usuarioId, novaSenha) {
    try {
        const response = await fetch(`${BASE_URL}/users/redefinir-senha`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario_id: usuarioId, nova_senha: novaSenha })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || "Erro ao alterar senha");
        }
        
        return data;
    } catch (error) {
        console.error("Erro ao alterar senha:", error);
        throw error;
    }
}
