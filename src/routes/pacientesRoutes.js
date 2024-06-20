const express = require('express');
const router = express.Router();
const controller = require('../controller/pacientesController');
const { eAdmin } = require('../middlewares/auth'); // Importando o middleware de autenticação

// Exemplo de proteção de rotas usando middleware eAdmin
router.get('/', eAdmin, controller.findAll);

router.get('/:nome', eAdmin, controller.findByName);

router.get('/id/:id', eAdmin, controller.findByPk);

router.post('/', eAdmin, controller.create);

router.put('/:id', eAdmin, controller.alter);

router.delete('/:id', eAdmin, controller.remove);

module.exports = router;