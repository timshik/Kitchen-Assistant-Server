const mongoose = require('../db/mongoose').mongoose
const validator = require('validator')
const Ingridient = require('./ingridient')
const Instruction = require('./instruction')
const UserRecipeConnection = require('./userrecipeconnection')
const UserRecipeRate = require('./userreciperate')
const RecipeTagConnection = require('./recipetagconnection')
const Tag = require('./tag')
const User = require('./user')

const recipeSchema = new mongoose.Schema({
    title:{
        type: String,
        required:true,
        trim:true,
        maxlength:50
    },
    description: {
        type: String,
        required:true,
        trim:true,
        maxlength: 255
    },
    totalTime:{
        type: Number,
        
    },
    rate:{
        type:Number,
        default: 0
    },
    edate: { // edit date
        type:Number,
        
    },
    adate: { // add date
        type:Number,
        required :true
    },
    status:{
        type: Boolean,
        default:true
    },
    creator:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    image:{
        type:Buffer
    }

})
recipeSchema.methods.toJSON = function () {
    const recipe = this
    const recipeObject = recipe.toObject()
    return recipeObject
}

recipeSchema.virtual('users', {
    ref: 'UserRecipeConnection',
    localField: '_id',
    foreignField: 'recipe'
})
recipeSchema.virtual('userRates', {
    ref: 'UserRecipeRate',
    localField: '_id',
    foreignField: 'recipe'
})
recipeSchema.virtual('tags', {
    ref: 'RecipeTagConnection',
    localField: '_id',
    foreignField: 'recipe'
})
recipeSchema.virtual('ingridients', {
    ref: 'Ingridient',
    localField: '_id',
    foreignField: 'owner'
})
recipeSchema.virtual('instructions', {
    ref: 'Instruction',
    localField: '_id',
    foreignField: 'owner'
})

recipeSchema.pre('remove', async function (next) {
    const recipe = this
    await Ingridient.deleteMany({ owner: recipe._id })
    await Instruction.deleteMany({owner:recipe._id})
    await UserRecipeConnection.deleteMany({ recipe: recipe._id })
    await UserRecipeRate.deleteMany({recipe:recipe._id})
    await RecipeTagConnection.deleteMany({ recipe: recipe._id })
   
    next()
})
recipeSchema.statics.findFullDetails = async (recipe_id) => {
    
    
    try{
        const recipe =  await Recipe.findById(recipe_id)
        if(!recipe){
            throw new Error('file not found') ;
        }
        
        await recipe.populate('ingridients').execPopulate()
        
        await recipe.populate('instructions').execPopulate()
        
        await recipe.populate('tags').execPopulate()
        
        
        let tags =[]
        for (let i = 0; i < recipe.tags.length; i++) {
         
         tag = await Tag.findById(recipe.tags[i].tag)
         tags.push(tag) 
       }
      
       return ({recipe,ingridients:recipe.ingridients,instructions:recipe.instructions,tags}) //tags:tags
    }catch(e){
        throw new Error(e)
    }
}
const Recipe = mongoose.model('Recipe', recipeSchema)
module.exports = Recipe   

    
    
