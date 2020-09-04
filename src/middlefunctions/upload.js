const multer = require('multer')
const upload = multer({
    limits: {
        fileSize: 5000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|png|jpeg)$/)){
            return cb(new Error('file must be png/jpg/jpeg'))
        }
        
        cb(undefined,true )
    }
})
module.exports = upload