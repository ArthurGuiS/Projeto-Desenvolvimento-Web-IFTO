-- Criação da tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    cpf TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'employee' CHECK (role IN ('admin', 'employee')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criação da tabela de registros de ponto
CREATE TABLE IF NOT EXISTS registros_ponto (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
    data_hora TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    tipo TEXT NOT NULL DEFAULT 'marcacao',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserção de um usuário administrador inicial
-- Senha padrão: mudar123
INSERT INTO usuarios (nome, email, senha, cpf, role)
VALUES ('Administrador', 'admin@pontoweb.com', 'mudar123', '000.000.000-00', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_registros_usuario_data ON registros_ponto(usuario_id, data_hora DESC);
