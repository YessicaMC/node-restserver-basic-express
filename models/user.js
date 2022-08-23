/*
{
    name: 'Yessica',
    email: 'yessica.m.c.7@gmail.com',
    password: 'If3elf1ne22',
    image: 'http://image.com/123',
    role: ''
    state: false,
    google: true
}
*/
const { Schema, model} = require('mongoose');

const UserSchema = Schema({
    name: {
        type: String,
        required: [true, 'Name mandatory']
    },
    email: {
        type: String,
        required: [true, 'Email mandatory'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password mandatory'],
    },
    image: {
        type: String,
    },
    role: {
        type: String,
        required: [true, 'Role mandatory'],
        enum: ['ADMIN_ROLE', 'USER_ROLE'],
        default: 'USER_ROLE'
    },
    state: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
    },

});


//Una funcion de flecha mantiene el objeto this, fuera de la misma y yo necesito 
/** Tiene que ser un funcition() */
UserSchema.methods.toJSON = function() {
    /** Con '...user' todos las propiedades apartir de esa instruccion las va a contener en un objeto llamada user */
    const {__v, password, _id, ...user} = this.toObject();
    user.uid = _id;
    return user;
}   


module.exports = model( 'User',  UserSchema);