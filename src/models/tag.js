const mongoose = require('../db/mongoose').mongoose
const RecipeTagConnection = require('./recipetagconnection')


const tagSchema =mongoose.Schema( {
    title: {
        type: String,
        unique: true,
        required:true,
        maxlength: 50
    }
})
tagSchema.virtual('recipes', {
    ref: 'RecipeTagConnection',
    localField: '_id',
    foreignField: 'tag'
})
tagSchema.statics.findTagByName = async function(name){
    tag = await Tag.findOne({title:name})
    return tag
}
tagSchema.pre('remove', async function (next) {
    const tag = this
    await RecipeTagConnection.deleteMany({ tag: tag._id })
    
   
    next()
})

const Tag = mongoose.model('Tag',tagSchema)
module.exports = Tag