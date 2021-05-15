const {Schema, model} = require('mongoose');

const FavoritedSchema = new Schema({
    name: {type: String, unique: true},
    url: {type: String, unique: true}
})

module.exports = model('Favorited', FavoritedSchema)
