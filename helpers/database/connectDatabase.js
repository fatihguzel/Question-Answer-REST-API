const mongoose = require('mongoose')

const connectDatabase = () => {
    mongoose.connect('mongodb+srv://dbUser:dbUser123@cluster0.1nto8.mongodb.net/?retryWrites=true&w=majority',
        err => {
            if(err) throw err;
            console.log('connected to MongoDB')
        });
}

module.exports = connectDatabase