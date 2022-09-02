
const { Router } = require('express');
const { check } = require('express-validator');
const { uploadFile, updateImage, getFileUrl, updateAndUploadImage } = require('../controllers/uploads_controller');
const { isValidCollection } = require('../helpers');


///Una forma de agrupar
const {
    validateFields,
    validateJWT,
    hasFile
} = require('../middlewares');


const router = Router();

/** 
 * {{url}}/api/uploads
 */

router.post('/', 
    hasFile, //Cuando se usa un solo middleware no se tiene que poner []
  uploadFile)


router.put('/:collection/:id', [
    hasFile,
    check('id', 'Invalid id').isMongoId(),
    check('collection', 'Invalid collection').custom( c => isValidCollection(c, ['users', 'products'])),
    validateFields
] ,updateAndUploadImage)


router.get('/:collection/:id', [
    check('id', 'Invalid id').isMongoId(),
    check('collection', 'Invalid collection').custom( c => isValidCollection(c, ['users', 'products'])),
    validateFields
] ,getFileUrl)

module.exports = router;