const express = require('express')
const UserRecipeConnection = require('../models/userrecipeconnection')
const auth = require('../middlefunctions/auth')

const router = new express.Router()
router.post('/api/community/recipe/:recipe_id', auth, async (req, res) => {
    user_id = req.user._id
    recipe_id = req.params.recipe_id
    
    const userRecipeConnection = new UserRecipeConnection({
        ...req.body,
        user: user_id,
        recipe: recipe_id
    })

    try {
        await userRecipeConnection.save()
        
        res.status(201).send('succes')
    } catch (e) {
        res.status(400).send(e)
    }
})

router.patch('/api/user/recipe/:recipe_id/connection', auth, async (req, res) => {
    user_id = req.user._id
    recipe_id = req.params.recipe_id
    
    const updates = Object.keys(req.body)
    const allowedUpdates = ['favorite','lastCheck']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        const connection = await UserRecipeConnection.findOne({user: user_id,recipe: recipe_id})

        if (!connection) {
            return res.status(404).send()
        }

        updates.forEach((update) => connection[update] = req.body[update])
        await connection.save()
        res.send(connection)
    } catch (e) {
        res.status(400).send(e)
    }
})
router.delete('/api/user/recipe/:recipe_id/connection', auth, async (req, res) => {
    user_id = req.user._id
    recipe_id = req.params.recipe_id
    
    try {
        const connection = await UserRecipeConnection.findOneAndDelete({user: user_id,recipe: recipe_id})

        if (!connection) {
            res.status(404).send()
        }

        res.send('succes')
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router
