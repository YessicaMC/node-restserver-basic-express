
const { Router } = require('express');
const { check } = require('express-validator');
const { userGET, userPUT, userPOST, userPATCH, userDELETE } = require('../controllers/users_controller');
const { isValidRole, emailAlreadyExists, userExistsById } = require('../helpers/db-validators');
const { validateFields } = require('../middlewares/midd-validations');


const router = Router();

router.get('/',  userGET);
/** El check Prepara los errores en el request*/
/** El segundo argumentos son middlewares, si no se especifica entoncs toma el callback */
router.post('/', 
    [ 
        check('name', 'El nombre es obligatorio').not().isEmpty(), 
        check('password', 'El password debe contener mas de 6 caracteres').isLength(6), 
        check('password', 'El password es obligatorio').not().isEmpty(), 
        check('email', 'El correo no es válido').isEmail(), 
        // check('role', 'No es un rol válido').isIn(['USER_ROLE', 'ADMIN_ROLE']), 
        // check('role').custom( ( role) => isValidRole(role)), // role) => isValidRole(role es redundante a (isValidROle)
        check('role').custom(isValidRole), 
        check('email').custom(emailAlreadyExists), 
        validateFields
    ],
    userPOST
);
router.put('/:id', 
[ 
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(userExistsById),
    check('role').custom(isValidRole), 
    validateFields
],
userPUT);
router.patch('/', userPATCH);

router.delete('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(userExistsById),
    validateFields
],
userDELETE);

module.exports = router;