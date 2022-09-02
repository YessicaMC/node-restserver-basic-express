const {Schema, model} = require('mongoose');

const ProductSchema = Schema({
    name: {
        type: String,
        required: [ true, 'Name is mandatory']
    },
    price: { type: Number,  default: 0 },
    description: { type: String },
    available: {  type: Boolean, default: true },
    state: {
        type: Boolean,
        default: true,
        required: [true, 'Status is mandatory']
    },
    type: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    image: {
        type: String
    }
});

ProductSchema.methods.toJSON = function() {
    const {__v, state, _id, ...product} = this.toObject();
    product.uid = _id;
    return product;
}   


module.exports = model('Product', ProductSchema)