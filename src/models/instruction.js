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
instructionSchema.index({description:1,specialNotes:1,owner:1},{unique:true})
const Instruction = mongoose.model('Instruction',instructionSchema)
module.exports = Instruction