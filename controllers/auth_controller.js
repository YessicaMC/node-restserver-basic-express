const { response, json } = require("express");
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const { generateJWT } = require("../helpers/jwts");
const { googleVerify } = require("../helpers/google-verify");

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


const googleSignIn = async ( req, res = response) => {
    const {id_token} = req.body;
    try {
        const {email, name, picture} = await googleVerify(id_token);


        let user = await User.findOne({ email })

        if(!user){
            user = {
                name, 
                email,
                password: 'signwithgoogle',
                image: picture,
                google: true,
            };
            user = User(user);
            await user.save();
        }
        
        //Si el usuario en DB
        if(! user.state){
            return res.status(401).json({
                result: false,
                msg: 'El usuario ha sifo bloqueado'
            });
        }

        const token = await generateJWT(user.id);

        res.json({
            user,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            result: false,
            msg: 'El token no se pudo verificar'
        });
    }
}

module.exports = {
    login,
    googleSignIn
}