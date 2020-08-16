const mongoose = require('../db/mongoose').mongoose
const instructionSchema = mongoose.Schema({
    description: {
        type: String,
        required:true,
        maxlength:255
    },
    specialNotes: {
        type:String
    },
    time:{
        type:Number
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Recipe'
    }

})

const Instruction = mongoose.model('Instruction',instructionSchema)
module.exports = Instruction