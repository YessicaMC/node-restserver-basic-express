const { response, request, query } = require('express')
const bcryptjs = require('bcryptjs')

/**Es standar usar la "U" de user en mayuscula para la instancia del modelo de DB */
const User = require('../models/user');

const userGET = async (req = request, res = response) => {
    const {limit = 5, from = 0} = req.query;
    const query = { state: true}

    // const users = await User.find(query)
    // .skip(Number(from))
    // .limit(Number(limit));

    // const total = await User.countDocuments();

    //Mandar todas las promesas que quiero que se ejecuten    
    //No va a continuar hast que todas se ejecuten
    const [total, users] = await Promise.all([
        User.countDocuments(),
        User.find(query)
            .skip(Number(from))
            .limit(Number(limit))
    ]);

    res.json({
        result: true,
        total,
        users,
    });
};

const userPOST = async (req, res = response) => {

    const {name, email, password, role} = req.body;
    const user = User({
        name, email, password, role
    });

    

    // //Verificar si el correo existe
    // /** email = email es redundante en JS*/
    // const emailExists = await User.findOne({ email });
    // if(emailExists ) {
    //     return res.status(400).json({
    //         msg: 'El correo ya está registrado'
    //     });
    // }

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync(); //Number of rounds to encrypt
    user.password = bcryptjs.hashSync(password, salt);

    await user.save();

    res.json({
        result: true,
        user
    });
};


const userPUT = async (req = request, res = response) => {
    const id = req.params.id;
    const {_id, password, google, ...userToUpdate } = req.body;

    //TODO: validar contra base de datos
    if(password){
        const salt = bcryptjs.genSaltSync(); //Number of rounds to encrypt
        userToUpdate.password = bcryptjs.hashSync(password, salt);
    }
    
    await User.findByIdAndUpdate(id, userToUpdate);
    const userUpdated = await User.findById(id)

    res.json({
        result: true,
        userUpdated
    });
};

const userPATCH = (req, res = response) => {
    res.json({
        result: true,
        msj: 'PATCH API user with controller'
    });
};

const userDELETE = async (req, res = response) => {
    const {id} = req.params;

    //Borrado físico
    // const user = await User.findByIdAndDelete(id);
    // const uid = req.uid;

    const user = await User.findByIdAndUpdate(id, {state: false});
    const userAuthenticated = req.userAuthenticated;

    res.json({
        result: true,
        user,
        userAuthenticated
    });
};


module.exports = {
    userGET,
    userPOST,
    userPUT,
    userPATCH,
    userDELETE
}