
const { Router } = require('express');
const { check } = require('express-validator');
const { getAllProductsPaginatedGET, getProductByIdGET, createProductPOST, editProductPUT, productDELETE } = require('../controllers/products_controller');
const { isValidRole, categoryExistsById, productExistsById} = require('../helpers/db-validators');


/***
 * Notas dev:
 * 
 * Request data:
 * req.body = { "data" : "all"}
 * req.params = /:id 
 * req.query = ?param0= &param1= 
 * req.header('Content-Type')
 * 
 * 
 * Validations order:
 * - ValidateJWT
 * - Validate mandatory params ej. { :id }
 * - Validate mandatory relations ej. { categoryId }
 * - Validate mandatory STRINGs fields ej. { name }
 * 
 */

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



/**
 * Get all productos
 *  - Paginated
 */

router.get('/', [
], getAllProductsPaginatedGET);


/**
 * Get one product by id
*  id = req.params.id
 */
router.get('/:id', [
    check('id', 'Id is mandatory').not().isEmpty(),
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(productExistsById),
    validateFields
], getProductByIdGET);


/**
 * Create product
 * - ValidateJWT
 * - Validate required STRING fields that user needs to provide
 * - Validate catalogs (on this case only category)
 * */
router.post('/', [ 
    validateJWT,
    check('name', 'Name is mandatory').not().isEmpty(),
    check('type', 'Category is mandatory').not().isEmpty(),
    check('type', 'Invalid Category').isMongoId(),
    validateFields
], createProductPOST);


/**
 * Edit product
 * - ValidateJWT
 * - Validate mandatory params { :id }
 * - Validate mandatory relations { category }
 * - Validate  mandatory STRING fields {name}
 * */
router.put('/:id', [
    validateJWT,
    check('id', 'Id is mandatory').not().isEmpty(),
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(productExistsById),
    validateFields
], 
editProductPUT);
   

/**
 * Edit product
 * - ValidateJWT
 * - Validate mandatory params { :id }
*/
router.delete('/:id', [
    validateJWT,
    check('id', 'Id is mandatory').not().isEmpty(),
    check('id', 'Invalid ID').isMongoId(),
    check('id').custom(productExistsById),
    validateFields
], productDELETE);

module.exports = router;