const mongoose = require('../db/mongoose').mongoose
const Recipe = require('./recipe')
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
userRecipeRateSchema.methods.updateRating = async function (){  // update rating of a recipe every time,not checke yet
    const userRecipeRate = await UserReciperate.find({recipe:this.recipe})
    let avg = 0
    userRecipeRate.forEach((rate)=>{
        avg = avg + rate.rate
    })
   avg = avg / userRecipeRate.length
   console.log(avg)
   console.log(this.recipe)
   const recipe = await Recipe.findById(this.recipe)
   console.log(recipe)
   recipe['rate'] = avg
   await recipe.save()

}
userRecipeRateSchema.pre('save', async function (next) {
    this.updateRating()
     next()
})
userRecipeRateSchema.pre('remove', async function (next) {
    await this.updateRating()
    next()
})
userRecipeRateSchema.pre('update', async function (next) {
    await this.updateRating()
     next()
})

const UserReciperate = mongoose.model('UserRecipeRate',userRecipeRateSchema)

module.exports = UserReciperate