const express = require('express');

const router = express.Router();

const users = require('./users');
const auth = require('./auth');
const properties = require('./properties');
const feedback = require('./feedbacks');
const featured = require('./featured');
const favourite = require('./favourite');
const contactagent = require('./contactagent');

router.use(users);
router.use(auth);
router.use(properties);
router.use(feedback);
router.use(featured);
router.use(favourite);
router.use(contactagent);

module.exports = router;
