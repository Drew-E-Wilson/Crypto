const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Favorited = require('../models/FavoritedPage');
const { jsonAuth, auth } = require('./authController');

router.get('/', (req, res) => {
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


router.get('/favoritedPages/', async (req, res) => {

    try {
        const usersFavorited = await Favorited.find({});
        res.status(200).json(usersFavorited)
    }catch(error){
        res.status(400).json({
            msg: error.message
        })
    }
})



// Route that add favoritedPage to general API
router.post('/addFavoritedPage', auth, (req, res) =>{
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
router.post('/addFavoritedPage/:favorited/:username',  (req, res) =>{
    const favoritedPageQuery = Favorited.findOne({ _id: req.params.favorited })
    favoritedPageQuery.exec(( err, favorited ) => {
        if(err){
            res.status(400).json({
                msg: err.message
            })
        } else {
            const addFavoritedQuery = User.findOneAndUpdate({ username: req.params.username }, { $addToSet: { favoritedPage: favorited._id }}, {new: true})
            addFavoritedQuery.exec((err, updatedUser) => {
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


//Route that shows all favorited Pages for a specific user and user info
router.get('/:username',  (req, res) => {
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


router.get('/profile', auth, (req, res) => {
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

// edit the user
router.put('/:id', auth, async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true } )
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
})


// Delete user
router.delete('/:id/', auth,  async (req, res) => {
    try {
        const deletedUserPage = await User.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedUserPage);
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
})


module.exports = router