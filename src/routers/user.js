const express = require('express')
const formidable = require('formidable');
const User = require('../models/user')
const auth = require('../middlefunctions/auth')
const router = new express.Router()
const upload = require('../middlefunctions/upload')
const imgurUploader = require('imgur-uploader');
const fs = require("fs");
router.post('/api/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

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

router.post('/api/users/login', async (req, res) => {
   
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/api/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/api/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/api/users/profile', auth, async (req, res) => {
    res.send(req.user)
})

router.patch('/api/users/profile', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/api/users/profile', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.post('/api/user/me/avatar',auth, async (req,res)=>{
    const form = formidable({ multiples: true });
    form.parse(req, async (error, fields, files) => {
        req.user.avatar = await uploadImage(files.image);
        await req.user.save()
        res.send({avatar: req.user.avatar})
    })
}, (error, req, res, next)=>{
    console.log(error)
    res.status(400).send({error:error.toString()})
})
router.delete('/api/user/me/avatar',auth,async (req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

//no need for now
// router.get('/api/users/:id/avatar',async (req,res)=>{
//     try {
//         const user = await User.findById(req.params.id)
//         if(!user|!user.avatar){
//             throw new Error()
//         }

//         res.set('Content-Type','image/jpg')
//         res.send(user.avatar)
//     } catch (error) {
//         res.status(404).send()
//     }
// })
module.exports = router