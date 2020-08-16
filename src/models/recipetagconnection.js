const mongoose = require('../db/mongoose').mongoose
const RecipeTagSchema = mongoose.Schema({
    recipe:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Recipe'
    },
    tag:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Tag'
    },
    
})


const RecipeTagConnection = mongoose.model('RecipeTagConnection',RecipeTagSchema)

module.exports = RecipeTagConnection