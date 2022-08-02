const { validationResult } = require("express-validator");

const validateFields = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json(errors);
    }
    /**El next hace que siga al siguiente middleware, si ya no hay mas middleware entonces ejecuta el controlador */
    next()
};

module.exports = {
    validateFields
}