const {Schema, model} = require('mongoose');

const CategorySchema = Schema({
    name: {
        type: String,
        required: [ true, 'Name is mandatory']
    },
    state: {
        type: Boolean,
        default: true,
        required: [true, 'Status is mandatory']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

CategorySchema.methods.toJSON = function() {
    const {__v, state, _id, ...category} = this.toObject();
    category.uid = _id;
    return category;
}   


module.exports = model('Category', CategorySchema)