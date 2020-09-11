const express = require('express')
const formidable = require('formidable');
const Recipe = require('../models/recipe')
const UserRecipeConnection = require('../models/userrecipeconnection')
const RecipeTagConnection = require('../models/recipetagconnection')
const auth = require('../middlefunctions/auth')
const Ingridient = require('../models/ingridient')
const Tag = require('./../models/tag')
const upload = require('../middlefunctions/upload')
const fs = require("fs");
const imgurUploader = require('imgur-uploader');
var imgur = require('imgur')
const router = new express.Router()
// for the search
var TfIdf = require('node-tfidf');
const { result } = require('underscore');
////////////////////////

const uploadImage = async function(file) {
    let url;
    await imgurUploader(fs.readFileSync(file.path), {title: 'test'})
    .then(function(data) {
        url = data.link;
    }).catch(function(error) {
        console.log("error");
    });
    return url;
}

router.post('/api/user/recipes',auth, async(req,res)=>{
    const form = formidable({ multiples: true });
    form.parse(req, async (error, fields, files) => {
        const recipe = new Recipe({...fields, creator: req.user._id})
        if (files.image) {
            recipe.image = await uploadImage(files.image)
        }
        console.log(recipe);

        try {
            await recipe.save()
            const userRecipeConnection = new UserRecipeConnection({
                user: req.user._id,
                recipe: recipe._id
            })
            await userRecipeConnection.save()
            res.status(201).send(recipe)
        } catch (e) {
            res.status(400).send(e)
        }
    });
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
        let limit = req.query.limit === undefined ? 10 : Number(req.query.limit);
        let page = req.query.page === undefined ? 1 : Number(req.query.page);
        recipes = await Recipe.find({}).limit(limit).skip(limit * page)
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
        res.status(500).send(error)
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
        const recipe = await Recipe.findOneAndDelete({ _id: req.params.recipe_id, creator: req.user._id})
      
        if (!recipe) {
            res.status(404).send()
        }

        res.send('succes')
    } catch (e) {
        res.status(500).send(e)
    }
})
router.get('/api/user/lastrecipes/load',async(req,res)=>{
    const recipes = req.body.recipes
    var result = []
    var removed =[]
    try {
        for(let i = 0 ; i<recipes.length;i++)
        {
            
            recipe = await Recipe.findById(recipes[i])
            if(!recipe){
                removed.push(recipes[i])
            }
            else{
                result.push(recipe)
            }
            
        }

        res.status(200).send({recipes:result,removed})
    } catch (error) {
        console.log(error.toString())
        res.status(500).send(error)
    }
    
})
router.get('/api/community/search/recipe',auth,async (req,res)=>{ // need to decide witch part will weight more
    const query = req.query.search
    var tfidf = new TfIdf();
    try {
        let limit = req.query.limit === undefined ? 10 : Number(req.query.limit);
        let page = req.query.page === undefined ? 1 : Number(req.query.page);

        recipes = await Recipe.find({})
        let tags = await Tag.find({})
        const tags_map = new Map();
        tags.forEach((tag) => {
            tags_map[tag._id] = tag.title;
        });
        for(let i = 0; i < recipes.length; i++){
            let content = await parseRecipe(recipes[i],[{        // parseRecipe will parse to array of strings every recipe by the collection you send and the fields of each collection, the body of the recipe itself will be parsed automatically with the fields title and description
                collection:'ingridients',
                fields:['title','description']
            },{
                collection:'instructions',
                fields:['description','specialNotes']
            },{
                collection:'tags',
                fields:['title']
            }],
            tags_map)
            
            
            tfidf.addDocument(content)
        }

        let result = []
        tfidf.tfidfs(query, function(i, measure) {
            result.push({recipe:recipes[i], score: measure})
        });
        result.sort(compare)
        result = result.slice((page - 1) * limit, page * limit).map((obj)=> obj.recipe)
        res.send(result)
    } catch (error) {
        res.status(500).send(error.toString())
    }
})
router.post('/api/recipe/:recipe_id/image',auth,async (req,res)=>{   //upload.single('image'),
    const recipe = await Recipe.findOne({ _id: req.params.recipe_id, creator: req.user._id})

    if (!recipe) {
        return res.status(404).send()
    }
    recipe.image = await getUrlFromBase64(req.body.image)
     //recipe.image = req.file.buffer    
    await recipe.save()
    res.send()
}, (error, req,res,next)=>{
    res.status(400).send({error:error.toString()})
})
router.delete('/api/recipe/:recipe_id/image',auth,async (req,res)=>{
    const recipe = await Recipe.findOne({ _id: req.params.recipe_id, creator: req.user._id})

    if (!recipe) {
        return res.status(404).send()
    }
       recipe.image = undefined
    await recipe.save()
    res.send()
})
////////////////// helper functions

const parseRecipe = async (recipe, obj, tags_map)=>{
    try {
        const fullRecipe = await recipe.getFullDetails(tags_map);
        let content =  await parsecollections([fullRecipe.recipe],['title','description'])

        for(let i =0 ;i<obj.length;i++) {
            let parsedCollection = await parsecollections(fullRecipe[obj[i].collection],obj[i].fields)
            content = content.concat(parsedCollection)
        }

        return content
    } catch (error) {
        throw new Error(error)
    }
}

let i = 0;

const parsecollections = async(collections,fields)=>{
    let content = []
    if(collections != null){
        collections.forEach((collections)=>{
            fields.forEach((field)=>{
                if (collections !=null && field != null && field != undefined && collections[field] != undefined && collections[field] != null) {
                    content = content.concat(collections[field].split(' ').map((name) =>clean(name))) 
                }
            })
        })
    }
    return content
}


function compare( a, b ) {
    if ( a.score > b.score ){
      return -1;
    }
    if (  a.score < b.score  ){
      return 1;
    }
    return 0;
  }
  function clean(name){
      name = name.toLowerCase()
      const regex = /[.,()\s]/g;

      const result = name.replace(regex, '');

      return result
  }

  const getUrlFromBase64 = async function(base64){
    var url;
    await imgur.uploadBase64(base64)
    .then(function (json) {
        url = json.data.link;
    })
    .catch(function (err) {
        console.error(err.message);
    });
    return url
   }
module.exports = router






 
    // let parsedIngridients = await parsecollections(fullRecipe.ingridients,['title','description'])
    // let parsedInstructions = await parsecollections(fullRecipe.instructions,['description','specialNotes'])
    // let parsedTags = await parsecollections(fullRecipe.tags,['title'])
    
    // content = content.concat(parsedRecipe)
    // content =  content.concat(parsedIngridients)
    // content =  content.concat(parsedInstructions)
    // content = content.concat(parsedTags)
