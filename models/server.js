const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.usersPath = '/api/user';

        //Connect DB
        this.database();

        //Middlewares (Función que siempre se va a ejecutar cuando lancemos nuestro servidor)
        /** Se ejecuta antes de que se ejecute cualquier ruta */
        this.middlewares();

        //App routes
        this.routes();
    }

    routes(){
        this.app.use(this.usersPath, require('../routes/user_routes'));
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto', this.port)
        })
    }

    middlewares(){
        //Public path for static content
        this.app.use(express.static('public'));

        //Needed for host that are not localhost
        this.app.use(cors())

        //Receive and parse JSON as a BODY
        this.app.use(express.json())
    }

    database = async () => {
        await dbConnection();
    }
}

module.exports = Server;