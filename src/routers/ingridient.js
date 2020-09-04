const express = require('express')
const Recipe = require('../models/recipe')
const Ingridient = require('../models/ingridient')
const auth = require('../middlefunctions/auth')
const addFew = require('../helper/methods').addFew
const update = require('../helper/methods').update
const remove = require('../helper/methods').remove
const getOne = require('../helper/methods').getOne
const getFew = require('../helper/methods').getFew
const router = new express.Router()
router.post('/api/user/recipe/:recipe_id/ingridients',auth,async(req,res)=>{  // need to make this code reusble later
    try {
        await addFew(Ingridient,req.body,{owner:req.params.recipe_id})
        res.status(201).send('succes')
    } catch (error) {
        res.status(400).send({error:error.toString()})
    }
})
    // for(let i=0;i<req.body.length;i++){
    //     const ingridient = new Ingridient({...req.body[i], owner:req.params.recipe_id})
    //     try {
    //         await ingridient.save()
    //   } catch (e) {
    //       return res.status(400).send(e)
    //     }
    // }
    // res.status(201).send('succes')


router.get('/api/user/recipe/:recipe_id/ingridients', auth, async (req, res) => {
    try {
        const ingridients = await getFew(Ingridient,{owner:req.params.recipe_id})
        res.send(ingridients)
    } catch (error) {
        res.status(400).send({error:error.toString()})
    }
})
    
    
    
    // try {
        
    //     const recipe = await Recipe.findById(req.params.recipe_id)
    //     await recipe.populate('ingridients').execPopulate()
    //     res.send(recipe.ingridients)
    // } catch (e) {
    //     res.status(500).send()
    // }


router.get('/api/user/recipe/:recipe_id/ingridients/:ingridient_id', auth, async (req, res) => {
    try {
        const ingridient = await getOne(Ingridient,{ _id:req.params.ingridient_id, owner: req.params.recipe_id })
        res.send(ingridient)
    } catch (error) {
        res.status(400).send({error:error.toString()})
    }
    
})
    // const recipe_id = req.params.recipe_id
    // const ingridient_id = req.params.ingridient_id
    // try {
       
    //     const ingridient = await Ingridient.findOne({ _id:ingridient_id, owner: recipe_id })
        
    //     if (!ingridient) {
    //         return res.status(404).send()
    //     }

    //     res.send(ingridient)
    // } catch (e) {
    //     res.status(500).send()
    // }


router.patch('/api/user/recipe/:recipe_id/ingridients/:ingridient_id', auth, async (req, res) => {
    try {
        const ingridient = await update(Ingridient,{ _id: req.params.ingridient_id, owner: req.params.recipe_id},req.body,['title','description', 'amount','unit','priority'])
        res.status(200).send(ingridient)
    } catch (error) {
        res.status(400).send({error:error.toString()})
    }
})
    
    // const updates = Object.keys(req.body)
    // const allowedUpdates = ['title','description', 'amount','unit','priority']
    // const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    // if (!isValidOperation) {
    //     return res.status(400).send({ error: 'Invalid updates!' })
    // }

    // try {
    //     const ingridient = await Ingridient.findOne({ _id: ingridient_id, owner: recipe_id})

    //     if (!ingridient) {
    //         return res.status(404).send()
    //     }

    //     updates.forEach((update) => ingridient[update] = req.body[update])
    //     await ingridient.save()
    //     res.send(ingridient)
    // } catch (e) {
    //     res.status(400).send(e)
    // }


router.delete('/api/user/recipe/:recipe_id/ingridients/:ingridient_id', auth, async (req, res) => {
    try {
        await remove(Ingridient,{ _id: req.params.ingridient_id, owner: req.params.recipe_id})
        res.status(200).send('succes')
    } catch (error) {
        res.status(400).send({error:error.toString()})
    }
})  
    
    // try {
    //     const ingridient = await Ingridient.findOneAndDelete({ _id:ingridient_id , owner:recipe_id  })

    //     if (!ingridient) {
    //         res.status(404).send()
    //     }

    //     res.send("succes")
    // } catch (e) {
    //     res.status(500).send()
    // }


module.exports = router