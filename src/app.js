const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const recipeRouter = require('./routers/recipe')
const ingridientRouter = require('./routers/ingridient')
const instructionRouter = require('./routers/instruction')
const userreciperateRouter = require('./routers/userrecipesrate')
const userRecipeConnectionRouter = require('./routers/userrecipeconnection')
const tag = require('./routers/tag')
const recipeTagConnection = require('./routers/recipetagconnection')

const app = express()
const port = process.env.PORT || 3000

app.get('/', function(req, res) {
    res.send("he!");
})

app.use(express.json())
app.use(userRouter)
app.use(recipeRouter)
app.use(ingridientRouter)
app.use(instructionRouter)
app.use(userreciperateRouter)
app.use(userRecipeConnectionRouter)
app.use(tag)
app.use(recipeTagConnection)
app.listen(port, ()=>{
    console.log('Server is up')
})

//const Recipe = require('./models/recipe')
//const UserRecipeRate = require('./models/userreciperate')

//     async function getRating(recipe_id){ 
//         const userRecipeRate = await UserRecipeRate.find({user,recipe})
//     const avg = 0
//     userRecipeRate.forEach((rate)=>{
//         avg = avg + rate.rate
//     })
//    avg = avg / userRecipeRate.length
//    console.log(avg)
//         }
// getRating('5f3979483bd67a4e60481dbf','5f3a5055c9674a5be0354eba')

