const express = require('express')
const formidable = require('express-formidable');
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

// Multipart form handle:
app.use(formidable());
