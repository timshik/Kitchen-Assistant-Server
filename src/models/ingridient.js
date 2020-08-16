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
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Recipe'
    }
})

const Ingridient = mongoose.model('Ingridient', ingredientSchema)
module.exports = Ingridient