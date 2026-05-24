const supabase = require('../config/supabase');

const authController = {
  login: async (req, res) => {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ message: "Credenciais inválidas" });
      }

      const { data: usuario, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !usuario || usuario.senha !== senha) {
        return res.status(401).json({ message: "Acesso negado" });
      }

      return res.status(200).json({
        user: {
          id: usuario.id,
          role: usuario.role,
          nome: usuario.nome
        }
      });
    } catch (error) {
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
};

module.exports = authController;
