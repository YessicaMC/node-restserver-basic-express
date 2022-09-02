
const { response, request, query, json } = require('express');

const { uploadFileHelper } = require('../helpers/');
const {User, Product} = require('../models')
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2

cloudinary.config(process.env.CLOUDINARY_URL);

const uploadFile = async (req = request, res = response) => {

    console.log(req.files);

    //Object.keys(req.files) => buscar recursivamente en el request
    // if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {
    //     return res.status(400).json({msg: 'No files were uploaded.'});
    // }

    try{
        // const filename = await uploadFileHelper(req.files,  ['txt', 'md'], 'textos');
        const filename = await uploadFileHelper(req.files,  undefined, 'imgs');
        return res.json({
            msg: 'File uploaded',
            file: filename
        });
    }catch (error){
        return res.status(400).json({
            msg: 'Cannot upload file',
            error
        });
    }

}


const updateImage = async (req = request, res = response) => {

    const {collection, id} = req.params;
    let model;

    switch(collection){
        case 'users':
            model = await User.findById(id);
            if(!model){
                return res.status(400).json({
                    msg: `No user with ${id} has found`
                });
            }
            break;
        case 'products':
            model = await Product.findById(id);
            if(!model){
                return res.status(400).json({
                    msg: `No product with ${id} has found`
                });
            }
            break;
        default:
            return res.status(500).json({
                msg: 'Missing validation'
            })
    }

    //limpiar imagenes previas
    try{
        if(model.image){
            const previousImagePath = path.join(__dirname, '../uploads/', collection, model.image)
            console.log(previousImagePath);
            if( fs.existsSync(previousImagePath) ){
                fs.unlinkSync(previousImagePath);
            }
        }
    }catch(error){

    }

    const filename = await uploadFileHelper(req.files,  undefined, collection);
    model.image = filename;
    await model.save();

    res.json(
        model
    );

}

const updateAndUploadImage = async (req = request, res = response) => {

    const {collection, id} = req.params;
    let model;

    switch(collection){
        case 'users':
            model = await User.findById(id);
            if(!model){
                return res.status(400).json({
                    msg: `No user with ${id} has found`
                });
            }
            break;
        case 'products':
            model = await Product.findById(id);
            if(!model){
                return res.status(400).json({
                    msg: `No product with ${id} has found`
                });
            }
            break;
        default:
            return res.status(500).json({
                msg: 'Missing validation'
            })
    }

    //limpiar imagenes previas
    try{
        if(model.image){
            //Delete image from cloudinary
            const pathComponents = model.image.split('/');
            const filename = pathComponents[pathComponents.length - 1];
            const [ public_id ] = filename.split('.');
            // console.log(public_id); 
            cloudinary.uploader.destroy(public_id);
        }
    }catch(error){
        console.log(error);
    }

    const { tempFilePath } = req.files.file;
    const {secure_url} = await cloudinary.uploader.upload(tempFilePath);

    // res.json({
    //     resp
    // });

    model.image = secure_url;
    await model.save();

    res.json(
        model
    );

}; 

const getFileUrl = async (req = request, res = response) => {

    const  {collection, id} = req.params;

    let model;

    switch(collection){
        case 'users':
            model = await User.findById(id);
            if(!model){
                return res.status(400).json({
                    msg: `No user with ${id} has found`
                });
            }
            break;
        case 'products':
            model = await Product.findById(id);
            if(!model){
                return res.status(400).json({
                    msg: `No product with ${id} has found`
                });
            }
            break;
        default:
            return res.json({
                msg: 'Placeholder'
            });
    }

    if(model.image) {
        const imageLocalPath = path.join(__dirname, '../uploads/', collection, model.image)
        if( fs.existsSync(imageLocalPath) ){
            //Regresaria la imagen se pede utilizar en html como http://localhost:8081/api/uploads/products/62f7b48137f56f2015a05517
            return res.sendFile(imageLocalPath);
        }
    }

    const placeholderLocalPath = path.join(__dirname, '../assets/no-image.jpg')
    return res.sendFile(placeholderLocalPath);
}



module.exports = {
    uploadFile,
    updateImage, //No usaremos esto
    getFileUrl,
    updateAndUploadImage
}