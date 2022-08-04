
const { Router } = require('express');
const { check } = require('express-validator');
const { login } = require('../controllers/auth_controller');
const { validateFields } = require('../middlewares/midd-validations');
const { validateJWT } = require('../middlewares/validate-jwt');


const router = Router();

router.post('/login', [
    check('email', 'Email mandatory').isEmail(),
    check('password', 'Password mandatory').not().isEmpty(),
    validateFields,
],
login);

module.exports = router;