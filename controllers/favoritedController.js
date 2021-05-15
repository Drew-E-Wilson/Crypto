const express = require('express');
const router = express.Router();
const Favorited = require('../models/FavoritedPage')

//Index
router.get('/', async (req, res) => {
    let filters;
    if(Object.keys(req.query).length > 0){
        filters = {...req.query}
    }
    try {
        if(!filters){
            const foundFavoritedPages = await Favorited.find({});
            res.status(200).json(foundFavoritedPages)
        } else {
            const foundFavoritedPages = await Favorited.find({...filters});
            res.status(200).json(foundFavoritedPages)
        }  
    }catch(error){
        res.status(400).json({
            msg: error.message
        })
    }
})

// Show
router.get('/:id', async (req, res) => {
    try {
        const foundFavoritedPage = await Favorited.findById(req.params.id);
        res.status(200).json(foundFavoritedPage)
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
})

router.get('/byName/:name', async (req, res) => {
    try {
        const foundFavoritedPage = await Favorited.findOne({name: req.params.name });
        res.status(200).json(foundFavoritedPage)
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
})

//Create
router.post('/', async (req, res) => {
    try {
        const createFavoritedPage = await Favorited.create(req.body)
        res.status(200).json(createFavoritedPage)
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
})

//Update
router.put('/:id', async (req, res) => {
    try{
        const updatedFavoritedPage = await Favorited.findByIdAndUpdate(req.params.id, req.body, {new: true})
        res.status(200).json(updatedFavoritedPage)
    }catch(err){
        res.status(400).json({
            msg: err.message
        })
    }
})

//Delete
router.delete('/:id', async (req, res) => {
    try {
        const deletedFavoritedPage = await Favorited.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedFavoritedPage);
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
})

module.exports = router