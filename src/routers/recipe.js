const express = require('express')
const Recipe = require('../models/recipe')
const UserRecipeConnection = require('../models/userrecipeconnection')
const RecipeTagConnection = require('../models/recipetagconnection')
const auth = require('../middlefunctions/auth')
const Ingridient = require('../models/ingridient')
const router = new express.Router()

router.post('/api/user/recipes',auth, async(req,res)=>{
    const recipe = new Recipe({...req.body, creator: req.user._id})
        
    try {
        await recipe.save()
        const userRecipeConnection = new UserRecipeConnection({
            user: req.user._id,
            recipe: recipe._id
        })
        await userRecipeConnection.save()
        res.status(201).send('succes')
    } catch (e) {
        res.status(400).send(e)
    }
})
router.get('/api/user/recipes',auth,async(req,res)=>{
    try {
        const userrecipes =await UserRecipeConnection.find({user:req.user._id})
        if(!userrecipes){
            return res.status(404).send()
        }
        
        for (let i = 0; i < userrecipes.length; i++) {
            await userrecipes[i].populate('recipe').execPopulate()
            userrecipes[i] = userrecipes[i].recipe
          }
       
        res.status(200).send(userrecipes)
    } catch (error) {
        res.status(500).send(error)
    }
})
router.get('/api/user/recipe/:recipe_id',auth,async(req,res)=>{
   const recipe_id = req.params.recipe_id 

   try{
       const recipe =  await Recipe.findById(recipe_id)
       if(!recipe){
           return res.status(404).send()
       }
       await recipe.populate('ingridients').execPopulate()
       await recipe.populate('instructions').execPopulate()
       const tags = RecipeTagConnection.find({recipe: recipe_id})
       for (let i = 0; i < tags.length; i++) {
        await tags[i].populate('tag').execPopulate()
        tags[i] = tags[i].tag
      }
      res.status(200).send({...recipe,tags}) //tags:tags
   }catch(e){
        res.status(500).send(e)
   }
})
router.patch('/api/user/recipes/:recipe_id',auth,async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title','description','adate','status' ]
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation){
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        
        const recipe = await Recipe.findOne({ _id: req.params.recipe_id, creator: req.user._id})

        if (!recipe) {
            return res.status(404).send()
        }

        updates.forEach((update) => recipe[update] = req.body[update])
        await recipe.save()
        res.send('succes')
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/api/user/recipes/:recipe_id',auth, async(req,res)=>{
   
    try {
        const recipe = await Recipe.findByIdAndDelete(req.params.recipe_id )
      
        if (!recipe) {
            res.status(404).send()
        }

        res.send('succes')
    } catch (e) {
        res.status(500).send(e)
    }
})


module.exports = router