const mongoose = require('mongoose')

const refreshTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('refresh_token', refreshTokenSchema)