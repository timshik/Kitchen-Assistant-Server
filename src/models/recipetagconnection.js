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

RecipeTagSchema.index({recipe:1,tag:1},{unique:true})
const RecipeTagConnection = mongoose.model('RecipeTagConnection',RecipeTagSchema)

module.exports = RecipeTagConnection