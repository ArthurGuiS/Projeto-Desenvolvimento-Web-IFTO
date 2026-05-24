const supabase = require('../config/supabase');

const userController = {
  criarUsuario: async (req, res) => {
    try {
      const { nome, email, cpf, role } = req.body;
      const senha_padrao = "mudar123";

      const { data, error } = await supabase
        .from('usuarios')
        .insert([
          { nome, email, cpf, senha: senha_padrao, role: role || 'employee' }
        ]);

      if (error) {
        console.error('Erro ao inserir usuário no Supabase:', error);
        return res.status(500).json({ message: "Erro ao criar usuário", details: error.message });
      }

      return res.status(201).json({ message: "Usuário criado" });
    } catch (error) {
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

  listarFuncionarios: async (req, res) => {
    try {
      const { data: usuarios, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('role', 'employee');

      if (error) {
        return res.status(500).json({ message: "Erro ao listar funcionários" });
      }

      return res.status(200).json(usuarios);
    } catch (error) {
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
};

module.exports = userController;
