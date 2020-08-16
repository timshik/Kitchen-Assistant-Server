const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')



const app = express()
const port = process.env.PORT || 3000

app.get('/', function(req, res) {
    res.send("he!");
})

app.use(express.json())
app.use(userRouter)

app.listen(port, ()=>{
    console.log('Server is up')
})

// const User = require('./models/user')
// const Recipe = require('./models/recipe')
// const Tag = require('./models/tag')
// const Ingridient = require('./models/ingridient')
// const Instruction = require('./models/instruction')

// const test = async(tag,ingridient,instruction)=>{
//     const tag1 = new Tag(tag)
//    // const ingridient1 = new Ingridient(ingridient)
//     //const instruction1 = new Instruction(instruction)
//     //await tag1.save()
//     //await ingridient1.save()
//     await instruction1.save()
//     console.log(ingridient1)
//     console.log(tag1)
//     console.log(instruction1)
// }
// test()


