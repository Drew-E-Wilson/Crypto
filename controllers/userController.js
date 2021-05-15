const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Favorited = require('../models/FavoritedPage');
const { jsonAuth, auth } = require('./authController');

router.get('/', auth, (req, res) => {
    console.log(res.locals)
    const userQuery = User.find({}).select('-password').populate('favoritedPage')
    userQuery.exec((err, foundUsers) => {
        if (err) {
            console.log(err);
            res.status(401).json({ msg: err.message })
        } else {
            res.status(200).json(foundUsers)
        }
    })
})

// Route that add favoritedPage to general API
router.post('/addFavoritedPage', jsonAuth, (req, res) =>{
    console.log(res.locals, "AddFavoritedPage")
    console.log(req.body)
    const favorited = req.body
    const addFavoritedQuery = User.findOneAndUpdate({ username: res.locals.user }, { $addToSet: { favoritedPage: favorited._id }}, {new: true})
    addFavoritedQuery.exec((err, updatedUser) => {
        if (err){
            res.status(400).json({
                msg: err.message
            })
        } else {
            res.status(200).json({
                msg: `Updated ${res.locals.user} with ${favorited.name}`
            })
        }
    })
})
// Add favoritedPage to a user
router.post('/addFavoritedPage/:favorited/:username', auth, (req, res) =>{
    const favoritedPageQuery = Favorited.findOne({ name: req.params.favorited })
    favoritedPageQuery.exec(( err, favorited ) => {
        if(err){
            res.status(400).json({
                msg: err.message
            })
        } else {
            const addBookmarkQuery = User.findOneAndUpdate({ username: req.params.username }, { $addToSet: { favoritedPage: favorited._id }}, {new: true})
            addBookmarkQuery.exec((err, updatedUser) => {
                if(err){
                    res.status(400).json({
                        msg: err.message
                    }) 
                } else {
                    console.log(updatedUser);
                    res.status(200).json({
                        msg: `Updated ${updatedUser.username} with the Crypto ${favorited.name} `
                    })
                }
            })
        }
    })
})


//Route that shows all favorited Pages for a specific user
router.get('/:username', auth, (req, res) => {
    const userQuery = User.findOne({ username: req.params.username.toLowerCase() }).select('-password').populate('favoritedPage')
    userQuery.exec((err, foundUser) => {
        if (err) {
           res.status(400).json({
               msg: err.message
           }) 
        } else {
            res.status(200).json(foundUser)
        }
    })
})


module.exports = router