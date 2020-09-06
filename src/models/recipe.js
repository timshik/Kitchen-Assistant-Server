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

recipeSchema.methods.getFullDetails = async function(tags_map = null) {
    try {
        await this.populate('ingridients')
                .populate('instructions')
                .populate('tags').execPopulate()

        let tags =[]
        if (tags_map == null) {
            for (let i = 0; i < this.tags.length; i++) {
                tag = await Tag.findById(this.tags[i].tag)
                tags.push(tag) 
            }
        } else {
            for (let i = 0; i < this.tags.length; i++) {
                tags.push(tags_map[this.tags[i].tag]) 
            }
        }
        
        return ({recipe: this, ingridients:this.ingridients, instructions:this.instructions, tags}) //tags:tags
    }catch(e){
        throw new Error(e)
    } 
}

recipeSchema.statics.findFullDetails = async (recipe_id) => {
        const recipe = await Recipe.findById(recipe_id)
        if (recipe != null) {
            return await recipe.getFullDetails();
        }

        throw new Error("RECIPE_NOT_EXISTS");
}
recipeSchema.statics.updateTotalTime = async function (recipe_id){  
    const instructions = await Instruction.find({owner:recipe_id})
    const recipe =await Recipe.findById(recipe_id)
    
    let sum = 0
    instructions.forEach((instruction)=>{
        sum = sum + instruction.time
    })
   
   recipe['totalTime'] = sum
   await recipe.save()
   return sum
}
const Recipe = mongoose.model('Recipe', recipeSchema)
module.exports = Recipe   

    
    
