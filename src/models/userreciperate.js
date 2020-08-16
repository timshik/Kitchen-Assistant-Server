const mongoose = require('../db/mongoose').mongoose
const userRecipeRateSchema = mongoose.Schema({
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
    rate:{
        type: Number,
        required:true,
        min: 1,
        max: 5
    }
})

const UserReciperate = mongoose.model('UserRecipeRate',userRecipeRateSchema)

module.exports = UserReciperate