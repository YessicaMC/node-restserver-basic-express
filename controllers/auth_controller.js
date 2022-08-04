const { response } = require("express");
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const { generateJWT } = require("../helpers/jwts");

const login = async (req, res = response) => {

    const {email, password} = req.body;

    try {

        //Verifica si el mail existe
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({
                msg: "Usuario o password no son correctos"
            });
        }

        //Si el usuaro esta activo
        if(!user.state){
            return res.status(400).json({
                msg: "Usuario o password no son correctos (state false)"
            });
        }

        //Veriricar la contraseña
        const validPassword = bcryptjs.compareSync(password, user.password);
        if(!validPassword){
            return res.status(400).json({
                msg: "Usuario o password no son correctos (pwd invalid)"
            }); 
        }

        //Genrar JWT
        const token = await generateJWT( user.id );
            
        res.json({
            msg: "Login ok",
            user,
            token
        });    
        
    } catch (error) {
        console.log(error);
        //Solo se puede tener un res.json
        return res.status(500).json({
            response: false,
            msg: "Cannot perform login"
        })
    }
    
}

module.exports = {
    login
}