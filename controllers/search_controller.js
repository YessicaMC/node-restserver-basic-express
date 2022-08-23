const { response } = require('express');
const { User, Product, Category, Role } = require('../models');
const { ObjectId } = require('mongoose').Types;


const allowedCollections = [ 
    'users',
    'products',
    'categories',
    'roles'
];

const searchUsers = async ( term = '', res = response) => {
    const isMongoId = ObjectId.isValid(term);
    if(isMongoId){
        const user = await User.findById(term);
        return res.json({ 
            results : (user) ? [ user ] : []
        });
    }

    const regexp = new RegExp(term, 'i')
    const users = await User.find({ 
        $or: [
            {name: regexp},
            {email: regexp}
        ],
        $and: [
            {state: true}
        ]
    });
    res.json({
        results: users
    });
}

const searchProducts = async ( term = '', res = response) => {
    const isMongoId = ObjectId.isValid(term);
    if(isMongoId){
        const product = await Product.findById(term)
            .populate('type', 'name');
        return res.json({ 
            results : (product) ? [ product ] : []
        });
    }

    //{ type: ObjectId('62f3b139e9e9cd6b48583bfd')}

    const regexp = new RegExp(term, 'i')
    const products = await Product.find({ 
        $or: [
            {name: regexp},
            {description: regexp}
        ],
        $and: [
            {state: true}
        ]
    })
        .populate('type', 'name');
    res.json({
        results: products
    });
}

const searchCategories = async ( term = '', res = response) => {
    const isMongoId = ObjectId.isValid(term);
    if(isMongoId){
        const category = await Category.findById(term);
        return res.json({ 
            results : (category) ? [ category ] : []
        });
    }
    const regexp = new RegExp(term, 'i')
    const categories = await Category.find({ 
            name: regexp, state: true,
    });
    res.json({
        results: categories
    });
}

const searchRoles= async ( term = '', res = response) => {
    const isMongoId = ObjectId.isValid(term);
    if(isMongoId){
        const role = await Role.findById(term);
        return res.json({ 
            results : (role) ? [ role ] : []
        });
    }
    const regexp = new RegExp(term, 'i')
    const roles = await Role.find({ 
        $or: [
            {role: regexp},
        ]
    });
    res.json({
        results: roles
    });
}

const searchGET = async (req, res = response) => {

    const {collection, term} = req.params;

    if( !allowedCollections.includes(collection)){
        return res.status(400).json({
            msg: 'La colección no existe o no está permitida'
        });
    }

    switch (collection) {
        case 'users':
            searchUsers(term, res);
            break;
        case 'products':
            searchProducts(term, res);
            break;
        case 'categories':
            searchCategories(term, res);
            break;
        case 'roles': 
            searchRoles(term, res);
            break;
        default:
            break;
    }
    
}

module.exports = {
    searchGET
}