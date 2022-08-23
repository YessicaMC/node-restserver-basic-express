const { response, request, query } = require('express')
const { Product, Category } = require('../models');


/**
 * Service to get all productos
 *  - Paginated
 */
const getAllProductsPaginatedGET = async (req = request, res = response) => {
    const {limit = 5, from = 0} = req.query;

    const [total, products] = await Promise.all([
        Product.countDocuments(),
        Product.find({ state: true})
        .populate('user', 'name',)
        .populate('type', 'name')
        .skip(Number(from))
        .limit(Number(limit))
    ]);
    res.json({
        result: true,
        total,
        products
    });
}


/**
 * Get one product by id
*  id = req.params.id
 */
const getProductByIdGET = async (req = request, res = response) => {
    const id = req.params.id;
    const product = await Product.findById(id)
        .populate('user', 'name')
        .populate('type', 'name');

    res.json({
        result: true,
        product
    });
}

/**
 * Service to create product
 *  req.body = {
 *     name,
 *     price (optional),
 *     type (category id),
 *     description (optional),
 *      available (optional)
 *  }
 */
const createProductPOST = async (req = request, res = response) => {
    const {state, _id,  user, ...productToAdd} = req.body;
    
    const isValidCategory = await Category.findById(productToAdd.type);
    if(!isValidCategory){
        return res.status(400).json({
            result: false,
            msg: `Category ${productToAdd.type} does not exists`
        });
    }


    // productToAdd.user = req.userAuthenticated._id;

    //Solucion sugerida:
    const data = {
        ...productToAdd,
        name: productToAdd.name.toUpperCase(),
        user: req.userAuthenticated._id
    }


    const productAlreadyInDB = await Product.findOne({ name: data.name });
    if(productAlreadyInDB){
        return res.status(400).json({
            result: false,
            msg: `Product ${productToAdd.name} already exists`
        });
    }

    
    const product = Product(data);
    await product.save();

    const productAdded = await Product.findOne({name : data.name})
        .populate('user', 'name')
        .populate('type', 'name');

    res.status(201).json({
        msg: 'El producto se ha añadido',
        productAdded
    });
}


/**
 * Service to create product
 *  req.body = {
 *     name,
 *     price (optional),
 *     type (category id),
 *     description (optional),
 *      available (optional)
 *  }
 */
const editProductPUT = async(req = request, res = response) => {
    const { id } = req.params;
    const {_id, state, ... productToUpdate } = req.body;


    if(productToUpdate.name){
        productToUpdate.name = productToUpdate.name.toUpperCase();
    }

    if(productToUpdate.type){
        const isValidCategory = await Category.findById(productToUpdate.type);
        if(!isValidCategory){
            return res.status(400).json({
                result: false,
                msg: `Category ${productToUpdate.type} does not exists`
            });
        }
    }
   

    productToUpdate.user = req.userAuthenticated._id;
    
    await Product.findByIdAndUpdate(id, productToUpdate);
    const productUpdated = await Product.findById(id)
        .populate('user', 'name')
        .populate('type', 'name');

    res.json({
        result: true,
        productUpdated
    });

};

const productDELETE = async (req = request, res = response) => {
    const { id } = req.params;

    const dataQuery = {
        state: false,
        user: req.userAuthenticated
    };

    await Product.findByIdAndUpdate(id, dataQuery);

    res.json({
        result: true,
    });
};

module.exports = {
    getAllProductsPaginatedGET,
    getProductByIdGET,
    createProductPOST,
    editProductPUT,
    productDELETE
}