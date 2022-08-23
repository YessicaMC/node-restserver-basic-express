
const { Router } = require('express');
const { check } = require('express-validator');
const { createCategory, categoriesPaginatedGET, categoryGET, categotyPUT, categoryPOST, categoryDELETE } = require('../controllers/categories_controller');
const { isValidRole, categoryExistsById} = require('../helpers/db-validators');


///Una forma de agrupar
const {
    validateFields,
    validateJWT,
    isAdminRole,
} = require('../middlewares');


const router = Router();

/** 
 * {{url}}/api/categories
 */


/// Get all (paginated)
router.get('/', [
    // validateJWT
], categoriesPaginatedGET);

//Get one
router.get('/:id', [
    // validateJWT,
    check('id', 'Id is mandatory').not().isEmpty(),
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(categoryExistsById),
    validateFields
], categoryGET);


//Create category - private
router.post('/', [ 
    validateJWT,
    check('name', 'Name is mandatory').not().isEmpty(),
    validateFields
], categoryPOST);


//Edit category - private 
router.put('/:id', [
    validateJWT,
    check('id', 'Id is mandatory').not().isEmpty(),
    check('name', 'Name is mandatory').not().isEmpty(),
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(categoryExistsById),
    validateFields
], 
categotyPUT);
   

//Create category - only admins - state:false
router.delete('/:id', [
    validateJWT,
    check('id', 'Id is mandatory').not().isEmpty(),
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(categoryExistsById),
    validateFields
], categoryDELETE);

module.exports = router;