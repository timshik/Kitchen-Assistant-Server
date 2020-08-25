const mongoose = require('../db/mongoose').mongoose
const ingredientSchema = mongoose.Schema({
    title:{
        type: String,
        required:true,
        maxlength:50
    },
    description:{
        type:String,
        maxlength:255
    },
    amount:{
        type:Number,
        required:true
    },
    unit: {
        type: String,
        required:true,
        enum : ['piece','kilos','grams','spoons'],// needs to change acoording to the app
        default: 'pieces'
    },
    priority:{
        type:Number,
        min:1,
        required:true,
        unique: true

    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Recipe'
    }
})
ingredientSchema.index({title:1,description:1,owner:1},{unique:true})
const Ingridient = mongoose.model('Ingridient', ingredientSchema)
module.exports = Ingridient