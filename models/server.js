const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileupload')

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth: '/api/auth',
            categories: '/api/categories',
            users: '/api/user',
            products: '/api/products',
            search: '/api/search',
            uploads: '/api/uploads',
        };

        //Connect DB
        this.database();

        //Middlewares (Función que siempre se va a ejecutar cuando lancemos nuestro servidor)
        /** Se ejecuta antes de que se ejecute cualquier ruta */
        this.middlewares();

        //App routes
        this.routes();
    }

    routes(){
        this.app.use(this.paths.users, require('../routes/user_routes'));
        this.app.use(this.paths.auth, require('../routes/auth_routes'));
        this.app.use(this.paths.categories, require('../routes/category_routes'));
        this.app.use(this.paths.products, require('../routes/product_routes'));
        this.app.use(this.paths.search, require('../routes/search_routes'));
        this.app.use(this.paths.uploads, require('../routes/uploads_routes'));
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

        //To manage the file upload
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath : true
        }));
    }

    database = async () => {
        await dbConnection();
    }
}

module.exports = Server;