const express = require('express');
const ContactsController = require('../controllers/ContactsController');

const router = express.Router();

router.get('/', ContactsController.list);

router.get('/:id', ContactsController.show);

router.post('/', ContactsController.create);

router.put('/:id', ContactsController.update);

router.delete('/:id', ContactsController.remove);

module.exports = router;
