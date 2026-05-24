const supabase = require('../config/supabase');

const pontoController = {
  registrarPonto: async (req, res) => {
    try {
      const { usuario_id } = req.body;
      const dataHoraAtual = new Date();
      const hojeInicio = new Date(dataHoraAtual.getFullYear(), dataHoraAtual.getMonth(), dataHoraAtual.getDate()).toISOString();
      const hojeFim = new Date(dataHoraAtual.getFullYear(), dataHoraAtual.getMonth(), dataHoraAtual.getDate(), 23, 59, 59).toISOString();

      // Buscar registros do usuário hoje para determinar o tipo de marcação
      const { data: registrosHoje, error: errorBusca } = await supabase
        .from('registros_ponto')
        .select('tipo')
        .eq('usuario_id', usuario_id)
        .gte('data_hora', hojeInicio)
        .lte('data_hora', hojeFim)
        .order('data_hora', { ascending: true });

      if (errorBusca) {
        console.error('Erro ao buscar registros de hoje:', errorBusca);
        return res.status(500).json({ message: "Erro ao verificar registros" });
      }

      // Lógica de alternância: 0, 2, 4 registros = Entrada | 1, 3, 5 registros = Saída
      const tipo = registrosHoje.length % 2 === 0 ? 'entrada' : 'saida';
      
      const { data, error } = await supabase
        .from('registros_ponto')
        .insert([
          { usuario_id, data_hora: dataHoraAtual.toISOString(), tipo }
        ]);

      if (error) {
        console.error('Erro ao inserir ponto:', error);
        return res.status(500).json({ message: "Erro ao registrar" });
      }

      return res.status(201).json({ message: "Ponto registrado", tipo });
    } catch (error) {
      console.error('Erro interno no registro de ponto:', error);
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
