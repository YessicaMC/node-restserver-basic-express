const validateFields  = require('../middlewares/midd-validations');
const validateJWT  = require('../middlewares/validate-jwt');
const validateRoles = require('../middlewares/validate-role');
const validateFiles = require('../middlewares/validate-file');


module.exports = {
    ...validateFields,
    ...validateJWT,
    ...validateRoles,
    ...validateFiles
};