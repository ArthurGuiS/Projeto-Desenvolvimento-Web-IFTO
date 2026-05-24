const supabase = require('../config/supabase');

const pontoController = {
  registrarPonto: async (req, res) => {
    try {
      const { usuario_id } = req.body;
      const dataHoraAtual = new Date().toISOString();

      // Buscar o último registro do dia para determinar o tipo de marcação
      // Simplificação: apenas inserindo o registro com a data/hora atual
      // Em um sistema real, haveria lógica para determinar se é entrada, pausa, etc.
      
      const { data, error } = await supabase
        .from('registros_ponto')
        .insert([
          { usuario_id, data_hora: dataHoraAtual, tipo: 'marcacao' }
        ]);

      if (error) {
        return res.status(500).json({ message: "Erro ao registrar" });
      }

      return res.status(201).json({ message: "Ponto registrado" });
    } catch (error) {
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  },

  buscarHistoricoFuncionario: async (req, res) => {
    try {
      const { usuario_id } = req.params;

      const { data: registros, error } = await supabase
        .from('registros_ponto')
        .select('*')
        .eq('usuario_id', usuario_id)
        .order('data_hora', { ascending: false });

      if (error) {
        return res.status(500).json({ message: "Erro ao buscar histórico" });
      }

      return res.status(200).json(registros);
    } catch (error) {
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
};

module.exports = pontoController;
