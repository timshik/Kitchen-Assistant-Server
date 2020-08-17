const express = require('express')
const Recipe = require('../models/recipe')
const auth = require('../middlefunctions/auth')
const Ingridient = require('../models/ingridient')
const router = new express.Router()

router.post('/api/user/recipe/:recipe_id/ingridient',auth,async(req,res)=>{
   
    const ingridient = new Ingridient({...req.body, owner:req.params.recipe_id})
    try {
        await ingridient.save()
        res.status(201).send('succes')

    } catch (e) {
        res.status(400).send(e)
    }
})
router.get('/api/user/recipe/:recipe_id/ingridients', auth, async (req, res) => {
    try {
        console.log(req.params.recipe_id)
        const recipe = await Recipe.findById(req.params.recipe_id)
        await recipe.populate('ingridients').execPopulate()
        res.send(recipe.ingridients)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/api/user/recipe/:recipe_id/ingridient/:ingridient_id', auth, async (req, res) => {
    const recipe_id = req.params.recipe_id
    const ingridient_id = req.params.ingridient_id
    try {
       
        const ingridient = await Ingridient.findOne({ _id:ingridient_id, owner: recipe_id })
        
        if (!ingridient) {
            return res.status(404).send()
        }

        res.send(ingridient)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/api/user/recipe/:recipe_id/ingridient/:ingridient_id', auth, async (req, res) => {
    const recipe_id = req.params.recipe_id
    const ingridient_id = req.params.ingridient_id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title','description', 'amount','unit']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const ingridient = await Ingridient.findOne({ _id: ingridient_id, owner: recipe_id})

        if (!ingridient) {
            return res.status(404).send()
        }

        updates.forEach((update) => ingridient[update] = req.body[update])
        await ingridient.save()
        res.send(ingridient)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/api/user/recipe/:recipe_id/ingridient/:ingridient_id', auth, async (req, res) => {
    const recipe_id = req.params.recipe_id
    const ingridient_id = req.params.ingridient_id
    try {
        const ingridient = await Ingridient.findOneAndDelete({ _id: recipe_id, owner: ingridient_id })

        if (!ingridient) {
            res.status(404).send()
        }

        res.send("succes")
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router