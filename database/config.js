const mongoose = require('mongoose');

const dbConnection = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_CNDW, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // useCreateIndex: true,
            // useFindAndModify: false
        })
        /** https://mongoosejs.com/docs/migrating_to_6.html#no-more-deprecation-warning-options */
        console.log('Database connected');
    }catch(e){
        console.log(e);
        throw new Error('Error al cargar la base de datos')
    }
}


module.exports = { 
    dbConnection 
}