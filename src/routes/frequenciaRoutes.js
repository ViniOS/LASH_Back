const express = require('express');
const router = express.Router();
const controller = require('../controller/frequenciaController');
const { eAdmin } = require('../middlewares/auth');

router.get('/', eAdmin, controller.findAll);

router.get('/:id', eAdmin, controller.findById);

router.post('/', eAdmin, controller.create);

router.delete('/:id', eAdmin, controller.remove);

module.exports = router;