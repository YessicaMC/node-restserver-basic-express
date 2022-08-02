const Role = require('../models/role');
const User = require('../models/user');

const isValidRole = async (role = '') => {
    const exists = await Role.findOne({ role })
    if(!exists){
        /** Esto no va a reventar la app, solamente regresa el error del express-validator */
        throw new Error(`El rol ${ role} no existe en la base de datos`);
    }
}


const emailAlreadyExists = async (email = '') => {
    //Verificar si el correo existe
    /** email = email es redundante en JS*/
    const emailExists = await User.findOne({ email });
    if(emailExists ) {
        // return res.status(400).json({
        //     msg: 'El correo ya está registrado'
        // });
        throw new Error(`El correo ${email} ya existe en la base de datos`);
    }
}

const userExistsById = async (id = '') => {
    //Verificar si el correo existe
    /** email = email es redundante en JS*/
    const exists = await User.findById(id);
    if(! exists ) {
        // return res.status(400).json({
        //     msg: 'El correo ya está registrado'
        // });
        throw new Error(`El ID ${id} del usuario no existe en la base de datos`);
    }
}

module.exports = {
    isValidRole,
    emailAlreadyExists,
    userExistsById
}