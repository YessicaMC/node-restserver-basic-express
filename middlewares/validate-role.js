const { response, request } = require("express");

const isAdminRole = (req = request, res = response, next) => {
    if(! req.userAuthenticated){
        return res.status(500).json({
            msg: "Trying to validate role against invalid token"
        })
    }
    const {role, name} = req.userAuthenticated;

    if(role != "ADMIN_ROLE"){
        return res.status(500).json({
            msg: `${name} has not privileges to delete user`
        })
    }
    next();
}


const hasRole = ( ...roles) => {

    return (req, res = response, next) => {

        if(! req.userAuthenticated){
            return res.status(500).json({
                msg: "Trying to validate role against invalid token"
            })
        }

        if(!roles.includes(req.userAuthenticated.role)){
            return res.status(401).json({
                msg: `El servicio rquiere uno de estos roles: ${roles}`
            });
        }

        next();
    };
}


module.exports = {
    isAdminRole,
    hasRole
}