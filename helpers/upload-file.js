const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadFileHelper = ( files , validExtensions = ['jpg', 'jpeg', 'png', 'gif'], folder = '') => {
    return new Promise((resolve, reject) => {
         /// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        const { file } = files;
        const splittedName = file.name.split('.');
    
        console.log(splittedName);
    
        const extension = splittedName[splittedName.length - 1];
    
        if(!validExtensions.includes(extension)){
            return reject(`No a valid file, files permitted: ${validExtensions}`);
        }
        
        const filename = uuidv4() + '.' + extension;
        console.log(filename);
    
        ///_dirname apunta a la carpeta donde se encuentra este archivo, "controllers/" en este caso
        const uploadPath = path.join( __dirname, '../uploads/', folder, filename);
     
        // Use the mv() method to place the file somewhere on your server
        file.mv(uploadPath,  function(err) {
            if (err) {
                reject(err);
            }
            resolve(filename);
        });
    });
}


module.exports = {
    uploadFileHelper
}

