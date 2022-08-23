const { response, request, query } = require('express')
const bcryptjs = require('bcryptjs')

/**Es standar usar la "U" de user en mayuscula para la instancia del modelo de DB */
const { Category } = require('../models');
const router = require('../routes/auth_routes');



const categoryPOST = async (req = request, res = response) => {
    const name = req.body.name.toUpperCase();

    const categoryonDB = await  Category.findOne({ name });
    if(categoryonDB){
        return res.status(400).json({
            result: false,
            msg: `Category ${name} already exists`
        })
    }

    const data = {
        name,
        user : req.userAuthenticated._id
    }


    const category = Category(data);
    await category.save();

    res.status(201).json({
        result: true,
        msg: "Category saved",
        category
    });

}


//getCategories - paginado - total - populate
const categoriesPaginatedGET = async (req = request, res = response) => {

    const {limit = 5, from = 0} = req.query;

    const [total, categories] = await Promise.all([
        Category.countDocuments(),
        Category.find({ state: true})
        .populate('user', 'name')
        .skip(Number(from))
        .limit(Number(limit))
    ]);

    res.json({
        result: true,
        total,
        categories
    });
}

const categoryGET = async (req = request, res = response) => {
    const id = req.params.id;
    const category = await Category.findById(id)
        .populate('user', 'name');

    res.json({
        result: true,
        category
    });
}

const categotyPUT = async(req = request, res = response) => {
    const {id} = req.params;
    const {_id, state,... categoryToUpdate } = req.body;

    //to keep names uppercased
    categoryToUpdate.name = categoryToUpdate.name.toUpperCase();
    categoryToUpdate.user = req.userAuthenticated._id;
    
    await Category.findByIdAndUpdate(id, categoryToUpdate);
    const categoryUpdated = await Category.findById(id)
        .populate('user', 'name');

    res.json({
        result: true,
        categoryUpdated
    });

};

const categoryDELETE = async (req = request, res = response) => {
    const {id} = req.params;

    const dataQuery = {
        state: false,
        user: req.userAuthenticated
    };

    await Category.findByIdAndUpdate(id, dataQuery);
    const categoryUpdated = await Category.findById(id)
        .populate('user', 'name');

    res.json({
        result: true,
        categoryUpdated
    });
};

module.exports = {
    categoryPOST,
    categoriesPaginatedGET,
    categoryGET,
    categotyPUT,
    categoryDELETE
}