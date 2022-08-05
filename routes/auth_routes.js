
const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn } = require('../controllers/auth_controller');
const { validateFields } = require('../middlewares/midd-validations');
const { validateJWT } = require('../middlewares/validate-jwt');


const router = Router();

router.post('/login', [
    check('email', 'Email mandatory').isEmail(),
    check('password', 'Password mandatory').not().isEmpty(),
    validateFields,
],
login);

router.post('/google', [
    check('id_token', 'google token mandatory').not().isEmpty(),
    validateFields,
],
googleSignIn);

module.exports = router;