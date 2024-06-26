const express = require('express');
const router = express.Router();
const controller = require('../controller/doencasController');
const { eAdmin } = require('../middlewares/auth');

router.get('/', eAdmin, controller.findAll);

router.get('/:nome', eAdmin, controller.findByName);

router.get('/id/:id', eAdmin, controller.findByPk);

router.post('/', eAdmin, controller.create);

router.put('/:id', eAdmin, controller.alter);

router.delete('/:id', eAdmin, controller.remove);

module.exports = router;