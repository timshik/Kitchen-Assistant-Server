const mongoose = require('../db/mongoose').mongoose
const userRecipeSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    recipe:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Recipe'
    },
    favorite:{
        type: Boolean,
        default: false

    },
    lastCheck:{
        type:Number
    }
})

const UserRecipeConnection = mongoose.model('UserRecipeConnection',userRecipeSchema)

module.exports = UserRecipeConnection