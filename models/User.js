const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    username: {type: String, 
               required: [true, "Please create a username" ],
               unique: true
            },
    firstname: {
               type: String, 
               required: [true, "please enter your first name"]
    },
    email: {
               type: String,
               required: [true, "Please enter an email"],
               unique: true
            //    validate: isEmail

    },
    password: {type: String, 
               required: [true, "Please enter a valid password"],
               minlength: [8, "Password must be 8+ charecters"]
            },
    favoritedPage: [{ type: Schema.Types.ObjectId, ref:'Favorited' }]
})

module.exports = model('User', userSchema)