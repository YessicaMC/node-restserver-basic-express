const { response, request } = require('express')

const userGET = (req = request, res = response) => {
    const {apikey, name = 'No name', page = 1} = req.query;
    res.json({
        result: true,
        msj: 'GET API user with controller',
        apikey,
        name,
        page
    });
};

const userPOST = (req, res = response) => {
    const {name, age} = req.body;
    res.json({
        result: true,
        msj: 'POST API - usuersPost',
        name,
        age
    });
};


const userPUT = (req = request, res = response) => {
    const id = req.params.id;

    res.json({
        result: true,
        msj: 'PUT API user with controller',
        id
    });
};

const userPATCH = (req, res = response) => {
    res.json({
        result: true,
        msj: 'PATCH API user with controller'
    });
};

const userDELETE = (req, res = response) => {
    res.json({
        result: true,
        msj: 'DELETE API user with controller'
    });
};


module.exports = {
    userGET,
    userPOST,
    userPUT,
    userPATCH,
    userDELETE
}