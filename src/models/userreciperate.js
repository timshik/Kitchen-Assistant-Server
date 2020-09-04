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
userRecipeRateSchema.methods.updateRating = async function (){  
    console.log('hi')
    const userRecipeRate = await UserReciperate.find({recipe:this.recipe})
    
    let avg = 0
    userRecipeRate.forEach((rate)=>{
        avg = avg + rate.rate
    })
    if(userRecipeRate.length!=0){
        avg = avg / (userRecipeRate.length)
    }
    
   
   const recipe = await Recipe.findById(this.recipe)
   recipe['rate'] = avg
   await recipe.save()
   
   
}
userRecipeRateSchema.post('save', async function (next) {
    await this.updateRating()
     
})
userRecipeRateSchema.post('remove', async function (next) {  // not working the function isnt called before deleting 
await this.updateRating()})
    //     console.log('hi')
//     const userRecipeRate = await UserReciperate.find({recipe:this.recipe})
    
//     let avg = 0
//     if(!userRecipeRate.length == 1){
//         userRecipeRate.forEach((rate)=>{
//             avg = avg + rate.rate
//         })
//        avg = avg-this.rate / (userRecipeRate.length-1)
//     }
//     console.log(avg)
//    const recipe = await Recipe.findById(this.recipe)
//    recipe['rate'] = avg
//    await recipe.save()
//    next()
    
//})
userRecipeRateSchema.post('update', async function (next) {
    await this.updateRating()
     
})
userRecipeRateSchema.index({user:1,recipe:1,},{unique:true})
const UserReciperate = mongoose.model('UserRecipeRate',userRecipeRateSchema)

module.exports = UserReciperate