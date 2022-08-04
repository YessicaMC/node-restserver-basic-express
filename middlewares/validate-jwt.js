const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


const validateJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');
    if(!token){
        res.status(401).json({
            msg: "Unauthorize"
        });
    }
    try {
        const {uid} =  jwt.verify(token, process.env.SECRETPRIVATEKEY);
        //Set uid for future uses
        // req.uid = uid;

        //Getting complet user authenticated
        const user = await User.findById(uid);
           
        if(!user){
            return res.status(401).json({
                msg: "Invalid token - user not found"
            });
        }

        if(!user.state){
            return res.status(401).json({
                msg: "Invalid token - user not active"
            });
        }
        req.userAuthenticated = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: "Invalid token"
        });
        
    }
    
}


module.exports = {
    validateJWT
}