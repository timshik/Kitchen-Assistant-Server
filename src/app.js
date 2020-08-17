const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const recipeRouter = require('./routers/recipe')
const ingridientRouter = require('./routers/ingridient')
const instructionRouter = require('./routers/instruction')

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
app.listen(port, ()=>{
    console.log('Server is up')
})

// const Recipe = require('./models/recipe')
// const UserRecipeConnection = require('./models/userrecipeconnection')
// const main = async()=>{
//     const userrecipes =await UserRecipeConnection.findOne({user:'5f3979483bd67a4e60481dbf'})
//     console.log(userrecipes)
//      await userrecipes.populate('recipe').execPopulate()
//     console.log(userrecipes)

// }
// main()

