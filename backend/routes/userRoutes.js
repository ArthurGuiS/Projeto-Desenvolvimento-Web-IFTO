const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.criarUsuario);
router.get('/funcionarios', userController.listarFuncionarios);

module.exports = router;
