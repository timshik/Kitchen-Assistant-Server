
// needs the collection you adding to the fields of the collections you adding and the owner if there is 
const addFew = async(Collection,body,params)=>{
    for(let i=0;i<body.length;i++){
        const collection = new Collection({...body[i], ...params})
        await collection.save()
    }
}

const addFewTags = async(Collection, connection, tags, recipe) => {
    let db_tags = await Collection.find({})
    const tags_map = new Map();
    db_tags.forEach((tag) => {
        tags_map[tag.title] = tag._id;
    });

    for (let i = 0; i < tags.length; i++) {
        if (tags_map[tags[i]] == null) {
            tag = new Collection({title: tags[i]})
            await tag.save()
        } else {
            tag = tags_map[tags[i]];
        }

        const recipeTagConnection = new connection({
            recipe:recipe.owner,
            tag:tag
        })

        await recipeTagConnection.save()
    }
}

const getOne = async(Collection,params)=>{
    const collection = await Collection.findOne(params)
    if (!collection) {
        throw new Error('no such collection')
    }

    return collection
   
}
const getFew = async(Collection,params)=>{
    const collections = await Collection.find(params)
    return collections
}
//needs the collection you updating, the details of the collection you want to upsdate  the fields of the collections you updating and the list of allowed fields to update 
const update = async (Collection,params,body, allowedUpdates)=>{
    console.log(body)
    const updates = Object.keys(body)
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
         throw new Error ('Invalid updates!') 
    }
    const collection = await Collection.findOne(params)
    console.log(collection)
    if (!collection) {
        throw new Error('no such collection');
    }

    updates.forEach((update) => collection[update] = body[update])
    console.log(collection)
    await collection.save()
    return collection

}
//needs the collection you removing and fields to identify the collection you removing
const remove = async (Collection,params) =>{
    const collection = await Collection.findOneAndDelete(params)
    if (!collection) {
        throw new Error('no such collection');
    }
}


module.exports =  {addFew,getOne,getFew,update,remove,addFewTags}