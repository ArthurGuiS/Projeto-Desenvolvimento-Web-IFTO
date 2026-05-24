const express = require('express');
const router = express.Router();
const pontoController = require('../controllers/pontoController');

router.post('/registrar', pontoController.registrarPonto);
router.get('/historico/:usuario_id', pontoController.buscarHistoricoFuncionario);

module.exports = router;
