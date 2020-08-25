const express = require('express')
const auth = require('../middlefunctions/auth')
const RecipeTagConnection = require('../models/recipetagconnection')

const router = new express.Router()
router.post('/api/user/recipe/:recipe_id/tags', auth, async (req, res) => {
    
    recipe_id = req.params.recipe_id
    // we can check if the tags exists at all, for now we trust the application
    for(let i=0;i<req.body.length;i++){
        const tagId = req.body[i].tag_id

        const recipeTagConnection = new RecipeTagConnection({
       
            tag:tagId,
            recipe: recipe_id
        })
        
        try {
            await recipeTagConnection.save()
        
            
        } catch (e) {
            return res.status(400).send(e)
        }
    }
    res.status(201).send('succes')
})


router.delete('/api/user/recipe/:recipe_id/tags', auth, async (req, res) => {
    
    recipe_id = req.params.recipe_id
    for(let i=0;i<req.body.length;i++){
        try {
            const connection = await RecipeTagConnection.findOneAndDelete({tag: req.body[i].tag,recipe: recipe_id})

            if (!connection) {
                res.status(404).send()
            }

            
        } catch (e) {
           return res.status(500).send()
        }
    }
    res.send('succes')
})

module.exports = router
