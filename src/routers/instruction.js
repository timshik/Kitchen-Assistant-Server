const express = require('express')
const Recipe = require('../models/recipe')
const auth = require('../middlefunctions/auth')
const Instruction = require('../models/instruction')
const router = new express.Router()

router.post('/api/user/recipe/:recipe_id/instructions',auth,async(req,res)=>{  
    for(let i=0;i<req.body.length;i++){
        const instruction = new Instruction({...req.body[i], owner:req.params.recipe_id})
        try {
            await instruction.save()
        } catch (e) {
            return res.status(400).send(e)
        }
    }
    
    const time = await Recipe.updateTotalTime(req.params.recipe_id)
    res.status(201).send({time})
})
router.get('/api/user/recipe/:recipe_id/instructions', auth, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.recipe_id)
        await recipe.populate('instructions').execPopulate()
        res.send(recipe.instructions)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/api/user/recipe/:recipe_id/instructions/:instruction_id', auth, async (req, res) => {
    const recipe_id = req.params.recipe_id
    const instruction_id = req.params.instruction_id
    try {
        const instruction = await Instruction.findOne({ _id:instruction_id, owner: recipe_id })

        if (!instruction) {
            return res.status(404).send()
        }

        res.send(instruction)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/api/user/recipe/:recipe_id/instructions/:instruction_id', auth, async (req, res) => {
    const recipe_id = req.params.recipe_id
    const instruction_id = req.params.instruction_id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'specialNotes','time','priority']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const instruction = await Instruction.findOne({ _id: instruction_id, owner: recipe_id})

        if (!instruction) {
            return res.status(404).send()
        }

        updates.forEach((update) => instruction[update] = req.body[update])
        await instruction.save()
        const time = await Recipe.updateTotalTime(req.params.recipe_id)
        res.send({instruction,time})
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/api/user/recipe/:recipe_id/instructions/:instruction_id', auth, async (req, res) => {
    const recipe_id = req.params.recipe_id
    const instruction_id = req.params.instruction_id
    try {
        
        const instruction = await Instruction.findOneAndDelete({ _id:instruction_id , owner:recipe_id })
       
        if (!instruction) {
            res.status(404).send()
        }

        const time = await Recipe.updateTotalTime(req.params.recipe_id)
        res.send({instruction,time})
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router