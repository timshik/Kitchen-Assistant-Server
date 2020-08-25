const express = require('express')
const Recipe = require('../models/recipe')
const UserRecipeConnection = require('../models/userrecipeconnection')
const RecipeTagConnection = require('../models/recipetagconnection')
const auth = require('../middlefunctions/auth')
const Ingridient = require('../models/ingridient')
const Tag = require('./../models/tag')
const router = new express.Router()
// for the search
var TfIdf = require('node-tfidf');
const { result } = require('underscore');
////////////////////////

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
        const favorite = req.query.favorite  // favorite might be a string not a boolean
        const userrecipes =await UserRecipeConnection.find({user:req.user._id,favorite:favorite ==='true'})
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
router.get('/api/community/recipes',auth,async (req,res)=>{
    try {
        recipes = await Recipe.find({})
        res.status(200).send(recipes)
    } catch (error) {
        res.status(500).send(error)
    }
    
})
router.get('/api/user/recipes/:recipe_id',auth,async(req,res)=>{
   const recipe_id = req.params.recipe_id 
    try {
        const result = await Recipe.findFullDetails(recipe_id)
        res.status(200).send(result)
    } catch (error) {
        console.log(Error)
        res.status(500).send(error)
    }
//    try{
//        const recipe =  await Recipe.findById(recipe_id)
//        if(!recipe){
//            return res.status(404).send()
//        }
       
//        await recipe.populate('ingridients').execPopulate()
       
//        await recipe.populate('instructions').execPopulate()
       
//        await recipe.populate('tags').execPopulate()
//        //let tagIds = await RecipeTagConnection.find({recipe: recipe_id})
       
//        let tags =[]
//        for (let i = 0; i < recipe.tags.length; i++) {
//         console.log(recipe.tags[i])
//         tag = await Tag.findById(recipe.tags[i].tag)
//         tags.push(tag) 
//       }
      
//       res.status(200).send({recipe,ingridients:recipe.ingridients,instructions:recipe.instructions,tags}) //tags:tags
//    }catch(e){
//         res.status(500).send(e)
//    }
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
        const recipe = await Recipe.findOne({ _id: req.params.recipe_id, creator: req.user._id})
      
        if (!recipe) {
            res.status(404).send()
        }

        res.send('succes')
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/api/community/search/recipe',async (req,res)=>{ // need to decide witch part will weight more
    const query = req.query.search
    var tfidf = new TfIdf();
    try {
        
        recipes = await Recipe.find({})
        for(let i =0 ;i<recipes.length;i++){
            let content = []
            const fullRecipe = await Recipe.findFullDetails(recipes[i]._id) 
            content = content.concat(fullRecipe.recipe.title.split(' '))
            content = content.concat(fullRecipe.recipe.description.split(' '))
            fullRecipe.ingridients.forEach((ingridient)=>{
                content = content.concat(ingridient.title.split(' '))
                content = content.concat(ingridient.description.split(' '))

            })
            fullRecipe.instructions.forEach((instruction)=>{
                content = content.concat(instruction.description.split(' '))
                content = content.concat(instruction.specialNotes.split(' '))
            })
            fullRecipe.tags.forEach((tag)=>{
                content.concat(tag.title.split(' '))
            })
            tfidf.addDocument(content)
            console.log(content)
        }
        let result = []
        tfidf.tfidfs(query, function(i, measure) {
            result.push({recipe:recipes[i], score: measure})
            console.log('document #' + i + ' is ' + measure);
        });
        console.log(result)
        result.sort(compare)
        
        res.send(result)
    } catch (error) {
        res.status(500).send()
    }
})
////////////////// helper functions

const parseRecipe = (recipe)=>{
    
}
function compare( a, b ) {
    if ( a.score > b.score ){
      return -1;
    }
    if (  a.score > b.score  ){
      return 1;
    }
    return 0;
  }
  
  
module.exports = router