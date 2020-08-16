const mongoose = require('../db/mongoose').mongoose
const RecipeTagConnection = require('./recipetagconnection')


const tagSchema =mongoose.Schema( {
    title: {
        type: String,
        required:true,
        maxlength: 50
    }
})
tagSchema.virtual('recepies', {
    ref: 'RecipeTagConnection',
    localField: '_id',
    foreignField: 'tag'
})

tagSchema.pre('remove', async function (next) {
    const tag = this
    await RecipeTagConnection.deleteMany({ tag: tag._id })
    
   
    next()
})

const Tag = mongoose.model('Tag',tagSchema)
module.exports = Tag